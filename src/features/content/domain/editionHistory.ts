import type { AgeGroup } from '../../../../packages/contracts/src';
import { editionKey, type ContentLocale, type EditionContent } from './contentPackage';
import { isEditionProgress, progressMatches, type EditionProgress } from './editionProgress';

export type HistoryCatalogEntry = EditionContent & {
  title: string;
  kind: 'story' | 'rhyme' | 'learning' | 'game';
};
export interface HistoryEntry {
  editionKey: string;
  contentHash: string;
  contentId: string;
  title: string | null;
  kind: HistoryCatalogEntry['kind'] | null;
  ageGroup: AgeGroup;
  locale: ContentLocale;
  version: number;
  availability: 'current' | 'saved-only' | 'changed' | 'withdrawn';
  hasRecord: boolean;
  updatedAt: string | null;
  units: { id: string; optional: boolean; state: 'explored' | 'skipped' | 'not-marked' }[];
  requiredTotal: number;
  requiredExplored: number;
  optionalExplored: number;
  skipped: number;
  allRequiredExplored: boolean;
}
/** Read-only projection of one selected profile. No storage writes, voice callbacks,
 * dates invented from opening, or cross-version/legacy aggregate learning scores. */
export function buildEditionHistory(
  catalog: readonly HistoryCatalogEntry[],
  ledger: Readonly<Record<string, readonly EditionProgress[]>>,
  childId: string | null,
): HistoryEntry[] {
  if (!childId) return [];
  const rows = Object.hasOwn(ledger, childId) ? ledger[childId] : [];
  if (
    !Array.isArray(rows) ||
    rows.length > 32 ||
    rows.some((r) => !isEditionProgress(r)) ||
    new Set(rows.map((r) => r.editionKey)).size !== rows.length
  )
    throw new Error('Invalid selected-profile edition history.');
  const current = new Map(catalog.map((p) => [editionKey(p), p]));
  if (current.size !== catalog.length) throw new Error('Duplicate catalog edition.');
  const saved = new Map<string, EditionProgress>(
    rows.map((r: EditionProgress) => [r.editionKey, r]),
  );
  const keys = [...new Set([...current.keys(), ...saved.keys()])].sort();
  return keys.map((key) => {
    const content = current.get(key),
      row = saved.get(key);
    const availability: HistoryEntry['availability'] = !content
      ? 'saved-only'
      : content.publication === 'withdrawn'
        ? 'withdrawn'
        : row && !progressMatches(content, row)
          ? 'changed'
          : 'current';
    // Saved structure wins, especially if an editor changed the same-version package.
    // Do not map an old row to the current title, pages, age or version.
    const pages = row
      ? row.unitIds.map((id) => ({ id, optional: row.optionalUnitIds.includes(id) }))
      : content!.pages;
    const units: HistoryEntry['units'] = pages.map((p) => ({
      id: p.id,
      optional: p.optional,
      state: row?.exploredUnitIds.includes(p.id)
        ? 'explored'
        : row?.skippedUnitIds.includes(p.id)
          ? 'skipped'
          : 'not-marked',
    }));
    const [contentId, age, locale, version] = key.split(':');
    const requiredTotal = units.filter((u) => !u.optional).length;
    const requiredExplored = units.filter((u) => !u.optional && u.state === 'explored').length;
    return {
      editionKey: key,
      contentHash: row?.contentHash ?? content!.contentHash,
      contentId,
      title: availability === 'current' ? content!.title : null,
      kind: availability === 'current' ? content!.kind : null,
      ageGroup: age.replace('-', '–') as AgeGroup,
      locale: locale as ContentLocale,
      version: Number(version),
      availability,
      hasRecord: !!row,
      updatedAt: row?.updatedAt ?? null,
      units,
      requiredTotal,
      requiredExplored,
      optionalExplored: units.filter((u) => u.optional && u.state === 'explored').length,
      skipped: units.filter((u) => u.state === 'skipped').length,
      allRequiredExplored: !!row && requiredTotal > 0 && requiredTotal === requiredExplored,
    };
  });
}
export function filterEditionHistory(
  entries: readonly HistoryEntry[],
  filters: {
    locale: ContentLocale | 'all';
    ageGroup: AgeGroup | 'all';
    savedOnly: boolean;
  },
): HistoryEntry[] {
  return entries.filter(
    (e) =>
      (filters.locale === 'all' || e.locale === filters.locale) &&
      (filters.ageGroup === 'all' || e.ageGroup === filters.ageGroup) &&
      (!filters.savedOnly || e.hasRecord),
  );
}
/** Opening a review must use an exact, still-current identity. This returns data only;
 * the screen's development/demo/parent/lifecycle boundary independently gates access. */
export function reviewableEdition<T extends HistoryCatalogEntry>(
  catalog: readonly T[],
  entries: readonly HistoryEntry[],
  key: string,
): T | undefined {
  const entry = entries.find((e) => e.editionKey === key && e.availability === 'current');
  if (!entry) return undefined;
  return catalog.find(
    (c) =>
      editionKey(c) === key &&
      c.publication === 'draft' &&
      c.contentHash === entry.contentHash &&
      JSON.stringify(c.pages.map(({ id, optional }) => ({ id, optional }))) ===
        JSON.stringify(entry.units.map(({ id, optional }) => ({ id, optional }))),
  );
}
