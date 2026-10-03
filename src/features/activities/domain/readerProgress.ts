import type { ActivityProgress, ProgressInput } from '../../../../packages/contracts/src';
export const READING_STEPS = 5;
export function resumeReading(row?: ActivityProgress): number {
  if (
    !row ||
    row.totalSteps !== READING_STEPS ||
    !Number.isInteger(row.completedSteps) ||
    row.completedSteps < 0 ||
    row.completedSteps >= READING_STEPS
  )
    return 0;
  return row.completedSteps;
}
/** Only a deliberate page/verse-completion action creates a checkpoint. */
export function readingCheckpoint(pageIndex: number): ProgressInput {
  if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= READING_STEPS)
    throw new Error('Invalid reading page.');
  return { completedSteps: pageIndex + 1, totalSteps: READING_STEPS };
}
