import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const html = readFileSync(new URL('../public/app.html', import.meta.url), 'utf8');
const source = html.slice(html.indexOf('async function refreshAuthCache('), html.indexOf('/* Items injected'));
function setup(roleResult) {
 const cache={user:null,admin:null,ready:false}; const headers=[];
 const context={_authCache:cache,clearSession(){cache.user=null;cache.admin=null;},supabaseClient:{auth:{getSession(){throw Error('Stale session must not be read');}},from(table){const query={select(){return this;},eq(){return this;},single(){return this;},maybeSingle(){return this;},setHeader(key,value){headers.push([table,key,value]);return Promise.resolve(table==='admin_roles'?roleResult:{data:{id:'admin-1'}});}};return query;}}};
 runInNewContext(source,context);return {context,cache,headers};
}
test('role verification uses the newly authenticated token, not stale storage',async()=>{
 const {context,cache,headers}=setup({data:{level:'superadmin'}});
 await context.refreshAuthCache({user:{id:'admin-1',email:'admin@example.test'},access_token:'test-new-token'});
 assert.equal(cache.admin.user_id,'admin-1'); assert.equal(headers[0][2],'Bearer test-new-token');
});
test('a failed role lookup is not silently treated as a non-admin account',async()=>{
 const failure=Error('connection failed');const {context,cache}=setup({error:failure});
 await assert.rejects(context.refreshAuthCache({user:{id:'admin-1'},access_token:'test-token'}),/connection failed/);
 assert.equal(cache.admin,null);assert.equal(cache.user,null);
});
