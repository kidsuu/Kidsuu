# Kidsuu

Tablet-first React Native app with the approved clay UI, animated boy/puppy characters, and age-based Home experience.

**Status: development foundation, not a production release.** Live authentication, secure parent verification and live cloud persistence are not connected. Development demo data now persists locally in SQLite. Family screens and four original practice samples plus story/rhyme readers work with development-only dummy data. Release authentication fails closed instead of admitting users through the preview shortcut.

## Research-to-content implementation

The development-only **Grown-ups → Content Lab** now contains **eight Hindi/English draft editions**: a four-part spoken rhyme, six-page story, visual one-to-one placement activity and deterministic triangle game. The [interactive-player batch](docs/INTERACTIVE-PILOTS.md) adds tap placement/undo/models and geometric choices/hints, not another text quiz. Variable-length navigation, optional-repeat skipping, edition-specific local progress, v1/v2 → v3 snapshot migration, content hashes and language-aware TTS are implemented. Drafts remain excluded from release bundles and are not educationally approved. See [implementation, tablet checks and remaining work](docs/CONTENT-PLATFORM.md) and [the attributed research inputs](docs/research/README.md).

## Run locally

Use **Node 22.13+** (the project pins Node 22 via `.nvmrc`).

```sh
nvm use
npm ci
cp .env.example .env
npm start
```

Use an Expo Go client compatible with SDK 57, or a development build. `npm run android` / `npm run ios` require the corresponding emulator or native toolchain. Expo Go's OS startup screen may differ from the configured standalone splash.

The optional `.env` setting `EXPO_PUBLIC_AUTH_MODE=demo` enables the familiar **Sign in → Home** shortcut **only in development**. Use fictitious details only. Optional registration/recovery demo code: `123456`; seeded recovery mobile: `9000000000`. These are test fixtures, not real credentials or SMS.

Without the opt-in, auth stays unconfigured. Production builds ignore demo opt-in and cannot create a session. Never put passwords, API secrets or SMS provider keys in `EXPO_PUBLIC_*` variables: they are embedded in client bundles.

## Structure

```text
App.tsx                        # thin Expo entry
src/
  app/
    App.tsx                    # safe area, status bar, error boundary
    composition/               # adapter selection
    config/                    # fail-closed runtime policy
    navigation/                # typed routes and app flow controller
  features/
    auth/
      domain/                  # framework-free contract, types, validation
      data/                    # unavailable adapter + isolated demo adapter
      components/              # field/button/link primitives
      screens/                 # auth presentation and view props
      styles/
      assets/
    home/
      domain/                  # catalog types and responsive geometry
      data/                    # explicitly labelled sample catalog
      components/PlayScene/    # 12-second rig, native renderer, required layers
      screens/                 # Home / Explore / Saved / age selection
      assets/
    family/                    # profiles/settings/progress, store + isolated demo repository
    activities/                # practice + age-wise readers + optional device narration
    onboarding/                # animated launch + static splash
  shared/
    assets/brand/              # runtime icon/background/repaired splash logo
    components/                # error boundary and shared animated logo
scripts/                       # asset and release-bundle checks
tests/                        # auth policy, demo engine, tablet geometry, motion
docs/                         # architecture and release/security decisions
```

Features do not import the app layer; shared code does not import features. ESLint enforces those import boundaries. Native screens depend on an auth contract rather than constructing a demo engine.

## Included

- Expo SDK **57**, React Native **0.86**, React **19.2**, strict TypeScript.
- Tablet portrait/landscape support; phone-compatible layouts. The full animation canvas fits inside the Home hero. Content width is capped, cards use adaptive columns, and tablet controls are larger.
- Original articulated characters and corrected 2D choreography; system Reduce Motion/background/offscreen handling.
- Clean landscape/portrait login, static repaired splash, registration/recovery UI.
- Error boundary, explicit feature contracts, deterministic lockfile, formatting/linting, unit tests and GitHub Actions CI.
- Only **74 referenced PNG assets** (about 3.09 MiB). No ZIP deliveries, offline HTML previews, screenshots, generated bundles, credentials, unused raw references or rejected 3D experiments are committed.

## Quality commands

```sh
npm run check             # types, lint, formatting, tests, asset references
npm run verify:bundles    # Android/iOS JS export + no demo auth in release bundles
npm run audit:dependencies
npm run check:release     # intentionally fails until production work is complete
```

Current local checks: **135 app tests**, including **805** responsive geometry cases; TypeScript, lint and formatting; static-asset integrity; Android/iOS Metro exports. These exports are **not APK/IPA builds or device tests**. The bundle check confirms that seeded demo accounts/engine are absent and the unavailable auth adapter is present.

Dependency audit still reports upstream transitive advisories. See [security notes](docs/SECURITY.md); audit is not claimed clean. CI reports the audit separately and does not silently fix dependencies with `--force`.

## Before production

See [architecture](docs/ARCHITECTURE.md), [release checklist](docs/PRODUCTION-READINESS.md), and [security](docs/SECURITY.md). Backend/provider selection, verified parent access, secure identity storage, reviewed content and real-device QA are deliberate next steps—not placeholder implementations presented as complete.

## Cloudflare backend (staging phase)

`backend/` now contains an independently packaged Workers + D1 API. Shared transport types live in `packages/contracts/`; the tablet HTTP client is `src/shared/api/FamilyApiClient.ts`.

The API supports parent settings, owner-scoped child profiles and client-reported progress, with external-provider JWT validation and recent reauthentication for sensitive operations. It does **not** implement identity signup/login/SMS, verified parental consent or real activity players. Private endpoints fail closed until provider configuration exists. The family screens use a repository contract matching the API client. Live composition requires a token getter and real parent reauthentication; neither is supplied yet. Demo mode never calls the live API.

Use npm 11.21.0 for the backend lockfile; install backend dependencies separately with `cd backend && npm ci`. Backend CI pins that npm version. See [backend routes/tests](backend/README.md) and the [Cloudflare setup guide](docs/CLOUDFLARE-STAGING.md). The staging deployment workflow is manual and only runs from `main` after review/merge and owner-provided account configuration. No Cloudflare deployment or Android APK is implied by this source change.

## Family preview (auth deliberately deferred)

In development demo mode, Sign in opens a device-local family experience:

- Choose a child profile; Grown-ups → Open demo parent controls → add/edit/delete up to five profiles.
- Set a sound preference and daily goal (not a timer or enforced screen-time limit).
- Try a Learning or Games card: five original text-only practice steps, age-sensitive prompts, progress/continue cards, per-profile saved activities.
- Story/rhyme cards open 16 age-wise original drafts (80 pages/verses), with deliberate progress checkpoints and optional device read-aloud. Rhymes are spoken, not sung. Audio availability depends on the device.
- Parent controls relock on background, exit and after five minutes. **The demo gate is not secure parent verification.** Release auth still refuses entry.
- Demo family data now saves to device-local SQLite and restores after restart; sign-out/delete erases it. Credentials and parent unlock are never saved. No cloud sync. See [offline storage](docs/OFFLINE-STORAGE.md).

See [family preview and remaining work](docs/FAMILY-PREVIEW.md) and [tablet test checklist](docs/TABLET-QA.md). Current implementation is on a review branch; it is not automatically deployed or a built APK. See [reader behavior and audio limits](docs/READERS.md).

## First Android tablet development build

Application ID `com.kidsuu.app` is owner-approved. `eas.json` has only an internal debug development-client profile; no release or iOS build profile is enabled. `npm run qa:start` starts the development server with the explicit demo opt-in on Windows/macOS/Linux. Owner Expo account creation/project linking and APK compilation/install are still required; see [Android device QA setup](docs/ANDROID-DEVICE-QA.md). No physical-device case is marked passed. A Metro-connected development client is not proof of standalone airplane-mode cold launch or production performance.
