import type {
  ActivityId,
  ActivityProgress,
  ChildProfile,
  CreateChild,
  LearningSummary,
  Parent,
  ParentSettings,
  ProgressInput,
  UpdateChild,
} from '../../../packages/contracts/src';
export class FamilyApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public requestId?: string,
  ) {
    super(message);
    this.name = 'FamilyApiError';
  }
}
interface Options {
  baseUrl: string;
  getAccessToken: () => Promise<string | null>;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}
/** No hardcoded hostname, token persistence, credential logging or automatic mutation retry.
 * Supply tokens from the future live auth adapter; never send DemoAuth fixtures. */
export function createFamilyApiClient({
  baseUrl,
  getAccessToken,
  timeoutMs = 10000,
  fetchImpl = fetch,
}: Options) {
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
  const id = (value: string) => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))
      throw new Error('Invalid child profile ID.');
    return value;
  };
  return {
    initializeParent: async () =>
      (await request<{ parent: Parent }>('/parents/me', 'POST', {})).parent,
    getParent: async () => (await request<{ parent: Parent }>('/parents/me')).parent,
    updateSettings: async (settings: ParentSettings, version: number) =>
      (await request<{ parent: Parent }>('/parents/me/settings', 'PATCH', { ...settings, version }))
        .parent,
    listChildren: async () => (await request<{ children: ChildProfile[] }>('/children')).children,
    createChild: async (profile: CreateChild) =>
      (await request<{ child: ChildProfile }>('/children', 'POST', profile)).child,
    updateChild: async (childId: string, profile: UpdateChild) =>
      (await request<{ child: ChildProfile }>('/children/' + id(childId), 'PATCH', profile)).child,
    deleteChild: async (childId: string, version: number) =>
      request<void>('/children/' + id(childId), 'DELETE', undefined, {
        'If-Match': `"${version}"`,
      }),
    getProgress: async (childId: string) =>
      (await request<{ progress: ActivityProgress[] }>('/children/' + id(childId) + '/progress'))
        .progress,
    putProgress: async (childId: string, activity: ActivityId, progress: ProgressInput) =>
      (
        await request<{ progress: ActivityProgress }>(
          '/children/' + id(childId) + '/progress/' + encodeURIComponent(activity),
          'PUT',
          progress,
        )
      ).progress,
    getSummary: async (childId: string) =>
      (await request<{ summary: LearningSummary }>('/children/' + id(childId) + '/summary'))
        .summary,
    deleteFamilyData: async (version: number) =>
      request<{ dataDeleted: boolean; identityAccountDeleted: boolean }>(
        '/parents/me',
        'DELETE',
        undefined,
        { 'If-Match': `"${version}"`, 'X-Confirm-Delete': 'delete-my-data' },
      ),
  };
}
