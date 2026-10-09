import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Miniflare, convertV4MiniflareOptions, Response as MFResponse } from 'miniflare';
import { exportJWK, generateKeyPair, SignJWT, type JWTPayload } from 'jose';
import { readFileSync } from 'node:fs';
import type {
  ActivityProgress,
  ChildProfile,
  Parent,
  LearningSummary,
  StoredFamilySnapshot,
  StoredObjectMeta,
} from '../../packages/contracts/src';
const ISSUER = 'https://identity.kidsuu.test/',
  AUDIENCE = 'kidsuu-staging';
let keys: Awaited<ReturnType<typeof generateKeyPair>>,
  publicJwks: unknown,
  mf: Miniflare,
  closed: Miniflare;
const runtimes: Miniflare[] = [];
async function runtime(auth = true, limit = 10000) {
  const worker = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      scriptPath: 'dist/worker.js',
      compatibilityDate: '2026-10-01',
      d1Databases: { DB: crypto.randomUUID() },
      r2Buckets: { STORAGE: crypto.randomUUID() },
      ratelimits: { API_RATE_LIMITER: { namespace_id: '1001', simple: { limit, period: 60 } } },
      bindings: {
        ENVIRONMENT: 'test',
        AUTH_ISSUER: auth ? ISSUER : '',
        AUTH_AUDIENCE: auth ? AUDIENCE : '',
        AUTH_JWKS_URL: auth ? ISSUER + 'jwks' : '',
        ALLOWED_ORIGINS: 'https://admin.kidsuu.test',
      },
      outboundService: async (request) => {
        if (request.url !== ISSUER + 'jwks') throw new Error('Unexpected outbound request');
        return new MFResponse(JSON.stringify(publicJwks), {
          headers: { 'content-type': 'application/json' },
        });
      },
    }),
  );
  runtimes.push(worker);
  const db = await worker.getD1Database('DB');
  const sql = readFileSync('migrations/0001_family_data.sql', 'utf8').replace(/--[^\n]*/g, '');
  for (const statement of sql
    .split(/;\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean))
    await db.prepare(statement).run();
  return worker;
}
async function token(sub: string, extra: JWTPayload = {}) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ auth_time: now, ...extra })
    .setProtectedHeader({ alg: 'ES256', kid: 'test-signing-key' })
    .setSubject(sub)
    .setIssuer(typeof extra.iss === 'string' ? extra.iss : ISSUER)
    .setAudience(typeof extra.aud === 'string' ? extra.aud : AUDIENCE)
    .setIssuedAt(typeof extra.iat === 'number' ? extra.iat : now)
    .setExpirationTime(typeof extra.exp === 'number' ? extra.exp : now + 3600)
    .sign(keys.privateKey);
}
async function call(
  path: string,
  options: {
    method?: string;
    token?: string;
    body?: unknown;
    headers?: Record<string, string>;
    worker?: Miniflare;
  } = {},
) {
  const headers: Record<string, string> = { 'cf-connecting-ip': '192.0.2.1', ...options.headers };
  if (options.token) headers.authorization = 'Bearer ' + options.token;
  if (
    options.body !== undefined &&
    !(options.body instanceof Uint8Array) &&
    !headers['content-type']
  )
    headers['content-type'] = 'application/json';
  return (options.worker ?? mf).dispatchFetch('https://kidsuu.test' + path, {
    method: options.method ?? 'GET',
    headers,
    ...(options.body !== undefined
      ? {
          body:
            typeof options.body === 'string' || options.body instanceof Uint8Array
              ? options.body
              : JSON.stringify(options.body),
        }
      : {}),
  });
}
async function data<T>(res: { json(): Promise<unknown> }): Promise<T> {
  return (await res.json()) as T;
}
async function errorCode(res: { json(): Promise<unknown> }) {
  return (await data<{ error: { code: string } }>(res)).error.code;
}
async function parent() {
  const subject = crypto.randomUUID(),
    jwt = await token(subject),
    res = await call('/v1/parents/me', { method: 'POST', token: jwt, body: {} });
  expect(res.status).toBe(200);
  const { parent: record } = await data<{ parent: Parent }>(res);
  return { jwt, subject, id: record.id };
}
async function profile(jwt: string) {
  const r = await call('/v1/children', {
    method: 'POST',
    token: jwt,
    body: { nickname: 'Test Explorer', ageGroup: '4–5', avatar: 'star' },
  });
  expect(r.status).toBe(201);
  return (await data<{ child: ChildProfile }>(r)).child;
}
beforeAll(async () => {
  keys = await generateKeyPair('ES256');
  publicJwks = {
    keys: [
      { ...(await exportJWK(keys.publicKey)), kid: 'test-signing-key', alg: 'ES256', use: 'sig' },
    ],
  };
  mf = await runtime();
  closed = await runtime(false);
});
afterAll(async () => {
  await Promise.all(runtimes.map((r) => r.dispose()));
});
describe('Worker security boundary', () => {
  it('serves health but fails closed on private endpoints until auth is configured', async () => {
    expect((await call('/health', { worker: closed })).status).toBe(200);
    const r = await call('/v1/children', { worker: closed });
    expect(r.status).toBe(503);
    expect(await errorCode(r)).toBe('AUTH_NOT_CONFIGURED');
  });
  it('requires a bearer token, returns JSON/no-store/request ID, and rejects unknown routes', async () => {
    const r = await call('/v1/children');
    expect(r.status).toBe(401);
    expect(r.headers.get('cache-control')).toBe('no-store');
    expect(r.headers.get('x-request-id')).toBeTruthy();
    expect((await call('/missing')).status).toBe(404);
  });
  it.each([
    { iss: 'https://attacker.test/' },
    { aud: 'another-app' },
    { exp: 1 },
    { iat: Math.floor(Date.now() / 1000) + 120 },
    { exp: Math.floor(Date.now() / 1000) + 7200 },
  ])('rejects invalid token claims %j', async (claims) => {
    expect((await call('/v1/children', { token: await token('invalid', claims) })).status).toBe(
      401,
    );
  });
  it('rejects a forged signature and unsigned header', async () => {
    const jwt = await token('forged');
    const [head, payload, sig] = jwt.split('.');
    const changed = (sig[0] === 'A' ? 'B' : 'A') + sig.slice(1);
    expect((await call('/v1/children', { token: `${head}.${payload}.${changed}` })).status).toBe(
      401,
    );
    expect((await call('/v1/children', { token: 'eyJhbGciOiJub25lIn0.e30.' })).status).toBe(401);
  });
  it('only allows explicit browser origins and keeps preflight unauthenticated', async () => {
    const good = await call('/v1/children', {
      method: 'OPTIONS',
      headers: { origin: 'https://admin.kidsuu.test' },
    });
    expect(good.status).toBe(204);
    expect(good.headers.get('access-control-allow-origin')).toBe('https://admin.kidsuu.test');
    for (const origin of ['null', 'https://attacker.test'])
      expect((await call('/health', { headers: { origin } })).status).toBe(403);
  });
  it('requires recent signed auth_time for settings/profile mutations and parent summaries', async () => {
    const { jwt, subject } = await parent(),
      p = await profile(jwt);
    const stale = await token(subject, { auth_time: Math.floor(Date.now() / 1000) - 601 });
    expect((await call('/v1/children', { token: stale })).status).toBe(200);
    for (const path of ['/v1/parents/me', `/v1/children/${p.id}/summary`]) {
      const r = await call(path, { token: stale });
      expect(r.status).toBe(403);
      expect(await errorCode(r)).toBe('PARENT_REAUTH_REQUIRED');
    }
    expect(
      (
        await call('/v1/children', {
          method: 'POST',
          token: stale,
          body: { nickname: 'New', ageGroup: '4–5', avatar: 'star' },
        })
      ).status,
    ).toBe(403);
    expect(
      (await call('/v1/parents/me', { token: await token(subject, { auth_time: undefined }) }))
        .status,
    ).toBe(403);
  });
  it('rate-limits requests instead of silently bypassing protection', async () => {
    const limited = await runtime(true, 2);
    const statuses = [];
    for (let i = 0; i < 4; i++)
      statuses.push((await call('/v1/children', { worker: limited })).status);
    expect(statuses).toContain(429);
  });
});
describe('parent-scoped D1 data', () => {
  it('initializes idempotently and updates settings with optimistic concurrency', async () => {
    const { jwt } = await parent();
    const before = (await data<{ parent: Parent }>(await call('/v1/parents/me', { token: jwt })))
      .parent;
    const again = (
      await data<{ parent: Parent }>(
        await call('/v1/parents/me', { method: 'POST', token: jwt, body: {} }),
      )
    ).parent;
    expect(again).toEqual(before);
    const update = { version: 1, soundEnabled: false, dailyGoalMinutes: 20 };
    const r = await call('/v1/parents/me/settings', { method: 'PATCH', token: jwt, body: update });
    expect(r.status).toBe(200);
    expect((await data<{ parent: Parent }>(r)).parent.version).toBe(2);
    expect(
      (await call('/v1/parents/me/settings', { method: 'PATCH', token: jwt, body: update })).status,
    ).toBe(409);
  });
  it('creates and updates profiles, rejects stale edits and requires deletion version', async () => {
    const { jwt } = await parent(),
      p = await profile(jwt);
    const r = await call(`/v1/children/${p.id}`, {
      method: 'PATCH',
      token: jwt,
      body: { nickname: 'New Nickname', version: 1 },
    });
    expect(r.status).toBe(200);
    expect((await data<{ child: ChildProfile }>(r)).child.version).toBe(2);
    expect(
      (
        await call(`/v1/children/${p.id}`, {
          method: 'PATCH',
          token: jwt,
          body: { nickname: 'Old', version: 1 },
        })
      ).status,
    ).toBe(409);
    expect((await call(`/v1/children/${p.id}`, { method: 'DELETE', token: jwt })).status).toBe(428);
    expect(
      (
        await call(`/v1/children/${p.id}`, {
          method: 'DELETE',
          token: jwt,
          headers: { 'if-match': '"1"' },
        })
      ).status,
    ).toBe(409);
    expect(
      (
        await call(`/v1/children/${p.id}`, {
          method: 'DELETE',
          token: jwt,
          headers: { 'if-match': '"2"' },
        })
      ).status,
    ).toBe(204);
  });
  it('never grants another account access by accepting a child ID or parent_id input', async () => {
    const alice = await parent(),
      bob = await parent(),
      p = await profile(alice.jwt);
    for (const path of [
      `/v1/children/${p.id}`,
      `/v1/children/${p.id}/progress`,
      `/v1/children/${p.id}/summary`,
    ])
      expect((await call(path, { token: bob.jwt })).status).toBe(404);
    expect(
      (
        await call(`/v1/children/${p.id}`, {
          method: 'PATCH',
          token: bob.jwt,
          body: { nickname: 'Hijack', version: 1 },
        })
      ).status,
    ).toBe(404);
    expect(
      (
        await call(`/v1/children/${p.id}`, {
          method: 'DELETE',
          token: bob.jwt,
          headers: { 'if-match': '"1"' },
        })
      ).status,
    ).toBe(404);
    expect(
      (
        await call(`/v1/children/${p.id}/progress/colours`, {
          method: 'PUT',
          token: bob.jwt,
          body: { completedSteps: 1, totalSteps: 5 },
        })
      ).status,
    ).toBe(404);
    expect(
      (
        await call('/v1/children', {
          method: 'POST',
          token: bob.jwt,
          body: { nickname: 'Injected', ageGroup: '4–5', avatar: 'moon', parent_id: 'alice' },
        })
      ).status,
    ).toBe(400);
  });
  it('enforces the five-profile cap atomically under concurrent creation', async () => {
    const { jwt } = await parent();
    const responses = await Promise.all(
      Array.from({ length: 6 }, (_, i) =>
        call('/v1/children', {
          method: 'POST',
          token: jwt,
          body: { nickname: 'Child ' + i, ageGroup: '4–5', avatar: 'moon' },
        }),
      ),
    );
    expect(responses.filter((r) => r.status === 201)).toHaveLength(5);
    expect(responses.filter((r) => r.status === 409)).toHaveLength(1);
    const rows = await data<{ children: ChildProfile[] }>(
      await call('/v1/children', { token: jwt }),
    );
    expect(rows.children).toHaveLength(5);
  });
  it('merges progress monotonically and idempotently, with summaries based on stored data', async () => {
    const { jwt } = await parent(),
      p = await profile(jwt);
    const path = `/v1/children/${p.id}/progress/colours`;
    const put = (completedSteps: number, totalSteps = 5) =>
      call(path, { method: 'PUT', token: jwt, body: { completedSteps, totalSteps } });
    const a = (await data<{ progress: ActivityProgress }>(await put(2))).progress;
    expect(a.completedSteps).toBe(2);
    const b = (await data<{ progress: ActivityProgress }>(await put(1))).progress;
    expect(b).toEqual(a);
    expect((await put(3, 6)).status).toBe(409);
    expect((await put(6)).status).toBe(400);
    const done = (await data<{ progress: ActivityProgress }>(await put(5))).progress;
    expect(done.completedAt).toBeTruthy();
    expect((await data<{ progress: ActivityProgress }>(await put(3))).progress).toEqual(done);
    const summary = (
      await data<{ summary: LearningSummary }>(
        await call(`/v1/children/${p.id}/summary`, { token: jwt }),
      )
    ).summary;
    expect(summary.activitiesStarted).toBe(1);
    expect(summary.activitiesCompleted).toBe(1);
    expect(summary.completedSteps).toBe(5);
  });
  it('rejects malformed/oversized JSON, unknown fields, invalid ages and unknown activities', async () => {
    const { jwt } = await parent(),
      p = await profile(jwt);
    for (const body of [
      { nickname: 'Test', ageGroup: '10–11', avatar: 'moon' },
      { nickname: 'x'.repeat(5000), ageGroup: '4–5', avatar: 'moon' },
      '{invalid',
    ]) {
      const r = await call('/v1/children', { method: 'POST', token: jwt, body });
      expect([400, 413]).toContain(r.status);
    }
    expect(
      (
        await call('/v1/children', {
          method: 'POST',
          token: jwt,
          body: '{}',
          headers: { 'content-type': 'text/plain' },
        })
      ).status,
    ).toBe(415);
    expect(
      (
        await call(`/v1/children/${p.id}/progress/not-real`, {
          method: 'PUT',
          token: jwt,
          body: { completedSteps: 0, totalSteps: 1 },
        })
      ).status,
    ).toBe(400);
  });
  it('cascades deletion, without claiming the external identity account was deleted', async () => {
    const { jwt } = await parent(),
      p = await profile(jwt);
    await call(`/v1/children/${p.id}/progress/moon`, {
      method: 'PUT',
      token: jwt,
      body: { completedSteps: 1, totalSteps: 3 },
    });
    expect(
      (
        await call('/v1/parents/me', {
          method: 'DELETE',
          token: jwt,
          headers: { 'if-match': '"1"' },
        })
      ).status,
    ).toBe(400);
    const r = await call('/v1/parents/me', {
      method: 'DELETE',
      token: jwt,
      headers: { 'if-match': '"1"', 'x-confirm-delete': 'delete-my-data' },
    });
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ dataDeleted: true, identityAccountDeleted: false });
    const db = await mf.getD1Database('DB');
    expect(
      (
        await db
          .prepare('SELECT COUNT(*) AS n FROM activity_progress WHERE child_id=?')
          .bind(p.id)
          .first<{ n: number }>()
      )?.n,
    ).toBe(0);
    expect((await call('/v1/children', { token: jwt })).status).toBe(404);
  });
});
describe('R2 object storage (snapshots, content packages and media assets)', () => {
  it('stores parent-scoped snapshots in R2 with optimistic concurrency and prunes deleted children', async () => {
    const alice = await parent(),
      bob = await parent(),
      childA = await profile(alice.jwt),
      childB = await profile(alice.jwt),
      bobChild = await profile(bob.jwt);

    const initial = await call('/v1/parents/me/snapshot', { token: alice.jwt });
    expect(initial.status).toBe(200);
    expect(await data<{ snapshot: StoredFamilySnapshot | null }>(initial)).toEqual({
      snapshot: null,
    });

    // Reject foreign child ID in snapshot
    expect(
      (
        await call('/v1/parents/me/snapshot', {
          method: 'PUT',
          token: alice.jwt,
          body: {
            snapshot: { selectedId: bobChild.id, saved: {}, editions: {} },
          },
        })
      ).status,
    ).toBe(400);

    const editionRow = {
      editionKey: 'up-down-rest:2-3:en-IN:2',
      contentHash: 'a'.repeat(64),
      unitIds: ['R01', 'R02', 'R03', 'R04'],
      optionalUnitIds: ['R03'],
      exploredUnitIds: ['R01', 'R02'],
      skippedUnitIds: ['R03'],
      updatedAt: '2026-10-09T08:00:00.000Z',
    };

    const put1 = await call('/v1/parents/me/snapshot', {
      method: 'PUT',
      token: alice.jwt,
      body: {
        snapshot: {
          selectedId: childA.id,
          saved: { [childA.id]: ['colours'], [childB.id]: ['moon'] },
          editions: { [childA.id]: [editionRow], [childB.id]: [editionRow] },
        },
      },
    });
    expect(put1.status).toBe(200);
    const saved1 = (await data<{ snapshot: StoredFamilySnapshot }>(put1)).snapshot;
    expect(saved1.version).toBe(1);
    expect(saved1.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(saved1.snapshot.selectedId).toBe(childA.id);

    // Reject stale version
    expect(
      (
        await call('/v1/parents/me/snapshot', {
          method: 'PUT',
          token: alice.jwt,
          body: {
            version: 0,
            snapshot: { selectedId: childB.id, saved: {}, editions: {} },
          },
        })
      ).status,
    ).toBe(409);

    // Deleting childA in D1 automatically prunes childA from the R2 snapshot
    expect(
      (
        await call(`/v1/children/${childA.id}`, {
          method: 'DELETE',
          token: alice.jwt,
          headers: { 'if-match': '"1"' },
        })
      ).status,
    ).toBe(204);

    const afterChildDelete = (
      await data<{ snapshot: StoredFamilySnapshot }>(
        await call('/v1/parents/me/snapshot', { token: alice.jwt }),
      )
    ).snapshot;
    expect(afterChildDelete.version).toBe(2);
    expect(afterChildDelete.snapshot.selectedId).toBeNull();
    expect(afterChildDelete.snapshot.saved[childA.id]).toBeUndefined();
    expect(afterChildDelete.snapshot.saved[childB.id]).toEqual(['moon']);
    expect(afterChildDelete.snapshot.editions[childA.id]).toBeUndefined();
    expect(afterChildDelete.snapshot.editions[childB.id]).toHaveLength(1);

    // Deleting parent in D1 also deletes all R2 objects under parents/{parentId}/
    const bucket = await mf.getR2Bucket('STORAGE');
    expect(await bucket.get(`parents/${alice.id}/snapshot.json`)).not.toBeNull();
    expect(
      (
        await call('/v1/parents/me', {
          method: 'DELETE',
          token: alice.jwt,
          headers: { 'if-match': '"1"', 'x-confirm-delete': 'delete-my-data' },
        })
      ).status,
    ).toBe(200);
    expect(await bucket.get(`parents/${alice.id}/snapshot.json`)).toBeNull();
  });

  it('stores and serves content packages and media assets from R2 with integrity metadata', async () => {
    const { jwt } = await parent();
    const pkgKey = 'up-down-rest:2-3:en-IN:2';
    const putPkg = await call(`/v1/storage/packages/${pkgKey}`, {
      method: 'PUT',
      token: jwt,
      body: { contentId: 'up-down-rest', version: 2, locale: 'en-IN' },
    });
    expect(putPkg.status).toBe(201);
    const pkgMeta = (await data<{ meta: StoredObjectMeta }>(putPkg)).meta;
    expect(pkgMeta.key).toBe(pkgKey);
    expect(pkgMeta.sha256).toMatch(/^[a-f0-9]{64}$/);

    const getPkg = await call(`/v1/storage/packages/${pkgKey}`, { token: jwt });
    expect(getPkg.status).toBe(200);
    expect(getPkg.headers.get('x-content-sha256')).toBe(pkgMeta.sha256);
    expect((await data<{ package: Record<string, unknown> }>(getPkg)).package).toEqual({
      contentId: 'up-down-rest',
      version: 2,
      locale: 'en-IN',
    });

    // Upload and fetch binary PNG asset in R2
    const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3, 4]);
    const putAsset = await call('/v1/storage/assets/scenes/rhyme-up.png', {
      method: 'PUT',
      token: jwt,
      body: pngBytes,
      headers: { 'content-type': 'image/png' },
    });
    expect(putAsset.status).toBe(201);
    const assetMeta = (await data<{ meta: StoredObjectMeta }>(putAsset)).meta;
    expect(assetMeta.contentType).toBe('image/png');
    expect(assetMeta.size).toBe(pngBytes.byteLength);

    const getAsset = await call('/v1/storage/assets/scenes/rhyme-up.png', { token: jwt });
    expect(getAsset.status).toBe(200);
    expect(getAsset.headers.get('content-type')).toBe('image/png');
    expect(getAsset.headers.get('x-content-sha256')).toBe(assetMeta.sha256);
    expect(new Uint8Array(await getAsset.arrayBuffer())).toEqual(pngBytes);

    // Reject mismatched MIME or invalid key
    expect(
      (
        await call('/v1/storage/assets/scenes/rhyme-up.png', {
          method: 'PUT',
          token: jwt,
          body: pngBytes,
          headers: { 'content-type': 'audio/mpeg' },
        })
      ).status,
    ).toBe(415);
    expect(
      (
        await call('/v1/storage/assets/scenes/bad.exe', {
          method: 'PUT',
          token: jwt,
          body: pngBytes,
          headers: { 'content-type': 'image/png' },
        })
      ).status,
    ).toBe(400);
  });
});
