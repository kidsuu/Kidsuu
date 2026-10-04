# Production release checklist

This repository is a tested app foundation, **not release-ready**. `npm run check:release` deliberately exits non-zero. Completing this checklist and replacing that guard with real automated gates must be a reviewed change.

## Must be completed

- [ ] Choose and integrate a real auth/backend provider; confirm mobile/password and account recovery requirements.
- [ ] Verify credentials, OTP expiry/attempts/resend limits and authorization on the server. Never trust client timers or route guards.
- [ ] Remove reliance on demo signup/recovery data; implement secure token storage, refresh/revoke behavior, sign-out cleanup and account deletion.
- [ ] Implement secure parent reauthentication/verification. Family preview controls are now implemented, but their explicitly labelled development gate is not secure verification.
- [ ] Review age-appropriate privacy/consent obligations for the actual launch markets. A checkbox is not verified parental consent.
- [ ] Build the actual activity players; replace sample content with licensed, reviewed media/content and tested progress semantics.
- [ ] Define per-child profiles, offline/storage rules, saved activity persistence, migrations and data deletion.
- [ ] Resolve or formally risk-assess upstream dependency advisories; require a release-specific security review.
- [ ] Android ID `com.kidsuu.app` is owner-approved and an internal debug build profile is prepared. Owner Expo linking, signing/store ownership, iOS identity and the production build pipeline remain incomplete.
- [ ] Introduce native stack/deep-link/session-expiry handling when real player and account routes are implemented.
- [ ] Add provider integration tests, native UI/end-to-end tests and failure-path coverage.
- [ ] Test on intended Android tablets and iPads: portrait/landscape, split view, safe areas, keyboards, font scaling, VoiceOver/TalkBack, Reduce Motion and slow/absent connectivity.
- [ ] Measure memory/frame rate/battery and animation lifecycle on low-end target tablets. Check app-background, route-hidden and modal-open motion behavior on devices.
- [ ] Add privacy-safe crash reporting with consent/retention decisions; never log child data, tokens, passwords or OTPs.
- [ ] Run real signed APK/AAB/IPA builds and validate native splash/store requirements before release.

## Already verified locally

- Strict TypeScript, zero-warning ESLint, Prettier and static asset references.
- 105 app tests, including release auth refusal, demo-only flows, 805 pane geometries, sample catalog consistency and 241-pose loop seam integrity.
- Android and iOS Metro production JavaScript exports on Expo SDK 57.
- Release bundles exclude the demo account/engine and include fail-closed authentication.

Not verified: physical devices/emulators, native binaries, actual SMS/backend/provider behavior, store submissions, runtime performance or child privacy compliance. The earlier HTML preview's browser tests are not a substitute for native regression testing after the SDK upgrade.

## Cloudflare staging progress

Protected family-data endpoints, D1 schema/migrations, ownership checks, recent-account-reauthentication checks, and a typed tablet client are implemented and integration-tested locally. These do not complete the outstanding real identity/SMS, legal-guardian verification, live authenticated UI integration, APK/device testing or dependency security review items above. A later owner-run workflow deployed staging successfully; `/health` and the fail-closed private response were independently fetched. Health is not proof of authenticated D1 CRUD. Auth/SMS are deferred by the owner.

## Family preview delivered, not production completion

- Session-scoped profile CRUD, selection, preferences, progress list and continue cards.
- Four original text-only practice samples with five checkpoints each; no learning-score or elapsed-time claims.
- API-compatible repository seam, explicit loading/error/empty states, no automatic mutation retries, conflict handling and stale-read suppression.
- Eight moderate dependency findings removed by a scoped/tested override; sixteen high findings remain.
- Parent gate, encrypted real-account storage/cloud sync, recorded media/music, complete curriculum review, APK and real tablet QA **remain open**. See FAMILY-PREVIEW.md and TABLET-QA.md.

## Reader follow-up

Story/rhyme text readers now include 16 original age-wise drafts, 80 pages/verses, explicit explored-page progress and optional device TTS with stop/background/exit handling. This is not recorded music or singing. Pure tests and JS exports are not audible-device verification; privacy/educator review and native audio/a11y testing remain required. See READERS.md.

## Offline demo follow-up

Device-local SQLite restore is implemented for dummy family data, including bookmarks/selection, with schema validation/migration, atomic commits and durable sign-out/delete. Credentials and parent unlock are excluded. Real SQLite file restart tests run under Node; physical Android/iOS force-close/restart, low-storage and backup behavior remain unverified. Local demo persistence is not encrypted production storage or authenticated cloud sync. See OFFLINE-STORAGE.md.

## Android device-QA setup

Owner has an Android tablet and computer; no Expo account/build is linked yet. SDK-compatible expo-dev-client/system-ui and the approved package ID are configured. Native Android configuration generation was smoke-checked (not compiled). Development builds require Metro, so true offline cold launch and release performance cannot be passed using that setup alone. EAS post-install checks reject other profiles/platforms; check:release still intentionally fails. See ANDROID-DEVICE-QA.md.
