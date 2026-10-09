# Kidsuu

Tablet-first React Native + Expo app with the original approved boy/puppy, age-based Home and device-local family demo.

**Current content: Fresh Worlds, 9 October 2026.** At the owner's request, all previous playable Games, Learning activities, Stories and Rhymes have been removed from app source. A new seven-concept library replaces them, with fourteen English/Hindi draft editions. The three games now use original animated SVG worlds with 17 stages across nine environments; the earlier static game preview is retained only as historical records. This remains an internal adult preview; editorial, language, rights and physical-device review are pending.

| Fresh concept             | Category                                      | Age | Parts |
| ------------------------- | --------------------------------------------- | --- | ----- |
| Pattern Trail             | Games: complete repeating units               | 4–5 | 6     |
| River Builders            | Games: compose exact bridge lengths           | 6–7 | 6     |
| Lantern Grove             | Games: plan direct-neighbour light changes    | 8–9 | 5     |
| Hello, Little Seed        | Shared Learning: soil, water, sun, time       | 2–3 | 4     |
| Pocket Garden             | Learning: one seed per pot, quantities 1–5    | 4–5 | 5     |
| The Little Seed’s Journey | Stories: an original illustrated seed journey | 4–5 | 6     |
| Tip, Tap, Rain            | Shared spoken rhyme with an optional repeat   | 2–3 | 4     |

See [Fresh Worlds implementation and QA](docs/FRESH-CONTENT.md), [art provenance](docs/FRESH-ART-PROVENANCE.md) and [research inputs](docs/research/README.md). Earlier content documents are historical; they do not describe the playable catalog now.

## Run the native preview

Use Node 22.13+ and npm 11.21.0 (backend lockfile requirement).

```sh
npm ci
npm run qa:start
```

Use an Expo Go client compatible with SDK 57 or a development client. The local development demo opt-in opens Sign in → Home with fictitious details. Grown-ups → Open demo parent controls → Fresh worlds opens the full review library. Home cards show only the selected age's new activities and enter the adult gate before opening a draft. Parent access relocks on background, exit and timeout. This demo gate is not verified parental identity.

English/Hindi are independent editions. Tap a piece and a target; drag is optional. Hints, undo/reset, replay and explicit Next/Finish are available. Game progression unlocks after solving; River Builders requires the seed delivery cart to arrive. An adult review control can inspect a stage without changing records. No timers, streaks, autoplay or mastery scores. Listening uses available device TTS voices; rhymes are spoken, not recorded songs. Saved records still describe exploration rather than independent mastery or measured understanding.

## Storage and compatibility

SQLite restores demo profiles, settings, bookmarks and edition records. New content has new stable IDs; old progress is retained only as history and never assigned to a new edition. Removed editions cannot launch. Credentials and parent unlock are never stored. Sign-out/delete keep their existing erasure behavior. Backend snapshot validation and the R2 client accept the seven new bookmark IDs alongside historical IDs; live auth/cloud composition remains unconfigured.

## Verification

```sh
npm run check
npm run verify:bundles
npm --prefix backend ci
npm run backend:check
```

Native Android/iOS JavaScript exports and release isolation are checked separately from a real APK/IPA or physical-device run. Draft content, generated art and demo auth are excluded from normal release bundles. Content release checks intentionally reject unreviewed drafts. The standalone APK workflow explicitly builds a demo preview on its runner; this source change does not itself compile, install or deploy an APK.

The games use Expo-compatible react-native-svg 15.15.4 for native vectors; scene motion uses React Native Animated. Browser QA renders the actual new native screens with React Native Web in a separate disposable harness; it is not a runtime dependency or an added web product. See the [current verification report](docs/FRESH-VERIFICATION.md) for exact results and limits. Dependency advisories remain documented in [security notes](docs/SECURITY.md).

## Structure

- src/features/world/: fresh packages, manifests, deterministic puzzle rules, native illustration primitives, library and player.
- src/features/content/: reusable edition validation, progress/history and review infrastructure.
- src/features/activities/audio/: locale-aware optional narration.
- src/features/family/: profile/store/repositories and offline snapshot compatibility.
- src/features/home/: approved Home art and age-filtered fresh preview cards.
- packages/contracts/ and backend/: shared transport types and owner-scoped Workers/D1/R2 API.
- docs/content-archive/: non-runtime historical fixtures retained only to verify saved records.

Production work remains tracked in [readiness](docs/PRODUCTION-READINESS.md), [Android device QA](docs/ANDROID-DEVICE-QA.md), [architecture](docs/ARCHITECTURE.md) and [backend setup](backend/README.md).
