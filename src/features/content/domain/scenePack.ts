import { parseSceneFrames, type SceneFrame } from './sceneFrames';
import { exactObject } from './packageValidation';
export { parseSceneFrames, chooseSceneFrame, type SceneFrame } from './sceneFrames';
export interface SceneAsset {
  id: string;
  file: string;
  sha256: string;
  width: number;
  height: number;
  bytes: number;
  origin: 'ai-crop' | 'ai-background-composite' | 'owner-reference';
  sourceIds: string[];
}
export interface ScenePack {
  schemaVersion: 1;
  packId: 'kidsuu-reader-scenes';
  version: 1;
  publication: 'draft';
  humanReview: 'pending';
  rightsReview: 'pending';
  sources: { id: string; sha256: string }[];
  compositionScriptHash: string;
  assets: SceneAsset[];
}
const hash = (v: unknown) => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const id = (v: unknown) => typeof v === 'string' && /^[a-z][a-z0-9-]{2,63}$/.test(v);
export function parseScenePack(value: unknown): ScenePack {
  if (
    !exactObject(value, [
      'schemaVersion',
      'packId',
      'version',
      'publication',
      'humanReview',
      'rightsReview',
      'sources',
      'compositionScriptHash',
      'assets',
    ]) ||
    value.schemaVersion !== 1 ||
    value.packId !== 'kidsuu-reader-scenes' ||
    value.version !== 1 ||
    value.publication !== 'draft' ||
    value.humanReview !== 'pending' ||
    value.rightsReview !== 'pending' ||
    !hash(value.compositionScriptHash) ||
    !Array.isArray(value.sources) ||
    !value.sources.length ||
    value.sources.length > 16 ||
    !Array.isArray(value.assets) ||
    !value.assets.length ||
    value.assets.length > 32
  )
    throw new Error('Invalid draft scene pack.');
  const sources = new Set<string>(),
    assets = new Set<string>(),
    files = new Set<string>();
  for (const s of value.sources) {
    if (
      !exactObject(s, ['id', 'sha256']) ||
      !id(s.id) ||
      !hash(s.sha256) ||
      sources.has(s.id as string)
    )
      throw new Error('Invalid scene source record.');
    sources.add(s.id as string);
  }
  let bytes = 0;
  for (const a of value.assets) {
    if (
      !exactObject(a, [
        'id',
        'file',
        'sha256',
        'width',
        'height',
        'bytes',
        'origin',
        'sourceIds',
      ]) ||
      !id(a.id) ||
      typeof a.file !== 'string' ||
      !/^[a-z][a-z0-9-]+\.png$/.test(a.file) ||
      a.file !== `${a.id}.png` ||
      !hash(a.sha256) ||
      !Number.isInteger(a.width) ||
      !Number.isInteger(a.height) ||
      (a.width as number) < 200 ||
      (a.width as number) > 1280 ||
      (a.height as number) < 200 ||
      (a.height as number) > 960 ||
      !Number.isSafeInteger(a.bytes) ||
      (a.bytes as number) < 1 ||
      (a.bytes as number) > 1500000 ||
      !['ai-crop', 'ai-background-composite', 'owner-reference'].includes(a.origin as string) ||
      !Array.isArray(a.sourceIds) ||
      !a.sourceIds.length ||
      a.sourceIds.length > 3 ||
      a.sourceIds.some((s) => !sources.has(s)) ||
      new Set(a.sourceIds).size !== a.sourceIds.length ||
      assets.has(a.id as string) ||
      files.has(a.file)
    )
      throw new Error('Invalid or oversized scene asset.');
    assets.add(a.id as string);
    files.add(a.file);
    bytes += a.bytes as number;
  }
  if (bytes > 8 * 1024 * 1024) throw new Error('Scene pack exceeds bundled preview budget.');
  return value as unknown as ScenePack;
}
export function validateReaderSceneRefs(
  content: {
    assetStatus: string;
    scenePackHash?: string;
    pages: readonly { scenes?: readonly SceneFrame[] }[];
  },
  pack: ScenePack,
  expectedHash: string,
): void {
  if (content.assetStatus === 'text-only-preview') return;
  if (
    content.assetStatus !== 'illustrated-preview' ||
    !hash(expectedHash) ||
    content.scenePackHash !== expectedHash
  )
    throw new Error('Reader scene pack hash mismatch.');
  const ids = new Set(pack.assets.map((a) => a.id));
  for (const page of content.pages) {
    const frames = parseSceneFrames(page.scenes);
    if (frames.some((f) => !ids.has(f.assetId) || f.assetId === 'cast-reference'))
      throw new Error('Unknown reader scene asset.');
  }
}
