import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const f = join(dir, n);
    return statSync(f).isDirectory() ? walk(f) : [f];
  });
}
for (const platform of ['android', 'ios']) {
  const files = walk(`.expo/verify-${platform}`).filter((f) => f.endsWith('.js'));
  if (!files.length)
    throw new Error(`No ${platform} JavaScript bundle found. Run npm run verify:bundles first.`);
  const code = files.map((f) => readFileSync(f, 'utf8')).join('\n');
  for (const sentinel of [
    '9000000000',
    'Preview parent',
    'This demo code expired',
    'DemoAuthEngine',
    'demo-family-session',
    'createDemoFamilyRepository',
    'kidsuu-demo-offline.db',
    'kidsuu-demo-family',
    'up-down-rest',
    'dry-bench-story',
    'ORAL.UP_DOWN_SHARED',
  ]) {
    if (code.includes(sentinel))
      throw new Error(`${platform}: development fixture leaked into release bundle (${sentinel})`);
  }
  if (!code.includes('Authentication is not connected yet'))
    throw new Error(`${platform}: expected fail-closed auth adapter not found`);
  console.log(
    `PASS: ${platform} release bundle excludes demo auth and draft content fixtures and includes fail-closed adapter.`,
  );
}
