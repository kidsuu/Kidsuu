import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../src/features/content/data/demo/', import.meta.url);
const packages = JSON.parse(readFileSync(new URL('readerPilots.json', root), 'utf8'));
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'));
if (
  manifest.schemaVersion !== 1 ||
  manifest.status !== 'adult-draft-preview' ||
  manifest.packages.length !== packages.length
)
  throw new Error('Invalid content manifest.');
const keys = new Set();
for (const content of packages) {
  const { contentHash, ...payload } = content;
  const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  const key = `${content.contentId}:${content.ageGroup.replace('–', '-')}:${content.locale}:${content.contentVersion}`;
  const entries = manifest.packages.filter((entry) => entry.editionKey === key);
  if (
    keys.has(key) ||
    entries.length !== 1 ||
    hash !== contentHash ||
    entries[0].contentHash !== hash ||
    entries[0].unitCount !== content.pages.length
  )
    throw new Error(
      `Content integrity failed: ${key}. Review changes, version changed content and update its manifest; never relabel old progress.`,
    );
  if (
    content.publication !== 'draft' ||
    content.assetStatus !== 'text-only-preview' ||
    content.reviews.length ||
    entries[0].humanApproval !== 'pending' ||
    entries[0].illustrations !== 'not-generated' ||
    entries[0].recordedAudio !== 'not-generated'
  )
    throw new Error(`This internal draft pipeline cannot approve publication: ${key}`);
  keys.add(key);
}
console.log(
  `PASS: ${keys.size} draft editions match their SHA-256 manifest. No generated media or human approval claimed.`,
);
if (process.argv.includes('--release')) {
  console.error(
    'BLOCKED: no approved production content catalog. Drafts require qualified review, reviewed media/rights, privacy and physical-device acceptance.',
  );
  process.exitCode = 1;
}
