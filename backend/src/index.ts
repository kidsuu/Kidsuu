import { Hono } from 'hono';
import type { AppEnv } from './env';
import { ApiError, failure } from './errors';
import { authenticate, hash, rateLimit } from './auth/identity';
import family from './routes/family';
import storage from './routes/storage';
const app = new Hono<AppEnv>();
app.use('*', async (c, next) => {
  c.set('requestId', crypto.randomUUID());
  c.header('X-Request-Id', c.get('requestId'));
  c.header('Cache-Control', 'no-store');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'no-referrer');
  const origin = c.req.header('origin');
  const allow = (c.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (origin) {
    if (origin === 'null' || !allow.includes(origin))
      throw new ApiError(403, 'ORIGIN_NOT_ALLOWED', 'Browser origin is not allowed.');
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Vary', 'Origin');
    c.header('Access-Control-Expose-Headers', 'X-Request-Id,Retry-After,ETag,X-Content-Sha256');
  }
  if (c.req.method === 'OPTIONS') {
    if (!origin)
      throw new ApiError(403, 'ORIGIN_NOT_ALLOWED', 'Browser origin is required for preflight.');
    c.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    c.header(
      'Access-Control-Allow-Headers',
      'Authorization,Content-Type,If-Match,X-Confirm-Delete',
    );
    return c.body(null, 204);
  }
  await next();
});
app.get('/health', async (c) => {
  let r2Objects = 0;
  let r2Bytes = 0;
  try {
    const indexObj = await c.env.STORAGE?.get('storage-index.json');
    if (indexObj) {
      const parsed = (await indexObj.json()) as { totalObjects?: number; totalBytes?: number };
      r2Objects = parsed.totalObjects ?? 0;
      r2Bytes = parsed.totalBytes ?? 0;
    }
  } catch {
    /* Ignore R2 index read errors on public liveness check */
  }
  return c.json({
    service: 'kidsuu-api',
    environment: c.env.ENVIRONMENT || 'staging',
    database: 'd1',
    storage: 'r2',
    r2Objects,
    r2Bytes,
    status: 'ok',
  });
});
app.put('/internal/seed/:key{.+}', async (c) => {
  const expected = c.env.STORAGE_SEED_SHA256;
  if (!expected || !/^[a-f0-9]{64}$/.test(expected))
    throw new ApiError(404, 'NOT_FOUND', 'Endpoint not found.');
  const secret = c.req.header('x-storage-seed-secret') || '';
  if (!secret || (await hash(secret)) !== expected)
    throw new ApiError(403, 'FORBIDDEN', 'Invalid storage seed secret.');
  const key = c.req.param('key');
  if (!key || key.includes('..') || key.startsWith('/'))
    throw new ApiError(400, 'INVALID_KEY', 'Invalid object key.');
  const contentType = c.req.header('content-type') || 'application/octet-stream';
  const body = await c.req.arrayBuffer();
  await c.env.STORAGE.put(key, body, { httpMetadata: { contentType } });
  return c.json({ stored: key, bytes: body.byteLength }, 201);
});
app.use('/v1/*', rateLimit, authenticate, rateLimit);
app.route('/v1', family);
app.route('/v1', storage);
app.notFound((c) => failure(c, new ApiError(404, 'NOT_FOUND', 'Endpoint not found.')));
app.onError((e, c) => {
  if (e instanceof ApiError) return failure(c, e);
  console.error(JSON.stringify({ event: 'api_error', requestId: c.get('requestId') }));
  return failure(c, new ApiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.'));
});
export default app;
