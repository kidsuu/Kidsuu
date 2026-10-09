import type {
  PutFamilySnapshotInput,
  StoredFamilySnapshot,
  StoredObjectMeta,
} from '../../../packages/contracts/src';
import { FamilyApiError } from './FamilyApiClient';

export interface R2StorageClientOptions {
  baseUrl: string;
  getAccessToken: () => Promise<string | null>;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

const VALID_PACKAGE_KEY = /^[a-z0-9][a-z0-9:._-]{2,95}$/i;
const VALID_ASSET_KEY = /^[a-z0-9][a-z0-9._/-]{1,120}\.(png|webp|mp3|m4a|ogg|wav)$/i;

/** Client for Cloudflare R2 object storage routes (/v1/parents/me/snapshot & /v1/storage/*).
 * Relational parent/profile/progress data remains in D1 via createFamilyApiClient. */
export function createR2StorageClient({
  baseUrl,
  getAccessToken,
  timeoutMs = 10000,
  fetchImpl = fetch,
}: R2StorageClientOptions) {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    throw new Error('Configure a valid HTTPS API origin.');
  }
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== '/'
  )
    throw new Error('Configure an HTTPS API origin without credentials, query or path.');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1)
    throw new Error('Configure a positive request timeout.');
  const origin = url.origin;

  async function request<T>(
    path: string,
    method = 'GET',
    body?: unknown,
    extraHeaders?: Record<string, string>,
  ): Promise<T> {
    const token = await getAccessToken();
    if (!token || /[\r\n]/.test(token))
      throw new FamilyApiError('UNAUTHENTICATED', 'Sign in to continue.', 401);
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(origin + '/v1' + path, {
        method,
        redirect: 'error',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...extraHeaders,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      if (response.status === 204) return undefined as T;
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new FamilyApiError(
          'INVALID_RESPONSE',
          'The service returned an invalid response.',
          response.status,
          response.headers.get('x-request-id') ?? undefined,
        );
      }
      if (!response.ok) {
        const error =
          result && typeof result === 'object' && 'error' in result ? result.error : null;
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          typeof error.code === 'string' &&
          'message' in error &&
          typeof error.message === 'string'
        )
          throw new FamilyApiError(
            error.code,
            error.message,
            response.status,
            response.headers.get('x-request-id') ?? undefined,
          );
        throw new FamilyApiError(
          'REQUEST_FAILED',
          'The request could not be completed.',
          response.status,
        );
      }
      if (!result || typeof result !== 'object')
        throw new FamilyApiError(
          'INVALID_RESPONSE',
          'The service returned an invalid response.',
          response.status,
        );
      return result as T;
    } catch (e) {
      if (e instanceof FamilyApiError) throw e;
      if (controller.signal.aborted)
        throw new FamilyApiError('TIMEOUT', 'The request timed out. Please retry.', 0);
      throw new FamilyApiError('NETWORK_ERROR', 'Unable to reach the service.', 0);
    } finally {
      clearTimeout(timer);
    }
  }

  const pkgKey = (value: string) => {
    if (!VALID_PACKAGE_KEY.test(value) || value.includes('..'))
      throw new Error('Invalid content package key.');
    return value;
  };

  const assetKey = (value: string) => {
    if (!VALID_ASSET_KEY.test(value) || value.includes('..') || value.includes('//'))
      throw new Error('Invalid media asset key.');
    return value;
  };

  return {
    getSnapshot: async () =>
      (await request<{ snapshot: StoredFamilySnapshot | null }>('/parents/me/snapshot')).snapshot,
    putSnapshot: async (input: PutFamilySnapshotInput) =>
      (await request<{ snapshot: StoredFamilySnapshot }>('/parents/me/snapshot', 'PUT', input))
        .snapshot,
    deleteSnapshot: async (version: number) =>
      request<void>('/parents/me/snapshot', 'DELETE', undefined, {
        'If-Match': `"${version}"`,
      }),
    getContentPackage: async <T = Record<string, unknown>>(key: string) =>
      request<{ package: T; meta: StoredObjectMeta }>(
        '/storage/packages/' + encodeURIComponent(pkgKey(key)),
      ),
    putContentPackage: async (key: string, payload: Record<string, unknown>) =>
      (
        await request<{ meta: StoredObjectMeta }>(
          '/storage/packages/' + encodeURIComponent(pkgKey(key)),
          'PUT',
          payload,
        )
      ).meta,
    getAssetUrl: (key: string) => origin + '/v1/storage/assets/' + assetKey(key),
  };
}
export type R2StorageClient = ReturnType<typeof createR2StorageClient>;
