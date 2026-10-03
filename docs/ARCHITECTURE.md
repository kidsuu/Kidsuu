# Architecture

## Dependency direction

`app → feature presentation/domain/data → shared`

The composition root selects concrete adapters. Feature screens do not know how the app chooses its environment. Domain auth contracts and validation import no React Native APIs. View props live next to screens. Shared branding/artwork can serve onboarding and login without importing app-specific flow.

No speculative API endpoints, fake HTTP client, unused global state library, empty repositories or backend keys are included.

## Application flow

`App` owns safe-area providers, native splash handoff and an error boundary. `AppNavigator` composes intro/auth/Home features; `useAppFlow` owns the current typed route, pending actions, field values, accessibility announcements and lifecycle cleanup. `AuthScreen` renders fields and invokes callbacks instead of performing network operations.

The present navigator is a small typed in-memory flow, not a full native navigation-stack library. Before players, notification links or nested parent/account routes are added, introduce a native stack with route/session tests. Do not extend a single hook indefinitely. No deep links or persisted navigation state are currently accepted.

## Authentication boundary

`AuthGateway` defines session/challenge reads and sign-in, registration, verification, reset and sign-out operations. Its production contract has **no `enterPreview()` method**.

- Development + explicit `EXPO_PUBLIC_AUTH_MODE=demo`: isolated demo gateway preserves the approved visual-review shortcut and memory-only registration/recovery engine.
- Any release build, or missing/unknown configuration: `UnconfiguredAuthGateway` rejects all auth operations and never creates a session or challenge.
- `__DEV__` gates a conditional module import. Metro release exports are checked to ensure the demo engine and seeded account are absent.

The app also requires a session before navigating to Home. This client check is **not** server-side authorization. A future live adapter must not accept an unverified client-created user object as proof of identity.

A real provider integration must include server-controlled OTP/rate limits, account-enumeration resistance, server-side session revocation and authorization, timeout/cancellation behavior, redacted errors, and safe retry semantics. Refresh/session tokens belong in OS-backed secure storage; provider secrets stay on the server. Add integration tests against the actual provider contract before switching the composition root to a live adapter.

## Home and content

Home receives its catalog through props. The current sample fixture contains illustrative titles/durations only, not media or a vetted curriculum. Age and saved selections are local UI state; there is no invented persistence or analytics. Continue progress is supplied by the parent and is demo-only in the current composition.

Responsive layout uses measured app-pane dimensions—not model names or a fixed phone width. The entire 600×550 motion stage must fit inside the hero. Pure layout calculations are independently tested. Animation data and cutout art remain intact; native renderer compatibility was updated for the current SDK.

Before loading external catalogs, add runtime schema validation, authorized content delivery, loading/empty/error states, per-child profile scoping and storage/migration tests. Replace placeholder activity callbacks with actual players. No unvalidated remote data is loaded today.

## Assets and styling

Runtime art is owned by its feature; branding used across features lives in shared. Static `require()` paths keep Metro asset resolution deterministic. `check-assets` rejects missing/unused PNGs. StyleSheets preserve the approved cream/peach/clay appearance and tablet adjustments without a new styling runtime.

The app uses Expo-managed native generation. `android/` and `ios/` are ignored until there is an intentional native-code requirement; commit app config/plugins and dependency lockfile instead of generated native output.

## Backend boundary

The Cloudflare staging service has its own dependencies and lockfile under `backend/`; Expo does not bundle backend code. `packages/contracts` contains dependency-free transport types/constants used by both sides. The auth provider remains a separate required integration. The mobile Family API client receives a token getter; it never reads demo fixtures or stores tokens itself. The Worker derives account ownership from verified JWT claims and every family-data query is scoped to that owner.

The original app/demo flow remains unchanged until the real provider and profile UI are integrated. Backend auth verification is implemented; client identity sign-in is not. See the staging guide for deployment and migration boundaries.
