# Illustrated readers — batch 3

6 October 2026 · `feature/family-app` · **Internal adult-review drafts, not publication approval.**

## Implemented scope

The four English/Hindi reader editions are now **content version 2**, with the same four rhyme units and six story pages. The two interactive packages remain version 1; there are still **eight current locale editions**, not twelve. Text-only v1 scripts/manifests are preserved under `docs/content-archive/` for compatibility and regression tests, not offered in the current catalog.

- Six object-focused story scenes: paper/line/leaf; rain and curled corner; wet versus dry bench; paper on dry wood; leaf beside line; added sail. These are not falsely labelled pictures of the boy/Puppy performing every narrated action.
- Two still rhyme pictures: **Up** and **Down / Rest**. Down and rest deliberately share one picture. There is no separate lowering frame, animation, autoplay, motion tracking or singing. R01/R04 show rest; R02/R03 allow manual selection.
- Original boy/Puppy reference shown separately as **Story friends**, explicitly not an action scene. Original puppy cutout is reused in the rhyme, in one unchanged pose. The login/Home choreography, splash and character rigs are untouched.
- A native `Image` player with manifest aspect ratio and `contain`, no cropping/stretching, visible localized descriptions, missing-image fallback, and 48+ dp shared buttons. Images are hidden from accessibility so the visible description is the single screen-reader equivalent. Native traversal and sizing still need device QA.
- Switching a picture cancels pending/current narration before changing state. It never writes exploration. Changing pages remounts the scene at its initial frame. Existing sound/TalkBack/lifecycle/parent-lock narration guards remain in place. TTS speaks the page, not the image description; a screen reader can read the description.
- No new dependency, permission, backend API, schema-storage migration or native module. All images are local bundled PNGs in the adult development lab; there is no remote-media fetch/download manager.

## Integrity and version boundaries

Schema 1 now recognizes an explicit `illustrated-preview` branch: every page must have one or two exact-key frame records and the package must carry `scenePackHash`. The existing strict text-only branch still accepts archived v1; mixed/unknown fields fail closed. Older apps need updating to understand the new branch.

Package hashes cover frame labels/descriptions/asset IDs and the scene-pack hash. The scene manifest covers PNG SHA-256, dimensions, byte lengths, source identities and the composition-script hash. Catalog validation rejects unknown assets and use of the cast reference as a page-action picture. Build checks ensure exactly the registered files exist, verify PNG headers and enforce **1,500,000 bytes/image, 8 MiB/pack**. Actual nine-file pack: **5.19 MiB**; total referenced app PNGs: **83 / 8.28 MiB**. These are compressed storage sizes, not native decoded-memory measurements.

Hashes use SHA-256 over `JSON.stringify` payloads (preserving key order), not signed publication authorization. A content or asset change needs a new version/hash/manifest; never relabel saved progress. v1 and v2 ledger keys remain separate. Frame selection, image IDs and descriptions are not stored in the ledger. Snapshot v3, 32 edition rows/child, atomic failures, explicit deletion/sign-out and separate legacy activity records are unchanged. Old history is retained, not silently migrated or evicted.

The manifest and validator can represent **pending** human/rights review only. Changing an approval label is not a supported publishing route. Development scene fixtures and their actual PNG byte hashes are checked for exclusion from Android/iOS release exports. The general frame schema is separate from draft-pack-specific validation, preventing the latter from entering release through the shared package parser.

## Artwork provenance and limitations

See [the scene manifest](../src/features/content/data/demo/scenePack.json) for full source/output SHA-256 hashes and output dimensions; see [asset provenance](READER-ART-PROVENANCE.md) for dimensions, source briefs and composition steps.

AI full-character scenes and their correction attempts drifted from the approved reference and were **rejected**, not bundled. Generation was limited to prop/background sources. Final rhyme characters use crop/alpha composition, never a generative redraw. Cast reference is copied byte-for-byte. No 3D model/pipeline was introduced. Rendered shading does not authorize a character redesign.

The agent viewed all eight final scenes and checked their broad narrative alignment; this is an **AI desk check**, not owner, illustrator, educator, native-language, safety or rights sign-off. Open review items include the small procedural paper corner/sail at actual tablet size, stylistic transition between close-up and bench scenes, rain intensity, Hindi wording/Puppy naming, cloth demonstration and visual hierarchy. Story pictures intentionally omit actors; decide with the editor whether full action scenes are needed later, without replacing the approved characters.

No commercial-use clearance, pedagogy/learning gains, child testing, audible pronunciation quality or production readiness is inferred.

## Verify and review on the tablet

From the existing Windows checkout (preserve owner Expo linking):

```powershell
cd "$HOME\Kidsuu"
git pull --ff-only origin feature/family-app
npm run check
npm run qa:start
```

Development demo → dummy profile → **Grown-ups → Open demo parent controls → Open Content Lab**. This is not the Home child-content catalog. Existing SDK 57-compatible development client can load the JavaScript/assets through Metro; no new native module is required.

All cases below are **NOT RUN on a physical device**. Record tablet model/Android version, commit/build ID, steps, screenshot/recording and observed result; never fill PASS from a JS export.

| Case | Action and expected evidence                                                                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V01  | Open both story locales. Exactly six scenes; wet left/dry wall-side end, leaf, wave and small sail visible; no boat floating in water or replacement mascot.                                                     |
| V02  | Open both rhyme locales. R01/R04 rest; R02/R03 two buttons. Down/rest use the same still picture; no automatic changes or forced movement.                                                                       |
| V03  | Start TTS, rapidly switch up/rest and exit/background/parent lock. Pending speech must not start later; current speech stops audibly; no autoplay on return.                                                     |
| V04  | Rotate each aspect ratio (960×411 and 960×644); increase font scale. Whole picture remains contained and all text/buttons are scroll-reachable. Confirm no stretched image or clipped puppy.                     |
| V05  | Enable TalkBack. Confirm one image description, Hindi language handling, selected/disabled button states and understandable focus order; extra TTS remains disabled.                                             |
| V06  | Review pictures without marking pages. Ledger must not change. Mark/skip deliberately; optional R03 remains separate; another locale/profile starts independently.                                               |
| V07  | Upgrade a dummy profile with saved reader v1 history. v2 starts separately; restart preserves both. Do not clear storage or fabricate v2 completion from v1.                                                     |
| V08  | With JS loaded, disconnect network and navigate all scenes. Images/text remain local. True airplane-mode cold launch still requires an embedded-bundle test binary.                                              |
| V09  | In a local QA build, deliberately fail a picture load; verify visible description/text/navigation remain usable. Do not ship damaged assets or weaken integrity checks for this test.                            |
| V10  | Open/close readers and alternate scenes ten times on target low-end tablet. Capture memory/jank/loading behavior; 5.19 MiB compressed assets are not proof of acceptable decoded-memory/performance.             |
| V11  | Have qualified reviewers inspect source rights, exact reference identity, page/alt-text alignment, small clue legibility, safety and both languages. Record actual approvals separately; all remain pending now. |

## Engineering evidence

- Full automated suite: **170 tests / 18 files**, including nine new scene/schema/integrity tests and durable v1/v2 isolation/failure/restart/sign-out regression. These are not native rendered-component or end-to-end tests.
- Deterministic composition rerun against retained sources reproduced all nine output SHA-256 hashes.
- Static asset check: 83 referenced PNGs, no missing/unused PNGs. Content check: eight current package hashes, scene bytes/registry/recipe and procedural geometry.
- Android development JS export includes all nine scene/reference PNG byte hashes. Android/iOS release JS exports exclude draft IDs, draft-specific scene-pack identifiers and all nine PNG hashes; fail-closed auth remains.
- `check:content-release` deliberately refuses publication. App-wide release approval remains blocked. No main merge, deployment, APK/IPA build, remote-CI result or new physical-device acceptance is implied.
- Dependency audit is not clean: the install still reports 16 high findings. Real auth/SMS remain deferred. No forced dependency upgrades.
