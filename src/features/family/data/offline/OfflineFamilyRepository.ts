import { mergeEditionProgress } from '../../../content/domain/editionProgress';
import type { FamilyRepository } from '../../domain/FamilyRepository';
import { createDemoFamilyRepository } from '../demo/DemoFamilyRepository';
import { decodeSnapshot, encodeSnapshot, storageError, type OfflineSnapshot } from './snapshot';
export interface SnapshotStorage {
  read(): Promise<string | null>;
  write(text: string): Promise<void>;
  clear(): Promise<void>;
}
/** Single-app-session local repository. All reads/writes are serialized, using
 * copy -> validate -> atomic disk commit -> publish. Failed writes never publish. */
export function createOfflineFamilyRepository(storage: SnapshotStorage): FamilyRepository {
  let snapshot: OfflineSnapshot | undefined;
  let closed = false;
  let queue: Promise<unknown> = Promise.resolve();
  const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
  const enqueue = <T>(fn: () => Promise<T>): Promise<T> => {
    const next = queue.then(fn, fn);
    queue = next.catch(() => {});
    return next;
  };
  async function write(next: OfflineSnapshot) {
    const text = encodeSnapshot(next);
    try {
      await storage.write(text);
    } catch {
      storageError(
        'LOCAL_WRITE_FAILED',
        'Could not save on this device. Your last saved data is unchanged. Free storage space and retry.',
      );
    }
    snapshot = next;
  }
  async function hydrate() {
    if (closed)
      storageError('LOCAL_CLOSED', 'This local session is closed. Sign in to start again.');
    if (snapshot) return snapshot;
    let raw: string | null;
    try {
      raw = await storage.read();
    } catch {
      return storageError(
        'LOCAL_READ_FAILED',
        'Could not open saved data on this device. Retry; your data has not been reset.',
      );
    }
    if (raw === null) {
      const data = createDemoFamilyRepository().exportData();
      await write({
        kind: 'kidsuu-demo-family',
        schemaVersion: 3,
        data,
        preferences: { selectedId: data.children[0]?.id ?? null, saved: {}, editions: {} },
      });
    } else {
      const decoded = decodeSnapshot(raw);
      if (decoded.migrated) await write(decoded.snapshot);
      else snapshot = decoded.snapshot;
    }
    return snapshot!;
  }
  async function erase() {
    try {
      await storage.clear();
    } catch {
      return storageError(
        'LOCAL_CLEAR_FAILED',
        'Local data could not be cleared. You are still signed in. Retry before leaving this device.',
      );
    }
    snapshot = undefined;
    closed = true;
  }
  const read = <T>(fn: (repo: ReturnType<typeof createDemoFamilyRepository>) => Promise<T>) =>
    enqueue(async () => fn(createDemoFamilyRepository((await hydrate()).data)));
  const mutate = <T>(
    fn: (repo: ReturnType<typeof createDemoFamilyRepository>) => Promise<T>,
    updatePreferences?: (next: OfflineSnapshot, result: T) => void,
  ) =>
    enqueue(async () => {
      const next = clone(await hydrate());
      const candidate = createDemoFamilyRepository(next.data);
      const result = await fn(candidate);
      next.data = candidate.exportData();
      updatePreferences?.(next, result);
      const ids = new Set(next.data.children.map((c) => c.id));
      if (next.preferences.selectedId !== null && !ids.has(next.preferences.selectedId))
        next.preferences.selectedId = null;
      for (const id of Object.keys(next.preferences.saved))
        if (!ids.has(id)) delete next.preferences.saved[id];
      for (const id of Object.keys(next.preferences.editions))
        if (!ids.has(id)) delete next.preferences.editions[id];
      await write(next);
      return result;
    });
  return {
    getParent: () => read((repo) => repo.getParent()),
    initializeParent: () => read((repo) => repo.initializeParent()),
    listChildren: () => read((repo) => repo.listChildren()),
    getProgress: (id) => read((repo) => repo.getProgress(id)),
    getSummary: (id) => read((repo) => repo.getSummary(id)),
    updateSettings: (settings, version) => mutate((repo) => repo.updateSettings(settings, version)),
    createChild: (input) =>
      mutate(
        (repo) => repo.createChild(input),
        (next, child) => {
          if (next.preferences.selectedId === null) next.preferences.selectedId = child.id;
        },
      ),
    updateChild: (id, input) => mutate((repo) => repo.updateChild(id, input)),
    deleteChild: (id, version) => mutate((repo) => repo.deleteChild(id, version)),
    putProgress: (id, activity, input) => mutate((repo) => repo.putProgress(id, activity, input)),
    deleteFamilyData: (version) =>
      enqueue(async () => {
        const repo = createDemoFamilyRepository((await hydrate()).data);
        const result = await repo.deleteFamilyData(version);
        await erase();
        return result;
      }),
    local: {
      getPreferences: () => enqueue(async () => clone((await hydrate()).preferences)),
      setSelected: (id) =>
        enqueue(async () => {
          const next = clone(await hydrate());
          if (!next.data.children.some((c) => c.id === id))
            storageError('NOT_FOUND', 'Profile not found.');
          next.preferences.selectedId = id;
          await write(next);
        }),
      setSaved: (id, activities) =>
        enqueue(async () => {
          const next = clone(await hydrate());
          if (!next.data.children.some((c) => c.id === id))
            storageError('NOT_FOUND', 'Profile not found.');
          next.preferences.saved[id] = [...new Set(activities)];
          await write(next);
        }),
      putEditionProgress: (id, row) =>
        enqueue(async () => {
          const next = clone(await hydrate());
          if (!next.data.children.some((c) => c.id === id))
            storageError('NOT_FOUND', 'Profile not found.');
          const rows = next.preferences.editions[id] ?? [];
          const merged = mergeEditionProgress(
            rows.find((r) => r.editionKey === row.editionKey),
            row,
          );
          next.preferences.editions[id] = [
            ...rows.filter((r) => r.editionKey !== row.editionKey),
            merged,
          ];
          await write(next);
          return clone(merged);
        }),
      // Bypasses hydration so corruption/newer-schema/open failures can be explicitly reset.
      // Queued work before deletion completes first; work after deletion sees closed=true.
      clear: () =>
        enqueue(async () => {
          if (!closed) await erase();
        }),
    },
  };
}
