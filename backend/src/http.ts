import type { Context } from 'hono';
import type { z } from 'zod';
import type { AppEnv } from './env';
import { ApiError } from './errors';
const MAX_BODY = 4096;
export async function readBody<T>(
  c: Context<AppEnv>,
  schema: z.ZodType<T>,
  maxBytes = MAX_BODY,
): Promise<T> {
  if (c.req.header('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json')
    throw new ApiError(415, 'JSON_REQUIRED', 'Send an application/json request.');
  const limitLabel = maxBytes >= 1024 ? `${Math.floor(maxBytes / 1024)} KiB` : `${maxBytes} bytes`;
  const length = c.req.header('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes))
    throw new ApiError(413, 'BODY_TOO_LARGE', `Request body exceeds ${limitLabel}.`);
  const reader = c.req.raw.body?.getReader();
  if (!reader) throw new ApiError(400, 'INVALID_JSON', 'A JSON body is required.');
  let text = '',
    size = 0;
  const decoder = new TextDecoder('utf-8', { fatal: true });
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new ApiError(413, 'BODY_TOO_LARGE', `Request body exceeds ${limitLabel}.`);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(400, 'INVALID_JSON', 'Invalid JSON body.');
  } finally {
    reader.releaseLock();
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new ApiError(400, 'INVALID_JSON', 'Invalid JSON body.');
  }
  const result = schema.safeParse(value);
  if (!result.success)
    throw new ApiError(400, 'VALIDATION_ERROR', 'Check the request fields.', [
      ...new Set(result.error.issues.map((i) => i.path.join('.')).filter(Boolean)),
    ]);
  return result.data;
}
export async function readBinary(
  c: Context<AppEnv>,
  allowedMime: readonly string[],
  maxBytes = 2_000_000,
): Promise<{ bytes: Uint8Array; contentType: string }> {
  const ct = c.req.header('content-type')?.split(';')[0].trim().toLowerCase() ?? '';
  if (!allowedMime.includes(ct))
    throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Unsupported asset content-type.');
  const length = c.req.header('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes || Number(length) < 1))
    throw new ApiError(413, 'BODY_TOO_LARGE', 'Asset body is empty or exceeds the size limit.');
  const reader = c.req.raw.body?.getReader();
  if (!reader) throw new ApiError(400, 'EMPTY_BODY', 'An asset body is required.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new ApiError(413, 'BODY_TOO_LARGE', 'Asset body exceeds the size limit.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  if (size < 1) throw new ApiError(400, 'EMPTY_BODY', 'An asset body is required.');
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { bytes, contentType: ct };
}
export function childId(value: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))
    throw new ApiError(400, 'INVALID_ID', 'Invalid profile identifier.');
  return value;
}
export function deleteVersion(c: Context<AppEnv>) {
  const h = c.req.header('if-match');
  if (!h)
    throw new ApiError(428, 'VERSION_REQUIRED', 'Send the current quoted version in If-Match.');
  if (!/^"[1-9]\d{0,9}"$/.test(h))
    throw new ApiError(400, 'INVALID_VERSION', 'Invalid If-Match version.');
  const v = Number(h.slice(1, -1));
  if (v > 2147483647) throw new ApiError(400, 'INVALID_VERSION', 'Invalid If-Match version.');
  return v;
}
