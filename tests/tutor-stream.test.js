import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { z } from 'zod';

const load = p => readFileSync(new URL('../'+p, import.meta.url),'utf8');
function moduleCode(p) {
  return ts.transpileModule(load(p).replace(/^import[\s\S]*?from\s+['"][^'"]+['"]\s*$/gm,''),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
}
const ctx = {exports:{},Response,ReadableStream,TextEncoder,Error};
runInNewContext(moduleCode('src/lib/tutor-stream.server.ts'),ctx);
const {tutorStreamResponse} = ctx.exports;
const browser = {TextDecoder};
runInNewContext(load('public/tutor-stream.js'),browser);
async function* answer() { yield {type:'text-delta',text:'Olá '}; yield {type:'text-delta',text:'aluno'}; yield {type:'finish',finishReason:'stop'}; }

test('text deltas arrive progressively and completion returns only answer text',async()=>{
  const response = await tutorStreamResponse(answer());
  const updates=[];
  assert.match(response.headers.get('content-type'),/text\/plain/);
  assert.equal(await browser.readTutorStream(response,t=>updates.push(t)),'Olá aluno');
  assert.equal(updates[0],'Olá ');
  assert.ok(updates.includes('Olá aluno'));
});
test('mid-stream errors show the actual error and never resolve as a complete answer',async()=>{
  async function* fail() { yield {type:'text-delta',text:'Partial'}; yield {type:'error',error:new Error('service unavailable')}; }
  await assert.rejects(browser.readTutorStream(await tutorStreamResponse(fail())),/service unavailable/);
});
test('EOF without finish is rejected, including a truncated connection',async()=>{
  async function* fail() { yield {type:'text-delta',text:'Partial'}; }
  await assert.rejects(browser.readTutorStream(await tutorStreamResponse(fail())),/interrompida/);
  await assert.rejects(browser.readTutorStream(new Response('Partial')),/interrompida/);
});
test('UTF-8 and the terminal record survive single-byte boundaries',async()=>{
  const bytes=new TextEncoder().encode('Olá 🩺\u001e{"done":true}\n');
  const response=new Response(new ReadableStream({start(c){for(const byte of bytes)c.enqueue(Uint8Array.of(byte));c.close()}}));
  assert.equal(await browser.readTutorStream(response),'Olá 🩺');
});
const corsCtx={exports:{},Response,Headers};
runInNewContext(moduleCode('src/lib/cors.server.ts'),corsCtx);
function route({gate='ok',status='active',caller=true,parts=answer}={}) {
  let calls=0;
  const context={exports:{},Response,z,process:{env:{LOVABLE_API_KEY:'test-only'}},
    createFileRoute:()=>x=>x,preflight:corsCtx.exports.preflight,withCors:corsCtx.exports.withCors,
    subscriptionGate:async()=>gate,clientForRequest:async()=>caller?{userId:'admin',supabase:{from:()=>({select:()=>({eq:()=>({single:async()=>({data:{status},error:null})})})})}}:null,
    createLovableChatProvider:()=>()=>({}),createLovableResponsesProvider:()=>({responses:()=>({})}),
    withLovableAiGatewayRunIdHeader:async r=>r,tutorStreamResponse,
    streamText:()=>{calls++;return {stream:parts(),text:Promise.resolve('Legacy answer')}}};
  runInNewContext(moduleCode('src/routes/api/tutor.ts'),context);
  return {post:context.exports.Route.server.handlers.POST,calls:()=>calls};
}
function request(stream=true,origin='https://localhost') {return new Request('http://localhost/api/tutor',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({provider:'gemini',messages:[{role:'user',content:'Hello'}],...(stream?{stream:true}:{})})});}
for (const [options,code,error] of [[{caller:false},401,'unauthorized'],[{status:'suspended'},403,'account_suspended'],[{gate:'denied'},402,'subscription_required'],[{gate:'error'},503,'unavailable']]) test(`streaming preserves pre-stream JSON gate ${code}`,async()=>{
  const r=route(options),res=await r.post({request:request()});
  assert.equal(res.status,code);assert.equal((await res.json()).error,error);assert.equal(r.calls(),0);
});
test('requests without stream preserve the JSON contract',async()=>{
  const res=await route().post({request:request(false)});
  assert.deepEqual(await res.json(),{text:'Legacy answer',provider:'gemini',model:'google/gemini-3.1-flash-lite'});
});
test('streaming keeps Android CORS and omits unlisted origins',async()=>{
  for(const origin of ['https://localhost','capacitor://localhost','https://bkcirugia.lovable.app','https://evil.example']){
    const res=await route().post({request:request(true,origin)});
    assert.equal(res.headers.get('Access-Control-Allow-Origin'),origin==='https://evil.example'?null:origin);
    assert.equal(await browser.readTutorStream(res),'Olá aluno');
  }
});