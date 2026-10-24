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

function mfaSetup({ aal, factors = { totp: [], all: [] }, verifyError = null }) {
  const calls = [];
  const mfa = {
    getAuthenticatorAssuranceLevel: async () => ({ data: aal }),
    listFactors: async () => ({ data: factors }),
    challenge: async ({ factorId }) => { calls.push(['challenge', factorId]); return { data: { id: 'ch-1' } }; },
    verify: async args => { calls.push(['verify', args]); return verifyError ? { error: verifyError } : { data: {} }; },
    unenroll: async ({ factorId }) => { calls.push(['unenroll', factorId]); return {}; },
    enroll: async () => { calls.push(['enroll']); return { data: { id: 'new', totp: { qr_code: 'data:qr', secret: 'SECRET' } } }; },
  };
  const { context, cache } = setup({ data: { level: 'superadmin' } });
  context.supabaseClient.auth = { mfa, getSession: async () => ({ data: { session: { access_token: 'aal2-token' } } }) };
  return { context, cache, calls };
}
test('admin with verified TOTP at aal1 is not granted admin access yet', async () => {
  const { context, cache } = mfaSetup({ aal: { currentLevel: 'aal1', nextLevel: 'aal2' } });
  await context.refreshAuthCache({ user: { id: 'admin-1' }, access_token: 't' });
  assert.equal(cache.admin, null); assert.equal(cache.mfaPending, true);
});
test('admin without 2FA (aal1 → aal1) still signs in, so nobody is locked out', async () => {
  const { context, cache } = mfaSetup({ aal: { currentLevel: 'aal1', nextLevel: 'aal1' } });
  await context.refreshAuthCache({ user: { id: 'admin-1', email: 'a@x' }, access_token: 't' });
  assert.equal(cache.admin.user_id, 'admin-1'); assert.equal(cache.mfaPending, false);
});
test('admin at aal2 is granted access', async () => {
  const { context, cache } = mfaSetup({ aal: { currentLevel: 'aal2', nextLevel: 'aal2' } });
  await context.refreshAuthCache({ user: { id: 'admin-1' }, access_token: 't' });
  assert.equal(cache.admin.user_id, 'admin-1');
});
test('code verification runs challenge + verify and returns the new session', async () => {
  const { context, calls } = mfaSetup({ aal: {} });
  const s = await context.adminMfaVerifyCode('f1', ' 123 456 ');
  assert.equal(s.access_token, 'aal2-token');
  assert.equal(JSON.stringify(calls[1]), JSON.stringify(['verify', { factorId: 'f1', challengeId: 'ch-1', code: '123456' }]));
});
test('wrong code rejects; malformed code is rejected before any request', async () => {
  const { context, calls } = mfaSetup({ aal: {}, verifyError: Object.assign(Error('Invalid TOTP code'), { code: 'mfa_verification_failed' }) });
  await assert.rejects(context.adminMfaVerifyCode('f1', '000000'), /Invalid TOTP/);
  const before = calls.length;
  await assert.rejects(context.adminMfaVerifyCode('f1', '12ab'), e => e.code === 'invalid_format');
  assert.equal(calls.length, before);
});
test('enrollment removes old unverified TOTP factors first', async () => {
  const { context, calls } = mfaSetup({ aal: {}, factors: { totp: [], all: [
    { id: 'old1', factor_type: 'totp', status: 'unverified' }, { id: 'ph', factor_type: 'phone', status: 'unverified' }] } });
  const r = await context.adminMfaEnroll();
  assert.equal(JSON.stringify(calls), JSON.stringify([['unenroll', 'old1'], ['enroll']]));
  assert.equal(r.secret, 'SECRET'); assert.equal(r.factorId, 'new');
});
