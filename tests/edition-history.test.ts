import { describe, it, expect } from 'vitest';
import { pilotCatalog, interactiveCatalog } from './legacy-fixtures';
import oldRaw from '../docs/content-archive/readerPilots-v1.json';
import { editionKey, parseReaderCatalog } from '../src/features/content/domain/contentPackage';
import { exploreUnit, type EditionProgress } from '../src/features/content/domain/editionProgress';
import {
  buildEditionHistory,
  filterEditionHistory,
  reviewableEdition,
} from '../src/features/content/domain/editionHistory';
import { FamilyStore } from '../src/features/family/domain/FamilyStore';
import {
  createOfflineFamilyRepository,
  type SnapshotStorage,
} from '../src/features/family/data/offline/OfflineFamilyRepository';
const catalog = [...pilotCatalog, ...interactiveCatalog];
const rhyme = pilotCatalog[0],
  old = parseReaderCatalog(oldRaw)[0];
const date = '2026-10-06T04:00:00.000Z';
const record = (p = rhyme, id = p.pages[0].id) => exploreUnit(p, undefined, id, 'explore', date);
const clone = <T>(v: T): T => structuredClone(v);
const all = { locale: 'all', ageGroup: 'all', savedOnly: false } as const;
describe('read-only edition history', () => {
  it('shows eight current editions without creating progress or timestamps', () => {
    const entries = buildEditionHistory(catalog, {}, 'child-a');
    expect(entries).toHaveLength(8);
    expect(new Set(entries.map((e) => e.kind))).toEqual(
      new Set(['story', 'rhyme', 'learning', 'game']),
    );
    expect(
      entries.every(
        (e) =>
          !e.hasRecord &&
          e.updatedAt === null &&
          !e.allRequiredExplored &&
          e.requiredExplored === 0,
      ),
    ).toBe(true);
    expect(entries.every((e) => e.units.every((u) => u.state === 'not-marked'))).toBe(true);
  });
  it('does not invent exploration for a structurally valid empty saved record', () => {
    const row = { ...record(), exploredUnitIds: [] };
    const result = buildEditionHistory(catalog, { a: [row] }, 'a').find((e) => e.hasRecord)!;
    expect(result).toMatchObject({
      hasRecord: true,
      requiredExplored: 0,
      optionalExplored: 0,
      skipped: 0,
      allRequiredExplored: false,
    });
    expect(result.units.every((u) => u.state === 'not-marked')).toBe(true);
  });
  it('does not combine children, missing selections or prototype properties', () => {
    const ledger = { 'child-a': [record()], 'child-b': [record(pilotCatalog[1])] };
    expect(buildEditionHistory(catalog, ledger, null)).toEqual([]);
    const a = buildEditionHistory(catalog, ledger, 'child-a').filter((e) => e.hasRecord);
    const b = buildEditionHistory(catalog, ledger, 'child-b').filter((e) => e.hasRecord);
    expect(a.map((e) => e.locale)).toEqual(['en-IN']);
    expect(b.map((e) => e.locale)).toEqual(['hi-IN']);
    expect(buildEditionHistory(catalog, ledger, 'missing').some((e) => e.hasRecord)).toBe(false);
    expect(
      buildEditionHistory(catalog, Object.create(ledger) as typeof ledger, 'child-a').some(
        (e) => e.hasRecord,
      ),
    ).toBe(false);
  });
  it('keeps v1 saved history separate from v2 and does not borrow current titles or kinds', () => {
    const entries = buildEditionHistory(catalog, { a: [record(old)] }, 'a');
    expect(entries).toHaveLength(9);
    const archived = entries.find((e) => e.editionKey === editionKey(old))!;
    expect(archived).toMatchObject({
      version: 1,
      availability: 'saved-only',
      title: null,
      kind: null,
      hasRecord: true,
      requiredExplored: 1,
      requiredTotal: 3,
      updatedAt: date,
    });
    expect(entries.find((e) => e.editionKey === editionKey(rhyme))).toMatchObject({
      version: 2,
      availability: 'current',
      hasRecord: false,
      requiredExplored: 0,
    });
    expect(reviewableEdition(catalog, entries, archived.editionKey)).toBeUndefined();
  });
  it('keeps unknown/newer editions without guessing metadata or remapping ages', () => {
    const other = {
      ...old,
      contentId: 'future-reader',
      ageGroup: '6–7' as const,
      contentVersion: 999999,
    };
    const entries = buildEditionHistory(catalog, { a: [record(other)] }, 'a');
    expect(entries.find((e) => e.contentId === 'future-reader')).toMatchObject({
      ageGroup: '6–7',
      version: 999999,
      availability: 'saved-only',
      title: null,
      kind: null,
    });
  });
  it('separates required exploration, optional exploration and optional skipping', () => {
    let row = record();
    for (const unit of ['R02', 'R04']) row = exploreUnit(rhyme, row, unit, 'explore', date);
    row = exploreUnit(rhyme, row, 'R03', 'skip', date);
    const skipped = buildEditionHistory(catalog, { a: [row] }, 'a').find((e) => e.hasRecord)!;
    expect(skipped).toMatchObject({
      requiredTotal: 3,
      requiredExplored: 3,
      optionalExplored: 0,
      skipped: 1,
      allRequiredExplored: true,
    });
    expect(skipped.units.find((u) => u.id === 'R03')?.state).toBe('skipped');
    row = exploreUnit(rhyme, row, 'R03', 'explore', date);
    const explored = buildEditionHistory(catalog, { a: [row] }, 'a').find((e) => e.hasRecord)!;
    expect(explored).toMatchObject({ requiredExplored: 3, optionalExplored: 1, skipped: 0 });
  });
  it('handles game optional reasoning and single-language history independently', () => {
    const game = interactiveCatalog.find((p) => p.kind === 'game' && p.locale === 'hi-IN')!;
    const row = exploreUnit(game, undefined, 'G05', 'skip', date);
    const result = buildEditionHistory(catalog, { a: [row] }, 'a').find((e) => e.hasRecord)!;
    expect(result).toMatchObject({
      kind: 'game',
      locale: 'hi-IN',
      requiredTotal: 5,
      requiredExplored: 0,
      skipped: 1,
      allRequiredExplored: false,
    });
  });
  it('blocks same-version hash/structure mismatches and keeps the old unit snapshot', () => {
    const row = record();
    for (const changed of [
      { ...rhyme, contentHash: 'b'.repeat(64) },
      { ...rhyme, pages: rhyme.pages.slice(0, 2) },
    ]) {
      const result = buildEditionHistory([changed], { a: [row] }, 'a')[0];
      expect(result).toMatchObject({
        availability: 'changed',
        title: null,
        kind: null,
        requiredTotal: 3,
        requiredExplored: 1,
      });
      expect(result.units).toHaveLength(4);
      expect(reviewableEdition([changed], [result], result.editionKey)).toBeUndefined();
    }
  });
  it('retains withdrawn history but disallows opening', () => {
    const withdrawn = { ...rhyme, publication: 'withdrawn' as const };
    const entries = buildEditionHistory([withdrawn], { a: [record()] }, 'a');
    expect(entries[0]).toMatchObject({ availability: 'withdrawn', hasRecord: true, title: null });
    expect(reviewableEdition([withdrawn], entries, entries[0].editionKey)).toBeUndefined();
  });
  it('opens only the exact current locale/age/version/hash and rejects stale projections', () => {
    const entries = buildEditionHistory(catalog, { a: [record()] }, 'a');
    const key = editionKey(rhyme);
    expect(reviewableEdition(catalog, entries, key)).toBe(rhyme);
    expect(reviewableEdition(catalog, entries, editionKey(old))).toBeUndefined();
    expect(
      reviewableEdition([{ ...rhyme, contentHash: 'b'.repeat(64) }], entries, key),
    ).toBeUndefined();
    expect(
      reviewableEdition([{ ...rhyme, pages: rhyme.pages.slice(0, 2) }], entries, key),
    ).toBeUndefined();
    expect(reviewableEdition(catalog, entries, 'unknown')).toBeUndefined();
  });
  it('filters by stored edition age/locale and retains records when filters hide them', () => {
    const ledger = { a: [record(), record(pilotCatalog[3]), record(old)] };
    const before = JSON.stringify(ledger);
    const entries = buildEditionHistory(catalog, ledger, 'a');
    expect(filterEditionHistory(entries, { ...all, savedOnly: true })).toHaveLength(3);
    expect(
      filterEditionHistory(entries, { ...all, locale: 'hi-IN', savedOnly: true }).map(
        (e) => e.contentId,
      ),
    ).toEqual(['dry-bench-story']);
    expect(
      filterEditionHistory(entries, { ...all, ageGroup: '2–3', savedOnly: true }),
    ).toHaveLength(2);
    expect(filterEditionHistory(entries, { ...all, ageGroup: '4–5', savedOnly: true })).toEqual([]);
    expect(filterEditionHistory(entries, all)).toHaveLength(9);
    expect(JSON.stringify(ledger)).toBe(before);
  });
  it('returns deterministic order without sorting/mutating the ledger or catalog', () => {
    const rows = [record(pilotCatalog[3]), record(), record(old)];
    const c = clone(catalog),
      before = JSON.stringify({ c, rows });
    const one = buildEditionHistory(c, { a: rows }, 'a');
    expect(buildEditionHistory([...c].reverse(), { a: [...rows].reverse() }, 'a')).toEqual(one);
    one[0].units[0].state = 'skipped';
    expect(JSON.stringify({ c, rows })).toBe(before);
  });
  it('refuses invalid/duplicate/oversized selected history and duplicate catalog keys', () => {
    const row = record();
    for (const rows of [
      [row, row],
      [{ ...row, skippedUnitIds: ['R01'] }],
      [{ ...row, updatedAt: 'invalid' }],
      [{ ...row, token: 'secret' }],
    ])
      expect(() => buildEditionHistory(catalog, { a: rows }, 'a')).toThrow();
    const rows = Array.from({ length: 33 }, (_, i) => ({
      ...row,
      editionKey: `stored-${i}:2-3:en-IN:1`,
    }));
    expect(() => buildEditionHistory(catalog, { a: rows }, 'a')).toThrow();
    expect(() => buildEditionHistory([rhyme, rhyme], {}, 'a')).toThrow();
    expect(() =>
      buildEditionHistory(catalog, { a: [row], b: [{} as EditionProgress] }, 'a'),
    ).not.toThrow();
  });
  it('shows all 32 retained rows without eviction or merging with eight current editions', () => {
    const row = record();
    const rows = Array.from({ length: 32 }, (_, i) => ({
      ...row,
      editionKey: `stored-${i}:2-3:en-IN:1`,
    }));
    const entries = buildEditionHistory(catalog, { a: rows }, 'a');
    expect(entries).toHaveLength(40);
    expect(entries.filter((e) => e.hasRecord)).toHaveLength(32);
    expect(rows).toHaveLength(32);
  });
  it('includes no mastery, rank, answer, elapsed-time or percentage fields', () => {
    const result = buildEditionHistory(catalog, { a: [record()] }, 'a');
    for (const e of result)
      for (const key of [
        'score',
        'mastery',
        'rank',
        'answers',
        'minutes',
        'timeSpent',
        'percentage',
        'listened',
      ])
        expect(e).not.toHaveProperty(key);
  });
  it('can browse, filter and resolve a draft without changing durable storage across restart', async () => {
    let disk: string | null = null;
    let writes = 0;
    const storage: SnapshotStorage = {
      read: async () => disk,
      write: async (v) => {
        writes++;
        disk = v;
      },
      clear: async () => {
        disk = null;
      },
    };
    const store = new FamilyStore(createOfflineFamilyRepository(storage), async () => {});
    await store.load();
    await store.unlock();
    await store.recordEdition(old, 'R01', 'explore');
    await store.recordEdition(rhyme, 'R03', 'skip');
    const before = disk,
      count = writes,
      state = store.getSnapshot();
    const entries = buildEditionHistory(catalog, state.editions, state.selectedId);
    filterEditionHistory(entries, { ...all, locale: 'hi-IN' });
    reviewableEdition(catalog, entries, editionKey(rhyme));
    expect(writes).toBe(count);
    expect(disk).toBe(before);
    store.dispose();
    const reopened = new FamilyStore(createOfflineFamilyRepository(storage), async () => {});
    await reopened.load();
    const restored = reopened.getSnapshot();
    expect(restored.parentUnlocked).toBe(false);
    expect(buildEditionHistory(catalog, restored.editions, restored.selectedId)).toEqual(entries);
    expect(restored.progress).toEqual([]);
    reopened.dispose();
  });
});
