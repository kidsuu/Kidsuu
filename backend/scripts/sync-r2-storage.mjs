import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(backendRoot, '..');
const stagingConfig = JSON.parse(
  readFileSync(resolve(backendRoot, '.wrangler/staging.json'), 'utf8'),
);
const bucket = stagingConfig.r2_buckets?.[0]?.bucket_name;
if (!bucket) throw new Error('R2 bucket name is not configured in .wrangler/staging.json.');

const tmpDir = resolve(backendRoot, '.wrangler/r2-sync-tmp');
mkdirSync(tmpDir, { recursive: true });

function putObject(objectKey, filePath, contentType) {
  const res = spawnSync(
    'npx',
    [
      'wrangler',
      'r2',
      'object',
      'put',
      `${bucket}/${objectKey}`,
      '--file',
      filePath,
      '--content-type',
      contentType,
      '--remote',
      '--cwd',
      '.wrangler',
      '--config',
      'staging.json',
    ],
    { cwd: backendRoot, encoding: 'utf8', stdio: 'inherit' },
  );
  if (res.status !== 0) {
    throw new Error(`Failed to upload R2 object: ${objectKey}`);
  }
}

try {
  const readers = JSON.parse(
    readFileSync(resolve(repoRoot, 'src/features/content/data/demo/readerPilots.json'), 'utf8'),
  );
  const interactive = JSON.parse(
    readFileSync(
      resolve(repoRoot, 'src/features/content/data/demo/interactivePilots.json'),
      'utf8',
    ),
  );
  for (const pkg of [...readers, ...interactive]) {
    const editionKey = `${pkg.contentId}:${pkg.ageGroup.replace('–', '-')}:${pkg.locale}:${pkg.contentVersion}`;
    const tmpFile = join(tmpDir, `${editionKey.replace(/:/g, '_')}.json`);
    writeFileSync(tmpFile, JSON.stringify(pkg, null, 2) + '\n');
    putObject(`content/packages/${editionKey}.json`, tmpFile, 'application/json');
  }

  for (const [name, relPath] of [
    ['readerManifest.json', 'src/features/content/data/demo/manifest.json'],
    ['interactiveManifest.json', 'src/features/content/data/demo/interactiveManifest.json'],
    ['interactiveRecipes.json', 'src/features/content/data/demo/interactiveRecipes.json'],
    ['scenePack.json', 'src/features/content/data/demo/scenePack.json'],
  ]) {
    putObject(`content/manifests/${name}`, resolve(repoRoot, relPath), 'application/json');
  }

  const scenePack = JSON.parse(
    readFileSync(resolve(repoRoot, 'src/features/content/data/demo/scenePack.json'), 'utf8'),
  );
  for (const asset of scenePack.assets) {
    putObject(
      `content/assets/scenes/${asset.file}`,
      resolve(repoRoot, 'src/features/content/assets/demo', asset.file),
      'image/png',
    );
  }
  console.log(`Synced content packages, manifests and scene assets to R2 bucket ${bucket}.`);
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}
