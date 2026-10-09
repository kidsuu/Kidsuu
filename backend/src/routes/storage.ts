import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { recentParentAuth } from '../auth/identity';
import { deleteVersion, readBinary, readBody } from '../http';
import * as schema from '../domain/validation';
import { FamilyRepository } from '../db/repository';
import { ALLOWED_ASSET_MIME, R2StorageRepository } from '../storage/r2Repository';

const app = new Hono<AppEnv>();

async function parentChildIds(c: {
  env: AppEnv['Bindings'];
  get(k: 'identity'): AppEnv['Variables']['identity'];
}) {
  const repo = new FamilyRepository(c.env.DB, c.get('identity').parentId);
  await repo.getParent();
  const children = await repo.children();
  return new Set(children.map((ch) => ch.id));
}

app.get('/parents/me/snapshot', async (c) => {
  const childIds = await parentChildIds(c);
  const r2 = new R2StorageRepository(c.env.STORAGE, c.get('identity').parentId);
  return c.json({ snapshot: await r2.getSnapshot(childIds) });
});

app.put('/parents/me/snapshot', async (c) => {
  const body = await readBody(c, schema.putSnapshot, 65_536);
  const childIds = await parentChildIds(c);
  const r2 = new R2StorageRepository(c.env.STORAGE, c.get('identity').parentId);
  return c.json({ snapshot: await r2.putSnapshot(body, childIds) });
});

app.delete('/parents/me/snapshot', recentParentAuth, async (c) => {
  const version = deleteVersion(c);
  await new FamilyRepository(c.env.DB, c.get('identity').parentId).getParent();
  const r2 = new R2StorageRepository(c.env.STORAGE, c.get('identity').parentId);
  await r2.deleteSnapshot(version);
  return c.body(null, 204);
});

app.get('/storage/packages/:key', async (c) => {
  const r2 = new R2StorageRepository(c.env.STORAGE, c.get('identity').parentId);
  const { data, meta } = await r2.getContentPackage(c.req.param('key'));
  c.header('ETag', `"${meta.sha256}"`);
  c.header('X-Content-Sha256', meta.sha256);
  return c.json({ package: data, meta });
});

app.put('/storage/packages/:key', recentParentAuth, async (c) => {
  const payload = await readBody(c, schema.contentPackagePayload, 65_536);
  const r2 = new R2StorageRepository(c.env.STORAGE, c.get('identity').parentId);
  const meta = await r2.putContentPackage(c.req.param('key'), payload);
  return c.json({ meta }, 201);
});

app.get('/storage/assets/:key{.+}', async (c) => {
  const r2 = new R2StorageRepository(c.env.STORAGE, c.get('identity').parentId);
  const { bytes, meta } = await r2.getAsset(c.req.param('key'));
  return new Response(bytes, {
    status: 200,
    headers: {
      'Content-Type': meta.contentType,
      'Content-Length': String(meta.size),
      ETag: `"${meta.sha256}"`,
      'X-Content-Sha256': meta.sha256,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'X-Request-Id': c.get('requestId'),
    },
  });
});

app.put('/storage/assets/:key{.+}', recentParentAuth, async (c) => {
  const { bytes, contentType } = await readBinary(c, Object.values(ALLOWED_ASSET_MIME));
  const r2 = new R2StorageRepository(c.env.STORAGE, c.get('identity').parentId);
  const meta = await r2.putAsset(c.req.param('key'), bytes, contentType);
  return c.json({ meta }, 201);
});

export default app;
