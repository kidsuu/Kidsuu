import { AGE_GROUPS, AVATARS, type CreateChild } from '../../../../packages/contracts/src';
export function validateProfile(profile: CreateChild): string | null {
  const name = profile.nickname.trim();
  if (!name || name.length > 32 || !/^[\p{L}\p{N}\p{M} .'-]+$/u.test(name))
    return 'Use a nickname of 1–32 letters, numbers, spaces, dots, apostrophes or hyphens.';
  if (!AGE_GROUPS.includes(profile.ageGroup)) return 'Choose an age group.';
  if (!AVATARS.includes(profile.avatar)) return 'Choose an avatar.';
  return null;
}
export function validateGoal(value: string): number | null {
  if (!/^\d{1,2}$/.test(value.trim())) return null;
  const n = Number(value);
  return n >= 5 && n <= 60 ? n : null;
}
