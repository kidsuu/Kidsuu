import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import {
  interactiveCatalog as catalog,
  interactiveRecipes as recipes,
} from '../src/features/content/data/demo/interactiveCatalog';
import rawRecipes from '../src/features/content/data/demo/interactiveRecipes.json';
import manifest from '../src/features/content/data/demo/interactiveManifest.json';
import {
  parseInteractivePackage,
  parseInteractiveCatalog,
  parseRecipes,
} from '../src/features/content/domain/interactivePackage';
import {
  canPreview,
  editionKey,
  parseReaderPackage,
} from '../src/features/content/domain/contentPackage';
import {
  exploreUnit,
  hasExploredRequired,
  resumeEdition,
} from '../src/features/content/domain/editionProgress';
import {
  correctShapeId,
  isTriangle,
  pathSegments,
  segmentLayout,
  shapeReason,
  triangleArea,
  type Shape,
} from '../src/features/content/domain/geometry';
const hash = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const shape = (id: string) => recipes.shapes.find((s) => s.id === id)!;
describe('interactive authoring packages', () => {
  it('serializes four bilingual six-unit pilots and optional G05, not reader padding', () => {
    expect(catalog.map((p) => p.kind)).toEqual(['learning', 'learning', 'game', 'game']);
    expect(catalog.map((p) => p.locale)).toEqual(['en-IN', 'hi-IN', 'en-IN', 'hi-IN']);
    for (const p of catalog) {
      expect(p.pages).toHaveLength(6);
      expect(p.pages.every((v) => v.text.length > 0)).toBe(true);
    }
    expect(catalog[0].pages.filter((p) => p.optional)).toEqual([]);
    expect(catalog[2].pages.filter((p) => p.optional).map((p) => p.id)).toEqual(['G05']);
    expect(catalog[1].pages[0].text).toMatch(/[\u0900-\u097f]/u);
  });
  it('binds every script and exact geometric recipe to honest manifests', () => {
    expect(manifest.recipeHash).toBe(hash(rawRecipes));
    for (const p of catalog) {
      const { contentHash, ...payload } = p;
      expect(contentHash).toBe(hash(payload));
      expect(p.recipeHash).toBe(manifest.recipeHash);
      expect(manifest.packages.find((m) => m.editionKey === editionKey(p))).toMatchObject({
        contentHash,
        unitCount: 6,
        humanApproval: 'pending',
        illustrations: 'procedural-unreviewed',
        recordedAudio: 'not-generated',
      });
    }
  });
  it('keeps readers strict and does not allow an approval flag or extra data', () => {
    expect(() => parseReaderPackage(catalog[0])).toThrow();
    for (const patch of [
      { publication: 'approved' },
      { reviews: ['AI approved'] },
      { secret: 'bad' },
      { assetStatus: 'reviewed' },
      { ageGroup: '2–3' },
      { recipeHash: 'bad' },
      { feedback: {} },
    ])
      expect(() => parseInteractivePackage({ ...catalog[0], ...patch })).toThrow();
    expect(canPreview(catalog[0], false, true, true)).toBe(false);
    expect(canPreview({ ...catalog[0], publication: 'withdrawn' }, true, true, true)).toBe(false);
  });
  it('rejects wrong scene order, optional flags, missing explanations or hints', () => {
    const p = catalog[2];
    for (const patch of [
      { id: 'X01' },
      { mode: 'picnic-intro' },
      { optional: true },
      { hints: ['bad'] },
      { text: 'x'.repeat(1501) },
      { secret: true },
    ])
      expect(() =>
        parseInteractivePackage({
          ...p,
          pages: [{ ...p.pages[0], ...patch }, ...p.pages.slice(1)],
        }),
      ).toThrow();
    expect(() =>
      parseInteractivePackage({ ...p, pages: p.pages.filter((v) => v.id !== 'G05') }),
    ).toThrow();
    const pages = p.pages.map((v) => ({ ...v }));
    pages[4].optional = false;
    expect(() => parseInteractivePackage({ ...p, pages })).toThrow();
    expect(() => parseInteractiveCatalog([p, p])).toThrow();
  });
  it('allows required exploration without assuming choice, correctness or listening', () => {
    const p = catalog[2];
    let row = exploreUnit(p, undefined, 'G01', 'explore');
    for (const page of p.pages.slice(1))
      row = exploreUnit(p, row, page.id, page.optional ? 'skip' : 'explore');
    expect(row.exploredUnitIds).toEqual(['G01', 'G02', 'G03', 'G04', 'G06']);
    expect(row.skippedUnitIds).toEqual(['G05']);
    expect(hasExploredRequired(row)).toBe(true);
    expect(resumeEdition(catalog[3], row)).toBe(0);
    expect(row).not.toHaveProperty('answers');
    expect(row).not.toHaveProperty('mastery');
  });
  it('neutral end copy refers to the displayed model rather than an unobserved success', () => {
    expect(catalog[0].pages[5].text).toContain('Our picture');
    expect(catalog[2].pages[5].text).toContain('These examples');
    expect(catalog[0].pages[3].text).toContain('new place');
  });
});
describe('deterministic shape definitions and answers', () => {
  it('has exactly one mathematically valid triangle in each round, in varied positions', () => {
    const rounds = Object.values(recipes.rounds).map((ids) => ids.map(shape));
    expect(rounds.map(correctShapeId)).toEqual(['closed-tri', 'turned-tri', 'scalene-tri']);
    expect(rounds.map((r) => r.findIndex(isTriangle))).toEqual([0, 2, 1]);
    expect(recipes.shapes.filter(isTriangle)).toHaveLength(3);
  });
  it('uses a true right-angle rotation and genuinely scalene example', () => {
    const upright = shape('closed-tri'),
      turned = shape('turned-tri'),
      scalene = shape('scalene-tri');
    if (upright.kind !== 'path' || turned.kind !== 'path' || scalene.kind !== 'path')
      throw new Error('Wrong fixture');
    expect(upright.points.map(([x, y]) => [100 - y, x])).toEqual(turned.points);
    expect(triangleArea(upright.points)).toBe(triangleArea(turned.points));
    const lengths = scalene.points.map((p, i) => {
      const q = scalene.points[(i + 1) % 3];
      return Math.hypot(p[0] - q[0], p[1] - q[1]);
    });
    expect(new Set(lengths).size).toBe(3);
  });
  it('preserves an actual visible gap instead of falsely closing the open-three foil', () => {
    const s = shape('open-three'),
      segments = pathSegments(s);
    expect(isTriangle(s)).toBe(false);
    expect(shapeReason(s)).toBe('open');
    expect(segments).toHaveLength(3);
    const first = segments[0][0],
      last = segments[2][1];
    expect(Math.hypot(first[0] - last[0], first[1] - last[1])).toBe(20);
  });
  it('renders a non-linear quadratic boundary and never calls it a triangle', () => {
    const s = shape('curved-three');
    expect(shapeReason(s)).toBe('curved');
    expect(isTriangle(s)).toBe(false);
    const segments = pathSegments(s);
    expect(segments).toHaveLength(26);
    expect(segments[0][1]).toEqual(segments[1][0]);
    expect(segments[segments.length - 1][1]).toEqual(segments[0][0]);
    expect(segments[12][1][0]).toBeGreaterThan(70);
  });
  it('samples actual ellipses with uniform stroke geometry instead of a rounded rectangle', () => {
    const oval = shape('oval');
    if (oval.kind !== 'ellipse') throw new Error('Wrong fixture');
    const segments = pathSegments(oval);
    expect(segments).toHaveLength(64);
    for (const [p] of segments)
      expect(((p[0] - 50) / oval.radii[0]) ** 2 + ((p[1] - 50) / oval.radii[1]) ** 2).toBeCloseTo(
        1,
      );
    expect(segments[63][1]).toEqual(segments[0][0]);
  });
  it('keys every foil explanation from the same boundary used for drawing', () => {
    expect(shapeReason(shape('square'))).toBe('four');
    expect(shapeReason(shape('rectangle'))).toBe('four');
    expect(shapeReason(shape('circle'))).toBe('curved');
    expect(shapeReason(shape('oval'))).toBe('curved');
    expect(() => correctShapeId([shape('square'), shape('circle')])).toThrow();
    expect(() => correctShapeId([shape('closed-tri'), shape('scalene-tri')])).toThrow();
  });
  it('keeps all rendered path endpoints bounded and line transforms centred', () => {
    for (const s of recipes.shapes)
      for (const [a, b] of pathSegments(s)) {
        for (const p of [a, b])
          expect(p.every((n) => Number.isFinite(n) && n >= 5 && n <= 95)).toBe(true);
        for (const size of [100, 120, 200]) {
          const l = segmentLayout(a, b, size);
          expect(l.left + l.width / 2).toBeCloseTo(((a[0] + b[0]) * size) / 200);
          expect(l.top + 1.5).toBeCloseTo(((a[1] + b[1]) * size) / 200);
          expect(l.width).toBeGreaterThan(0);
        }
      }
  });
  it('rejects degenerate triangles, missing IDs, mismatched roles and dishonest curves', () => {
    const degenerate: Shape = {
      id: 'line',
      kind: 'path',
      points: [
        [10, 10],
        [20, 20],
        [30, 30],
      ],
      closed: true,
      curve: null,
    };
    expect(isTriangle(degenerate)).toBe(false);
    for (const mutate of [
      (r: typeof rawRecipes) => {
        r.shapes[0].id = 'missing';
      },
      (r: typeof rawRecipes) => {
        r.shapes[0].closed = false;
      },
      (r: typeof rawRecipes) => {
        r.rounds['triangle-familiar'] = ['square', 'circle', 'oval'];
      },
      (r: typeof rawRecipes) => {
        r.shapes[8].curve = { edge: 1, control: [65, 50] };
      },
      (r: typeof rawRecipes) => {
        r.quantityChoices = [2, 3, 4];
      },
      (r: typeof rawRecipes) => {
        r.shapes[0].points = [
          [0, 0],
          [20, 20],
          [30, 30],
        ];
      },
    ]) {
      const r = structuredClone(rawRecipes);
      mutate(r);
      expect(() => parseRecipes(r)).toThrow();
    }
  });
});
