import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const eas = JSON.parse(readFileSync(resolve(root, 'eas.json'), 'utf8'));
const app = JSON.parse(readFileSync(resolve(root, 'app.json'), 'utf8')).expo;
const dev = eas.build?.development;
// This is a guard against accidentally scheduling a release, not a security boundary
// against a repository owner who can change the build configuration.
if (
  process.env.EAS_BUILD_PROFILE !== 'development' ||
  process.env.EAS_BUILD_PLATFORM !== 'android' ||
  !dev?.developmentClient ||
  dev.distribution !== 'internal' ||
  dev.android?.gradleCommand !== ':app:assembleDebug' ||
  dev.android?.buildType !== 'apk' ||
  app.android?.package !== 'com.kidsuu.app' ||
  app.android?.allowBackup !== false
) {
  console.error(
    'Only the approved Android development APK is enabled. Production/iOS builds remain blocked; see docs/PRODUCTION-READINESS.md.',
  );
  process.exitCode = 1;
} else {
  console.log(
    'Approved Android debug development-client build. This is NOT a release candidate or device-QA pass.',
  );
}
