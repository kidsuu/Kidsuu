# Security notes

## Current behavior

- Production authentication is intentionally unavailable; it fails closed. The development shortcut is gated with the Metro `__DEV__` constant and an explicit non-secret environment opt-in.
- No real SMS, password database, backend keys, analytics SDK, auth-session persistence or provider integration is shipped.
- Demo passwords and OTPs are fictitious in-memory fixtures. Never enter real personal information into demo mode.
- `.env`, signing material, private keys, generated builds and dependency folders are ignored. `.env.example` contains only a public development-mode selector and public staging API origin.
- The error boundary does not print exceptions or personal information into UI/logs. A real observability integration needs its own redaction/consent review.

## Dependency baseline — 2026-10-03

The previous Expo 54 baseline was upgraded to Expo **57.0.26**, with SDK-compatible React Native **0.86.3**, React **19.2.3** and TypeScript **6**. Node **22.13+** is required. `expo install --check` passes; compatible `npm audit fix` was attempted without forcing major downgrades.

`npm audit --omit=dev` now reports **16 high, 0 moderate, 0 critical** findings at this snapshot (previously 24: 16 high / 8 moderate). The report includes inherited vulnerability chains in the Expo/Metro/native build ecosystem, rooted in `braces` and `node-forge`. Counts and advisory data can change independently of this commit. Re-run `npm run audit:dependencies` for the current details.

No claim is made that those findings are harmless or fixed. Do not blindly use `npm audit fix --force`: the observed suggestion included downgrading Expo to 44, which is not a safe resolution. Upstream patches/SDK updates or reviewed compatible overrides need testing, including native builds. Avoid untrusted build inputs while this is unresolved. This baseline is blocked from production release pending review/remediation.

CI reports the audit in a clearly labelled advisory step without masking its command output. Application checks remain mandatory. A production pipeline must gate on the reviewed security policy, not simply reuse this foundation CI.

## Access and reporting

Repository deployment keys are not part of the app and must never be committed. Remove the temporary write-enabled deploy key after this initial delivery. Use least-privilege service accounts and branch protection for ongoing development.

Report vulnerabilities privately to the repository owner. Do not include live tokens, passwords, private keys or child data in public issues or screenshots.

## Cloudflare staging backend

The isolated `backend/` runtime dependency audit currently reports **zero known advisories** (`npm audit --omit=dev`, 2026-10-03). That does not resolve the existing Expo/native dependency findings above; the app audit remains 16 high / 0 moderate at this checkpoint.

The backend is not an identity provider. It accepts only configured issuer/audience/asymmetric-JWKS tokens, scopes database access to the verified identity, requires recent signed authentication for sensitive parent operations, and fails closed when configuration is missing. Password hashing/SMS are not improvised inside a Free-tier Worker. Browser origin allowlisting is not a replacement for authorization. Rate limiting is per-edge-location and is not a hard global abuse/billing cap.

Staging uses minimal, fictitious child data. Profiles share the parent account's authorization scope; separate child-session capabilities and verified legal guardianship/consent are still production design work. Revocation, account deletion at the identity provider, log retention, backups and provider/mobile integration need review before real users.

## Scoped build dependency remediation

`xcode@3.0.1` uses only CommonJS `uuid.v4()` to generate 24-character PBX identifiers. Its scoped override to `uuid@11.1.1` removes the vulnerable UUID range without changing Expo/React Native versions. A regression test verifies CommonJS loading, 100 unique identifier shapes and PBX parse/write round trips. Android/iOS JS exports remain separate checks, **not** native Xcode/Gradle validation.

The registry currently reports `braces@3.0.3` and `node-forge@1.4.0` as latest releases; both are still in their reported affected ranges. Do not invent a patched version or suppress the audit. Avoid untrusted build inputs; native builds and production release remain blocked pending mitigation/upstream fixes and review.

## Family preview boundary

The pure family engine has no disk/network I/O; a development-only offline wrapper now persists validated dummy data in app-private SQLite. Both are conditionally excluded from release bundles. The demo parent gate is a visibly labelled preview confirmation, not adult/identity verification. The store refuses parent changes before authorization, clears its gate on background/exit/timeout, and ignores stale profile reads. The live composition seam requires an external reauthentication adapter; the server remains authoritative. No unlock flags or tokens are persisted. Demo nicknames/settings/progress/bookmarks are now saved locally; only fictitious data is permitted. Sign-out waits for local erase; offline writes are not queued or automatically replayed.

## Optional narration

expo-speech receives only fixed original editorial text, not child/account data or tokens. This app does not request microphone access or record voices. OS TTS engines may use network-backed voices; do not claim fully local processing or guaranteed offline audio. Narration is user-initiated, cancels on background/exit and remains disabled when a screen reader is active or cannot be detected. No new server endpoint or auth bypass was added.

## Local demo SQLite policy

SQLite storage is not app-level encrypted and represents a single fictitious household per installation. Production auth still denies access; no development bypass is enabled in release. Snapshot schemas explicitly reject unexpected credential/unlock fields; read/corruption failures preserve existing data instead of reseeding. Save acknowledgement follows atomic disk commit, and all family sign-out paths wait for erase. Data is erased from the current database, not from historical backups or flash remnants. Android `allowBackup: false` applies only to generated standalone apps, not Expo Go or all OS/OEM behaviors. iOS backup exclusion, secure real-account storage, retention, key management and multi-account authorization remain production blockers. See OFFLINE-STORAGE.md.

## Android development-client QA

The owner-approved package is `com.kidsuu.app`. The only EAS profile is an internal **debug** APK; no production credentials or project IDs were invented. Account linking/cloud builds are owner-operated. The debug client/Metro server is for trusted testers, not public distribution or real child data. Keep LAN/tunnel endpoints private and stop them after use. Android config blocks microphone and legacy shared-storage permissions because the app has no recording/shared-media feature; SQLite remains app-private. Generated native files were inspected, but final merged APK permissions and actual device behavior still need verification after compilation. This does not eliminate the 16 outstanding high dependency findings.
