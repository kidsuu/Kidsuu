import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { AppEnv } from './env';
export class ApiError extends Error {
  constructor(
    public status: ContentfulStatusCode,
    public code: string,
    message: string,
    public fields?: string[],
  ) {
    super(message);
  }
}
export function failure(c: Context<AppEnv>, error: ApiError) {
  return c.json(
    {
      error: {
        code: error.code,
        message: error.message,
        requestId: c.get('requestId'),
        ...(error.fields ? { fields: error.fields } : {}),
      },
    },
    error.status,
  );
}
