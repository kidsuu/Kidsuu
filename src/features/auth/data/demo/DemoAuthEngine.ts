/** DEVELOPMENT ONLY: fictitious in-memory accounts, never production credentials. */
import type { User, Registration, Purpose } from '../../domain/types';
import {
  normalizeMobile,
  validateMobile,
  validatePassword,
  validateRegistration,
} from '../../domain/validation';
export const DEMO = { mobile: '9000000000', password: 'Kidsuu123', code: '123456' };
type Challenge = {
  purpose: Purpose;
  mobile: string;
  expiresAt: number;
  resendAt: number;
  attempts: number;
  registration?: Registration;
};
export class DemoAuthEngine {
  private records = new Map<string, User & { password: string }>([
    [DEMO.mobile, { name: 'Demo parent', mobile: DEMO.mobile, password: DEMO.password }],
  ]);
  private challenge: Challenge | null = null;
  private resetGrant: { mobile: string; expiresAt: number } | null = null;
  private session: User | null = null;
  constructor(private latency = 420) {}
  private pause() {
    return new Promise<void>((resolve) => setTimeout(resolve, this.latency));
  }
  /** Explicit UI-preview shortcut. Never use as production authentication. */
  enterPreview(): User {
    this.cancelVerification();
    this.session = { name: 'Preview parent', mobile: DEMO.mobile };
    return { ...this.session };
  }
  getSession() {
    return this.session ? { ...this.session } : null;
  }
  getChallenge() {
    if (!this.challenge) return null;
    const { purpose, mobile, expiresAt, resendAt } = this.challenge;
    return { purpose, mobile, expiresAt, resendAt };
  }
  cancelVerification() {
    this.challenge = null;
    this.resetGrant = null;
  }
  signOut() {
    this.session = null;
    this.cancelVerification();
  }
  async signIn(mobile: string, password: string): Promise<User> {
    await this.pause();
    if (validateMobile(mobile)) throw new Error(validateMobile(mobile));
    const r = this.records.get(normalizeMobile(mobile));
    if (!r || r.password !== password)
      throw new Error('Mobile number or password does not match a demo account.');
    this.session = { name: r.name, mobile: r.mobile };
    return { ...this.session };
  }
  private start(purpose: Purpose, mobile: string, registration?: Registration) {
    this.resetGrant = null;
    this.challenge = {
      purpose,
      mobile,
      expiresAt: Date.now() + 300000,
      resendAt: Date.now() + 30000,
      attempts: 0,
      registration,
    };
  }
  async beginRegistration(v: Registration) {
    await this.pause();
    const errors = validateRegistration(v);
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
    const mobile = normalizeMobile(v.mobile);
    if (this.records.has(mobile))
      throw new Error('This mobile already has a demo account. Sign in or reset its password.');
    this.start('register', mobile, { ...v, mobile, name: v.name.trim() });
  }
  async beginReset(mobile: string) {
    await this.pause();
    if (validateMobile(mobile)) throw new Error(validateMobile(mobile));
    mobile = normalizeMobile(mobile);
    if (!this.records.has(mobile))
      throw new Error('Use the demo number 9000000000, or register a demo account first.');
    this.start('reset', mobile);
  }
  async resend() {
    await this.pause();
    const c = this.challenge;
    if (!c) throw new Error('Start verification again.');
    if (Date.now() < c.resendAt)
      throw new Error('Please wait before requesting another demo code.');
    this.start(c.purpose, c.mobile, c.registration);
  }
  async verify(code: string): Promise<{ purpose: Purpose; user?: User }> {
    await this.pause();
    const c = this.challenge;
    if (!c) throw new Error('Start verification again.');
    if (c.expiresAt < Date.now()) throw new Error('This demo code expired. Request another code.');
    if (c.attempts >= 5) throw new Error('Too many attempts. Request another demo code.');
    if (code !== DEMO.code) {
      c.attempts++;
      throw new Error('That code does not match. The demo code is 123456.');
    }
    this.challenge = null;
    if (c.purpose === 'register') {
      const r = c.registration!;
      this.records.set(c.mobile, { name: r.name, mobile: c.mobile, password: r.password });
      this.session = { name: r.name, mobile: c.mobile };
      return { purpose: 'register', user: { ...this.session } };
    }
    this.resetGrant = { mobile: c.mobile, expiresAt: Date.now() + 300000 };
    return { purpose: 'reset' };
  }
  async resetPassword(password: string, confirm: string) {
    await this.pause();
    const grant = this.resetGrant;
    if (!grant || grant.expiresAt < Date.now())
      throw new Error('Verification expired. Go back and verify your mobile again.');
    if (validatePassword(password)) throw new Error(validatePassword(password));
    if (password !== confirm) throw new Error('Both passwords must match.');
    const r = this.records.get(grant.mobile)!;
    this.records.set(grant.mobile, { ...r, password });
    this.resetGrant = null;
    this.session = null;
  }
}
