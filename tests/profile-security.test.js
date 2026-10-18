import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
const html = readFileSync(new URL('../public/app.html', import.meta.url), 'utf8');
function appFunction(name) {
  const start = html.indexOf(`async function ${name}(`);
  const end = html.indexOf('\n}', start) + 2;
  return html.slice(start, end);
}
test('delete account preserves the session and does not write or audit', async () => {
  let toast = 0;
  const context = { t: x => x, showToast: () => toast++, supabaseClient: { from: () => assert.fail('unexpected write'), auth: { signOut: () => assert.fail('unexpected sign out') } }, auditLog: () => assert.fail('unexpected audit'), clearSession: () => assert.fail('unexpected session clear') };
  runInNewContext(appFunction('deleteAccount'), context);
  await context.deleteAccount();
  assert.equal(toast, 1);
});
test('admin block uses the authorized RPC and rerenders only after success', async () => {
  const calls = [], events = [];
  const user = { id: 'student-1', status: 'active' };
  let error = null, renders = 0;
  const context = { _adminUsersCache: [user], supabaseClient: { rpc: async (name, args) => { calls.push([name, {...args}]); return {error}; } }, showToast: () => {}, auditLog: (...args) => events.push(args), renderAdminDashboard: () => renders++ };
  runInNewContext(appFunction('adminToggleBlock'), context);
  await context.adminToggleBlock(user.id);
  assert.deepEqual(calls[0], ['admin_set_user_status', {_user_id:'student-1',_status:'suspended'}]);
  assert.equal(user.status, 'suspended');
  await context.adminToggleBlock(user.id);
  assert.equal(user.status, 'active');
  error = {message:'forbidden'};
  await context.adminToggleBlock(user.id);
  assert.equal(user.status, 'active');
  assert.equal(renders, 2);
  assert.equal(events.length, 2);
});
for (const session of [null, {user:{id:'new-student'}}]) test(`signup sends profile metadata without profile updates (${session ? 'session' : 'email confirmation'})`, async () => {
  const values = {regPw:'password123',regPw2:'password123',regName:'Student Name',regEmail:'student@example.invalid',regPhone:'123',regCountry:'Guiné-Bissau',regType:'residente',regInstitution:'Hospital',regCourse:'',regYear:'2'};
  let signup, completes = 0, confirmation = 0;
  const context = {document:{getElementById:id=>({value:values[id],checked:true,classList:{add(){},remove(){}}})}, clearFieldErrors(){}, fieldError(){confirmation++}, showToast(){}, t:x=>x, currentLang:'pt', supabaseClient:{auth:{signUp:async args=>{signup=args;return {data:{session},error:null}}},from:()=>assert.fail('profile update forbidden')},showAuthScreen(){},regGoStep(){},auditLog(){},refreshAuthCache:async()=>{},completeAuth(){completes++}};
  runInNewContext(appFunction('finishRegister'),context);
  await context.finishRegister();
  assert.deepEqual({...signup.options.data},{name:'Student Name',phone:'123',country:'Guiné-Bissau',role:'residente',institution:'Hospital',course:'Medicina',year:'2'});
  assert.equal(completes,session?1:0);
  assert.equal(confirmation,session?0:1);
});
for (const path of ['tutor.ts','books/search.ts']) {
  function handler(profile, error=null) {
    let source=readFileSync(new URL('../src/routes/api/'+path,import.meta.url),'utf8');
    source=source.replace(/^import[\s\S]*?from\s+['"][^'"]+['"]\s*$/gm,'').replace('export const Route','const Route');
    const reads=[];
    const context={Response,withCors:h=>h,preflight:()=>new Response(null,{status:204}),subscriptionGate:async()=>'ok',process:{env:{}},clientForRequest:async()=>({userId:'student-1',supabase:{from:table=>{reads.push(table);return {select:column=>{reads.push(column);return {eq:(key,id)=>{reads.push([key,id]);return {single:async()=>({data:profile,error})}}}}}}}}),createFileRoute:()=>options=>options,z:{object:()=>({}),enum:()=>({}),string:()=>({min(){return this},max(){return this},uuid(){return this},nullable(){return this},optional(){return this}}),number:()=>({int(){return this},min(){return this},max(){return this},optional(){return this}}),array:()=>({min(){return this},max(){return this}})}};
    // Schema methods needed at module initialization; parse isn't reached for denied requests.
    context.z.object=()=>({parse:()=>({}),optional(){return this}});
    runInNewContext(ts.transpileModule(source+'\nglobalThis.post = Route.server.handlers.POST;', {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText,context);
    return {post:context.post,reads};
  }
  test(`${path}: suspended owner gets 403 before parsing or AI work`,async()=>{
    const {post,reads}=handler({status:'suspended'});
    const response=await post({request:{json:()=>assert.fail('should not parse')}});
    assert.equal(response.status,403);
    assert.deepEqual(await response.json(),{error:'account_suspended'});
    assert.deepEqual(reads.slice(0,2),['profiles','status']);
    assert.deepEqual([...reads[2]],['id','student-1']);
  });
  test(`${path}: failed or missing profile read fails closed`,async()=>{
    for(const [profile,error] of [[null,{code:'57014'}],[null,null]]) {
      const {post}=handler(profile,error);
      assert.equal((await post({request:{json:()=>assert.fail('should not parse')}})).status,503);
    }
  });
  test(`${path}: active owner passes the suspension check`,async()=>{
    const {post}=handler({status:'active'});
    let parsed=false;
    const response=await post({request:{json:async()=>{parsed=true;return {}}}});
    assert.equal(parsed,true);
    assert.equal(response.status,503); // no AI key in test environment
    assert.notEqual((await response.json()).error,'account_suspended');
  });
}
