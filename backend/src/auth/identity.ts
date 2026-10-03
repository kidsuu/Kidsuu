import { createRemoteJWKSet, jwtVerify, errors } from 'jose';
import type { MiddlewareHandler } from 'hono';
import type { AppEnv, Env } from '../env';
import { ApiError } from '../errors';
const keysets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
function config(env: Env) {
  const { AUTH_ISSUER: issuer, AUTH_AUDIENCE: audience, AUTH_JWKS_URL: jwksUrl } = env;
  if (!issuer || !audience || !jwksUrl)
    throw new ApiError(503, 'AUTH_NOT_CONFIGURED', 'Authentication is not configured.');
  try {
    for (const url of [issuer, jwksUrl]) {
      const u = new URL(url);
      if (u.protocol !== 'https:' || u.username || u.password || u.hash) throw new Error();
    }
  } catch {
    throw new ApiError(503, 'AUTH_NOT_CONFIGURED', 'Authentication is not configured.');
  }
  return { issuer, audience, jwksUrl };
}
export async function hash(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
export const authenticate: MiddlewareHandler<AppEnv> = async (c, next) => {
  const { issuer, audience, jwksUrl } = config(c.env);
  const h = c.req.header('authorization');
  if (!h || h.length > 8192 || !/^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(h))
    throw new ApiError(401, 'UNAUTHENTICATED', 'A valid access token is required.');
  if (!keysets.has(jwksUrl))
    keysets.set(
      jwksUrl,
      createRemoteJWKSet(new URL(jwksUrl), {
        timeoutDuration: 3000,
        cooldownDuration: 30000,
        cacheMaxAge: 600000,
      }),
    );
  try {
    const { payload } = await jwtVerify(h.slice(7), keysets.get(jwksUrl)!, {
      issuer,
      audience,
      algorithms: ['RS256', 'ES256'],
      requiredClaims: ['sub', 'iss', 'aud', 'exp', 'iat'],
      maxTokenAge: '1h',
      clockTolerance: 5,
    });
    const now = Math.floor(Date.now() / 1000);
    if (
      !payload.sub ||
      payload.sub.length > 200 ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number' ||
      payload.exp - payload.iat > 3600 ||
      payload.iat > now + 5
    )
      throw new ApiError(401, 'UNAUTHENTICATED', 'A valid access token is required.');
    const authTime =
      typeof payload.auth_time === 'number' && Number.isInteger(payload.auth_time)
        ? payload.auth_time
        : null;
    c.set('identity', { parentId: await hash(JSON.stringify([issuer, payload.sub])), authTime });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof errors.JOSEError && e.code !== 'ERR_JWKS_TIMEOUT')
      throw new ApiError(401, 'UNAUTHENTICATED', 'A valid access token is required.');
    throw new ApiError(503, 'AUTH_UNAVAILABLE', 'Authentication is temporarily unavailable.');
  }
  await next();
};
/** Signed provider auth_time must reflect actual reauthentication, not token refresh.
 * This proves recent account access, NOT age or verified legal guardianship. */
export const recentParentAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const t = c.get('identity').authTime,
    now = Math.floor(Date.now() / 1000);
  if (t === null || t > now + 5 || now - t > 300)
    throw new ApiError(
      403,
      'PARENT_REAUTH_REQUIRED',
      'Reauthenticate the parent account to continue.',
    );
  await next();
};
export const rateLimit: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (!c.env.API_RATE_LIMITER)
    throw new ApiError(503, 'RATE_LIMIT_UNAVAILABLE', 'Request protection is unavailable.');
  // Cloudflare supplies CF-Connecting-IP at the edge. Never persist/log the raw IP.
  const identity = c.get('identity');
  const key = identity
    ? 'parent:' + identity.parentId
    : 'ip:' + (await hash(c.req.header('cf-connecting-ip') || 'local-unknown'));
  let success: boolean;
  try {
    ({ success } = await c.env.API_RATE_LIMITER.limit({ key }));
  } catch {
    throw new ApiError(503, 'RATE_LIMIT_UNAVAILABLE', 'Request protection is unavailable.');
  }
  if (!success) {
    c.header('Retry-After', '60');
    throw new ApiError(429, 'RATE_LIMITED', 'Too many requests. Please retry later.');
  }
  await next();
};
