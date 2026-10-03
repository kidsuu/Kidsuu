export type User = { name: string; mobile: string };
export type Registration = User & { password: string; confirm: string; guardian: boolean };
export type Purpose = 'register' | 'reset';
export type FieldErrors = Record<string, string>;

export type AuthRoute =
  'login' | 'register' | 'forgot' | 'verify-register' | 'verify-reset' | 'reset' | 'success';
export type Values = Registration & { code: string };
export type InputID = 'name' | 'mobile' | 'password' | 'confirm' | 'code';
export type VerificationChallenge = {
  purpose: Purpose;
  mobile: string;
  expiresAt: number;
  resendAt: number;
};
