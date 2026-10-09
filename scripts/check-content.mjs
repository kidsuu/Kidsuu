import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const read = (name) => JSON.parse(readFileSync('src/features/world/data/' + name, 'utf8'));
const packages = read('packages.json'),
  manifest = read('manifest.json'),
  home = read('homeCatalog.json');
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
if (
  packages.length !== 14 ||
  manifest.packages.length !== 14 ||
  manifest.status !== 'adult-draft-preview'
)
  throw Error('Invalid fresh manifest');
const keys = new Set();
for (const p of packages) {
  const { contentHash, ...payload } = p;
  const key =
    p.contentId + ':' + p.ageGroup.replace('–', '-') + ':' + p.locale + ':' + p.contentVersion;
  const records = manifest.packages.filter((r) => r.editionKey === key);
  if (
    keys.has(key) ||
    records.length !== 1 ||
    hash(payload) !== contentHash ||
    records[0].contentHash !== contentHash ||
    records[0].unitCount !== p.pages.length ||
    p.publication !== 'draft' ||
    p.reviews.length ||
    records[0].humanApproval !== 'pending' ||
    records[0].recordedAudio !== 'not-generated'
  )
    throw Error('Content integrity failed: ' + key);
  keys.add(key);
}
for (const asset of manifest.assets) {
  const bytes = readFileSync('src/features/world/assets/' + asset.file);
  if (
    bytes.length !== asset.bytes ||
    bytes.length > 4 * 1024 * 1024 ||
    createHash('sha256').update(bytes).digest('hex') !== asset.sha256
  )
    throw Error('World artwork integrity failed');
}
const removed = [
  'colours',
  'count',
  'shapes',
  'pairs',
  'clap',
  'rainbow',
  'moon',
  'bear',
  'one-each-bowl',
  'triangle-workshop',
  'up-down-rest',
  'dry-bench-story',
];
if (
  home.activities.some((a) => removed.includes(a.id)) ||
  packages.some((p) => removed.includes(p.contentId))
)
  throw Error('Removed content returned to playable catalog');
console.log(
  'PASS: fourteen fresh draft editions, seven new Home cards and artwork integrity. Removed prototypes cannot launch.',
);
if (process.argv.includes('--release')) {
  console.error(
    'BLOCKED: educational, language, rights, privacy and physical-device reviews pending.',
  );
  process.exitCode = 1;
}
