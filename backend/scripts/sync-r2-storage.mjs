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
    { cwd: backendRoot, encoding: 'utf8' },
  );
  return res.status === 0;
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
  let synced = 0;
  let tokenHasR2CliScope = true;
  for (const pkg of [...readers, ...interactive]) {
    const editionKey = `${pkg.contentId}:${pkg.ageGroup.replace('–', '-')}:${pkg.locale}:${pkg.contentVersion}`;
    const tmpFile = join(tmpDir, `${editionKey.replace(/:/g, '_')}.json`);
    writeFileSync(tmpFile, JSON.stringify(pkg, null, 2) + '\n');
    if (!putObject(`content/packages/${editionKey}.json`, tmpFile, 'application/json')) {
      tokenHasR2CliScope = false;
      break;
    }
    synced++;
  }

  if (tokenHasR2CliScope) {
    for (const [name, relPath] of [
      ['readerManifest.json', 'src/features/content/data/demo/manifest.json'],
      ['interactiveManifest.json', 'src/features/content/data/demo/interactiveManifest.json'],
      ['interactiveRecipes.json', 'src/features/content/data/demo/interactiveRecipes.json'],
      ['scenePack.json', 'src/features/content/data/demo/scenePack.json'],
    ]) {
      if (putObject(`content/manifests/${name}`, resolve(repoRoot, relPath), 'application/json'))
        synced++;
    }

    const scenePack = JSON.parse(
      readFileSync(resolve(repoRoot, 'src/features/content/data/demo/scenePack.json'), 'utf8'),
    );
    for (const asset of scenePack.assets) {
      if (
        putObject(
          `content/assets/scenes/${asset.file}`,
          resolve(repoRoot, 'src/features/content/assets/demo', asset.file),
          'image/png',
        )
      )
        synced++;
    }
    console.log(`Synced ${synced} objects to R2 bucket ${bucket}.`);
  } else {
    console.log(
      `Worker R2 binding (${bucket}) is active. Direct CLI seed skipped until CLOUDFLARE_API_TOKEN includes R2 Storage:Edit permission.`,
    );
  }
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}
