import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
const sha = (data) => createHash('sha256').update(data).digest('hex');
const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root));
const directory = 'src/features/content/assets/demo/';
/** Byte-level check used by check:content in CI. Runtime schema tests supply structural checks. */
export function checkSceneAssets() {
  const pack = JSON.parse(read('src/features/content/data/demo/scenePack.json'));
  if (
    pack.publication !== 'draft' ||
    pack.humanReview !== 'pending' ||
    pack.rightsReview !== 'pending'
  )
    throw new Error('Scene pack cannot approve publication.');
  if (pack.compositionScriptHash !== sha(read('scripts/compose-reader-scenes.py')))
    throw new Error('Composition recipe hash mismatch.');
  const files = readdirSync(new URL(directory, root)).sort();
  const registered = [
    ...read('src/features/content/data/demo/sceneAssets.ts')
      .toString()
      .matchAll(/require\(['"]\.\.\/\.\.\/assets\/demo\/([a-z0-9-]+\.png)['"]\)/g),
  ]
    .map((m) => m[1])
    .sort();
  const expected = pack.assets.map((a) => a.file).sort();
  if (
    JSON.stringify(files) !== JSON.stringify(expected) ||
    JSON.stringify(registered) !== JSON.stringify(expected)
  )
    throw new Error('Scene files/registry/manifest differ.');
  let bytes = 0;
  for (const a of pack.assets) {
    if (!/^[a-z][a-z0-9-]+\.png$/.test(a.file)) throw new Error('Unsafe asset path.');
    const buffer = read(directory + a.file);
    if (
      buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
      sha(buffer) !== a.sha256 ||
      buffer.length !== a.bytes ||
      buffer.readUInt32BE(16) !== a.width ||
      buffer.readUInt32BE(20) !== a.height ||
      buffer.length > 1500000
    )
      throw new Error(`Scene bytes/hash/dimensions failed: ${a.id}`);
    bytes += buffer.length;
  }
  if (bytes > 8 * 1024 * 1024) throw new Error('Scene pack over preview budget.');
  const reference = pack.sources.find((s) => s.id === 'approved-pair');
  if (!reference || reference.sha256 !== pack.assets.find((a) => a.id === 'cast-reference')?.sha256)
    throw new Error('Original cast reference was changed.');
  console.log(
    `PASS: ${pack.assets.length} draft scene/reference PNGs; exact SHA-256, dimensions, registry, composition recipe and ${(bytes / 1024 / 1024).toFixed(2)} MiB budget.`,
  );
  return sha(JSON.stringify(pack));
}
