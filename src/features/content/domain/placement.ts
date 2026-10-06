export interface PlacementState {
  count: 2 | 3;
  locations: readonly (number | null)[];
  selected: number | null;
  history: readonly number[];
  message:
    | 'ready'
    | 'selected'
    | 'cancelled'
    | 'placed'
    | 'occupied'
    | 'choose-fruit'
    | 'complete'
    | 'undone'
    | 'modelled';
  modelled: boolean;
}
export type PlacementAction =
  | { type: 'select'; token: number }
  | { type: 'place'; bowl: number }
  | { type: 'cancel' }
  | { type: 'undo' }
  | { type: 'reset' }
  | { type: 'model-one' };
export function newPlacement(count: 2 | 3 = 3): PlacementState {
  if (count !== 2 && count !== 3) throw new Error('Unsupported picnic size.');
  return {
    count,
    locations: Array.from({ length: count }, () => null),
    selected: null,
    history: [],
    message: 'ready',
    modelled: false,
  };
}
export function placementComplete(state: PlacementState) {
  return (
    state.locations.length === state.count &&
    state.locations.every((b) => Number.isInteger(b) && b !== null && b >= 0 && b < state.count) &&
    new Set(state.locations).size === state.count
  );
}
/** Each token has at most one location, every bowl at most one token. A model is
 * explicitly labelled, never an independent success. No timers/randomness/network. */
export function reducePlacement(state: PlacementState, action: PlacementAction): PlacementState {
  const valid = (n: number) => Number.isInteger(n) && n >= 0 && n < state.count;
  if (action.type === 'reset') return newPlacement(state.count);
  if (action.type === 'cancel') return { ...state, selected: null, message: 'cancelled' };
  if (action.type === 'select') {
    if (!valid(action.token) || state.locations[action.token] !== null) return state;
    return {
      ...state,
      selected: state.selected === action.token ? null : action.token,
      message: state.selected === action.token ? 'cancelled' : 'selected',
    };
  }
  if (action.type === 'undo') {
    if (!state.history.length) return { ...state, selected: null };
    const locations = [...state.locations],
      token = state.history[state.history.length - 1];
    locations[token] = null;
    return {
      ...state,
      locations,
      selected: null,
      history: state.history.slice(0, -1),
      message: 'undone',
    };
  }
  if (action.type === 'model-one') {
    const token = state.locations.findIndex((b) => b === null),
      bowl = Array.from({ length: state.count }, (_, i) => i).find(
        (i) => !state.locations.includes(i),
      );
    if (token < 0 || bowl === undefined) return state;
    const next = reducePlacement({ ...state, selected: token }, { type: 'place', bowl });
    return { ...next, modelled: true, message: 'modelled' };
  }
  if (!valid(action.bowl)) return state;
  if (state.selected === null) return { ...state, message: 'choose-fruit' };
  if (state.locations.includes(action.bowl)) return { ...state, message: 'occupied' };
  const locations = [...state.locations];
  locations[state.selected] = action.bowl;
  const next: PlacementState = {
    ...state,
    locations,
    selected: null,
    history: [...state.history, state.selected],
    message: 'placed',
  };
  return { ...next, message: placementComplete(next) ? 'complete' : 'placed' };
}
