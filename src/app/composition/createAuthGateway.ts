import type { AuthGateway } from '../../features/auth/domain/AuthGateway';
import { UnconfiguredAuthGateway } from '../../features/auth/data/UnconfiguredAuthGateway';
import { resolveAuthMode } from '../config/authPolicy';
/** __DEV__ is a Metro build-time constant, not a remotely controllable setting. */
export function createAuthGateway(): AuthGateway {
  if (__DEV__ && resolveAuthMode(__DEV__, process.env.EXPO_PUBLIC_AUTH_MODE) === 'demo') {
    // Conditional require lets Metro exclude demo code from release bundles.
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { DemoAuthGateway } =
      require('../../features/auth/data/demo/DemoAuthGateway') as typeof import('../../features/auth/data/demo/DemoAuthGateway');
    /* eslint-enable @typescript-eslint/no-require-imports */
    return new DemoAuthGateway();
  }
  return new UnconfiguredAuthGateway();
}
