import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migration = readFileSync(
  new URL('../drizzle/migrations/0017_security_hardening_mfa_messages_trial.sql', import.meta.url),
  'utf8',
);
const route = readFileSync(
  new URL('../src/routes/api/public/hooks/study-reminders.ts', import.meta.url),
  'utf8',
);

// Espelha a regra de is_platform_admin(): admin E (aal2 OU sem fator TOTP verificado).
function isPlatformAdmin({ inAdminRoles, aal, hasVerifiedTotp }) {
  return inAdminRoles && (aal === 'aal2' || !hasVerifiedTotp);
}

test('admin sem 2FA entra em aal1 (não fica bloqueado)', () => {
  assert.equal(isPlatformAdmin({ inAdminRoles: true, aal: 'aal1', hasVerifiedTotp: false }), true);
});
test('admin com 2FA verificado é recusado em aal1', () => {
  assert.equal(isPlatformAdmin({ inAdminRoles: true, aal: 'aal1', hasVerifiedTotp: true }), false);
});
test('admin com 2FA verificado passa em aal2', () => {
  assert.equal(isPlatformAdmin({ inAdminRoles: true, aal: 'aal2', hasVerifiedTotp: true }), true);
});
test('não-admin nunca passa, mesmo em aal2', () => {
  assert.equal(isPlatformAdmin({ inAdminRoles: false, aal: 'aal2', hasVerifiedTotp: true }), false);
});
test('a migração implementa a regra aal2/TOTP em is_platform_admin', () => {
  assert.match(migration, /auth\.jwt\(\)\s*->>\s*'aal'/);
  assert.match(migration, /auth\.mfa_factors/);
  assert.match(migration, /SECURITY DEFINER/);
});

// Espelha os privilégios de coluna: UPDATE só é permitido em read_at.
const GRANTED = { direct_messages: ['read_at'], feedback_replies: ['read_at'], peer_messages: ['read_at'] };
function canUpdate(table, column) {
  return (GRANTED[table] ?? []).includes(column);
}

test('UPDATE de body/reply em mensagens é recusado (só read_at é permitido)', () => {
  for (const t of Object.keys(GRANTED)) {
    assert.equal(canUpdate(t, 'read_at'), true);
    assert.equal(canUpdate(t, 'body'), false);
    assert.equal(canUpdate(t, 'reply'), false);
    assert.equal(canUpdate(t, 'sender_id'), false);
  }
});
test('a migração revoga UPDATE geral e concede apenas UPDATE (read_at)', () => {
  for (const t of ['direct_messages', 'feedback_replies', 'peer_messages']) {
    assert.match(migration, new RegExp(`REVOKE UPDATE ON public\\.${t} FROM authenticated, anon`));
    assert.match(migration, new RegExp(`GRANT UPDATE \\(read_at\\) ON public\\.${t} TO authenticated`));
  }
});
test('a migração limita o tamanho das mensagens (1 a 4000 caracteres)', () => {
  assert.match(migration, /direct_messages_body_len CHECK \(char_length\(body\) BETWEEN 1 AND 4000\)/);
  assert.match(migration, /peer_messages_body_len CHECK \(char_length\(body\) BETWEEN 1 AND 4000\)/);
  assert.match(migration, /feedback_replies_reply_len CHECK \(char_length\(reply\) BETWEEN 1 AND 4000\)/);
});

test('chat_directory exige has_access() e não deriva o nome do email', () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.chat_directory\(\)[\s\S]*?public\.has_access\(\)/);
  assert.match(migration, /COALESCE\(NULLIF\(p\.name, ''\), 'Aluno'\)/);
  assert.doesNotMatch(migration, /split_part\(p\.email/);
});

test('INSERT em peer_messages exige remetente próprio, destinatário ativo e acesso', () => {
  assert.match(migration, /CREATE POLICY pm_insert ON public\.peer_messages[\s\S]*?sender_id = auth\.uid\(\)[\s\S]*?recipient_id <> auth\.uid\(\)[\s\S]*?public\.has_access\(\)[\s\S]*?p\.status = 'active'/);
});

test('audit_events bloqueia eventos admin_/payment_* de não-admins (via admin_roles)', () => {
  assert.match(migration, /CREATE POLICY audit_events_insert_own[\s\S]*?EXISTS \(SELECT 1 FROM public\.admin_roles[\s\S]*?event NOT LIKE 'admin\\_%'[\s\S]*?event NOT IN \('payment_approved', 'payment_rejected'\)/);
});

test('trial passa a 7 dias e grant_trial_access deixa de ser executável pela API', () => {
  assert.match(migration, /interval '7 days'/);
  assert.match(migration, /REVOKE EXECUTE ON FUNCTION public\.grant_trial_access\(\) FROM PUBLIC, anon, authenticated/);
});

test('o segredo do cron vive numa tabela privada e a verificação é só de service_role', () => {
  assert.match(migration, /CREATE SCHEMA IF NOT EXISTS private/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS private\.hook_secrets/);
  assert.match(migration, /REVOKE ALL ON private\.hook_secrets FROM PUBLIC, anon, authenticated/);
  assert.match(migration, /GRANT EXECUTE ON FUNCTION public\.verify_reminders_secret\(text\) TO service_role/);
});

test('a rota study-reminders valida o segredo no banco e já não lê REMINDERS_HOOK_SECRET', () => {
  assert.match(route, /verify_reminders_secret/);
  assert.doesNotMatch(route, /REMINDERS_HOOK_SECRET/);
});
