import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { pilotCatalog } from '../src/features/content/data/demo/catalog';
import manifest from '../src/features/content/data/demo/manifest.json';
import {
  canPreview,
  editionKey,
  parseReaderCatalog,
  parseReaderPackage,
  releaseBlockers,
} from '../src/features/content/domain/contentPackage';
import {
  exploreUnit,
  hasExploredRequired,
  isEditionProgress,
  mergeEditionProgress,
  progressMatches,
  resumeEdition,
} from '../src/features/content/domain/editionProgress';
const rhyme = pilotCatalog[0];
const clone = <T>(v: T): T => structuredClone(v);
describe('strict reader packages and publication boundary', () => {
  it('contains four fully serialized editions with 4/6 parts, without padding', () => {
    expect(pilotCatalog.map((p) => p.pages.length)).toEqual([4, 4, 6, 6]);
    expect(pilotCatalog.map((p) => p.locale)).toEqual(['en-IN', 'hi-IN', 'en-IN', 'hi-IN']);
    expect(pilotCatalog[1].pages[1].text).toMatch(/[\u0900-\u097f]/u);
    expect(pilotCatalog[0].pages[1].text).toContain('\n');
    expect(
      pilotCatalog.every((p) => p.source && p.parentNote && p.discussion && p.objectiveId),
    ).toBe(true);
  });
  it('locks canonical scripts to content hashes and honest media manifests', () => {
    for (const p of pilotCatalog) {
      const { contentHash, ...payload } = p;
      expect(createHash('sha256').update(JSON.stringify(payload)).digest('hex')).toBe(contentHash);
      expect(manifest.packages.find((m) => m.editionKey === editionKey(p))).toMatchObject({
        contentHash,
        unitCount: p.pages.length,
        illustrations: 'not-generated',
        recordedAudio: 'not-generated',
        humanApproval: 'pending',
      });
    }
  });
  it('rejects unknown schema/fields, unsupported locales and fake approvals', () => {
    for (const patch of [
      { schemaVersion: 2 },
      { token: 'secret' },
      { locale: 'fr' },
      { publication: 'approved' },
      { reviews: ['AI-approved'] },
      { contentHash: 'bad' },
      { contentVersion: 0 },
      { pages: [] },
      { useMode: 'supported-reader' },
    ]) {
      expect(() => parseReaderPackage({ ...rhyme, ...patch })).toThrow();
    }
  });
  it('rejects duplicate pages, oversized speech and optional boundaries', () => {
    expect(() =>
      parseReaderPackage({ ...rhyme, pages: [rhyme.pages[0], rhyme.pages[0]] }),
    ).toThrow();
    expect(() =>
      parseReaderPackage({ ...rhyme, pages: [{ ...rhyme.pages[0], text: 'x'.repeat(1501) }] }),
    ).toThrow();
    expect(() =>
      parseReaderPackage({ ...rhyme, pages: [{ ...rhyme.pages[0], optional: true }] }),
    ).toThrow();
    expect(() =>
      parseReaderPackage({ ...rhyme, pages: [{ ...rhyme.pages[0], text: '\u0000' }] }),
    ).toThrow();
  });
  it('refuses duplicate editions and distinguishes version, locale and age', () => {
    expect(() => parseReaderCatalog([rhyme, rhyme])).toThrow();
    const keys = [
      rhyme,
      { ...rhyme, contentVersion: 2 },
      { ...rhyme, ageGroup: '4–5' as const },
      pilotCatalog[1],
    ].map(editionKey);
    expect(new Set(keys).size).toBe(4);
  });
  it('only previews development + demo + unlocked parent drafts', () => {
    expect(canPreview(rhyme, true, true, true)).toBe(true);
    for (const flags of [
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ])
      expect(canPreview(rhyme, ...(flags as [boolean, boolean, boolean]))).toBe(false);
    expect(canPreview({ ...rhyme, publication: 'withdrawn' }, true, true, true)).toBe(false);
    expect(releaseBlockers(rhyme)).not.toHaveLength(0);
  });
});
describe('edition exploration, never mastery or listening', () => {
  it('resumes unvisited units and never creates progress just from opening', () => {
    expect(resumeEdition(rhyme)).toBe(0);
    const row = exploreUnit(rhyme, undefined, 'R01', 'explore');
    expect(resumeEdition(rhyme, row)).toBe(1);
    expect(hasExploredRequired(row)).toBe(false);
    expect(row).not.toHaveProperty('score');
  });
  it('keeps optional skip separate while required units finish the exploration', () => {
    let row = exploreUnit(rhyme, undefined, 'R01', 'explore');
    row = exploreUnit(rhyme, row, 'R02', 'explore');
    row = exploreUnit(rhyme, row, 'R03', 'skip');
    expect(resumeEdition(rhyme, row)).toBe(3);
    row = exploreUnit(rhyme, row, 'R04', 'explore');
    expect(row.exploredUnitIds).toEqual(['R01', 'R02', 'R04']);
    expect(row.skippedUnitIds).toEqual(['R03']);
    expect(hasExploredRequired(row)).toBe(true);
    expect(resumeEdition(rhyme, row)).toBe(0);
    const replay = exploreUnit(rhyme, row, 'R03', 'explore');
    expect(replay.skippedUnitIds).toEqual([]);
    expect(exploreUnit(rhyme, replay, 'R03', 'skip').exploredUnitIds).toContain('R03');
  });
  it('refuses required skips, unknown units and fake timestamps', () => {
    expect(() => exploreUnit(rhyme, undefined, 'R01', 'skip')).toThrow();
    expect(() => exploreUnit(rhyme, undefined, 'NO', 'explore')).toThrow();
    expect(() => exploreUnit(rhyme, undefined, 'R01', 'explore', 'yesterday')).toThrow();
  });
  it('does not reuse another language, age, version or changed same-version script', () => {
    const row = exploreUnit(rhyme, undefined, 'R01', 'explore');
    for (const content of [
      pilotCatalog[1],
      { ...rhyme, ageGroup: '4–5' as const },
      { ...rhyme, contentVersion: 2 },
      { ...rhyme, contentHash: 'b'.repeat(64) },
      { ...rhyme, pages: rhyme.pages.slice(0, 2) },
    ]) {
      expect(progressMatches(content, row)).toBe(false);
      expect(resumeEdition(content, row)).toBe(0);
      expect(() => exploreUnit(content, row, content.pages[0].id, 'explore')).toThrow();
    }
  });
  it('is idempotent and merges concurrent monotonic unit updates', () => {
    const first = exploreUnit(rhyme, undefined, 'R01', 'explore');
    expect(exploreUnit(rhyme, first, 'R01', 'explore').exploredUnitIds).toEqual(['R01']);
    const second = exploreUnit(rhyme, undefined, 'R02', 'explore');
    expect(mergeEditionProgress(first, second).exploredUnitIds).toEqual(['R01', 'R02']);
    expect(() => mergeEditionProgress(first, { ...second, contentHash: 'b'.repeat(64) })).toThrow();
    const isolated = mergeEditionProgress(first, second);
    second.unitIds.push('R99');
    second.optionalUnitIds.push('R99');
    expect(isolated.unitIds).not.toContain('R99');
    expect(isolated.optionalUnitIds).not.toContain('R99');
  });
  it('rejects overlap, unknown, duplicate, required skip, and extra sensitive fields', () => {
    const row = exploreUnit(rhyme, undefined, 'R01', 'explore');
    for (const patch of [
      { token: 'secret' },
      { skippedUnitIds: ['R01'] },
      { exploredUnitIds: ['NO'] },
      { exploredUnitIds: ['R01', 'R01'] },
      { optionalUnitIds: ['R01'] },
      { unitIds: [] },
      { editionKey: '__proto__' },
      { exploredUnitIds: ['R03'], skippedUnitIds: ['R03'] },
    ])
      expect(isEditionProgress({ ...row, ...patch })).toBe(false);
    expect(isEditionProgress(clone(row))).toBe(true);
  });
});
