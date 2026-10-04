import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import app from '../app.json';
import eas from '../eas.json';
function guard(profile: string, platform: string) {
  return spawnSync(process.execPath, [resolve('scripts/check-eas-build.mjs')], {
    encoding: 'utf8',
    env: { ...process.env, EAS_BUILD_PROFILE: profile, EAS_BUILD_PLATFORM: platform },
  });
}
describe('owner-approved Android development build', () => {
  it('uses the approved app ID and preserves offline/native modules and backup policy', () => {
    expect(app.expo.android.package).toBe('com.kidsuu.app');
    expect(app.expo.android.allowBackup).toBe(false);
    expect(app.expo.orientation).toBe('default');
    expect(app.expo.plugins).toContain('expo-sqlite');
    expect(app.expo.plugins.some((p) => Array.isArray(p) && p[0] === 'expo-dev-client')).toBe(true);
  });
  it('exposes only a debug internal APK, not a release/store profile', () => {
    expect(Object.keys(eas.build)).toEqual(['development']);
    expect(eas.build.development.developmentClient).toBe(true);
    expect(eas.build.development.distribution).toBe('internal');
    expect(eas.build.development.android).toEqual({
      buildType: 'apk',
      gradleCommand: ':app:assembleDebug',
    });
  });
  it('allows the approved remote build context', () => {
    const result = guard('development', 'android');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('NOT a release');
  });
  it('blocks production, iOS and missing remote context', () => {
    for (const [profile, platform] of [
      ['production', 'android'],
      ['development', 'ios'],
      ['', ''],
    ])
      expect(guard(profile, platform).status).toBe(1);
  });
  it('keeps release auth and release-readiness guards intact', () => {
    expect(readFileSync('src/app/config/authPolicy.ts', 'utf8')).toContain(
      "development && requested === 'demo'",
    );
    const result = spawnSync(process.execPath, ['scripts/check-release.mjs'], { encoding: 'utf8' });
    expect(result.status).toBe(1);
  });
});
