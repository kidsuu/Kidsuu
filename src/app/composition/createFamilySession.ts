import { FamilyStore } from '../../features/family/domain/FamilyStore';
import { createR2CloudFamilyRepository } from '../../features/family/data/r2/r2CloudRepository';
import { createFamilyApiClient, FamilyApiError } from '../../shared/api/FamilyApiClient';
import { createR2StorageClient } from '../../shared/api/R2StorageClient';
import { resolveAuthMode } from '../config/authPolicy';
export interface LiveFamilyAccess {
  getAccessToken: () => Promise<string | null>;
  reauthenticateParent: () => Promise<void>;
}
/** Live mode requires a real token/reauthentication adapter. Never fallback to demo on error.
 * Relational records live in Cloudflare D1; snapshot/edition/media storage lives in Cloudflare R2. */
export function createFamilySession(isDemo: boolean, live?: LiveFamilyAccess): FamilyStore | null {
  if (__DEV__ && isDemo && resolveAuthMode(__DEV__, process.env.EXPO_PUBLIC_AUTH_MODE) === 'demo') {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { createDeviceOfflineRepository } =
      require('../../features/family/data/offline/deviceOfflineRepository') as typeof import('../../features/family/data/offline/deviceOfflineRepository');
    /* eslint-enable @typescript-eslint/no-require-imports */
    return new FamilyStore(createDeviceOfflineRepository(), async () => {});
  }
  if (!live || isDemo) return null;
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!baseUrl)
    throw new FamilyApiError('AUTH_NOT_CONFIGURED', 'API origin is not configured.', 503);
  const dbClient = createFamilyApiClient({ baseUrl, getAccessToken: live.getAccessToken });
  const r2Client = createR2StorageClient({ baseUrl, getAccessToken: live.getAccessToken });
  return new FamilyStore(
    createR2CloudFamilyRepository(dbClient, r2Client),
    live.reauthenticateParent,
  );
}
