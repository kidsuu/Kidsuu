# Content platform — implementation batch 1

Date: 5 October 2026. Branch: `feature/family-app`. Status: **tested internal authoring/reader foundation, not production approval**. Real auth remains deferred by the owner. Main/staging are not changed by this batch.

**Follow-up:** batch 2 implements the visual Learning/Game pilots; current lab total is eight locale editions. See [INTERACTIVE-PILOTS.md](INTERACTIVE-PILOTS.md). The historical batch-1 scope and verification below remain identified as such.

## Implemented

- An exact-key, bounded runtime reader-package validator: one objective, age band, locale, use mode, 1–24 parts, optional parts, parent note and optional end discussion. English/Hindi are explicit editions. Toddler drafts require caregiver-shared mode.
- Four fully serialized text draft editions from the supplied research: `up-down-rest` (2–3, four parts, optional R03) and `dry-bench-story` (8–9, six pages), each en-IN/hi-IN. No forced five-part padding. Source scripts remain editorial drafts, not independently educator/native-language reviewed. Titles and concise parent/discussion notes are authoring adaptations.
- SHA-256 script/package hashes and a manifest explicitly declaring illustrations/recorded audio **not generated**, human approval **pending**. `npm run check:content` checks integrity; `npm run check` also runs strict schema/domain tests.
- Adult **Content Lab** in development demo parent controls. It is not on the child Home catalog. Parent lock, app background and five-minute parent/lab timeout close access. The demo gate is not identity/consent verification.
- A variable-length reader: manual previous/next, stop/finish later, optional-repeat skip, replay, end-only conversation, readable Hindi text, flexible tablet-width layout and explicit text-only draft labels. No quiz, audio autoplay, score or inferred listening.
- New local edition ledger: child + content ID + age + language + version, with content hash. Explored IDs and skipped optional IDs are disjoint. Required exploration is not mastery; replay does not erase prior exploration. No cloud request or analytics added.
- Atomic offline snapshot **v3**, migrating defined v1/v2 snapshots without changing existing activity progress, bookmarks, profiles or settings. No legacy five-step records are assigned to a new language/version. Failed migration/save keeps prior committed data.
- Narration requests the edition locale, prefers an exact locale voice, then same-language voice, and fails safely if unavailable. Hindi never silently requests an English voice. Playback still depends on OS engine; offline quality/voice availability is not guaranteed. Cancellation after slow voice lookup is tested. TTS is spoken, not sung.
- Development content is behind a `__DEV__` require boundary. Android/iOS release-bundle sentinel checks exclude both draft IDs and the existing demo/auth fixtures. `check:content-release` deliberately fails; the app-wide `check:release` remains blocked.

## What has NOT been changed or claimed

The approved 2D boy/puppy, login animation, splash and Home design are unchanged. No Flutter/3D migration. No new dependencies or native modules. Owner-local `app.json` Expo project link is not touched.

The existing eight-activity backend contract and its SQL remain unchanged. Legacy activity progress still has its earlier age-edition limitation; the **new** ledger does not fix or relabel that legacy history. Content Lab progress does not enter legacy Home continue cards or activity totals. No live edition-progress API/sync, media cache, download manager, recorded narration or illustrations implemented here.

The two interactive Learning/Game pilots need actual new graphical players (placing/undo and deterministic triangle geometry), not a relabelled text quiz. They were not included in batch 1; the subsequent implementation is documented in INTERACTIVE-PILOTS.md and remains review-gated.

## Test on the owner's tablet

PowerShell: run each command separately, from the real checkout:

```powershell
cd "$HOME\Kidsuu"
git pull --ff-only origin feature/family-app
npm run check
npm run qa:start
```

Keep the legitimate local Expo link in `app.json`. Do not reset/reclone or copy the unrelated home-directory Expo config. This batch changes JavaScript/content only, so an existing compatible SDK 57 client normally does not need a native rebuild.

Open the development client with Metro, sign in to demo, choose a dummy profile, then **Grown-ups → Open demo parent controls → Open Content Lab**.

1. Open English rhyme; mark R01/R02 explored, skip optional R03, finish R04. Lab must show **3 explored, 1 skipped**, not four listened/completed learning tasks.
2. Switch to Hindi from the lab. It starts independently; save one part. Reopen each edition and check independent continuation.
3. Force-close without signing out, reconnect to Metro and reopen. Check persisted progress; parent gate must be locked. This is **not** standalone airplane-mode cold-start acceptance.
4. Open the six-page story. No question interrupts pages; optional discussion appears at the end. Finish later must never force correctness or extra activity.
5. Read aloud in each language. Try missing Hindi voice, sound disabled, TalkBack, Stop, rapid Next, app background, route exit and parent timeout. No overlap or autoplay. Inspect actual pronunciation; do not infer quality from mocks.
6. Rotate portrait/landscape and increase Android font scale. All text/buttons must remain reachable; inspect Devanagari shaping and TalkBack order. No native UI/end-to-end run has been performed in the agent sandbox.
7. Verify another profile has separate ledger, profile age edit preserves old edition history, deleting one profile removes its records only, and sign-out erases all local demo data.

**Downgrade caution:** once migrated, an older v2 app intentionally refuses a v3 snapshot rather than discarding it. Prefer updating forward. Clearing storage/signing out is destructive and must be an explicit owner choice, not troubleshooting default.

## Storage bounds and release policy

The same app-private, plaintext dummy SQLite row is used. Limit remains 65,536 characters; at most 32 edition rows per profile and 24 units per edition. There is no silent eviction. A full/invalid snapshot refuses a save and leaves the previous document. A production library needs a separate scalable authenticated storage design.

Schema 1 represents only draft/withdrawn packages: it cannot fake an `approved` flag or reviewer identity. A later reviewed release schema must add actual review records and asset/rights integrity; editing a label cannot approve these drafts. Changes to content or structure require a new content version, recomputed hash and manifest; a same-version hash/structure mismatch with saved history blocks new writes rather than remapping history. Hashes are integrity checks, not author authentication or signed approval.

## Open editorial issues from the supplied audit

- R01 Hindi movement invitation, R02 English ending/Hindi smile cue, and native spoken rhythm need review; no audible/native certification claimed.
- Story Puppy/पपी is a naming placeholder; settle approved localized naming before art generation or publication.
- Story shelter referent, leaf/boat continuity and Hindi ending need editorial/native read-through.
- Learner observations, learning gains and effectiveness are not inferred from this engineering work. No children were recruited/tested and no real child data collected.

See [the attributed research audit](research/RESEARCH-AUDIT.md). It is a second-pass AI desk-audit, not an independent source/legal/educator attestation.

## Verification recorded for this batch

- Full `npm run check`: TypeScript, zero-warning lint, formatting, **135 tests across 15 files**, 74 unchanged PNG references, four content hash/manifest checks.
- Node SQLite file close/reopen verifies Hindi edition exploration/skip persistence alongside old activity records; this is not Android SQLite instrumentation.
- Android development JS export includes the draft route/packages; Android and iOS release JS exports exclude them and retain fail-closed auth.
- `check:content-release` and app-wide `check:release` refuse release as expected.
- No dependency changes; install audit still reports **16 high** findings. No forced upgrades. Backend/main/staging and owner Expo metadata unchanged.
- Physical-device UI, audible Hindi/English quality, actual APK build, Windows checks/remote CI for this new batch remain unverified here.

## Next engineering batches

1. Visual player implementation delivered in batch 2 (INTERACTIVE-PILOTS.md); adult/device/educator review still pending. Keep drafts adult-only.
2. Reviewed script corrections and consistent approved-reference illustrations, scene manifests, native-language voice QA; generate assets only from stable briefs, without assuming commercial rights or human approval.
3. Approved catalog + production content/review schema; live edition API/migration/history strategy; actual media storage/cache and privacy review.
4. Native device/end-to-end regression, standalone offline build, accessibility/performance testing, remaining dependency security remediation/risk assessment.
5. Deferred real auth/guardian verification, encrypted account isolation and release pipeline before public launch.

Automated checks and JS exports are engineering evidence only. They are not APK delivery, physical-device acceptance, educator approval or production certification.
