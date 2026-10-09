import { z } from 'zod';
import { SAVED_CONTENT_IDS, AGE_GROUPS, AVATARS } from '../../../packages/contracts/src';
const nickname = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .regex(/^[\p{L}\p{N}\p{M} .'-]+$/u);
export const createChild = z.strictObject({
  nickname,
  ageGroup: z.enum(AGE_GROUPS),
  avatar: z.enum(AVATARS),
});
export const updateChild = createChild
  .partial()
  .extend({ version: z.number().int().min(1).max(2147483647) })
  .refine((v) => v.nickname !== undefined || v.ageGroup !== undefined || v.avatar !== undefined);
export const settings = z.strictObject({
  version: z.number().int().min(1).max(2147483647),
  soundEnabled: z.boolean(),
  dailyGoalMinutes: z.number().int().min(5).max(60),
});
export const progress = z
  .strictObject({
    completedSteps: z.number().int().min(0).max(200),
    totalSteps: z.number().int().min(1).max(200),
  })
  .refine((v) => v.completedSteps <= v.totalSteps);
export const empty = z.strictObject({});
const uuidV4 = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
const unitId = z.string().regex(/^[A-Z][A-Z0-9-]{1,31}$/);
const uniqueUnits = z
  .array(unitId)
  .max(24)
  .refine((items) => new Set(items).size === items.length);
export const storedEditionProgress = z
  .strictObject({
    editionKey: z
      .string()
      .regex(/^[a-z][a-z0-9-]{2,63}:(2-3|4-5|6-7|8-9):(en-IN|hi-IN):[1-9][0-9]{0,5}$/),
    contentHash: z.string().regex(/^[a-f0-9]{64}$/),
    unitIds: uniqueUnits.refine((items) => items.length >= 1),
    optionalUnitIds: uniqueUnits,
    exploredUnitIds: uniqueUnits,
    skippedUnitIds: uniqueUnits,
    updatedAt: z
      .string()
      .regex(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/)
      .refine((s) => Number.isFinite(Date.parse(s))),
  })
  .refine((row) => {
    const first = row.unitIds[0],
      last = row.unitIds[row.unitIds.length - 1];
    return (
      !row.optionalUnitIds.includes(first) &&
      !row.optionalUnitIds.includes(last) &&
      row.optionalUnitIds.every((id) => row.unitIds.includes(id)) &&
      row.exploredUnitIds.every((id) => row.unitIds.includes(id)) &&
      row.skippedUnitIds.every(
        (id) => row.optionalUnitIds.includes(id) && !row.exploredUnitIds.includes(id),
      )
    );
  });
export const familySnapshot = z.strictObject({
  selectedId: uuidV4.nullable(),
  saved: z.record(
    uuidV4,
    z
      .array(z.enum(SAVED_CONTENT_IDS))
      .max(SAVED_CONTENT_IDS.length)
      .refine((items) => new Set(items).size === items.length),
  ),
  editions: z.record(
    uuidV4,
    z
      .array(storedEditionProgress)
      .max(32)
      .refine((rows) => new Set(rows.map((r) => r.editionKey)).size === rows.length),
  ),
});
export const putSnapshot = z.strictObject({
  version: z.number().int().min(0).max(2147483647).optional(),
  snapshot: familySnapshot,
});
export const contentPackagePayload = z
  .record(z.string(), z.unknown())
  .refine((obj) => Object.keys(obj).length >= 1 && Object.keys(obj).length <= 64);
