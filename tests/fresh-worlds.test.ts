import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import raw from '../src/features/world/data/packages.json';
import staticGames from '../docs/content-archive/fresh-games-v1/packages.json';
import type { EditionContent } from '../src/features/content/domain/contentPackage';
import { worldCatalog } from '../src/features/world/data/catalog';
import { parseWorldCatalog, parseWorldPackage } from '../src/features/world/domain/worldPackage';
import {
  PATTERNS,
  BRIDGES,
  TOKENS,
  ALL_LANTERNS,
  LANTERN_STARTS,
  patternToken,
  placePattern,
  patternSolved,
  placePlank,
  bridgeLength,
  bridgeSolved,
  lanternMask,
  toggleLanterns,
  lanternSolution,
} from '../src/features/world/domain/puzzles';
import { editionKey, canPreview } from '../src/features/content/domain/contentPackage';
import { exploreUnit } from '../src/features/content/domain/editionProgress';
import {
  buildEditionHistory,
  reviewableEdition,
} from '../src/features/content/domain/editionHistory';
import {
  createOfflineFamilyRepository,
  type SnapshotStorage,
} from '../src/features/family/data/offline/OfflineFamilyRepository';
import { FamilyStore } from '../src/features/family/domain/FamilyStore';
import { pilotCatalog as retired } from './legacy-fixtures';
const hash = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
describe('fresh bilingual library and retired content boundary', () => {
  it('contains seven new concepts, fourteen matching bilingual editions and exact hashes', () => {
    expect(worldCatalog).toHaveLength(14);
    expect(new Set(worldCatalog.map((p) => p.contentId)).size).toBe(7);
    expect(new Set(worldCatalog.map((p) => p.kind))).toEqual(
      new Set(['game', 'learning', 'story', 'rhyme']),
    );
    for (const p of worldCatalog) {
      const { contentHash, ...payload } = p;
      expect(hash(payload)).toBe(contentHash);
      expect(p.reviews).toEqual([]);
      expect(p.publication).toBe('draft');
      expect(p.pages[0].optional).toBe(false);
      expect(p.pages.at(-1)?.optional).toBe(false);
    }
    for (const p of worldCatalog.filter((p) => p.locale === 'en-IN')) {
      const hindi = worldCatalog.find((q) => q.contentId === p.contentId && q.locale === 'hi-IN')!;
      expect(hindi.pages.map((p) => [p.id, p.optional])).toEqual(
        p.pages.map((p) => [p.id, p.optional]),
      );
      expect(hindi.objectiveId).toBe(p.objectiveId);
      expect(hindi.ageGroup).toBe(p.ageGroup);
    }
  });
  it('rejects missing locales, duplicate identities, invented approvals and unsupported input', () => {
    expect(() => parseWorldCatalog(raw.slice(1))).toThrow();
    expect(() => parseWorldCatalog([...raw.slice(1), raw[1]])).toThrow();
    for (const patch of [
      { publication: 'approved' },
      { reviews: [{ name: 'invented' }] },
      { locale: 'xx' },
      { contentId: 'one-each-bowl' },
      { mode: 'quiz' },
      { mode: 'bridge', kind: 'game' },
      { ageGroup: '8–9' },
      { pages: raw[0].pages.slice(1) },
      { pages: raw[0].pages.map((p, i) => (i === 0 ? { ...p, id: 'W99' } : p)) },
      { contentVersion: 0 },
      { title: '' },
      { pages: [{ ...raw[0].pages[0], optional: true }] },
    ])
      expect(() => parseWorldPackage({ ...raw[0], ...patch })).toThrow();
    const toddler = raw.find((p) => p.ageGroup === '2–3')!;
    expect(() => parseWorldPackage({ ...toddler, useMode: 'supported-reader' })).toThrow();
  });
  it('never reopens a removed edition or maps its records to a new game', () => {
    const old = retired[0],
      row = exploreUnit(old, undefined, old.pages[0].id, 'explore');
    const entries = buildEditionHistory(worldCatalog, { child: [row] }, 'child');
    const entry = entries.find((e) => e.editionKey === editionKey(old))!;
    expect(entry.availability).toBe('saved-only');
    expect(entry.requiredExplored).toBe(1);
    expect(reviewableEdition(worldCatalog, entries, entry.editionKey)).toBeUndefined();
    expect(entries.filter((e) => e.hasRecord)).toHaveLength(1);
    for (const p of [
      'src/features/activities/screens/PracticeScreen.tsx',
      'src/features/activities/screens/ReadingScreen.tsx',
      'src/features/content/data/demo/interactivePilots.json',
      'src/features/content/data/demo/readerPilots.json',
    ])
      expect(existsSync(p)).toBe(false);
  });
  it('keeps the static game drafts separate from the animated stage editions', () => {
    const old = staticGames[0] as unknown as EditionContent;
    const fresh = worldCatalog.find(
      (p) => p.contentId === old.contentId && p.locale === old.locale,
    )!;
    expect(fresh.contentVersion).toBe(2);
    expect(editionKey(fresh)).not.toBe(editionKey(old));
    const row = exploreUnit(old, undefined, old.pages[0].id, 'explore');
    const entries = buildEditionHistory(worldCatalog, { child: [row] }, 'child');
    expect(entries.find((e) => e.editionKey === editionKey(old))?.availability).toBe('saved-only');
    expect(entries.find((e) => e.editionKey === editionKey(fresh))?.hasRecord).toBe(false);
    expect(reviewableEdition(worldCatalog, entries, editionKey(old))).toBeUndefined();
    for (const p of worldCatalog) expect(p.contentVersion).toBe(p.kind === 'game' ? 2 : 1);
  });
  it('retains the development, demo and parent-preview requirements', () => {
    for (const dev of [false, true])
      for (const demo of [false, true])
        for (const parent of [false, true])
          expect(canPreview(worldCatalog[0], dev, demo, parent)).toBe(dev && demo && parent);
  });
});
describe('pattern paths', () => {
  it.each(PATTERNS.map((p, i) => [i, p] as const))(
    'round %s has one answer per space determined by its cycle',
    (_index, round) => {
      const slots = Array(round.length).fill(null);
      expect(patternSolved(round, slots)).toBe(false);
      let correct = slots;
      for (const index of round.missing)
        correct = placePattern(round, correct, index, patternToken(round, index));
      expect(patternSolved(round, correct)).toBe(true);
      for (const index of round.missing)
        for (const token of TOKENS) {
          const candidate = placePattern(round, correct, index, token);
          expect(patternSolved(round, candidate)).toBe(token === patternToken(round, index));
        }
      expect(slots.every((v) => v === null)).toBe(true);
      expect(() => placePattern(round, slots, -1, 'leaf')).toThrow();
    },
  );
});
describe('physical bridge inventory', () => {
  it.each(BRIDGES.map((p, i) => [i, p] as const))(
    'round %s can be solved with two distinct inventory pieces',
    (_index, round) => {
      let solutions = 0;
      for (let a = 0; a < round.planks.length; a++)
        for (let b = 0; b < round.planks.length; b++)
          if (a !== b) {
            const slots = [a, b];
            expect(bridgeLength(round, slots)).toBe(round.planks[a] + round.planks[b]);
            if (bridgeSolved(round, slots)) solutions++;
          }
      expect(solutions).toBeGreaterThan(0);
      expect(bridgeSolved(round, [null, null])).toBe(false);
      const before = placePlank(round, [null, null], 0, 0),
        moved = placePlank(round, before, 1, 0);
      expect(before).toEqual([0, null]);
      expect(moved).toEqual([null, 0]);
      expect(() => bridgeLength(round, [0, 0])).toThrow();
      expect(() => placePlank(round, [null, null], 0, 99)).toThrow();
    },
  );
});
describe('lantern causal geometry and dynamic hints', () => {
  it('changes direct neighbours without diagonal or row-wrap mistakes', () => {
    expect(lanternMask(0)).toBe((1 << 0) | (1 << 1) | (1 << 3));
    expect(lanternMask(4)).toBe((1 << 1) | (1 << 3) | (1 << 4) | (1 << 5) | (1 << 7));
    expect(lanternMask(2) & (1 << 3)).toBe(0);
    for (let i = 0; i < 9; i++) expect(toggleLanterns(toggleLanterns(85, i), i)).toBe(85);
    expect(() => toggleLanterns(900, 0)).toThrow();
  });
  it('all published starts are distinct and a hint always solves the current board', () => {
    expect(new Set(LANTERN_STARTS).size).toBe(5);
    for (const initial of LANTERN_STARTS) {
      expect(initial).not.toBe(ALL_LANTERNS);
      const userChanged = toggleLanterns(initial, 2);
      const solution = lanternSolution(userChanged)!;
      expect(solution).not.toBeNull();
      expect(solution.reduce(toggleLanterns, userChanged)).toBe(ALL_LANTERNS);
    }
    expect(lanternSolution(ALL_LANTERNS)).toEqual([]);
  });
  it('exhaustively verifies the hint solver across the finite 512-board state space', () => {
    for (let board = 0; board <= 511; board++) {
      const solution = lanternSolution(board);
      expect(solution).not.toBeNull();
      expect(solution!.reduce(toggleLanterns, board)).toBe(ALL_LANTERNS);
      expect(new Set(solution).size).toBe(solution!.length);
    }
  });
});
describe('fresh history and bookmark persistence', () => {
  it('saves fresh bookmarks and all fourteen editions without relabelling retired progress', async () => {
    let disk: string | null = null;
    const storage: SnapshotStorage = {
      read: async () => disk,
      write: async (v) => {
        disk = v;
      },
      clear: async () => {
        disk = null;
      },
    };
    const store = new FamilyStore(createOfflineFamilyRepository(storage), async () => {});
    await store.load();
    await store.unlock();
    const child = store.getSnapshot().selectedId!;
    expect(await store.setSaved(['pattern-trail', 'little-seed-journey'])).toBe(true);
    await store.recordEdition(retired[0], retired[0].pages[0].id, 'explore');
    for (const p of worldCatalog)
      expect(await store.recordEdition(p, p.pages[0].id, 'explore')).toBe(true);
    const rhyme = worldCatalog.find((p) => p.mode === 'rhyme')!;
    expect(await store.recordEdition(rhyme, 'W03', 'skip')).toBe(true);
    store.dispose();
    const reopened = new FamilyStore(createOfflineFamilyRepository(storage), async () => {});
    await reopened.load();
    const state = reopened.getSnapshot();
    expect(state.parentUnlocked).toBe(false);
    expect(state.saved[child]).toEqual(['pattern-trail', 'little-seed-journey']);
    expect(state.editions[child]).toHaveLength(15);
    expect(state.progress).toEqual([]);
    const before = disk;
    expect(await reopened.recordEdition(worldCatalog[0], 'W02', 'explore')).toBe(false);
    expect(disk).toBe(before);
  });
  it('includes the actual generated artwork in the provenance manifest', () => {
    const manifest = JSON.parse(readFileSync('src/features/world/data/manifest.json', 'utf8'));
    for (const asset of manifest.assets) {
      const bytes = readFileSync('src/features/world/assets/' + asset.file);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
      expect(bytes.length).toBe(asset.bytes);
    }
  });
});
