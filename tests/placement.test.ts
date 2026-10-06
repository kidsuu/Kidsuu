import { describe, it, expect } from 'vitest';
import {
  newPlacement,
  placementComplete,
  reducePlacement,
  type PlacementAction,
  type PlacementState,
} from '../src/features/content/domain/placement';
function place(s: PlacementState, token: number, bowl: number) {
  return reducePlacement(reducePlacement(s, { type: 'select', token }), { type: 'place', bowl });
}
describe('one-to-one placement state machine', () => {
  it('requires token selection before placement; supports cancellation and replacing selection', () => {
    let s = newPlacement();
    expect(reducePlacement(s, { type: 'place', bowl: 0 }).message).toBe('choose-fruit');
    s = reducePlacement(s, { type: 'select', token: 0 });
    expect(s.selected).toBe(0);
    s = reducePlacement(s, { type: 'select', token: 1 });
    expect(s.selected).toBe(1);
    s = reducePlacement(s, { type: 'select', token: 1 });
    expect(s.selected).toBeNull();
    s = reducePlacement(s, { type: 'select', token: 0 });
    s = reducePlacement(s, { type: 'cancel' });
    expect(s.selected).toBeNull();
    expect(s.locations).toEqual([null, null, null]);
  });
  it('rejects occupied bowls without losing the selected fruit', () => {
    let s = place(newPlacement(), 0, 1);
    s = reducePlacement(s, { type: 'select', token: 1 });
    s = reducePlacement(s, { type: 'place', bowl: 1 });
    expect(s.message).toBe('occupied');
    expect(s.selected).toBe(1);
    expect(s.locations).toEqual([1, null, null]);
    s = reducePlacement(s, { type: 'place', bowl: 2 });
    expect(s.locations).toEqual([1, 2, null]);
    expect(s.selected).toBeNull();
  });
  it('finishes only on one-to-one occupancy and never duplicates a rapid repeated tap', () => {
    let s = place(newPlacement(), 0, 2);
    const before = s;
    expect(reducePlacement(s, { type: 'select', token: 0 })).toBe(before);
    s = reducePlacement(s, { type: 'place', bowl: 2 });
    expect(s.locations).toEqual([2, null, null]);
    s = place(s, 2, 0);
    expect(placementComplete(s)).toBe(false);
    s = place(s, 1, 1);
    expect(placementComplete(s)).toBe(true);
    expect(s.message).toBe('complete');
  });
  it('undo returns only the latest placed token and reset clears transient board state', () => {
    let s = place(place(newPlacement(), 2, 1), 0, 2);
    s = reducePlacement(s, { type: 'undo' });
    expect(s.locations).toEqual([null, null, 1]);
    expect(s.history).toEqual([2]);
    expect(reducePlacement(s, { type: 'reset' })).toEqual(newPlacement());
    expect(reducePlacement(newPlacement(), { type: 'undo' })).toEqual(newPlacement());
  });
  it('shows one model placement at a time, marks help and never overwrites a bowl', () => {
    let s = place(newPlacement(), 1, 2);
    s = reducePlacement(s, { type: 'model-one' });
    expect(s.locations).toEqual([0, 2, null]);
    expect(s.modelled).toBe(true);
    expect(s.message).toBe('modelled');
    s = reducePlacement(s, { type: 'model-one' });
    expect(placementComplete(s)).toBe(true);
    expect(reducePlacement(s, { type: 'model-one' })).toBe(s);
    s = reducePlacement(s, { type: 'undo' });
    expect(s.modelled).toBe(true);
    expect(placementComplete(s)).toBe(false);
  });
  it('uses two objects for the teaching model, three for practice', () => {
    let s = newPlacement(2);
    s = reducePlacement(reducePlacement(s, { type: 'model-one' }), { type: 'model-one' });
    expect(placementComplete(s)).toBe(true);
    expect(s.locations).toEqual([0, 1]);
    expect(s.count).toBe(2);
    expect(newPlacement().locations).toHaveLength(3);
  });
  it('ignores invalid token/target indices rather than corrupting state', () => {
    const s = newPlacement();
    for (const n of [-1, 3, 0.5, NaN, Infinity]) {
      expect(reducePlacement(s, { type: 'select', token: n })).toBe(s);
      expect(reducePlacement(s, { type: 'place', bowl: n })).toBe(s);
    }
  });
  it.each([2, 3] as const)(
    'preserves invariants across every reachable %s-object board state',
    (count) => {
      const actions: PlacementAction[] = [
        { type: 'cancel' },
        { type: 'undo' },
        { type: 'reset' },
        { type: 'model-one' },
        ...Array.from({ length: count }, (_, i) => [
          { type: 'select', token: i } as const,
          { type: 'place', bowl: i } as const,
        ]).flat(),
      ];
      const initial = newPlacement(count),
        queue = [initial],
        seen = new Set([JSON.stringify(initial)]);
      while (queue.length) {
        const s = queue.pop()!,
          original = JSON.stringify(s);
        for (const action of actions) {
          const next = reducePlacement(s, action),
            used = next.locations.filter((n) => n !== null);
          expect(JSON.stringify(s)).toBe(original);
          expect(used.length).toBe(new Set(used).size);
          expect(used.every((n) => Number.isInteger(n) && n >= 0 && n < count)).toBe(true);
          expect(next.history.length).toBe(used.length);
          expect(new Set(next.history).size).toBe(next.history.length);
          if (next.selected !== null) expect(next.locations[next.selected]).toBeNull();
          expect(placementComplete(next)).toBe(used.length === count);
          const key = JSON.stringify(next);
          if (!seen.has(key)) {
            seen.add(key);
            queue.push(next);
          }
        }
      }
      expect(seen.size).toBeGreaterThan(30);
    },
  );
});
