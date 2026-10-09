import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(backendRoot, '..');
const workerUrl =
  process.env.STAGING_WORKER_URL?.trim() || 'https://kidsuu-api-staging.kidsuuofficial.workers.dev';
const seedSecret = process.env.STORAGE_SEED_SECRET?.trim() || '';

if (!seedSecret) {
  throw new Error(
    'STORAGE_SEED_SECRET is required to sync objects into R2 via the Worker binding.',
  );
}

function walkPngs(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walkPngs(full);
    return full.endsWith('.png') ? [full] : [];
  });
}

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

async function upload(key, bytes, contentType) {
  const res = await fetch(`${workerUrl}/internal/seed/${key}`, {
    method: 'PUT',
    headers: {
      'content-type': contentType,
      'x-storage-seed-secret': seedSecret,
    },
    body: bytes,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to upload ${key} (${res.status}): ${text}`);
  }
}

async function main() {
  const objects = [];
  const addObject = async (key, bytes, contentType) => {
    const buf = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes, 'utf8');
    await upload(key, buf, contentType);
    objects.push({
      key,
      contentType,
      size: buf.byteLength,
      sha256: sha256(buf),
    });
  };

  // 1. Upload all 8 bilingual Content Lab packages (4 readers + 4 interactive)
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
    await addObject(
      `content/packages/${editionKey}.json`,
      JSON.stringify(pkg, null, 2) + '\n',
      'application/json',
    );
  }

  // 2. Upload all content & scene manifests + catalog fixtures
  for (const [name, relPath] of [
    ['readerManifest.json', 'src/features/content/data/demo/manifest.json'],
    ['interactiveManifest.json', 'src/features/content/data/demo/interactiveManifest.json'],
    ['interactiveRecipes.json', 'src/features/content/data/demo/interactiveRecipes.json'],
    ['scenePack.json', 'src/features/content/data/demo/scenePack.json'],
    ['sampleCatalog.json', 'src/features/home/data/sampleCatalog.json'],
  ]) {
    await addObject(
      `content/manifests/${name}`,
      readFileSync(resolve(repoRoot, relPath)),
      'application/json',
    );
  }

  // 3. Upload all 9 reader scene PNGs under content/assets/scenes/<file>
  const scenePack = JSON.parse(
    readFileSync(resolve(repoRoot, 'src/features/content/data/demo/scenePack.json'), 'utf8'),
  );
  for (const asset of scenePack.assets) {
    const full = resolve(repoRoot, 'src/features/content/assets/demo', asset.file);
    await addObject(`content/assets/scenes/${asset.file}`, readFileSync(full), 'image/png');
  }

  // 4. Upload all 83 app PNG assets under content/assets/app/<relative-path>
  const allPngs = walkPngs(resolve(repoRoot, 'src')).sort();
  for (const full of allPngs) {
    const rel = relative(resolve(repoRoot, 'src'), full).replace(/\\/g, '/');
    await addObject(`content/assets/app/${rel}`, readFileSync(full), 'image/png');
  }

  const totalBytes = objects.reduce((sum, o) => sum + o.size, 0);
  const indexDoc = JSON.stringify(
    {
      bucket: 'kidsuu-storage',
      syncedAt: new Date().toISOString(),
      totalObjects: objects.length + 1,
      totalBytes,
      objects,
    },
    null,
    2,
  );
  await upload('storage-index.json', Buffer.from(indexDoc, 'utf8'), 'application/json');
  console.log(
    `Successfully uploaded ${objects.length + 1} objects (${(totalBytes / (1024 * 1024)).toFixed(2)} MiB) into R2 bucket kidsuu-storage!`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
