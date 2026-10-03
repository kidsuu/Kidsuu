import { describe, expect, it, vi } from 'vitest';
import { createDemoFamilyRepository } from '../src/features/family/data/demo/DemoFamilyRepository';
import { FamilyStore, familyError } from '../src/features/family/domain/FamilyStore';
import { FamilyApiError } from '../src/shared/api/FamilyApiClient';
import { validateGoal, validateProfile } from '../src/features/family/domain/validation';
import type { ActivityProgress } from '../packages/contracts/src';
const profile = { nickname: 'Tara', ageGroup: '6–7' as const, avatar: 'star' as const };
async function setup() {
  const repo = createDemoFamilyRepository(),
    authorize = vi.fn(async () => {}),
    store = new FamilyStore(repo, authorize);
  await store.load();
  return { repo, authorize, store };
}
describe('family session and protection', () => {
  it('loads isolated demo data without any network requests', async () => {
    const network = vi.spyOn(globalThis, 'fetch');
    const { store } = await setup();
    expect(store.getSnapshot().children).toHaveLength(1);
    expect(store.getSnapshot().parentUnlocked).toBe(false);
    expect(network).not.toHaveBeenCalled();
    network.mockRestore();
  });
  it('refuses mutations until parent access is explicitly granted and relocks', async () => {
    const { store, authorize } = await setup();
    expect(await store.saveProfile(profile)).toBe(false);
    expect(await store.unlock()).toBe(true);
    expect(authorize).toHaveBeenCalledOnce();
    expect(await store.saveProfile(profile)).toBe(true);
    store.lock();
    expect(await store.deleteProfile(store.getSnapshot().children[0])).toBe(false);
    expect(store.getSnapshot().children).toHaveLength(2);
  });
  it('fails closed when real parent reauthentication is unavailable', async () => {
    const store = new FamilyStore(createDemoFamilyRepository(), async () => {
      throw new FamilyApiError('AUTH_NOT_CONFIGURED', 'Not configured', 503);
    });
    await store.load();
    expect(await store.unlock()).toBe(false);
    expect(await store.saveProfile(profile)).toBe(false);
  });
  it('ignores a parent authorization response after background relocking', async () => {
    let resolve!: () => void;
    const store = new FamilyStore(
      createDemoFamilyRepository(),
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    const pending = store.unlock();
    store.lock();
    resolve();
    expect(await pending).toBe(false);
    expect(store.getSnapshot().parentUnlocked).toBe(false);
  });
  it('keeps progress and saved activities separate between profiles', async () => {
    const { store } = await setup();
    const first = store.getSnapshot().selectedId!;
    await store.unlock();
    await store.saveProfile(profile);
    await store.record('count', { completedSteps: 2, totalSteps: 5 });
    store.setSaved(['count']);
    const second = store.getSnapshot().children[1].id;
    await store.select(second);
    expect(store.getSnapshot().progress).toEqual([]);
    expect(store.getSnapshot().saved[second]).toBeUndefined();
    await store.select(first);
    expect(store.getSnapshot().progress[0].completedSteps).toBe(2);
    expect(store.getSnapshot().saved[first]).toEqual(['count']);
  });
  it('ignores stale profile reads on fast switching', async () => {
    const { store, repo } = await setup();
    await store.unlock();
    await store.saveProfile(profile);
    const [a, b] = store.getSnapshot().children;
    let complete!: (rows: ActivityProgress[]) => void;
    vi.spyOn(repo, 'getProgress')
      .mockImplementationOnce(
        () =>
          new Promise((done) => {
            complete = done;
          }),
      )
      .mockResolvedValueOnce([]);
    const first = store.select(a.id);
    await store.select(b.id);
    complete([
      {
        activityId: 'count',
        completedSteps: 4,
        totalSteps: 5,
        completedAt: null,
        updatedAt: '2026-10-03',
      },
    ]);
    await first;
    expect(store.getSnapshot().selectedId).toBe(b.id);
    expect(store.getSnapshot().progress).toEqual([]);
  });
  it('serializes writes and does not auto-retry ambiguous network failures', async () => {
    const { store, repo } = await setup();
    await store.unlock();
    let reject!: (e: Error) => void;
    const create = vi.spyOn(repo, 'createChild').mockImplementation(
      () =>
        new Promise((_ok, fail) => {
          reject = fail;
        }),
    );
    const first = store.saveProfile(profile);
    expect(await store.saveProfile(profile)).toBe(false);
    reject(new FamilyApiError('TIMEOUT', 'Timeout', 0));
    expect(await first).toBe(false);
    expect(create).toHaveBeenCalledOnce();
    expect(store.getSnapshot().busy).toBe(false);
    expect(store.getSnapshot().error).toContain('Reload');
  });
  it('does not advance saved progress when its write fails', async () => {
    const { store, repo } = await setup();
    vi.spyOn(repo, 'putProgress').mockRejectedValue(
      new FamilyApiError('NETWORK_ERROR', 'Offline', 0),
    );
    expect(await store.record('count', { completedSteps: 1, totalSteps: 5 })).toBe(false);
    expect(store.getSnapshot().progress).toEqual([]);
  });
  it('displays conflicts without silently overwriting a changed profile', async () => {
    const { store, repo } = await setup();
    await store.unlock();
    const original = store.getSnapshot().children[0];
    await repo.updateChild(original.id, {
      version: original.version,
      nickname: 'Changed elsewhere',
    });
    expect(await store.saveProfile(profile, original)).toBe(false);
    expect(store.getSnapshot().error).toContain('Reload');
    await store.load();
    expect(store.getSnapshot().children[0].nickname).toBe('Changed elsewhere');
  });
  it('deletion clears selected profile progress and local bookmarks', async () => {
    const { store } = await setup();
    await store.unlock();
    const child = store.getSnapshot().children[0];
    store.setSaved(['count']);
    await store.record('count', { completedSteps: 1, totalSteps: 5 });
    expect(await store.deleteProfile(child)).toBe(true);
    expect(store.getSnapshot().selectedId).toBeNull();
    expect(store.getSnapshot().progress).toEqual([]);
    expect(store.getSnapshot().saved).toEqual({});
  });
  it('erases family state without claiming external identity deletion', async () => {
    const { store, repo } = await setup();
    await store.unlock();
    const deleted = vi.spyOn(repo, 'deleteFamilyData');
    expect(await store.deleteFamily()).toBe(true);
    expect(await deleted.mock.results[0].value).toEqual({
      dataDeleted: true,
      identityAccountDeleted: false,
    });
    expect(store.getSnapshot().children).toEqual([]);
    expect(store.getSnapshot().parent).toBeNull();
  });
  it('disposal clears session data and ignores in-flight responses', async () => {
    const { store, repo } = await setup();
    let finish!: (rows: ActivityProgress[]) => void;
    vi.spyOn(repo, 'getProgress').mockImplementation(
      () =>
        new Promise((done) => {
          finish = done;
        }),
    );
    const request = store.select(store.getSnapshot().selectedId!);
    store.dispose();
    finish([]);
    await request;
    expect(store.getSnapshot().children).toEqual([]);
    expect(store.getSnapshot().selectedId).toBeNull();
    expect(await store.unlock()).toBe(false);
  });
});
describe('demo contract parity', () => {
  it('caps profiles at five and returns defensive copies', async () => {
    const repo = createDemoFamilyRepository();
    for (let i = 0; i < 4; i++) await repo.createChild(profile);
    await expect(repo.createChild(profile)).rejects.toMatchObject({ code: 'PROFILE_LIMIT' });
    const rows = await repo.listChildren();
    rows[0].nickname = 'Mutated';
    expect((await repo.listChildren())[0].nickname).not.toBe('Mutated');
  });
  it('uses versioned settings and rejects invalid goals', async () => {
    const repo = createDemoFamilyRepository(),
      parent = await repo.getParent();
    const updated = await repo.updateSettings(
      { soundEnabled: false, dailyGoalMinutes: 20 },
      parent.version,
    );
    expect(updated.version).toBe(2);
    await expect(repo.updateSettings(parent.settings, parent.version)).rejects.toMatchObject({
      code: 'VERSION_CONFLICT',
    });
    await expect(
      repo.updateSettings({ soundEnabled: false, dailyGoalMinutes: 61 }, 2),
    ).rejects.toMatchObject({ code: 'INVALID_INPUT' });
  });
  it('keeps progress monotonic, idempotent and fixed-total', async () => {
    const repo = createDemoFamilyRepository(),
      id = (await repo.listChildren())[0].id;
    const row = await repo.putProgress(id, 'count', { completedSteps: 5, totalSteps: 5 });
    expect(await repo.putProgress(id, 'count', { completedSteps: 2, totalSteps: 5 })).toEqual(row);
    await expect(
      repo.putProgress(id, 'count', { completedSteps: 3, totalSteps: 6 }),
    ).rejects.toMatchObject({ code: 'PROGRESS_CONFLICT' });
    expect((await repo.getSummary(id)).activitiesCompleted).toBe(1);
  });
  it('validates unicode nicknames and bounded whole-minute goals', () => {
    expect(validateProfile({ ...profile, nickname: 'तारा' })).toBeNull();
    for (const nickname of ['', ' ', 'a'.repeat(33), '<script>'])
      expect(validateProfile({ ...profile, nickname })).not.toBeNull();
    for (const goal of ['', '4', '61', '5.5', '1e1', '-5', 'NaN'])
      expect(validateGoal(goal)).toBeNull();
    expect(validateGoal('15')).toBe(15);
  });
  it('shows actionable failures for expired auth and rate limits', () => {
    expect(familyError(new FamilyApiError('PARENT_REAUTH_REQUIRED', '', 403))).toContain(
      'verify again',
    );
    expect(familyError(new FamilyApiError('UNAUTHENTICATED', '', 401))).toContain('sign in');
    expect(familyError(new FamilyApiError('RATE_LIMITED', '', 429))).toContain('wait');
  });
});
