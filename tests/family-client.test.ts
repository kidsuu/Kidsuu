import { describe, expect, it, vi } from 'vitest';
import { createFamilyApiClient, FamilyApiError } from '../src/shared/api/FamilyApiClient';
import { createR2StorageClient } from '../src/shared/api/R2StorageClient';
import { createR2CloudFamilyRepository } from '../src/features/family/data/r2/r2CloudRepository';
const origin = 'https://kidsuu-api.example.workers.dev';
const childId = '1f3d7790-9fb8-4c89-a1ea-071ced3a2711';
describe('Family API client', () => {
  it.each([
    'http://example.test',
    'https://user:pass@example.test',
    'https://example.test/v1',
    'https://example.test?token=x',
  ])('rejects unsafe API origin %s', (baseUrl) => {
    expect(() => createFamilyApiClient({ baseUrl, getAccessToken: async () => null })).toThrow();
    expect(() => createR2StorageClient({ baseUrl, getAccessToken: async () => null })).toThrow();
  });
  it('fails before making a request without a live token', async () => {
    const fetchImpl = vi.fn();
    const client = createFamilyApiClient({
      baseUrl: origin,
      getAccessToken: async () => null,
      fetchImpl,
    });
    await expect(client.listChildren()).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
  it('uses injected origin and bearer token without cookies or redirect forwarding', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ children: [] }));
    const client = createFamilyApiClient({
      baseUrl: origin,
      getAccessToken: async () => 'opaque-test-token',
      fetchImpl,
    });
    expect(await client.listChildren()).toEqual([]);
    expect(fetchImpl).toHaveBeenCalledWith(
      origin + '/v1/children',
      expect.objectContaining({
        redirect: 'error',
        headers: expect.objectContaining({ Authorization: 'Bearer opaque-test-token' }),
      }),
    );
  });
  it('surfaces reauthentication without silently retrying a mutation', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        Response.json(
          { error: { code: 'PARENT_REAUTH_REQUIRED', message: 'Reauthenticate.' } },
          { status: 403, headers: { 'x-request-id': 'request-test' } },
        ),
      );
    const client = createFamilyApiClient({
      baseUrl: origin,
      getAccessToken: async () => 'opaque-test-token',
      fetchImpl,
    });
    await expect(
      client.createChild({ nickname: 'Test', ageGroup: '4–5', avatar: 'star' }),
    ).rejects.toMatchObject({
      code: 'PARENT_REAUTH_REQUIRED',
      status: 403,
      requestId: 'request-test',
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
  it('sends a version for deletion and handles 204 without parsing JSON', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }));
    const client = createFamilyApiClient({
      baseUrl: origin,
      getAccessToken: async () => 'opaque-test-token',
      fetchImpl,
    });
    await expect(client.deleteChild(childId, 3)).resolves.toBeUndefined();
    expect(fetchImpl).toHaveBeenCalledWith(
      origin + '/v1/children/' + childId,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({ 'If-Match': '"3"' }),
      }),
    );
  });
  it('times out requests and does not retry', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );
    const client = createFamilyApiClient({
      baseUrl: origin,
      getAccessToken: async () => 'opaque-test-token',
      timeoutMs: 5,
      fetchImpl,
    });
    await expect(client.listChildren()).rejects.toMatchObject({ code: 'TIMEOUT' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
  it('returns a controlled error for HTML instead of an API response', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('<html>Error</html>', { status: 502 }));
    const client = createFamilyApiClient({
      baseUrl: origin,
      getAccessToken: async () => 'opaque-test-token',
      fetchImpl,
    });
    await expect(client.listChildren()).rejects.toBeInstanceOf(FamilyApiError);
  });
  it('separates D1 relational calls from R2 object storage snapshots and assets', async () => {
    const snapshotResponse = {
      version: 1,
      sha256: 'a'.repeat(64),
      updatedAt: '2026-10-09T08:00:00.000Z',
      snapshot: {
        selectedId: childId,
        saved: { [childId]: ['colours', 'pattern-trail'] },
        editions: {},
      },
    };
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ snapshot: null }))
      .mockResolvedValueOnce(Response.json({ snapshot: snapshotResponse }))
      .mockResolvedValueOnce(Response.json({ snapshot: snapshotResponse }));
    const dbClient = createFamilyApiClient({
      baseUrl: origin,
      getAccessToken: async () => 'opaque-test-token',
      fetchImpl,
    });
    const r2Client = createR2StorageClient({
      baseUrl: origin,
      getAccessToken: async () => 'opaque-test-token',
      fetchImpl,
    });
    const repo = createR2CloudFamilyRepository(dbClient, r2Client);
    expect(await repo.local!.getPreferences()).toEqual({
      selectedId: null,
      saved: {},
      editions: {},
    });
    await repo.local!.setSaved(childId, ['colours', 'pattern-trail']);
    expect((await repo.local!.getPreferences()).saved[childId]).toEqual([
      'colours',
      'pattern-trail',
    ]);
    const request = JSON.parse(String(fetchImpl.mock.calls[1][1]?.body));
    expect(request.snapshot.saved[childId]).toEqual(['colours', 'pattern-trail']);
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      origin + '/v1/parents/me/snapshot',
      expect.objectContaining({
        method: 'PUT',
      }),
    );
    expect(r2Client.getAssetUrl('scenes/rhyme-up.png')).toBe(
      origin + '/v1/storage/assets/scenes/rhyme-up.png',
    );
    expect(() => r2Client.getAssetUrl('../bad.png')).toThrow();
  });
});
