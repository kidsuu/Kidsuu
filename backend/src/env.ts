export interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
  API_RATE_LIMITER: RateLimit;
  ENVIRONMENT: string;
  AUTH_ISSUER?: string;
  AUTH_AUDIENCE?: string;
  AUTH_JWKS_URL?: string;
  ALLOWED_ORIGINS?: string;
}
export interface Identity {
  parentId: string;
  authTime: number | null;
}
export type AppEnv = { Bindings: Env; Variables: { identity: Identity; requestId: string } };
