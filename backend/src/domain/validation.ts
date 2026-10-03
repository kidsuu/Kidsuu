import { z } from 'zod';
import { AGE_GROUPS, AVATARS } from '../../../packages/contracts/src';
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
