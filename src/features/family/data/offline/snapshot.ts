import {
  isEditionProgress,
  type EditionProgressByChild,
} from '../../../content/domain/editionProgress';
import {
  ACTIVITY_IDS,
  SAVED_CONTENT_IDS,
  AGE_GROUPS,
  AVATARS,
  type Parent,
  type ChildProfile,
  type ActivityProgress,
} from '../../../../../packages/contracts/src';
import { FamilyApiError } from '../../../../shared/api/FamilyApiClient';
export interface DemoFamilyData {
  parent: Parent;
  children: ChildProfile[];
  progress: Record<string, ActivityProgress[]>;
  nextId: number;
}
export interface LocalPreferences {
  selectedId: string | null;
  saved: Record<string, string[]>;
  editions: EditionProgressByChild;
}
export interface OfflineSnapshot {
  kind: 'kidsuu-demo-family';
  schemaVersion: 3;
  data: DemoFamilyData;
  preferences: LocalPreferences;
}
export const MAX_SNAPSHOT_CHARS = 65536;
export function storageError(code: string, message: string): never {
  throw new FamilyApiError(code, message, 0);
}
function invalid(): never {
  return storageError(
    'LOCAL_DATA_INVALID',
    'Saved demo data could not be validated. Retry or explicitly erase local data. Nothing was overwritten.',
  );
}
function object(value: unknown, keys?: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid();
  const v = value as Record<string, unknown>;
  if (keys && (Object.keys(v).length !== keys.length || keys.some((k) => !Object.hasOwn(v, k))))
    return invalid();
  return v;
}
const integer = (v: unknown, min: number, max: number) =>
  typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max;
const timestamp = (v: unknown) =>
  typeof v === 'string' &&
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(v) &&
  Number.isFinite(Date.parse(v));
const childId = (v: unknown) => typeof v === 'string' && /^00000000-0000-4000-8000-\d{12}$/.test(v);
function checkData(value: unknown): DemoFamilyData {
  const data = object(value, ['parent', 'children', 'progress', 'nextId']);
  const parent = object(data.parent, ['id', 'settings', 'version', 'createdAt', 'updatedAt']);
  const settings = object(parent.settings, ['soundEnabled', 'dailyGoalMinutes']);
  if (
    parent.id !== 'demo-family-session' ||
    !integer(parent.version, 1, 2147483647) ||
    !timestamp(parent.createdAt) ||
    !timestamp(parent.updatedAt) ||
    typeof settings.soundEnabled !== 'boolean' ||
    !integer(settings.dailyGoalMinutes, 5, 60)
  )
    invalid();
  if (!Array.isArray(data.children) || data.children.length > 5) return invalid();
  const ids = new Set<string>();
  for (const value of data.children) {
    const c = object(value, [
      'id',
      'nickname',
      'ageGroup',
      'avatar',
      'version',
      'createdAt',
      'updatedAt',
    ]);
    if (
      !childId(c.id) ||
      ids.has(c.id as string) ||
      typeof c.nickname !== 'string' ||
      c.nickname !== c.nickname.trim() ||
      c.nickname.length < 1 ||
      c.nickname.length > 32 ||
      !/^[\p{L}\p{N}\p{M} .'-]+$/u.test(c.nickname) ||
      !AGE_GROUPS.some((a) => a === c.ageGroup) ||
      !AVATARS.some((a) => a === c.avatar) ||
      !integer(c.version, 1, 2147483647) ||
      !timestamp(c.createdAt) ||
      !timestamp(c.updatedAt)
    )
      invalid();
    ids.add(c.id as string);
  }
  if (
    !integer(data.nextId, 1, 999999999999) ||
    [...ids].some((id) => Number(id.slice(-12)) >= (data.nextId as number))
  )
    invalid();
  const progress = object(data.progress);
  if (Object.keys(progress).some((id) => !ids.has(id))) invalid();
  for (const rows of Object.values(progress)) {
    if (!Array.isArray(rows) || rows.length > ACTIVITY_IDS.length) return invalid();
    const activities = new Set();
    for (const value of rows) {
      const row = object(value, [
        'activityId',
        'completedSteps',
        'totalSteps',
        'completedAt',
        'updatedAt',
      ]);
      if (
        !ACTIVITY_IDS.some((a) => a === row.activityId) ||
        activities.has(row.activityId) ||
        !integer(row.totalSteps, 1, 200) ||
        !integer(row.completedSteps, 0, row.totalSteps as number) ||
        !timestamp(row.updatedAt) ||
        (row.completedSteps === row.totalSteps
          ? !timestamp(row.completedAt)
          : row.completedAt !== null)
      )
        invalid();
      activities.add(row.activityId);
    }
  }
  return data as unknown as DemoFamilyData;
}
function checkPreferences(value: unknown, data: DemoFamilyData, legacy = false): LocalPreferences {
  const prefs = object(
    value,
    legacy ? ['selectedId', 'saved'] : ['selectedId', 'saved', 'editions'],
  );
  const ids = new Set(data.children.map((c) => c.id));
  if (prefs.selectedId !== null && !ids.has(prefs.selectedId as string)) invalid();
  const saved = object(prefs.saved);
  for (const [id, values] of Object.entries(saved)) {
    if (
      !ids.has(id) ||
      !Array.isArray(values) ||
      values.length > SAVED_CONTENT_IDS.length ||
      new Set(values).size !== values.length ||
      values.some((value) => !SAVED_CONTENT_IDS.some((a) => a === value))
    )
      invalid();
  }
  const editions = legacy ? {} : object(prefs.editions);
  for (const [id, rows] of Object.entries(editions)) {
    if (
      !ids.has(id) ||
      !Array.isArray(rows) ||
      rows.length > 32 ||
      rows.some((row) => !isEditionProgress(row)) ||
      new Set(rows.map((row) => row.editionKey)).size !== rows.length
    )
      invalid();
  }
  return {
    selectedId: prefs.selectedId as string | null,
    saved: saved as Record<string, string[]>,
    editions: editions as EditionProgressByChild,
  };
}
/** No permissive spreading of unknown data. Credentials/unlock flags/unknown keys are rejected. */
export function decodeSnapshot(text: string): { snapshot: OfflineSnapshot; migrated: boolean } {
  if (text.length > MAX_SNAPSHOT_CHARS) return invalid();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return invalid();
  }
  const root = object(parsed);
  if (root.kind !== 'kidsuu-demo-family') return invalid();
  if (typeof root.schemaVersion === 'number' && root.schemaVersion > 3)
    return storageError(
      'LOCAL_DATA_NEWER',
      'This demo data was saved by a newer app. Update the app, or explicitly erase local data.',
    );
  if (root.schemaVersion === 1) {
    object(root, ['kind', 'schemaVersion', 'data']);
    const data = checkData(root.data);
    return {
      snapshot: {
        kind: 'kidsuu-demo-family',
        schemaVersion: 3,
        data,
        preferences: { selectedId: data.children[0]?.id ?? null, saved: {}, editions: {} },
      },
      migrated: true,
    };
  }
  if (root.schemaVersion !== 2 && root.schemaVersion !== 3) return invalid();
  object(root, ['kind', 'schemaVersion', 'data', 'preferences']);
  const data = checkData(root.data),
    preferences = checkPreferences(root.preferences, data, root.schemaVersion === 2);
  return {
    snapshot: { kind: 'kidsuu-demo-family', schemaVersion: 3, data, preferences },
    migrated: root.schemaVersion !== 3,
  };
}
export function encodeSnapshot(snapshot: OfflineSnapshot): string {
  const text = JSON.stringify(snapshot);
  decodeSnapshot(text);
  return text;
}
