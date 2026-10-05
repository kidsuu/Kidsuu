import { editionKey, exactObject, type ReaderPackage } from './contentPackage';
export interface EditionProgress {
  editionKey: string;
  contentHash: string;
  unitIds: string[];
  optionalUnitIds: string[];
  exploredUnitIds: string[];
  skippedUnitIds: string[];
  updatedAt: string;
}
export type EditionProgressByChild = Record<string, EditionProgress[]>;
const uniqueIds = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length <= 24 &&
  value.every((v) => typeof v === 'string' && /^[A-Z][A-Z0-9-]{1,31}$/.test(v)) &&
  new Set(value).size === value.length;
export function isEditionProgress(value: unknown): value is EditionProgress {
  if (
    !exactObject(value, [
      'editionKey',
      'contentHash',
      'unitIds',
      'optionalUnitIds',
      'exploredUnitIds',
      'skippedUnitIds',
      'updatedAt',
    ]) ||
    typeof value.contentHash !== 'string' ||
    !/^[a-f0-9]{64}$/.test(value.contentHash) ||
    typeof value.editionKey !== 'string' ||
    !/^[a-z][a-z0-9-]{2,63}:(2-3|4-5|6-7|8-9):(en-IN|hi-IN):[1-9][0-9]{0,5}$/.test(
      value.editionKey,
    ) ||
    !uniqueIds(value.unitIds) ||
    !value.unitIds.length ||
    !uniqueIds(value.optionalUnitIds) ||
    !uniqueIds(value.exploredUnitIds) ||
    !uniqueIds(value.skippedUnitIds) ||
    typeof value.updatedAt !== 'string' ||
    !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value.updatedAt) ||
    !Number.isFinite(Date.parse(value.updatedAt))
  )
    return false;
  const units = value.unitIds,
    optional = value.optionalUnitIds,
    explored = value.exploredUnitIds;
  return (
    !optional.includes(units[0]) &&
    !optional.includes(units[units.length - 1]) &&
    optional.every((id) => units.includes(id)) &&
    explored.every((id) => units.includes(id)) &&
    value.skippedUnitIds.every((id) => optional.includes(id) && !explored.includes(id))
  );
}
export function progressMatches(
  content: ReaderPackage,
  row?: EditionProgress,
): row is EditionProgress {
  return (
    !!row &&
    isEditionProgress(row) &&
    row.editionKey === editionKey(content) &&
    row.contentHash === content.contentHash &&
    JSON.stringify(row.unitIds) === JSON.stringify(content.pages.map((p) => p.id)) &&
    JSON.stringify(row.optionalUnitIds) ===
      JSON.stringify(content.pages.filter((p) => p.optional).map((p) => p.id))
  );
}
export function resumeEdition(content: ReaderPackage, row?: EditionProgress): number {
  if (!progressMatches(content, row)) return 0;
  const index = content.pages.findIndex(
    (p) => !row.exploredUnitIds.includes(p.id) && !row.skippedUnitIds.includes(p.id),
  );
  return index < 0 ? 0 : index;
}
/** No voice callbacks, scores, mastery inference or viewing-time telemetry. */
export function exploreUnit(
  content: ReaderPackage,
  previous: EditionProgress | undefined,
  unitId: string,
  action: 'explore' | 'skip',
  now = new Date().toISOString(),
): EditionProgress {
  const page = content.pages.find((p) => p.id === unitId);
  if (!page || (action !== 'explore' && action !== 'skip') || (action === 'skip' && !page.optional))
    throw new Error('Invalid reader action.');
  if (previous && !progressMatches(content, previous))
    throw new Error('Content changed without a new edition version.');
  const explored = new Set(previous?.exploredUnitIds),
    skipped = new Set(previous?.skippedUnitIds);
  if (action === 'explore') {
    explored.add(unitId);
    skipped.delete(unitId);
  } else if (!explored.has(unitId)) skipped.add(unitId);
  const row: EditionProgress = {
    editionKey: editionKey(content),
    contentHash: content.contentHash,
    unitIds: content.pages.map((p) => p.id),
    optionalUnitIds: content.pages.filter((p) => p.optional).map((p) => p.id),
    exploredUnitIds: [...explored],
    skippedUnitIds: [...skipped],
    updatedAt: now,
  };
  if (!isEditionProgress(row)) throw new Error('Invalid edition checkpoint.');
  return row;
}
export function hasExploredRequired(row: EditionProgress): boolean {
  return (
    isEditionProgress(row) &&
    row.unitIds
      .filter((id) => !row.optionalUnitIds.includes(id))
      .every((id) => row.exploredUnitIds.includes(id))
  );
}
/** Repository-level guard also protects callers bypassing FamilyStore. */
export function mergeEditionProgress(
  previous: EditionProgress | undefined,
  incoming: EditionProgress,
): EditionProgress {
  if (
    !isEditionProgress(incoming) ||
    (previous &&
      (!isEditionProgress(previous) ||
        previous.editionKey !== incoming.editionKey ||
        previous.contentHash !== incoming.contentHash ||
        JSON.stringify(previous.unitIds) !== JSON.stringify(incoming.unitIds) ||
        JSON.stringify(previous.optionalUnitIds) !== JSON.stringify(incoming.optionalUnitIds)))
  )
    throw new Error('Invalid edition progress update.');
  const explored = [
    ...new Set([...(previous?.exploredUnitIds ?? []), ...incoming.exploredUnitIds]),
  ];
  return {
    ...incoming,
    unitIds: [...incoming.unitIds],
    optionalUnitIds: [...incoming.optionalUnitIds],
    exploredUnitIds: explored,
    skippedUnitIds: [
      ...new Set([...(previous?.skippedUnitIds ?? []), ...incoming.skippedUnitIds]),
    ].filter((id) => !explored.includes(id)),
  };
}
