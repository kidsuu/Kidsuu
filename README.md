# Kidsuu

Tablet-first React Native app with the approved clay UI, animated boy/puppy characters, and age-based Home experience.

**Status: development foundation, not a production release.** Live authentication, real activity players, secure parent verification and persistence are not connected. Release authentication fails closed instead of admitting users through the preview shortcut.

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

Current local checks: **23 unit tests**, including **805** responsive geometry cases; TypeScript, lint and formatting; static-asset integrity; Android/iOS Metro exports. These exports are **not APK/IPA builds or device tests**. The bundle check confirms that seeded demo accounts/engine are absent and the unavailable auth adapter is present.

Dependency audit still reports upstream transitive advisories. See [security notes](docs/SECURITY.md); audit is not claimed clean. CI reports the audit separately and does not silently fix dependencies with `--force`.

## Before production

See [architecture](docs/ARCHITECTURE.md), [release checklist](docs/PRODUCTION-READINESS.md), and [security](docs/SECURITY.md). Backend/provider selection, verified parent access, private session storage, licensed content, activity players and real-device QA are deliberate next steps—not placeholder implementations presented as complete.
