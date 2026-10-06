import { AGE_GROUPS, type AgeGroup } from '../../../../packages/contracts/src';
export const CONTENT_LOCALES = ['en-IN', 'hi-IN'] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];
export interface ReaderPackage {
  schemaVersion: 1;
  contentId: string;
  contentVersion: number;
  contentHash: string;
  ageGroup: AgeGroup;
  locale: ContentLocale;
  kind: 'story' | 'rhyme';
  title: string;
  objectiveId: string;
  useMode: 'caregiver-shared' | 'supported-reader';
  publication: 'draft' | 'withdrawn';
  reviews: readonly never[];
  source: string;
  assetStatus: 'text-only-preview';
  parentNote: string;
  discussion: string;
  pages: readonly { id: string; text: string; optional: boolean }[];
}
/** Minimal shared navigation identity; interactive packages do not masquerade as stories. */
export type EditionContent = Pick<
  ReaderPackage,
  'contentId' | 'contentVersion' | 'contentHash' | 'ageGroup' | 'locale' | 'publication'
> & {
  pages: readonly { id: string; optional: boolean }[];
};
/** This first schema intentionally cannot represent publication approval. Real signed
 * reviews and reviewed assets require a later schema, not flipping a draft boolean. */
const keys = [
  'schemaVersion',
  'contentId',
  'contentVersion',
  'contentHash',
  'ageGroup',
  'locale',
  'kind',
  'title',
  'objectiveId',
  'useMode',
  'publication',
  'reviews',
  'source',
  'assetStatus',
  'parentNote',
  'discussion',
  'pages',
];
export function exactObject(
  value: unknown,
  fields: readonly string[],
): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === fields.length &&
    fields.every((key) => Object.hasOwn(value, key))
  );
}
const text = (value: unknown, max: number) =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  value.length <= max &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(value);
export function parseReaderPackage(input: unknown): ReaderPackage {
  if (
    !exactObject(input, keys) ||
    input.schemaVersion !== 1 ||
    typeof input.contentHash !== 'string' ||
    !/^[a-f0-9]{64}$/.test(input.contentHash) ||
    typeof input.contentId !== 'string' ||
    !/^[a-z][a-z0-9-]{2,63}$/.test(input.contentId) ||
    !Number.isSafeInteger(input.contentVersion) ||
    (input.contentVersion as number) < 1 ||
    (input.contentVersion as number) > 999999 ||
    !AGE_GROUPS.some((a) => a === input.ageGroup) ||
    !CONTENT_LOCALES.some((l) => l === input.locale) ||
    !['story', 'rhyme'].includes(input.kind as string) ||
    !['caregiver-shared', 'supported-reader'].includes(input.useMode as string) ||
    (input.ageGroup === '2–3' && input.useMode !== 'caregiver-shared') ||
    !['draft', 'withdrawn'].includes(input.publication as string) ||
    input.assetStatus !== 'text-only-preview' ||
    !Array.isArray(input.reviews) ||
    input.reviews.length !== 0 ||
    !text(input.title, 120) ||
    !text(input.objectiveId, 100) ||
    !text(input.source, 500) ||
    !text(input.parentNote, 1500) ||
    !text(input.discussion, 1500) ||
    !Array.isArray(input.pages) ||
    input.pages.length < 1 ||
    input.pages.length > 24
  ) {
    throw new Error('Invalid or unsupported reader package.');
  }
  const ids = new Set<string>();
  for (const page of input.pages) {
    if (
      !exactObject(page, ['id', 'text', 'optional']) ||
      typeof page.id !== 'string' ||
      !/^[A-Z][A-Z0-9-]{1,31}$/.test(page.id) ||
      ids.has(page.id) ||
      !text(page.text, 1500) ||
      typeof page.optional !== 'boolean'
    )
      throw new Error('Invalid or duplicate reader page.');
    ids.add(page.id);
  }
  if (input.pages[0].optional || input.pages[input.pages.length - 1].optional)
    throw new Error('Reader opening and ending must not be optional.');
  return input as unknown as ReaderPackage;
}
export function editionKey(
  content: Pick<ReaderPackage, 'contentId' | 'ageGroup' | 'locale' | 'contentVersion'>,
): string {
  return `${content.contentId}:${content.ageGroup.replace('–', '-')}:${content.locale}:${content.contentVersion}`;
}
export function parseReaderCatalog(input: unknown): readonly ReaderPackage[] {
  if (!Array.isArray(input) || input.length > 64) throw new Error('Invalid reader catalog.');
  const packages = input.map(parseReaderPackage),
    keys = packages.map(editionKey);
  if (new Set(keys).size !== keys.length) throw new Error('Duplicate content edition.');
  return packages;
}
/** Drafts are never admitted to a child-facing production catalog. */
export function canPreview(
  content: Pick<ReaderPackage, 'publication'>,
  development: boolean,
  demo: boolean,
  parentUnlocked: boolean,
) {
  return development && demo && parentUnlocked && content.publication === 'draft';
}
export function releaseBlockers(content: ReaderPackage): string[] {
  return [
    `${editionKey(content)}: ${content.publication}; not approved for publication`,
    'Qualified editorial, safety, language and rights reviews pending',
    'Text-only preview; reviewed visual/audio asset manifest and device QA pending',
  ];
}
