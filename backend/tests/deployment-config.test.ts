import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parse } from 'jsonc-parser';
const roots: string[] = [];
function run(extra: Record<string, string> = {}) {
  const root = mkdtempSync(join(resolve('node_modules'), 'kidsuu-deploy-test-'));
  roots.push(root);
  mkdirSync(join(root, 'scripts'));
  mkdirSync(join(root, 'src'));
  mkdirSync(join(root, 'migrations'));
  writeFileSync(join(root, 'src/index.ts'), 'export default {};');
  copyFileSync(resolve('scripts/prepare-staging.mjs'), join(root, 'scripts/prepare-staging.mjs'));
  copyFileSync(resolve('wrangler.jsonc'), join(root, 'wrangler.jsonc'));
  const result = spawnSync(process.execPath, [join(root, 'scripts/prepare-staging.mjs')], {
    encoding: 'utf8',
    env: {
      ...process.env,
      CLOUDFLARE_ACCOUNT_ID: 'a'.repeat(32),
      D1_DATABASE_ID: '11111111-1111-4111-8111-111111111111',
      AUTH_ISSUER: '',
      AUTH_AUDIENCE: '',
      AUTH_JWKS_URL: '',
      ALLOWED_ORIGINS: '',
      ...extra,
    },
  });
  return { result, root };
}
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
describe('staging deployment configuration', () => {
  it('uses committed staging identifiers when GitHub variables are empty', () => {
    const expected = parse(readFileSync('wrangler.jsonc', 'utf8'));
    const { result, root } = run({ CLOUDFLARE_ACCOUNT_ID: '', D1_DATABASE_ID: '' });
    expect(result.status).toBe(0);
    const config = JSON.parse(readFileSync(join(root, '.wrangler/staging.json'), 'utf8'));
    expect(config.account_id).toBe(expected.account_id);
    expect(config.d1_databases[0].database_id).toBe(expected.d1_databases[0].database_id);
    expect(config.vars.AUTH_ISSUER).toBe('');
    expect(config.vars.ENVIRONMENT).toBe('staging');
    expect(config.tsconfig).toBe(join(root, 'tsconfig.json'));
  });
  it('rejects an invalid explicit account override instead of ignoring it', () => {
    expect(run({ CLOUDFLARE_ACCOUNT_ID: 'not-an-account-id' }).result.status).not.toBe(0);
  });

  it('rejects a placeholder database, rather than accidentally deploying against it', () => {
    expect(run({ D1_DATABASE_ID: '00000000-0000-0000-0000-000000000000' }).result.status).not.toBe(
      0,
    );
  });
  it('rejects incomplete auth settings and non-HTTPS browser origins', () => {
    expect(run({ AUTH_ISSUER: 'https://identity.test/' }).result.status).not.toBe(0);
    expect(run({ ALLOWED_ORIGINS: '*' }).result.status).not.toBe(0);
    expect(run({ ALLOWED_ORIGINS: 'http://example.test' }).result.status).not.toBe(0);
  });
  it('creates locked staging without ever writing deployment credentials into config', () => {
    const secret = 'test-only-not-a-real-credential';
    const { result, root } = run({ CLOUDFLARE_API_TOKEN: secret });
    expect(result.status).toBe(0);
    const text = readFileSync(join(root, '.wrangler/staging.json'), 'utf8');
    expect(text).not.toContain(secret);
    const config = JSON.parse(text);
    expect(config.name).toBe('kidsuu-api-staging');
    expect(config.vars.AUTH_ISSUER).toBe('');
    expect(config.account_id).toBe('a'.repeat(32));
    expect(result.stdout).toContain('locked');
  });
});
