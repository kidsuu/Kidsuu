import { describe, expect, it, vi } from 'vitest';
import { createDemoFamilyRepository } from '../src/features/family/data/demo/DemoFamilyRepository';
import {
  createOfflineFamilyRepository,
  type SnapshotStorage,
} from '../src/features/family/data/offline/OfflineFamilyRepository';
import {
  decodeSnapshot,
  encodeSnapshot,
  MAX_SNAPSHOT_CHARS,
  type OfflineSnapshot,
} from '../src/features/family/data/offline/snapshot';
import { FamilyStore } from '../src/features/family/domain/FamilyStore';
const profile = { nickname: 'तारा', ageGroup: '6–7' as const, avatar: 'star' as const };
function disk(initial: string | null = null) {
  let value = initial;
  const storage: SnapshotStorage = {
    read: vi.fn(async () => value),
    write: vi.fn(async (text) => {
      value = text;
    }),
    clear: vi.fn(async () => {
      value = null;
    }),
  };
  return { storage, value: () => value };
}
function fixture(): OfflineSnapshot {
  const data = createDemoFamilyRepository().exportData();
  return {
    kind: 'kidsuu-demo-family',
    schemaVersion: 3,
    data,
    preferences: { selectedId: data.children[0].id, saved: {}, editions: {} },
  };
}
async function session(storage: SnapshotStorage) {
  const repo = createOfflineFamilyRepository(storage);
  const store = new FamilyStore(repo, async () => {});
  await store.load();
  return { repo, store };
}
describe('offline save / restore', () => {
  it('restores profiles, settings, selection, progress and bookmarks after a new session', async () => {
    const device = disk(),
      { store } = await session(device.storage);
    await store.unlock();
    expect(await store.saveProfile(profile)).toBe(true);
    const id = store.getSnapshot().children[1].id;
    await store.select(id);
    await store.unlock();
    await store.saveSettings(
      { soundEnabled: false, dailyGoalMinutes: 25 },
      store.getSnapshot().parent!.version,
    );
    await store.record('moon', { completedSteps: 3, totalSteps: 5 });
    await store.setSaved(['moon', 'count']);
    store.dispose(); // app restart/unmount is NOT sign-out.
    const restored = (await session(device.storage)).store.getSnapshot();
    expect(restored.ready).toBe(true);
    expect(restored.children[1].nickname).toBe('तारा');
    expect(restored.selectedId).toBe(id);
    expect(restored.saved[id]).toEqual(['moon', 'count']);
    expect(restored.progress[0].completedSteps).toBe(3);
    expect(restored.parent!.settings).toEqual({ soundEnabled: false, dailyGoalMinutes: 25 });
    expect(restored.parentUnlocked).toBe(false);
  });
  it('does not persist auth, locks, error messages or transient UI state', async () => {
    const device = disk(),
      { store } = await session(device.storage);
    await store.unlock();
    await store.setSaved(['count']);
    const snapshot = JSON.parse(device.value()!);
    expect(Object.keys(snapshot).sort()).toEqual(['data', 'kind', 'preferences', 'schemaVersion']);
    expect(Object.keys(snapshot.preferences).sort()).toEqual(['editions', 'saved', 'selectedId']);
    for (const key of [
      'parentUnlocked',
      'password',
      'token',
      'otp',
      'authorization',
      'busy',
      'error',
    ])
      expect(device.value()).not.toContain(`"${key}"`);
  });
  it('restores separate child progress and deletes associated rows/bookmarks atomically', async () => {
    const device = disk(),
      { repo, store } = await session(device.storage);
    const a = store.getSnapshot().children[0];
    await store.unlock();
    await store.saveProfile(profile);
    const b = store.getSnapshot().children[1];
    await store.record('count', { completedSteps: 1, totalSteps: 5 });
    await store.setSaved(['count']);
    await store.select(b.id);
    await store.record('bear', { completedSteps: 4, totalSteps: 5 });
    await store.setSaved(['bear']);
    await store.unlock();
    expect(await store.deleteProfile(b)).toBe(true);
    const snapshot = decodeSnapshot(device.value()!).snapshot;
    expect(snapshot.data.progress[b.id]).toBeUndefined();
    expect(snapshot.preferences.saved[b.id]).toBeUndefined();
    expect(snapshot.preferences.selectedId).toBeNull();
    expect((await repo.getProgress(a.id))[0].completedSteps).toBe(1);
    expect((await session(device.storage)).store.getSnapshot().selectedId).toBeNull();
  });
  it('preserves edited profile versions and never reuses deleted IDs after restart', async () => {
    const device = disk(),
      { repo } = await session(device.storage);
    const child = await repo.createChild(profile);
    await repo.updateChild(child.id, { version: child.version, nickname: 'Nova' });
    const again = createOfflineFamilyRepository(device.storage);
    expect((await again.listChildren())[1]).toMatchObject({ nickname: 'Nova', version: 2 });
    await again.deleteChild(child.id, 2);
    const next = await createOfflineFamilyRepository(device.storage).createChild(profile);
    expect(next.id).not.toBe(child.id);
  });
  it('keeps an empty family empty across restart instead of reseeding children', async () => {
    const device = disk(),
      { repo } = await session(device.storage);
    const child = (await repo.listChildren())[0];
    await repo.deleteChild(child.id, child.version);
    expect(await createOfflineFamilyRepository(device.storage).listChildren()).toEqual([]);
  });
  it('persists the first new selection when creating into an empty family', async () => {
    const device = disk(),
      { store } = await session(device.storage);
    await store.unlock();
    await store.deleteProfile(store.getSnapshot().children[0]);
    await store.saveProfile(profile);
    expect((await session(device.storage)).store.getSnapshot().selectedId).toBe(
      store.getSnapshot().selectedId,
    );
  });
  it('makes no network calls while saving or restoring', async () => {
    const network = vi.spyOn(globalThis, 'fetch');
    try {
      const device = disk();
      const { store } = await session(device.storage);
      await store.record('count', { completedSteps: 1, totalSteps: 5 });
      await session(device.storage);
      expect(network).not.toHaveBeenCalled();
    } finally {
      network.mockRestore();
    }
  });
});
describe('disk commit failure semantics', () => {
  it('publishes no profile change and no advanced ID/version after a failed write', async () => {
    const device = disk(),
      { repo, store } = await session(device.storage);
    await store.unlock();
    const before = device.value();
    vi.mocked(device.storage.write).mockRejectedValueOnce(new Error('Disk full'));
    expect(await store.saveProfile(profile)).toBe(false);
    expect(device.value()).toBe(before);
    expect(store.getSnapshot().children).toHaveLength(1);
    const next = await repo.createChild(profile);
    expect(next.id.endsWith('000000000002')).toBe(true);
  });
  it('does not report progress or bookmarks saved when disk commit fails', async () => {
    const device = disk(),
      { store } = await session(device.storage);
    vi.mocked(device.storage.write).mockRejectedValueOnce(new Error('Disk full'));
    expect(await store.record('count', { completedSteps: 2, totalSteps: 5 })).toBe(false);
    expect(store.getSnapshot().progress).toEqual([]);
    vi.mocked(device.storage.write).mockRejectedValueOnce(new Error('Disk full'));
    expect(await store.setSaved(['count'])).toBe(false);
    expect(store.getSnapshot().saved).toEqual({});
    expect(store.getSnapshot().error).toContain('Could not save');
  });
  it('keeps selection unchanged if selecting cannot commit', async () => {
    const device = disk(),
      { store } = await session(device.storage);
    await store.unlock();
    await store.saveProfile(profile);
    const before = store.getSnapshot().selectedId;
    vi.mocked(device.storage.write).mockRejectedValueOnce(new Error('Disk full'));
    await store.select(store.getSnapshot().children[1].id);
    expect(store.getSnapshot().selectedId).toBe(before);
    expect(decodeSnapshot(device.value()!).snapshot.preferences.selectedId).toBe(before);
  });
  it('waits for the disk before acknowledging progress', async () => {
    const device = disk(),
      { store } = await session(device.storage);
    let finish!: () => void;
    vi.mocked(device.storage.write).mockImplementationOnce(
      (text) =>
        new Promise<void>((done) => {
          finish = () => {
            void text;
            done();
          };
        }),
    );
    const pending = store.record('count', { completedSteps: 2, totalSteps: 5 });
    // Allow the serialized repository task and pure async engine to reach disk.
    await vi.waitFor(() => expect(finish).toBeTypeOf('function'));
    expect(store.getSnapshot().busy).toBe(true);
    expect(store.getSnapshot().progress).toEqual([]);
    finish();
    expect(await pending).toBe(true);
  });
  it('serializes concurrent repo writes without losing independent changes', async () => {
    const device = disk(),
      { repo } = await session(device.storage),
      id = (await repo.listChildren())[0].id;
    await Promise.all([
      repo.putProgress(id, 'count', { completedSteps: 2, totalSteps: 5 }),
      repo.putProgress(id, 'moon', { completedSteps: 3, totalSteps: 5 }),
      repo.local!.setSaved(id, ['moon']),
    ]);
    const restored = await session(device.storage);
    expect(restored.store.getSnapshot().progress).toHaveLength(2);
    expect(restored.store.getSnapshot().saved[id]).toEqual(['moon']);
  });
});
describe('schema validation and explicit recovery', () => {
  it('migrates supported v1 documents to v3 and retains family data', async () => {
    const data = fixture().data,
      device = disk(JSON.stringify({ kind: 'kidsuu-demo-family', schemaVersion: 1, data }));
    const { store } = await session(device.storage);
    expect(store.getSnapshot().ready).toBe(true);
    const restored = JSON.parse(device.value()!);
    expect(restored.schemaVersion).toBe(3);
    expect(restored.data).toEqual(data);
    expect(restored.preferences.saved).toEqual({});
  });
  it('preserves old schema on failed migration commit', async () => {
    const text = JSON.stringify({
        kind: 'kidsuu-demo-family',
        schemaVersion: 1,
        data: fixture().data,
      }),
      device = disk(text);
    vi.mocked(device.storage.write).mockRejectedValue(new Error('Disk full'));
    const { store } = await session(device.storage);
    expect(store.getSnapshot().ready).toBe(false);
    expect(device.value()).toBe(text);
  });
  it.each([
    '{broken',
    'null',
    '[]',
    JSON.stringify({ kind: 'kidsuu-demo-family', schemaVersion: 99 }),
  ])('never silently replaces unsupported/corrupt data (%s)', async (text) => {
    const device = disk(text),
      { store } = await session(device.storage);
    expect(store.getSnapshot().ready).toBe(false);
    expect(store.getSnapshot().children).toEqual([]);
    expect(device.value()).toBe(text);
    expect(device.storage.write).not.toHaveBeenCalled();
    expect(await store.prepareSignOut()).toBe(true);
    expect(device.value()).toBeNull();
    expect((await session(device.storage)).store.getSnapshot().ready).toBe(true);
  });
  it('rejects injected credentials, parent-unlock and orphan/invalid data', () => {
    const mutations: ((s: Record<string, any>) => void)[] = [
      (s) => {
        s.token = 'never-save';
      },
      (s) => {
        s.preferences.parentUnlocked = true;
      },
      (s) => {
        s.data.parent.settings.dailyGoalMinutes = 100;
      },
      (s) => {
        s.data.children[0].nickname = '<script>';
      },
      (s) => {
        s.preferences.selectedId = 'unknown';
      },
      (s) => {
        s.preferences.saved.unknown = ['moon'];
      },
      (s) => {
        s.data.progress.unknown = [];
      },
      (s) => {
        s.data.nextId = 1;
      },
      (s) => {
        s.preferences.saved[s.data.children[0].id] = ['unknown'];
      },
      (s) => {
        s.data.parent.password = 'never-save';
      },
    ];
    for (const mutate of mutations) {
      const value = fixture();
      mutate(value);
      expect(() => decodeSnapshot(JSON.stringify(value))).toThrow();
    }
    expect(() => decodeSnapshot(' '.repeat(MAX_SNAPSHOT_CHARS + 1))).toThrow();
  });
  it('rejects impossible progress and duplicate child/activity rows', () => {
    const s = fixture(),
      id = s.data.children[0].id;
    const row = {
      activityId: 'count' as const,
      completedSteps: 6,
      totalSteps: 5,
      completedAt: null,
      updatedAt: s.data.parent.updatedAt,
    };
    s.data.progress[id] = [row];
    expect(() => encodeSnapshot(s)).toThrow();
    row.completedSteps = 2;
    s.data.progress[id] = [row, row];
    expect(() => encodeSnapshot(s)).toThrow();
    s.data.progress[id] = [];
    s.data.children.push(s.data.children[0]);
    expect(() => encodeSnapshot(s)).toThrow();
  });
  it('retries a read error without discarding saved records', async () => {
    const text = encodeSnapshot(fixture()),
      device = disk(text);
    vi.mocked(device.storage.read).mockRejectedValue(new Error('Device locked'));
    const { store } = await session(device.storage);
    expect(store.getSnapshot().ready).toBe(false);
    expect(device.value()).toBe(text);
    vi.mocked(device.storage.read).mockResolvedValue(text);
    await store.load();
    expect(store.getSnapshot().ready).toBe(true);
  });
});
describe('durable deletion and sign-out', () => {
  it('clears disk on sign-out but not on route disposal or app restart', async () => {
    const device = disk(),
      { store } = await session(device.storage);
    store.dispose();
    expect(device.value()).not.toBeNull();
    const second = await session(device.storage);
    expect(await second.store.prepareSignOut()).toBe(true);
    expect(device.value()).toBeNull();
    expect(second.store.getSnapshot().children).toEqual([]);
  });
  it('refuses successful sign-out if erase fails and allows a retry', async () => {
    const device = disk(),
      { store } = await session(device.storage);
    const before = device.value();
    vi.mocked(device.storage.clear).mockRejectedValueOnce(new Error('Locked'));
    expect(await store.prepareSignOut()).toBe(false);
    expect(device.value()).toBe(before);
    expect(store.getSnapshot().error).toContain('could not be cleared');
    expect(await store.prepareSignOut()).toBe(true);
    expect(device.value()).toBeNull();
  });
  it('version checks family deletion and invalidates stale writers after erase', async () => {
    const device = disk(),
      { repo } = await session(device.storage);
    const parent = await repo.getParent(),
      id = (await repo.listChildren())[0].id;
    await expect(repo.deleteFamilyData(parent.version + 1)).rejects.toMatchObject({
      code: 'VERSION_CONFLICT',
    });
    expect(device.value()).not.toBeNull();
    const deletion = repo.deleteFamilyData(parent.version);
    const stale = repo.putProgress(id, 'count', { completedSteps: 1, totalSteps: 5 });
    expect(await deletion).toEqual({ dataDeleted: true, identityAccountDeleted: false });
    await expect(stale).rejects.toMatchObject({ code: 'LOCAL_CLOSED' });
    expect(device.value()).toBeNull();
  });
  it('does not clear while a store mutation is in flight', async () => {
    const device = disk(),
      { store } = await session(device.storage);
    const pending = store.record('count', { completedSteps: 1, totalSteps: 5 });
    expect(await store.prepareSignOut()).toBe(false);
    await pending;
    expect(await store.prepareSignOut()).toBe(true);
  });
});
