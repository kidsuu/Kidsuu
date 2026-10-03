# Production release checklist

This repository is a tested app foundation, **not release-ready**. `npm run check:release` deliberately exits non-zero. Completing this checklist and replacing that guard with real automated gates must be a reviewed change.

## Must be completed

- [ ] Choose and integrate a real auth/backend provider; confirm mobile/password and account recovery requirements.
- [ ] Verify credentials, OTP expiry/attempts/resend limits and authorization on the server. Never trust client timers or route guards.
- [ ] Remove reliance on demo signup/recovery data; implement secure token storage, refresh/revoke behavior, sign-out cleanup and account deletion.
- [ ] Implement secure parent reauthentication/verification. The current Grown-ups alert is not a protected parent gate.
- [ ] Review age-appropriate privacy/consent obligations for the actual launch markets. A checkbox is not verified parental consent.
- [ ] Build the actual activity players; replace sample content with licensed, reviewed media/content and tested progress semantics.
- [ ] Define per-child profiles, offline/storage rules, saved activity persistence, migrations and data deletion.
- [ ] Resolve or formally risk-assess upstream dependency advisories; require a release-specific security review.
- [ ] Choose Android package/iOS bundle identifiers, signing ownership, store account ownership and the release/build pipeline. None are invented or configured here.
- [ ] Introduce native stack/deep-link/session-expiry handling when real player and account routes are implemented.
- [ ] Add provider integration tests, native UI/end-to-end tests and failure-path coverage.
- [ ] Test on intended Android tablets and iPads: portrait/landscape, split view, safe areas, keyboards, font scaling, VoiceOver/TalkBack, Reduce Motion and slow/absent connectivity.
- [ ] Measure memory/frame rate/battery and animation lifecycle on low-end target tablets. Check app-background, route-hidden and modal-open motion behavior on devices.
- [ ] Add privacy-safe crash reporting with consent/retention decisions; never log child data, tokens, passwords or OTPs.
- [ ] Run real signed APK/AAB/IPA builds and validate native splash/store requirements before release.

## Already verified locally

- Strict TypeScript, zero-warning ESLint, Prettier and static asset references.
- 23 unit tests, including release auth refusal, demo-only flows, 805 pane geometries, sample catalog consistency and 241-pose loop seam integrity.
- Android and iOS Metro production JavaScript exports on Expo SDK 57.
- Release bundles exclude the demo account/engine and include fail-closed authentication.

Not verified: physical devices/emulators, native binaries, actual SMS/backend/provider behavior, store submissions, runtime performance or child privacy compliance. The earlier HTML preview's browser tests are not a substitute for native regression testing after the SDK upgrade.

## Cloudflare staging progress

Protected family-data endpoints, D1 schema/migrations, ownership checks, recent-account-reauthentication checks, and a typed tablet client are implemented and integration-tested locally. These do not complete the outstanding real identity/SMS, legal-guardian verification, native UI wiring, APK/device testing or dependency security review items above. No live Cloudflare resource has been verified solely by these tests.
