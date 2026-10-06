import { exactObject } from './packageValidation';
export interface SceneFrame {
  assetId: string;
  label: string;
  description: string;
}
const id = (v: unknown) => typeof v === 'string' && /^[a-z][a-z0-9-]{2,63}$/.test(v);
const text = (v: unknown, max: number) =>
  typeof v === 'string' &&
  v.trim().length > 0 &&
  v.length <= max &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(v);
export function parseSceneFrames(value: unknown): readonly SceneFrame[] {
  if (
    !Array.isArray(value) ||
    value.length < 1 ||
    value.length > 2 ||
    value.some(
      (f) =>
        !exactObject(f, ['assetId', 'label', 'description']) ||
        !id(f.assetId) ||
        !text(f.label, 64) ||
        !text(f.description, 600),
    ) ||
    new Set(value.map((f) => f.assetId)).size !== value.length
  )
    throw new Error('Invalid illustration frames.');
  return value as SceneFrame[];
}
/** Pure display selection. Does not read/write exploration, choose an answer or autoplay. */
export function chooseSceneFrame(frames: readonly SceneFrame[], index: number): SceneFrame {
  if (!Number.isInteger(index) || index < 0 || index >= frames.length)
    throw new Error('Invalid scene frame index.');
  return frames[index];
}
