import type { AuthGateway } from '../domain/AuthGateway';
export class UnconfiguredAuthGateway implements AuthGateway {
  readonly mode = 'unconfigured' as const;
  getSession() {
    return null;
  }
  getChallenge() {
    return null;
  }
  cancelVerification() {}
  signOut() {}
  private unavailable(): never {
    throw new Error(
      'Authentication is not connected yet. Please configure a secure authentication provider.',
    );
  }
  async signIn(): Promise<never> {
    return this.unavailable();
  }
  async beginRegistration(): Promise<never> {
    return this.unavailable();
  }
  async beginReset(): Promise<never> {
    return this.unavailable();
  }
  async resend(): Promise<never> {
    return this.unavailable();
  }
  async verify(): Promise<never> {
    return this.unavailable();
  }
  async resetPassword(): Promise<never> {
    return this.unavailable();
  }
}
