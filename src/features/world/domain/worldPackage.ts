import {
  exactObject,
  editionKey,
  type EditionContent,
  type ContentLocale,
} from '../../content/domain/contentPackage';
import { AGE_GROUPS, FRESH_CONTENT_IDS, type AgeGroup } from '../../../../packages/contracts/src';
export const WORLD_MODES = [
  'pattern',
  'bridge',
  'lantern',
  'seed',
  'garden',
  'story',
  'rhyme',
] as const;
export type WorldMode = (typeof WORLD_MODES)[number];
export const SCENES = [
  'garden',
  'trail',
  'river',
  'night',
  'seed',
  'soil',
  'rain',
  'sprout',
  'leaves',
  'flower',
  'cloud',
  'rest',
] as const;
export interface WorldPackage extends EditionContent {
  schemaVersion: 1;
  contentId: string;
  ageGroup: AgeGroup;
  locale: ContentLocale;
  kind: 'game' | 'learning' | 'story' | 'rhyme';
  mode: WorldMode;
  title: string;
  subtitle: string;
  objectiveId: string;
  useMode: 'caregiver-shared' | 'supported-reader';
  reviews: readonly never[];
  source: string;
  parentNote: string;
  discussion: string;
  pages: readonly { id: string; text: string; optional: boolean; scene: (typeof SCENES)[number] }[];
}
const keys = [
  'schemaVersion',
  'contentId',
  'contentVersion',
  'ageGroup',
  'locale',
  'kind',
  'mode',
  'title',
  'subtitle',
  'objectiveId',
  'useMode',
  'publication',
  'reviews',
  'source',
  'parentNote',
  'discussion',
  'pages',
  'contentHash',
];
const nonempty = (v: unknown, max: number) =>
  typeof v === 'string' &&
  v.trim().length > 0 &&
  v.length <= max &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(v);
const kinds: Record<WorldMode, WorldPackage['kind']> = {
  pattern: 'game',
  bridge: 'game',
  lantern: 'game',
  seed: 'learning',
  garden: 'learning',
  story: 'story',
  rhyme: 'rhyme',
};
const expected: Record<string, { mode: WorldMode; age: AgeGroup; units: number; version: number }> =
  {
    'pattern-trail': { mode: 'pattern', age: '4–5', units: 6, version: 2 },
    'river-builders': { mode: 'bridge', age: '6–7', units: 6, version: 2 },
    'lantern-grove': { mode: 'lantern', age: '8–9', units: 5, version: 2 },
    'little-seed-lab': { mode: 'seed', age: '2–3', units: 4, version: 1 },
    'pocket-garden': { mode: 'garden', age: '4–5', units: 5, version: 1 },
    'little-seed-journey': { mode: 'story', age: '4–5', units: 6, version: 1 },
    'tip-tap-rain': { mode: 'rhyme', age: '2–3', units: 4, version: 1 },
  };
export function parseWorldPackage(value: unknown): WorldPackage {
  if (
    !exactObject(value, keys) ||
    value.schemaVersion !== 1 ||
    !FRESH_CONTENT_IDS.some((id) => id === value.contentId) ||
    ![1, 2].includes(value.contentVersion as number) ||
    !AGE_GROUPS.some((a) => a === value.ageGroup) ||
    !['en-IN', 'hi-IN'].includes(value.locale as string) ||
    !WORLD_MODES.some((m) => m === value.mode) ||
    kinds[value.mode as WorldMode] !== value.kind ||
    value.publication !== 'draft' ||
    !Array.isArray(value.reviews) ||
    value.reviews.length !== 0 ||
    !['caregiver-shared', 'supported-reader'].includes(value.useMode as string) ||
    (value.ageGroup === '2–3' && value.useMode !== 'caregiver-shared') ||
    typeof value.contentHash !== 'string' ||
    !/^[a-f0-9]{64}$/.test(value.contentHash) ||
    !nonempty(value.title, 120) ||
    !nonempty(value.subtitle, 200) ||
    !nonempty(value.objectiveId, 100) ||
    !nonempty(value.source, 500) ||
    !nonempty(value.parentNote, 1500) ||
    typeof value.discussion !== 'string' ||
    value.discussion.length > 1500 ||
    !Array.isArray(value.pages) ||
    value.pages.length < 1 ||
    value.pages.length > 24
  )
    throw new Error('Invalid fresh content package');
  const definition = expected[value.contentId as string];
  if (
    value.contentVersion !== definition.version ||
    value.mode !== definition.mode ||
    value.ageGroup !== definition.age ||
    value.pages.length !== definition.units
  )
    throw new Error('Fresh package does not match its authored activity');
  const ids = new Set<string>();
  for (const [index, page] of value.pages.entries()) {
    if (
      !exactObject(page, ['id', 'text', 'optional', 'scene']) ||
      typeof page.id !== 'string' ||
      page.id !== 'W' + String(index + 1).padStart(2, '0') ||
      ids.has(page.id) ||
      !nonempty(page.text, 1500) ||
      typeof page.optional !== 'boolean' ||
      !SCENES.some((s) => s === page.scene)
    )
      throw new Error('Invalid fresh content page');
    ids.add(page.id);
  }
  if (value.pages[0].optional || value.pages[value.pages.length - 1].optional)
    throw new Error('Opening and ending must be required');
  return value as unknown as WorldPackage;
}
export function parseWorldCatalog(value: unknown): readonly WorldPackage[] {
  if (!Array.isArray(value) || value.length !== 14)
    throw new Error('Fresh library requires fourteen bilingual editions');
  const packages = value.map(parseWorldPackage);
  if (new Set(packages.map(editionKey)).size !== packages.length)
    throw new Error('Duplicate world edition');
  for (const id of FRESH_CONTENT_IDS)
    if (
      packages.filter((p) => p.contentId === id).length !== 2 ||
      !packages.some((p) => p.contentId === id && p.locale === 'en-IN') ||
      !packages.some((p) => p.contentId === id && p.locale === 'hi-IN')
    )
      throw new Error('Missing bilingual edition');
  return packages;
}
