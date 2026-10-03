import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveAuthMode } from '../src/app/config/authPolicy';
import { createAuthGateway } from '../src/app/composition/createAuthGateway';
import { UnconfiguredAuthGateway } from '../src/features/auth/data/UnconfiguredAuthGateway';
import { DemoAuthEngine, DEMO } from '../src/features/auth/data/demo/DemoAuthEngine';
import { DemoAuthGateway } from '../src/features/auth/data/demo/DemoAuthGateway';
import {
  validateMobile,
  validatePassword,
  validateRegistration,
  normalizeMobile,
} from '../src/features/auth/domain/validation';
import type { AuthGateway } from '../src/features/auth/domain/AuthGateway';
const registration = {
  name: 'Fictitious Parent',
  mobile: '9876543210',
  password: 'Fiction123',
  confirm: 'Fiction123',
  guardian: true,
};
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe('fail-closed runtime policy', () => {
  it.each([undefined, 'demo', 'live', 'production', ''])(
    'never enables demo in release, requested=%s',
    (requested) => {
      expect(resolveAuthMode(false, requested)).toBe('unconfigured');
    },
  );
  it('requires explicit development opt-in', () => {
    expect(resolveAuthMode(true, undefined)).toBe('unconfigured');
    expect(resolveAuthMode(true, 'demo')).toBe('demo');
  });
  it('composition root refuses demo even if release env requests it', async () => {
    vi.stubGlobal('__DEV__', false);
    vi.stubEnv('EXPO_PUBLIC_AUTH_MODE', 'demo');
    const auth = createAuthGateway();
    expect(auth.mode).toBe('unconfigured');
    expect(auth.getSession()).toBeNull();
    await expect(auth.signIn('', '')).rejects.toThrow('not connected');
    expect(auth.getSession()).toBeNull();
  });
  it('all unavailable authentication operations fail without creating session/challenge', async () => {
    const auth: AuthGateway = new UnconfiguredAuthGateway();
    const tasks = [
      () => auth.signIn(DEMO.mobile, DEMO.password),
      () => auth.beginRegistration(registration),
      () => auth.beginReset(DEMO.mobile),
      () => auth.resend(),
      () => auth.verify(DEMO.code),
      () => auth.resetPassword('Changed123', 'Changed123'),
    ];
    for (const task of tasks) await expect(task()).rejects.toThrow('not connected');
    auth.signOut();
    auth.cancelVerification();
    expect(auth.getSession()).toBeNull();
    expect(auth.getChallenge()).toBeNull();
  });
});
describe('validation', () => {
  it('normalizes formatting and checks Indian mobile numbers', () => {
    expect(normalizeMobile('98765 43210')).toBe('9876543210');
    expect(validateMobile('98765 43210')).toBe('');
    expect(validateMobile('1234567890')).not.toBe('');
    expect(validateMobile('987654321')).not.toBe('');
  });
  it('checks registration fields and does not treat the checkbox as verified consent', () => {
    expect(validateRegistration(registration)).toEqual({});
    expect(
      Object.keys(
        validateRegistration({
          ...registration,
          name: '',
          mobile: '',
          password: 'x',
          confirm: '',
          guardian: false,
        }),
      ),
    ).toHaveLength(5);
    expect(validatePassword('abcdefgh')).not.toBe('');
    expect(validatePassword('Valid123')).toBe('');
  });
});
describe('development-only memory engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-03T06:00:00Z'));
  });
  async function finish<T>(task: Promise<T>) {
    const handled = task.then(
      (value) => ({ value }),
      (error) => ({ error }),
    );
    await vi.runAllTimersAsync();
    const result = await handled;
    if ('error' in result) throw result.error;
    return result.value;
  }
  it('preserves direct preview sign-in only on the demo adapter', async () => {
    const demo = new DemoAuthGateway(0);
    expect(await demo.signIn('', '')).toHaveProperty('name', 'Preview parent');
    demo.signOut();
    expect(demo.getSession()).toBeNull();
  });
  it('strict engine rejects a bad password', async () => {
    const auth = new DemoAuthEngine(0);
    await expect(finish(auth.signIn(DEMO.mobile, 'wrong'))).rejects.toThrow('does not match');
    expect(auth.getSession()).toBeNull();
  });
  it('registration creates a session only after code verification; session reads return copies', async () => {
    const auth = new DemoAuthEngine(0);
    await finish(auth.beginRegistration(registration));
    expect(auth.getSession()).toBeNull();
    await finish(auth.verify(DEMO.code));
    const session = auth.getSession()!;
    session.name = 'Mutated';
    expect(auth.getSession()?.name).toBe(registration.name);
    auth.signOut();
    expect(auth.getSession()).toBeNull();
  });
  it('throttles resend and expires challenges', async () => {
    const auth = new DemoAuthEngine(0);
    await finish(auth.beginReset(DEMO.mobile));
    await expect(finish(auth.resend())).rejects.toThrow('wait');
    vi.advanceTimersByTime(300001);
    await expect(finish(auth.verify(DEMO.code))).rejects.toThrow('expired');
    await finish(auth.resend());
    expect(auth.getChallenge()).not.toBeNull();
  });
  it('limits wrong attempts', async () => {
    const auth = new DemoAuthEngine(0);
    await finish(auth.beginReset(DEMO.mobile));
    for (let i = 0; i < 5; i++)
      await expect(finish(auth.verify('000000'))).rejects.toThrow('does not match');
    await expect(finish(auth.verify(DEMO.code))).rejects.toThrow('Too many attempts');
  });
  it('reset consumes its grant and does not log in', async () => {
    const auth = new DemoAuthEngine(0);
    await finish(auth.beginReset(DEMO.mobile));
    await finish(auth.verify(DEMO.code));
    await finish(auth.resetPassword('Changed123', 'Changed123'));
    expect(auth.getSession()).toBeNull();
    await expect(finish(auth.resetPassword('Changed456', 'Changed456'))).rejects.toThrow(
      'Verification expired',
    );
    await finish(auth.signIn(DEMO.mobile, 'Changed123'));
    expect(auth.getSession()?.mobile).toBe(DEMO.mobile);
  });
  it('cancels unfinished verification', async () => {
    const auth = new DemoAuthEngine(0);
    await finish(auth.beginRegistration(registration));
    auth.cancelVerification();
    await expect(finish(auth.verify(DEMO.code))).rejects.toThrow('Start verification');
  });
});
