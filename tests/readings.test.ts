import { describe, expect, it, vi } from 'vitest';
import { ACTIVITY_IDS, AGE_GROUPS } from '../packages/contracts/src';
import catalog from '../src/features/home/data/sampleCatalog.json';
import { getReading, isReading, READING_IDS } from '../src/features/activities/data/readings';
import { PRACTICE_IDS } from '../src/features/activities/domain/practice';
import { readingCheckpoint, resumeReading } from '../src/features/activities/domain/readerProgress';
import { createDemoFamilyRepository } from '../src/features/family/data/demo/DemoFamilyRepository';
import { FamilyStore } from '../src/features/family/domain/FamilyStore';
describe('original story and rhyme drafts', () => {
  it('routes every current catalog activity to a practice or reader', () => {
    expect(new Set([...PRACTICE_IDS, ...READING_IDS])).toEqual(new Set(ACTIVITY_IDS));
    expect(isReading('unknown')).toBe(false);
    expect(isReading('colours')).toBe(false);
  });
  it('provides 16 age-matched editions with five bounded original pages each', () => {
    const texts = new Set<string>();
    for (const id of READING_IDS)
      for (const [index, age] of AGE_GROUPS.entries()) {
        const reading = getReading(id, age);
        expect(reading.title).toBe(catalog.activities.find((a) => a.id === id)!.titles[index]);
        expect(reading.ageGroup).toBe(age);
        expect(reading.pages).toHaveLength(5);
        expect(reading.version).toBe(1);
        for (const page of reading.pages) {
          expect(page.length).toBeGreaterThan(70);
          expect(page.length).toBeLessThan(1500);
          expect(page).not.toMatch(/https?:\/\/|<script|TODO/);
          texts.add(page);
        }
      }
    expect(texts.size).toBe(80);
  });
  it('uses short read-together stories for the youngest age group', () => {
    for (const id of ['moon', 'bear'] as const) {
      const young = getReading(id, '2–3').pages.join(' ').split(/\s+/).length;
      const older = getReading(id, '8–9').pages.join(' ').split(/\s+/).length;
      expect(young).toBeLessThan(older);
    }
  });
  it('keeps rhymes as separate verses instead of pretending they are audio tracks', () => {
    for (const id of ['clap', 'rainbow'] as const)
      for (const age of AGE_GROUPS) {
        const reading = getReading(id, age);
        expect(reading.kind).toBe('rhyme');
        for (const page of reading.pages) expect(page.split('\n')).toHaveLength(4);
      }
  });
});
describe('reader checkpoints', () => {
  it('resumes at the first unfinished page and replays completed readers from page one', () => {
    expect(resumeReading()).toBe(0);
    const row = {
      activityId: 'moon' as const,
      completedSteps: 2,
      totalSteps: 5,
      completedAt: null,
      updatedAt: '',
    };
    expect(resumeReading(row)).toBe(2);
    expect(resumeReading({ ...row, completedSteps: 5 })).toBe(0);
    expect(resumeReading({ ...row, totalSteps: 6 })).toBe(0);
    expect(resumeReading({ ...row, completedSteps: -1 })).toBe(0);
  });
  it('accepts only real page indices', () => {
    for (let i = 0; i < 5; i++)
      expect(readingCheckpoint(i)).toEqual({ completedSteps: i + 1, totalSteps: 5 });
    for (const i of [-1, 5, 0.5, NaN, Infinity]) expect(() => readingCheckpoint(i)).toThrow();
  });
  it('records explicit exploration monotonically and never on content access', async () => {
    const repo = createDemoFamilyRepository(),
      store = new FamilyStore(repo, async () => {});
    await store.load();
    getReading('moon', '4–5');
    expect(store.getSnapshot().progress).toEqual([]);
    expect(await store.record('moon', readingCheckpoint(1))).toBe(true);
    expect(await store.record('moon', readingCheckpoint(0))).toBe(true);
    expect(store.getSnapshot().progress[0].completedSteps).toBe(2);
    expect(await store.record('moon', readingCheckpoint(4))).toBe(true);
    expect(store.getSnapshot().progress[0].completedAt).not.toBeNull();
  });
  it('does not claim saved exploration if persistence fails', async () => {
    const repo = createDemoFamilyRepository(),
      store = new FamilyStore(repo, async () => {});
    await store.load();
    vi.spyOn(repo, 'putProgress').mockRejectedValue(new Error('Offline'));
    expect(await store.record('bear', readingCheckpoint(0))).toBe(false);
    expect(store.getSnapshot().progress).toEqual([]);
  });
});
