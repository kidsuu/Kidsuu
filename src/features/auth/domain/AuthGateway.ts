import type { User, Registration, Purpose, VerificationChallenge } from './types';
/** Backend boundary. No preview-entry method belongs in the production contract. */
export interface AuthGateway {
  readonly mode: 'demo' | 'unconfigured' | 'live';
  getSession(): User | null;
  getChallenge(): VerificationChallenge | null;
  cancelVerification(): void;
  signOut(): void;
  signIn(mobile: string, password: string): Promise<User>;
  beginRegistration(input: Registration): Promise<void>;
  beginReset(mobile: string): Promise<void>;
  resend(): Promise<void>;
  verify(code: string): Promise<{ purpose: Purpose; user?: User }>;
  resetPassword(password: string, confirm: string): Promise<void>;
}
