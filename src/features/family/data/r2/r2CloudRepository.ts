import { SAVED_CONTENT_IDS, type SavedContentId } from '../../../../../packages/contracts/src';
import {
  mergeEditionProgress,
  type EditionProgress,
} from '../../../content/domain/editionProgress';
import type { FamilyRepository, LocalFamilyPreferences } from '../../domain/FamilyRepository';
import type { createFamilyApiClient } from '../../../../shared/api/FamilyApiClient';
import type { R2StorageClient } from '../../../../shared/api/R2StorageClient';

type D1FamilyClient = ReturnType<typeof createFamilyApiClient>;

/** Combines D1 relational database operations (parents, child_profiles, activity_progress)
 * with Cloudflare R2 object storage (preferences, saved bookmarks, edition progress snapshots). */
export function createR2CloudFamilyRepository(
  dbClient: D1FamilyClient,
  r2Client: R2StorageClient,
): FamilyRepository {
  let version = 0;
  let cached: LocalFamilyPreferences | undefined;
  let queue: Promise<unknown> = Promise.resolve();
  const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
  const enqueue = <T>(fn: () => Promise<T>): Promise<T> => {
    const next = queue.then(fn, fn);
    queue = next.catch(() => {});
    return next;
  };

  const toSavedIds = (items: readonly string[]): SavedContentId[] => [
    ...new Set(
      items.filter((item): item is SavedContentId =>
        (SAVED_CONTENT_IDS as readonly string[]).includes(item),
      ),
    ),
  ];

  async function pullPreferences(): Promise<LocalFamilyPreferences> {
    const stored = await r2Client.getSnapshot();
    if (!stored) {
      version = 0;
      cached = { selectedId: null, saved: {}, editions: {} };
      return clone(cached);
    }
    version = stored.version;
    cached = {
      selectedId: stored.snapshot.selectedId,
      saved: { ...stored.snapshot.saved },
      editions: { ...stored.snapshot.editions },
    };
    return clone(cached);
  }

  async function pushPreferences(next: LocalFamilyPreferences): Promise<LocalFamilyPreferences> {
    const saved: Record<string, SavedContentId[]> = {};
    for (const [id, list] of Object.entries(next.saved)) {
      saved[id] = toSavedIds(list);
    }
    const stored = await r2Client.putSnapshot({
      ...(version > 0 ? { version } : {}),
      snapshot: {
        selectedId: next.selectedId,
        saved,
        editions: next.editions,
      },
    });
    version = stored.version;
    cached = {
      selectedId: stored.snapshot.selectedId,
      saved: { ...stored.snapshot.saved },
      editions: { ...stored.snapshot.editions },
    };
    return clone(cached);
  }

  async function currentPreferences(): Promise<LocalFamilyPreferences> {
    if (cached) return clone(cached);
    return pullPreferences();
  }

  return {
    initializeParent: () => dbClient.initializeParent(),
    getParent: () => dbClient.getParent(),
    updateSettings: (settings, v) => dbClient.updateSettings(settings, v),
    listChildren: () => dbClient.listChildren(),
    createChild: (profile) => dbClient.createChild(profile),
    updateChild: (id, profile) => dbClient.updateChild(id, profile),
    deleteChild: (id, v) =>
      enqueue(async () => {
        await dbClient.deleteChild(id, v);
        await pullPreferences();
      }),
    getProgress: (id) => dbClient.getProgress(id),
    putProgress: (id, activity, progress) => dbClient.putProgress(id, activity, progress),
    getSummary: (id) => dbClient.getSummary(id),
    deleteFamilyData: (v) =>
      enqueue(async () => {
        const res = await dbClient.deleteFamilyData(v);
        version = 0;
        cached = undefined;
        return res;
      }),
    local: {
      getPreferences: () => enqueue(() => pullPreferences()),
      setSelected: (id: string) =>
        enqueue(async () => {
          const next = await currentPreferences();
          next.selectedId = id;
          await pushPreferences(next);
        }),
      setSaved: (id: string, activities: string[]) =>
        enqueue(async () => {
          const next = await currentPreferences();
          next.saved[id] = toSavedIds(activities);
          await pushPreferences(next);
        }),
      putEditionProgress: (id: string, row: EditionProgress) =>
        enqueue(async () => {
          const next = await currentPreferences();
          const rows = next.editions[id] ?? [];
          const merged = mergeEditionProgress(
            rows.find((r) => r.editionKey === row.editionKey),
            row,
          );
          next.editions[id] = [...rows.filter((r) => r.editionKey !== row.editionKey), merged];
          await pushPreferences(next);
          return clone(merged);
        }),
      clear: () =>
        enqueue(async () => {
          version = 0;
          cached = undefined;
        }),
    },
  };
}
