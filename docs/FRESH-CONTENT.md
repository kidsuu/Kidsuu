# Fresh Worlds — rebuild from scratch

Date: 9 October 2026. Base: main commit 357ec01efe4a2b9f327eda7d30a528dd55403292. All fresh editions are original editorial drafts for internal adult review.

## Replacement boundary

The owner expanded the rebuild to all Games, Learning, Stories and Rhymes. Old PracticeScreen/ReadingScreen, text practice/readings, the One-Each Bowl/Triangle Workshop players, Dry Bench story, Up/Down rhyme, old reader scenes, old pilot JSON and their generated PNGs have been removed from playable app source. Home and the parent content lab now route to the new library. Approved brand, boy/puppy, auth/family infrastructure and historical records remain reusable infrastructure.

A small copy of old package JSON remains under docs/content-archive/removed-2026-10-09 exclusively as a test fixture. No app imports it. Legacy bookmarks are tolerated by storage; the active catalog exposes only new items. Edition history shows removed content as saved-only and has no reopen action for it. No remote storage purge or live data deletion has been performed.

## Fresh experiences

- Pattern Trail (4–5): six AB, AAB, ABB and ABC pattern trails; complete every missing position by tap placement or optional drag. Correctness is derived from the repeating unit. Labels convey shape/object names as well as colour.
- River Builders (6–7): six river gaps of 4–9 units. Two distinct inventory planks must sum to the gap; a physical piece cannot be duplicated. Unit marks and equation support inspection. Undo and removal let the child revise an idea.
- Lantern Grove (8–9): five authored 3×3 puzzles. Touching a lantern toggles itself and orthogonal neighbours, without diagonals or wrapping. Hints solve the current board using a bounded breadth-first search; undo restores a prior state.
- Hello, Little Seed (shared 2–3): four manual scenes introduce soil, water, sunlight and time. An accompanying adult can read and talk; no child quiz.
- Pocket Garden (4–5): five rounds, one seed in each pot, then choose the corresponding quantity. Later-growth art is explicitly imagined many days later.
- The Little Seed’s Journey (4–5): six manually paced original pages, from a seed under a leaf through rain, patience and a shoot. Discussion appears only at the end and is optional.
- Tip, Tap, Rain (shared 2–3): four original spoken verses, optional third repeat and an explicit calm ending. A tap changes the pictured raindrop/ripple; no autoplay or claim of recorded singing.

Every concept has en-IN and hi-IN packages. Age targets are explicit: this is a seven-concept first batch, not four categories fully populated for every age band. Home filters by the selected age; the adult library allows review of the whole batch.

## Native behavior

The player supports manual Previous/Next/Finish, hints, reset, replay, optional-repeat skipping, parent notes and edition history. Correctness feedback stays local to the puzzle. Advancing intentionally records exploration even if the puzzle is unsolved; storage never labels that as mastery. No timer, score, streak or automatic next activity is introduced.

A stable edition key includes content ID, age, locale and version. Stored records include the script hash and unit IDs; English and Hindi never share completion. Profile switching also isolates records. A changed hash fails closed until its version is managed correctly. Saves are guarded against reentry and failures do not advance. Historical snapshot migration and SQLite behavior remain tested.

All important actions have labelled buttons and optional tap routes. Text accompanies native illustrations. Reduce Motion suppresses optional springs/tap animation; unmount cancels animation. Narration uses the existing cancellation-aware locale adapter and stops during interaction/navigation/background. Device voice availability and offline audio quality need native testing.

## Delivery and review

No runtime dependencies were added. Packages and the generated environment image have SHA-256 provenance; exact-key parsers and integrity checks reject unsupported editions/approvals. Both locales are drafts with empty review lists; the release command rejects them deliberately. Standard release-bundle checks verify no fresh objective/title/parser sentinel, draft image bytes or demo login fixture appears in Android/iOS exports.

The preview APK workflow includes the fresh player in its explicit temporary demo opt-in. It has not been run or represented as a compiled APK by this batch. Staging sync selects fresh package paths and current source PNGs, but no Cloudflare upload/deployment/purge has occurred.

## Review on a real device

Use fictitious family details. Check 320px phones, portrait/landscape tablets, large font size, TalkBack/VoiceOver labels, drag interruption, tap alternatives, foreground/background relocking, Reduce Motion, native Hindi/English voices, offline cold launch, failed save and repeated taps. Review all scripts with a qualified educator and native Hindi reviewer, inspect original-art rights and generated environmental imagery, then record real approvals before changing publication status.

Browser preview checks are a supplemental check of the same native screen source, not a substitute for these cases. It uses a disposable localStorage repository and a browser speech adapter. No physical-device case is marked passed.
