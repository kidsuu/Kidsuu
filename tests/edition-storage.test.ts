import { describe, it, expect, vi } from 'vitest';
import {
  createOfflineFamilyRepository,
  type SnapshotStorage,
} from '../src/features/family/data/offline/OfflineFamilyRepository';
import { createDemoFamilyRepository } from '../src/features/family/data/demo/DemoFamilyRepository';
import { FamilyStore } from '../src/features/family/domain/FamilyStore';
import { decodeSnapshot } from '../src/features/family/data/offline/snapshot';
import { interactiveCatalog } from '../src/features/content/data/demo/interactiveCatalog';
import { pilotCatalog } from '../src/features/content/data/demo/catalog';
import { exploreUnit } from '../src/features/content/domain/editionProgress';
const content = pilotCatalog[0];
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
async function open(storage: SnapshotStorage) {
  const repo = createOfflineFamilyRepository(storage),
    store = new FamilyStore(repo, async () => {});
  await store.load();
  return { store, repo };
}
describe('edition ledger durable isolation and migration', () => {
  it.each([1, 2])(
    'migrates schema %s without reinterpreting any legacy activity rows',
    async (version) => {
      const data = createDemoFamilyRepository().exportData(),
        id = data.children[0].id;
      data.progress[id] = [
        {
          activityId: 'clap',
          completedSteps: 3,
          totalSteps: 5,
          completedAt: null,
          updatedAt: data.parent.updatedAt,
        },
      ];
      const raw = JSON.stringify({
        kind: 'kidsuu-demo-family',
        schemaVersion: version,
        data,
        ...(version === 2 ? { preferences: { selectedId: id, saved: { [id]: ['clap'] } } } : {}),
      });
      const device = disk(raw),
        { store } = await open(device.storage);
      const migrated = decodeSnapshot(device.value()!).snapshot;
      expect(migrated.schemaVersion).toBe(3);
      expect(migrated.data).toEqual(data);
      expect(store.getSnapshot().editions).toEqual({});
      if (version === 2) expect(store.getSnapshot().saved[id]).toEqual(['clap']);
      expect(decodeSnapshot(device.value()!).migrated).toBe(false);
    },
  );
  it('preserves v2 bytes if migration cannot commit', async () => {
    const raw = JSON.stringify({
      kind: 'kidsuu-demo-family',
      schemaVersion: 2,
      data: createDemoFamilyRepository().exportData(),
      preferences: { selectedId: null, saved: {} },
    });
    const device = disk(raw);
    vi.mocked(device.storage.write).mockRejectedValue(new Error('Full'));
    const { store } = await open(device.storage);
    expect(store.getSnapshot().ready).toBe(false);
    expect(device.value()).toBe(raw);
  });
  it('requires adult gate and persists each locale separately across restart', async () => {
    const device = disk(),
      { store } = await open(device.storage),
      id = store.getSnapshot().selectedId!;
    expect(await store.recordEdition(content, 'R01', 'explore')).toBe(false);
    await store.unlock();
    expect(await store.recordEdition(content, 'R01', 'explore')).toBe(true);
    expect(await store.recordEdition(content, 'R03', 'skip')).toBe(true);
    expect(await store.recordEdition(pilotCatalog[1], 'R01', 'explore')).toBe(true);
    store.dispose();
    const restored = (await open(device.storage)).store.getSnapshot();
    expect(restored.editions[id]).toHaveLength(2);
    expect(restored.editions[id][0].skippedUnitIds).toEqual(['R03']);
    expect(restored.progress).toEqual([]);
    expect(restored.parentUnlocked).toBe(false);
  });
  it('does not publish a failed commit and rejects a second rapid mutation', async () => {
    const device = disk(),
      { store } = await open(device.storage);
    await store.unlock();
    const before = device.value();
    vi.mocked(device.storage.write).mockRejectedValueOnce(new Error('Disk full'));
    const pending = store.recordEdition(content, 'R01', 'explore');
    expect(await store.recordEdition(content, 'R02', 'explore')).toBe(false);
    expect(await pending).toBe(false);
    expect(device.value()).toBe(before);
    expect(store.getSnapshot().editions).toEqual({});
    expect(await store.recordEdition(content, 'R01', 'explore')).toBe(true);
  });
  it('keeps profiles isolated and deletes only the target ledger', async () => {
    const device = disk(),
      { store } = await open(device.storage);
    await store.unlock();
    const a = store.getSnapshot().children[0];
    await store.recordEdition(content, 'R01', 'explore');
    await store.saveProfile({ nickname: 'Demo Two', ageGroup: '8–9', avatar: 'moon' });
    const b = store.getSnapshot().children[1];
    await store.select(b.id);
    await store.unlock();
    expect(store.getSnapshot().editions[b.id]).toBeUndefined();
    await store.recordEdition(pilotCatalog[2], 'S01', 'explore');
    await store.deleteProfile(b);
    const prefs = decodeSnapshot(device.value()!).snapshot.preferences;
    expect(prefs.editions[b.id]).toBeUndefined();
    expect(prefs.editions[a.id]).toHaveLength(1);
    await store.select(a.id);
    await store.unlock();
    await store.saveProfile({ nickname: a.nickname, ageGroup: '4–5', avatar: a.avatar }, a);
    expect(store.getSnapshot().editions[a.id]).toHaveLength(1);
  });
  it('serializes repository updates and rejects mismatched revisions', async () => {
    const device = disk(),
      { repo } = await open(device.storage),
      id = (await repo.listChildren())[0].id;
    await Promise.all(
      ['R01', 'R02'].map((unit) =>
        repo.local!.putEditionProgress(id, exploreUnit(content, undefined, unit, 'explore')),
      ),
    );
    const row = (await repo.local!.getPreferences()).editions[id][0];
    expect(row.exploredUnitIds).toEqual(['R01', 'R02']);
    await expect(
      repo.local!.putEditionProgress(id, { ...row, contentHash: 'b'.repeat(64) }),
    ).rejects.toThrow();
  });
  it('rejects orphan rows, duplicate editions, impossible skipped state and size overflow', async () => {
    const device = disk(),
      { store } = await open(device.storage);
    await store.unlock();
    await store.recordEdition(content, 'R01', 'explore');
    const snapshot = JSON.parse(device.value()!),
      id = store.getSnapshot().selectedId!,
      row = snapshot.preferences.editions[id][0];
    for (const editions of [
      { unknown: [row] },
      { [id]: [row, row] },
      { [id]: [{ ...row, skippedUnitIds: ['R01'] }] },
      {
        [id]: Array.from({ length: 33 }, (_, i) => ({
          ...row,
          editionKey: `draft-${i}:2-3:en-IN:1`,
        })),
      },
    ]) {
      expect(() =>
        decodeSnapshot(
          JSON.stringify({ ...snapshot, preferences: { ...snapshot.preferences, editions } }),
        ),
      ).toThrow();
    }
  });
  it('erases the ledger on sign-out and refuses stale writes afterwards', async () => {
    const device = disk(),
      { store, repo } = await open(device.storage);
    await store.unlock();
    const id = store.getSnapshot().selectedId!;
    await store.recordEdition(content, 'R01', 'explore');
    expect(await store.prepareSignOut()).toBe(true);
    expect(device.value()).toBeNull();
    expect(store.getSnapshot().editions).toEqual({});
    await expect(
      repo.local!.putEditionProgress(id, exploreUnit(content, undefined, 'R01', 'explore')),
    ).rejects.toMatchObject({ code: 'LOCAL_CLOSED' });
  });
});

describe('interactive ledger integration', () => {
  it('restores all eight editions without saving answers/hints/board state or legacy totals', async () => {
    const device = disk(),
      { store } = await open(device.storage);
    await store.unlock();
    const id = store.getSnapshot().selectedId!;
    for (const p of [...pilotCatalog, ...interactiveCatalog])
      expect(await store.recordEdition(p, p.pages[0].id, 'explore')).toBe(true);
    expect(await store.recordEdition(interactiveCatalog[2], 'G05', 'skip')).toBe(true);
    store.dispose();
    const restored = (await open(device.storage)).store.getSnapshot();
    expect(restored.editions[id]).toHaveLength(8);
    expect(restored.progress).toEqual([]);
    const game = restored.editions[id].find((r) =>
      r.editionKey.includes('triangle-workshop:6-7:en-IN'),
    )!;
    expect(game.skippedUnitIds).toEqual(['G05']);
    expect(game.exploredUnitIds).toEqual(['G01']);
    for (const key of [
      'answers',
      'hints',
      'locations',
      'selectedToken',
      'independentSuccess',
      'score',
    ])
      expect(device.value()).not.toContain(`"${key}"`);
    expect(restored.parentUnlocked).toBe(false);
  });
  it('rejects unsupported saves and changed recipe hashes without mutating old progress', async () => {
    const device = disk(),
      { store } = await open(device.storage),
      p = interactiveCatalog[0];
    await store.unlock();
    await store.recordEdition(p, 'L01', 'explore');
    const before = device.value();
    expect(await store.recordEdition(p, 'L02', 'skip')).toBe(false);
    expect(device.value()).toBe(before);
    expect(await store.recordEdition({ ...p, contentHash: 'b'.repeat(64) }, 'L02', 'explore')).toBe(
      false,
    );
    expect(device.value()).toBe(before);
  });
});
