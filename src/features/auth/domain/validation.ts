import type { Registration, FieldErrors } from './types';
export const normalizeMobile = (value: string) => value.replace(/[\s()-]/g, '');
export function validateMobile(value: string) {
  return /^[6-9]\d{9}$/.test(normalizeMobile(value))
    ? ''
    : 'Enter a valid 10-digit Indian mobile number.';
}
export function validatePassword(value: string) {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value)
    ? ''
    : 'Use 8 or more characters, with a letter and a number.';
}
export function validateRegistration(v: Registration): FieldErrors {
  const e: FieldErrors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter the parent or guardian’s name.';
  if (validateMobile(v.mobile)) e.mobile = validateMobile(v.mobile);
  if (validatePassword(v.password)) e.password = validatePassword(v.password);
  if (v.confirm !== v.password || !v.confirm) e.confirm = 'Both passwords must match.';
  if (!v.guardian) e.guardian = 'Please confirm you are a parent or guardian.';
  return e;
}
