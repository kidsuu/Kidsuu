import { describe, expect, it } from 'vitest';
import { responsiveHomeLayout } from '../src/features/home/domain/responsiveLayout';
import catalog from '../src/features/home/data/sampleCatalog.json';
import choreography from '../src/features/home/components/PlayScene/choreography.json';
describe('tablet-first geometry', () => {
  it('fits the full canvas and grids across 805 pane sizes', () => {
    let cases = 0;
    for (let width = 320; width <= 1600; width += 8)
      for (const height of [560, 768, 800, 1024, 1280]) {
        const l = responsiveHomeLayout(width, height);
        expect(l.sceneHeight + 24).toBeLessThanOrEqual(l.heroHeight);
        expect(l.sceneWidth + 12).toBeLessThanOrEqual(l.contentWidth);
        expect(l.categoryWidth * l.categoryColumns + l.gap * (l.categoryColumns - 1)).toBeCloseTo(
          l.contentWidth,
          4,
        );
        expect(l.activityWidth * l.activityColumns + l.gap * (l.activityColumns - 1)).toBeCloseTo(
          l.contentWidth,
          4,
        );
        expect(l.contentWidth).toBeLessThanOrEqual(1120);
        cases++;
      }
    expect(cases).toBe(805);
  });
  it('switches columns based on usable content width, not physical device name', () => {
    expect(responsiveHomeLayout(600, 960).categoryColumns).toBe(2);
    expect(responsiveHomeLayout(800, 1280).categoryColumns).toBe(4);
    expect(responsiveHomeLayout(800, 1280).activityColumns).toBe(3);
    expect(responsiveHomeLayout(1280, 800).activityColumns).toBe(4);
  });
  it('reduces the scene in short landscape panes', () => {
    expect(responsiveHomeLayout(1280, 600).sceneWidth).toBeLessThan(
      responsiveHomeLayout(800, 1280).sceneWidth,
    );
  });
  it('does not produce negative card sizes before measurement', () => {
    for (const width of [0, -1, Number.NaN]) {
      const l = responsiveHomeLayout(width, 0);
      expect(l.categoryWidth).toBeGreaterThanOrEqual(0);
      expect(l.activityWidth).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(l.heroHeight)).toBe(true);
    }
  });
});
describe('content and motion integrity', () => {
  it('every sample activity has four age variants and a valid category', () => {
    const categories = new Set(catalog.categories.map((c) => c.id));
    expect(catalog.ages).toHaveLength(4);
    expect(new Set(catalog.activities.map((a) => a.id)).size).toBe(catalog.activities.length);
    for (const activity of catalog.activities) {
      expect(categories.has(activity.category)).toBe(true);
      expect(activity.titles).toHaveLength(4);
      expect(activity.minutes).toHaveLength(4);
    }
  });
  it('retains the complete 12-second, 241-pose loop without jumps at its seam', () => {
    expect(choreography.duration).toBe(12000);
    expect(choreography.inputRange).toHaveLength(241);
    expect(choreography.inputRange[0]).toBe(0);
    expect(choreography.inputRange.at(-1)).toBe(1);
    function walk(value: unknown) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        if (key === 'motion' && child && typeof child === 'object') {
          for (const frames of Object.values(child) as number[][]) {
            expect(frames).toHaveLength(241);
            expect(frames.every(Number.isFinite)).toBe(true);
            expect(frames[0]).toBeCloseTo(frames.at(-1)!, 4);
          }
        } else walk(child);
      }
    }
    walk(choreography.characters);
    walk(choreography.shadows);
  });
});
