export const TOKENS = ['leaf', 'flower', 'sun', 'drop'] as const;
export type Token = (typeof TOKENS)[number];
export interface PatternRound {
  cycle: readonly Token[];
  length: number;
  missing: readonly number[];
}
export const PATTERNS: readonly PatternRound[] = [
  { cycle: ['leaf', 'flower'], length: 6, missing: [5] },
  { cycle: ['sun', 'drop'], length: 6, missing: [3, 5] },
  { cycle: ['leaf', 'leaf', 'flower'], length: 6, missing: [4, 5] },
  { cycle: ['sun', 'drop', 'drop'], length: 6, missing: [3, 4] },
  { cycle: ['flower', 'leaf', 'sun'], length: 6, missing: [2, 5] },
  { cycle: ['drop', 'sun', 'leaf'], length: 9, missing: [4, 7, 8] },
];
export function patternToken(round: PatternRound, index: number): Token {
  if (!Number.isInteger(index) || index < 0 || index >= round.length)
    throw new Error('Invalid pattern position');
  return round.cycle[index % round.cycle.length];
}
export function placePattern(
  round: PatternRound,
  slots: readonly (Token | null)[],
  index: number,
  token: Token,
): (Token | null)[] {
  if (slots.length !== round.length || !round.missing.includes(index) || !TOKENS.includes(token))
    throw new Error('Invalid pattern placement');
  return slots.map((value, i) => (i === index ? token : value));
}
export function patternSolved(round: PatternRound, slots: readonly (Token | null)[]): boolean {
  return (
    slots.length === round.length && round.missing.every((i) => slots[i] === patternToken(round, i))
  );
}
export interface BridgeRound {
  gap: number;
  planks: readonly number[];
}
export const BRIDGES: readonly BridgeRound[] = [
  { gap: 4, planks: [1, 3, 2] },
  { gap: 5, planks: [4, 2, 3] },
  { gap: 6, planks: [2, 5, 4] },
  { gap: 7, planks: [5, 3, 2, 6] },
  { gap: 8, planks: [3, 6, 2, 4] },
  { gap: 9, planks: [4, 2, 5, 6] },
];
export function placePlank(
  round: BridgeRound,
  slots: readonly (number | null)[],
  slot: number,
  plank: number,
): (number | null)[] {
  if (
    slots.length !== 2 ||
    ![0, 1].includes(slot) ||
    !Number.isInteger(plank) ||
    plank < 0 ||
    plank >= round.planks.length
  )
    throw new Error('Invalid bridge placement');
  // Moving a physical piece clears its previous slot; it never duplicates inventory.
  return slots.map((value, i) => (i === slot ? plank : value === plank ? null : value));
}
export function bridgeLength(round: BridgeRound, slots: readonly (number | null)[]): number {
  if (
    slots.length !== 2 ||
    slots.some((i) => i !== null && (!Number.isInteger(i) || i < 0 || i >= round.planks.length)) ||
    (slots[0] !== null && slots[0] === slots[1])
  )
    throw new Error('Invalid bridge state');
  return slots.reduce<number>((sum, i) => sum + (i === null ? 0 : round.planks[i]), 0);
}
export function bridgeSolved(round: BridgeRound, slots: readonly (number | null)[]): boolean {
  return slots.every((i) => i !== null) && bridgeLength(round, slots) === round.gap;
}
export const ALL_LANTERNS = 511;
export function lanternMask(index: number): number {
  if (!Number.isInteger(index) || index < 0 || index > 8) throw new Error('Invalid lantern');
  const row = Math.floor(index / 3),
    col = index % 3;
  return [
    index,
    ...(row > 0 ? [index - 3] : []),
    ...(row < 2 ? [index + 3] : []),
    ...(col > 0 ? [index - 1] : []),
    ...(col < 2 ? [index + 1] : []),
  ].reduce((mask, i) => mask | (1 << i), 0);
}
export function toggleLanterns(board: number, index: number): number {
  if (!Number.isInteger(board) || board < 0 || board > 511)
    throw new Error('Invalid lantern board');
  return board ^ lanternMask(index);
}
export const LANTERN_STARTS = [[4], [0, 8], [1, 6, 8], [0, 2, 4, 7], [0, 1, 4, 6, 8]].map((moves) =>
  moves.reduce(toggleLanterns, ALL_LANTERNS),
);
/** Breadth-first search over the bounded 512-state board. A hint solves the current
 * state, including any user moves; it never replays an outdated scripted solution. */
export function lanternSolution(board: number): number[] | null {
  if (!Number.isInteger(board) || board < 0 || board > 511)
    throw new Error('Invalid lantern board');
  const queue: { board: number; moves: number[] }[] = [{ board, moves: [] }];
  const seen = new Set([board]);
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    if (current.board === ALL_LANTERNS) return current.moves;
    for (let index = 0; index < 9; index++) {
      const next = toggleLanterns(current.board, index);
      if (!seen.has(next)) {
        seen.add(next);
        queue.push({ board: next, moves: [...current.moves, index] });
      }
    }
  }
  return null;
}
