import { describe, expect, it } from 'vitest';
import { AGE_GROUPS, ACTIVITY_IDS } from '../packages/contracts/src';
import { isPractice, PRACTICE_IDS, questionsFor } from '../src/features/activities/domain/practice';
describe('original practice content', () => {
  it('has five valid checkpoints for each supported age and activity', () => {
    for (const id of PRACTICE_IDS)
      for (const age of AGE_GROUPS) {
        expect(ACTIVITY_IDS).toContain(id);
        const questions = questionsFor(id, age);
        expect(questions).toHaveLength(5);
        for (const q of questions) {
          expect(q.prompt.length).toBeGreaterThan(5);
          expect(new Set(q.options).size).toBe(3);
          expect(q.options[q.answer]).toBeTruthy();
        }
      }
  });
  it('does not fabricate story or rhyme progress', () => {
    for (const id of ['moon', 'bear', 'clap', 'rainbow', 'unknown'])
      expect(isPractice(id)).toBe(false);
  });
  it('scales counting to simple arithmetic for older age groups', () => {
    expect(questionsFor('count', '2–3')[0].prompt).toContain('stars');
    expect(questionsFor('count', '8–9')[0].prompt).toContain('+');
    expect(questionsFor('colours', '8–9')[0].prompt).toContain('word');
  });
});
