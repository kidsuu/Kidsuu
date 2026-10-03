import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const f = join(dir, n);
    return statSync(f).isDirectory() ? walk(f) : [f];
  });
}
const files = walk('src'),
  used = new Set();
for (const file of files.filter((f) => /\.(ts|tsx)$/.test(f))) {
  const code = readFileSync(file, 'utf8');
  for (const m of code.matchAll(/require\(['"]([^'"]+\.png)['"]\)/g)) {
    const asset = resolve(dirname(file), m[1]);
    if (!existsSync(asset)) throw new Error(`Missing asset in ${file}: ${m[1]}`);
    used.add(asset);
  }
}
const unused = files.filter((f) => f.endsWith('.png') && !used.has(resolve(f)));
if (unused.length) throw new Error(`Unused PNG assets: ${unused.join(', ')}`);
const bytes = [...used].reduce((n, f) => n + statSync(f).size, 0);
for (const file of files) {
  if (/\.(zip|html|pem|p12|jks|keystore)$/.test(file))
    throw new Error(`Unexpected source artifact: ${relative('.', file)}`);
}
console.log(
  `PASS: ${used.size} statically referenced PNG assets (${(bytes / 1024 / 1024).toFixed(2)} MiB), no missing or unused PNGs.`,
);
