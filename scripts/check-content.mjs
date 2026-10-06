import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { checkSceneAssets } from './check-scene-assets.mjs';
const root = new URL('../src/features/content/data/demo/', import.meta.url);
const read = (file) => JSON.parse(readFileSync(new URL(file, root), 'utf8'));
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const scenePack = read('scenePack.json');
const sceneHash = checkSceneAssets();
const recipeHash = hash(read('interactiveRecipes.json'));
const keys = new Set();
for (const family of [
  {
    data: 'readerPilots.json',
    manifest: 'manifest.json',
    assets: 'illustrated-preview',
    illustrations: 'ai-and-composited-unreviewed',
  },
  {
    data: 'interactivePilots.json',
    manifest: 'interactiveManifest.json',
    assets: 'procedural-preview',
    illustrations: 'procedural-unreviewed',
  },
]) {
  const packages = read(family.data),
    manifest = read(family.manifest);
  if (
    manifest.schemaVersion !== 1 ||
    manifest.status !== 'adult-draft-preview' ||
    manifest.packages.length !== packages.length
  )
    throw new Error('Invalid content manifest.');
  if (family.assets === 'procedural-preview' && manifest.recipeHash !== recipeHash)
    throw new Error('Interaction recipe changed without new versioned content hashes.');
  for (const content of packages) {
    const { contentHash, ...payload } = content;
    const key = `${content.contentId}:${content.ageGroup.replace('–', '-')}:${content.locale}:${content.contentVersion}`;
    const entries = manifest.packages.filter((entry) => entry.editionKey === key);
    if (
      keys.has(key) ||
      entries.length !== 1 ||
      hash(payload) !== contentHash ||
      entries[0].contentHash !== contentHash ||
      entries[0].unitCount !== content.pages.length
    )
      throw new Error(
        `Content integrity failed: ${key}. Version changed content and update its manifest; never relabel old progress.`,
      );
    if (
      content.publication !== 'draft' ||
      content.assetStatus !== family.assets ||
      content.reviews.length ||
      entries[0].humanApproval !== 'pending' ||
      entries[0].illustrations !== family.illustrations ||
      entries[0].recordedAudio !== 'not-generated'
    )
      throw new Error(`This internal pipeline cannot approve publication: ${key}`);
    if (family.assets === 'procedural-preview' && content.recipeHash !== recipeHash)
      throw new Error(`Recipe hash mismatch: ${key}`);
    if (family.assets === 'illustrated-preview') {
      if (content.scenePackHash !== sceneHash || manifest.scenePackHash !== sceneHash)
        throw new Error(`Scene pack hash mismatch: ${key}`);
      for (const page of content.pages) {
        if (
          !page.scenes?.length ||
          page.scenes.some(
            (f) =>
              f.assetId === 'cast-reference' || !scenePack.assets.some((a) => a.id === f.assetId),
          )
        )
          throw new Error(`Missing scene reference: ${key}`);
      }
    }
    keys.add(key);
  }
}
console.log(
  `PASS: ${keys.size} draft editions, scene art and procedural geometry match SHA-256 manifests. No recorded media or human approval claimed.`,
);
if (process.argv.includes('--release')) {
  console.error(
    'BLOCKED: no approved production content catalog. Qualified content/geometry/language/rights review, privacy and physical-device acceptance remain required.',
  );
  process.exitCode = 1;
}
