import { parse } from 'jsonc-parser';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const parseErrors = [];
const config = parse(readFileSync(resolve(root, 'wrangler.jsonc'), 'utf8'), parseErrors, {
  allowTrailingComma: true,
});
if (parseErrors.length) throw new Error('Invalid Wrangler JSONC configuration.');
// Public staging identifiers are versioned; empty GitHub variables must not erase them.
const account = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() || config.account_id,
  db = process.env.D1_DATABASE_ID?.trim() || config.d1_databases?.[0]?.database_id;
if (!account || !/^[a-f0-9]{32}$/i.test(account))
  throw new Error('Set CLOUDFLARE_ACCOUNT_ID to your Cloudflare account ID.');
if (
  !db ||
  !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(db) ||
  db === '00000000-0000-0000-0000-000000000000'
)
  throw new Error('Create kidsuu-staging in Cloudflare D1 and set D1_DATABASE_ID.');
const auth = ['AUTH_ISSUER', 'AUTH_AUDIENCE', 'AUTH_JWKS_URL'].map(
  (k) => process.env[k]?.trim() || '',
);
if (auth.some(Boolean) && !auth.every(Boolean))
  throw new Error('Set all three AUTH_* settings, or leave all empty for locked staging.');
for (const text of [auth[0], auth[2]].filter(Boolean)) {
  const u = new URL(text);
  if (u.protocol !== 'https:' || u.username || u.password || u.hash)
    throw new Error('Auth issuer/JWKS must use HTTPS without credentials or fragments.');
}
const origins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
for (const origin of origins) {
  const u = new URL(origin);
  if (u.protocol !== 'https:' || u.origin !== origin)
    throw new Error('ALLOWED_ORIGINS must be exact HTTPS origins, comma separated.');
}
config.account_id = account;
config.main = resolve(root, 'src/index.ts');
// Wrangler joins tsconfig to the generated config directory, even for absolute paths.
// Keep this relative to .wrangler/staging.json so its bundler finds the backend config.
config.tsconfig = '../tsconfig.json';
config.d1_databases[0].database_id = db;
config.d1_databases[0].migrations_dir = resolve(root, 'migrations');
Object.assign(config.vars, {
  AUTH_ISSUER: auth[0],
  AUTH_AUDIENCE: auth[1],
  AUTH_JWKS_URL: auth[2],
  ALLOWED_ORIGINS: origins.join(','),
});
mkdirSync(resolve(root, '.wrangler'), { recursive: true });
writeFileSync(resolve(root, '.wrangler/staging.json'), JSON.stringify(config, null, 2) + '\n');
console.log(
  `Prepared staging configuration. Authentication: ${auth.every(Boolean) ? 'configured' : 'locked (not configured)'}. No tokens were written to this file.`,
);
