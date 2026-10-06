import { exactObject, parseReaderPackage, editionKey, type ReaderPackage } from './contentPackage';
import { correctShapeId, parseShapes, shapeReason, type Shape } from './geometry';
export const LEARNING_MODES = [
  'picnic-intro',
  'picnic-model',
  'picnic-row',
  'picnic-triangle',
  'picnic-quantity',
  'picnic-end',
] as const;
export const GAME_MODES = [
  'triangle-model',
  'triangle-familiar',
  'triangle-turned',
  'triangle-scalene',
  'triangle-reason',
  'triangle-end',
] as const;
export type SceneMode = (typeof LEARNING_MODES)[number] | (typeof GAME_MODES)[number];
export const FEEDBACK_KEYS = [
  'ready',
  'selected',
  'cancelled',
  'placed',
  'occupied',
  'choose-fruit',
  'complete',
  'undone',
  'modelled',
  'triangle',
  'curved',
  'four',
  'open',
  'quantity-two',
  'quantity-four',
  'quantity-three',
  'model-empty',
  'model-one',
  'model-two',
  'sides-zero',
  'sides-one',
  'sides-two',
  'sides-three',
] as const;
export type FeedbackKey = (typeof FEEDBACK_KEYS)[number];
export type InteractivePackage = Omit<
  ReaderPackage,
  'kind' | 'assetStatus' | 'pages' | 'scenePackHash'
> & {
  kind: 'learning' | 'game';
  assetStatus: 'procedural-preview';
  recipeHash: string;
  pages: readonly {
    id: string;
    text: string;
    optional: boolean;
    mode: SceneMode;
    hints: readonly string[];
  }[];
  feedback: Record<FeedbackKey, string>;
};
export type LabPackage = ReaderPackage | InteractivePackage;
export function isInteractive(content: LabPackage): content is InteractivePackage {
  return content.kind === 'learning' || content.kind === 'game';
}
export interface InteractiveRecipes {
  schemaVersion: 1;
  shapes: readonly Shape[];
  rounds: Record<'triangle-familiar' | 'triangle-turned' | 'triangle-scalene', readonly string[]>;
  quantityChoices: readonly number[];
  modelCount: 2;
  placementCount: 3;
}
export function parseRecipes(input: unknown): InteractiveRecipes {
  if (
    !exactObject(input, [
      'schemaVersion',
      'shapes',
      'rounds',
      'quantityChoices',
      'modelCount',
      'placementCount',
    ]) ||
    input.schemaVersion !== 1 ||
    input.modelCount !== 2 ||
    input.placementCount !== 3 ||
    JSON.stringify(input.quantityChoices) !== '[2,4,3]' ||
    !exactObject(input.rounds, ['triangle-familiar', 'triangle-turned', 'triangle-scalene'])
  )
    throw new Error('Unsupported interaction recipe.');
  const shapes = parseShapes(input.shapes);
  const roles: Record<string, string> = {
    'closed-tri': 'triangle',
    'turned-tri': 'triangle',
    'scalene-tri': 'triangle',
    oval: 'curved',
    circle: 'curved',
    square: 'four',
    rectangle: 'four',
    'open-three': 'open',
    'curved-three': 'curved',
  };
  if (shapes.some((s) => !Object.hasOwn(roles, s.id) || shapeReason(s) !== roles[s.id]))
    throw new Error('Shape identity and mathematical boundary disagree.');
  const expected = [
    ['closed-tri', 'oval', 'square'],
    ['circle', 'rectangle', 'turned-tri'],
    ['open-three', 'scalene-tri', 'curved-three'],
  ];
  const roundNames = ['triangle-familiar', 'triangle-turned', 'triangle-scalene'];
  for (const [index, name] of roundNames.entries()) {
    const value = input.rounds[name];
    if (JSON.stringify(value) !== JSON.stringify(expected[index]))
      throw new Error('Unsupported pilot round arrangement.');
    if (
      !Array.isArray(value) ||
      value.length !== 3 ||
      new Set(value).size !== 3 ||
      value.some((id) => !shapes.some((s) => s.id === id))
    )
      throw new Error('Invalid shape round.');
    const options = value.map((id) => shapes.find((s) => s.id === id)!);
    correctShapeId(options);
    options.forEach(shapeReason);
  }
  return input as unknown as InteractiveRecipes;
}
const copy = (v: unknown) =>
  typeof v === 'string' &&
  v.trim().length > 0 &&
  v.length <= 1500 &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(v);
export function parseInteractivePackage(input: unknown): InteractivePackage {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('Invalid interactive package.');
  const p = input as Record<string, unknown>;
  if (
    !['learning', 'game'].includes(p.kind as string) ||
    p.assetStatus !== 'procedural-preview' ||
    typeof p.recipeHash !== 'string' ||
    !/^[a-f0-9]{64}$/.test(p.recipeHash) ||
    !exactObject(p.feedback, FEEDBACK_KEYS) ||
    !Object.values(p.feedback).every(copy) ||
    !Array.isArray(p.pages) ||
    p.pages.length !== 6
  )
    throw new Error('Invalid interactive metadata.');
  const modes = p.kind === 'learning' ? LEARNING_MODES : GAME_MODES,
    prefix = p.kind === 'learning' ? 'L' : 'G';
  const expectedAge = p.kind === 'learning' ? '4–5' : '6–7';
  if (p.ageGroup !== expectedAge)
    throw new Error(
      'These pilots require their declared age bands; author another edition for other ages.',
    );
  const { recipeHash, feedback, ...common } = p;
  void recipeHash;
  void feedback;
  // Validate all shared metadata with the same strict reader rules, without
  // granting interactive packages publication status or weakening reader schema.
  const basePages = p.pages.map((page, i) => {
    if (
      !exactObject(page, ['id', 'text', 'optional', 'mode', 'hints']) ||
      page.id !== `${prefix}0${i + 1}` ||
      page.mode !== modes[i] ||
      page.optional !== (p.kind === 'game' && i === 4) ||
      !Array.isArray(page.hints) ||
      page.hints.length !==
        ((p.kind === 'learning' && [2, 3, 4].includes(i)) ||
        (p.kind === 'game' && [1, 2, 3].includes(i))
          ? 3
          : 0) ||
      !page.hints.every(copy)
    )
      throw new Error('Invalid interactive scene/optional-unit/hint sequence.');
    return { id: page.id, text: page.text, optional: page.optional };
  });
  parseReaderPackage({
    ...common,
    kind: 'story',
    assetStatus: 'text-only-preview',
    pages: basePages,
  });
  return p as unknown as InteractivePackage;
}
export function parseInteractiveCatalog(value: unknown): readonly InteractivePackage[] {
  if (!Array.isArray(value) || value.length > 64) throw new Error('Invalid interactive catalog.');
  const packages = value.map(parseInteractivePackage);
  if (new Set(packages.map(editionKey)).size !== packages.length)
    throw new Error('Duplicate interactive edition.');
  return packages;
}
