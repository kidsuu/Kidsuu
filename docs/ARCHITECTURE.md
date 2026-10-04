# Architecture

## Dependency direction

`app → feature presentation/domain/data → shared`

The composition root selects concrete adapters. Feature screens do not know how the app chooses its environment. Domain auth contracts and validation import no React Native APIs. View props live next to screens. Shared branding/artwork can serve onboarding and login without importing app-specific flow.

No speculative API endpoints, fake HTTP client, unused global state library, empty repositories or backend keys are included.

## Application flow

`App` owns safe-area providers, native splash handoff and an error boundary. `AppNavigator` composes intro/auth/Home features; `useAppFlow` owns the current typed route, pending actions, field values, accessibility announcements and lifecycle cleanup. `AuthScreen` renders fields and invokes callbacks instead of performing network operations.

The present navigator is a small typed in-memory flow, not a full native navigation-stack library. The family preview has a separate scoped screen controller with Android Back handling, parent relocking and a testable store. A native navigation stack with deep-link/session-expiry tests remains required before production; the preview does not implement native-stack restoration or navigation gestures. No deep links or persisted navigation state are currently accepted.

## Authentication boundary

`AuthGateway` defines session/challenge reads and sign-in, registration, verification, reset and sign-out operations. Its production contract has **no `enterPreview()` method**.

- Development + explicit `EXPO_PUBLIC_AUTH_MODE=demo`: isolated demo gateway preserves the approved visual-review shortcut and memory-only registration/recovery engine.
- Any release build, or missing/unknown configuration: `UnconfiguredAuthGateway` rejects all auth operations and never creates a session or challenge.
- `__DEV__` gates a conditional module import. Metro release exports are checked to ensure the demo engine and seeded account are absent.

The app also requires a session before navigating to Home. This client check is **not** server-side authorization. A future live adapter must not accept an unverified client-created user object as proof of identity.

A real provider integration must include server-controlled OTP/rate limits, account-enumeration resistance, server-side session revocation and authorization, timeout/cancellation behavior, redacted errors, and safe retry semantics. Refresh/session tokens belong in OS-backed secure storage; provider secrets stay on the server. Add integration tests against the actual provider contract before switching the composition root to a live adapter.

## Home and content

Home receives its catalog through props. The current sample fixture contains illustrative titles/durations only, not media or a vetted curriculum. Family profiles supply the selected age group; only parent controls edit it. Saved selections and continue progress are isolated per profile in a session-scoped store, persisted by the development-only SQLite wrapper, not analytics or cloud sync. Four original practice samples exercise actual completion writes against the demo repository.

Responsive layout uses measured app-pane dimensions—not model names or a fixed phone width. The entire 600×550 motion stage must fit inside the hero. Pure layout calculations are independently tested. Animation data and cutout art remain intact; native renderer compatibility was updated for the current SDK.

Before loading external catalogs, add runtime schema validation, authorized content delivery, loading/empty/error states, per-child profile scoping and storage/migration tests. Story/rhyme readers now load bundled age-wise editorial drafts with optional device narration. Validate the curriculum and any future recorded-media player before release. No unvalidated remote data is loaded today.

## Assets and styling

Runtime art is owned by its feature; branding used across features lives in shared. Static `require()` paths keep Metro asset resolution deterministic. `check-assets` rejects missing/unused PNGs. StyleSheets preserve the approved cream/peach/clay appearance and tablet adjustments without a new styling runtime.

The app uses Expo-managed native generation. `android/` and `ios/` are ignored until there is an intentional native-code requirement; commit app config/plugins and dependency lockfile instead of generated native output.

## Backend boundary

The Cloudflare staging service has its own dependencies and lockfile under `backend/`; Expo does not bundle backend code. `packages/contracts` contains dependency-free transport types/constants used by both sides. The auth provider remains a separate required integration. The mobile Family API client receives a token getter; it never reads demo fixtures or stores tokens itself. The Worker derives account ownership from verified JWT claims and every family-data query is scoped to that owner.

The approved animated login/Home scene is preserved. FamilyExperience now connects profile/settings/progress screens to FamilyStore and its repository interface. createFamilySession conditionally imports the device-local offline demo repository in development; live composition requires an injected token getter and reauthentication callback. There is no API-error fallback to demo. Backend auth verification is implemented; client identity sign-in is not. See the staging guide for deployment and migration boundaries.

## Reader/audio boundary

`activities/data/readings` provides versioned original text drafts; `readerProgress` defines explicit exploration checkpoints. `NarrationController` has an injected native port and no access to family state. A single device coordinator serializes stop/start across reader mounts; lifecycle changes cancel queued work. Audio callbacks never write learning progress. Only static page text reaches the OS voice engine. Voice/network availability is OS-controlled, not a guaranteed offline audio service.

## Local persistence boundary

The pure memory engine can export validated domain data. The offline repository wraps it with clone/validate/atomic-commit-before-publication, a serialized operation queue and strict versioned snapshots. SQLite is accessed through a tiny injectable port tested against real database files. FamilyStore additionally awaits persistent profile selection/bookmarks and separates route disposal from durable sign-out. UI restore failures block family access until Retry or explicitly confirmed reset. Hardware Back delegates sign-out to the family store so erase cannot be bypassed. This is one dummy family per install, not encrypted or authenticated real-account storage. See OFFLINE-STORAGE.md.
