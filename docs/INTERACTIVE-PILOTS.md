# Visual Learning + Game players — batch 2

Date: 6 October 2026. Branch: `feature/family-app`. This builds on the reader/content foundation, not a new framework or mascot redesign. Status: **internal adult-review implementation; publication and native-device acceptance pending**.

## Delivered scope

Content Lab now has **four activities / eight locale editions**: the prior rhyme/story plus two six-part visual pilots in English and Hindi.

### One for Each Bowl — ages 4–5

- A toy picnic introduction, two-bowl model, three-bowl guided placement, fresh triangular arrangement, three-plate quantity choice and neutral ending.
- Select an unplaced toy fruit, then tap an empty bowl. Tap the selected fruit again or Cancel to deselect; select another unplaced fruit to switch.
- Occupied bowls refuse replacement and explain the problem without losing the selected fruit. No duplicates, hidden auto-placement or silent success.
- Undo reverses only the latest placement. Reset clears the transient board. Model shows one placement at a time; third hint can demonstrate one placement and explicitly labels help.
- Quantity alternatives contain exactly 2 / 4 / 3 equally sized tokens in equal-sized trays. This is not treated as the same evidence as placement.
- End copy describes the displayed model, not an action the learner may never have performed. Instruction and ending adaptations respond to audit F11/F12 and remain editorial drafts.

### Triangle Workshop — ages 6–7

- Explicit boundary model, three finite choice rounds, optional non-scored reasoning and a natural end.
- Upright, truly rotated and scalene examples; oval/circle/four-sided/open/curved-boundary foils.
- One mathematical definition drives drawing and answer checks. Keys are derived from closed paths, exactly three straight sides and non-zero area—not an AI-generated picture label.
- Correct option positions are 1, 3, 2. Options share stroke colour/width and equal control surfaces; no colour-only correct-answer cue.
- Open-three retains a 20-design-unit gap. Curved-three has a genuinely nonlinear quadratic boundary. Ellipses are sampled from their equations, not substituted with rounded rectangles. Curves are approximated with deterministic line segments in native Views; device rasterization still needs visual QA.
- Descriptive accessibility names state boundary properties rather than merely saying “triangle.” This supported form changes the task, so it is not claimed as independent visual assessment.

## Architecture and data boundaries

`interactivePilots.json` holds complete per-locale screen scripts, hints, feedback, use-mode/age/objective, source and pending-review metadata. `interactiveRecipes.json` holds shared exact geometry, option order and quantity counts. `interactiveManifest.json` binds both via SHA-256. Script/recipe changes require deliberate version/hash updates; hash matching does not mean content approval.

The new interactive validator is separate from the unchanged strict reader validator. Shared edition identity/navigation types let both players use the **same existing snapshot v3 ledger** without inventing extra legacy activity IDs or changing the backend API/SQL. No dependency/native-module upgrade or new storage migration in this batch.

Graphical art is code-authored, procedural and **unreviewed**, not a generated/approved illustration pack. No new mascot imagery, recorded audio, song, microphone or cloud service was added. Existing TTS reads final instruction/hint/explanation text on explicit request and follows sound/lifecycle/screen-reader restrictions.

## Honest exploration semantics

- Only explicit “Mark explored & next/finish” persists a part. Correctness, viewing the screen, hints and voice callbacks never advance progress automatically.
- A correct answer is not required to move on. Watching, supported tries and ending early remain allowed.
- G05 is optional. Skipping it records `skippedUnitIds`, not explored/listened. The other five game parts can be marked explored without pretending an independent success.
- Token positions, selections, choice correctness, hint level, model use, retry counts and elapsed time are **transient only**, not saved or sent anywhere. No score or mastery claim.
- Leaving/reopening a part resets its board. Saved part-level continuation survives restart; mid-board restoration is intentionally not implemented. Repeat exploration does not erase previous history.
- Content Lab remains under development demo + adult gate; it is not a recommended child catalog. The demo gate is not verified parent consent or real authorization.

## Regression coverage

Automated checks cover strict package/scene/optional-state validation, content+recipe hashes, true rotation/scalene geometry, curve/open-edge distinctions, unique keys, and every reachable state of the two/three-object placement reducer under selection, placement, cancel, undo, reset and one-step modelling. These are finite pure-domain tests—not native tap automation or proof that children understand the visuals.

Ledger integration restores all eight editions, keeps Hindi/English and reader/game rows separate, refuses required skips and changed same-version hashes, and avoids persisting answer/board data. Actual Node SQLite close/reopen now includes Hindi game optional-skip rows. No Android SQLite instrumentation was run here.

Release-bundle sentinels include both new content IDs and objective. Production publication guards remain intentionally blocked. Main, Cloudflare staging, real auth, native identifiers and owner-local Expo linkage are unchanged.

## Owner tablet acceptance — all pending for this batch

Use the current compatible development APK and Metro. From `C:\Users\Umesh\Kidsuu`, run `npm run qa:start` after pulling `feature/family-app`; no new native module requires a rebuild in this batch. Keep using dummy profiles only.

Open **Grown-ups → Open demo parent controls → Open Content Lab**. Test English and हिन्दी.

1. **Model:** show one placement, then another; check that exactly two bowls each hold one fruit. Undo and reset; no stale or phantom token.
2. **Placement:** choose fruit A, switch to B, cancel, then place B. Try placing a second fruit in the occupied bowl; it must refuse and preserve the selected fruit. Undo restores the right token.
3. **Repeated taps:** rapid fruit/bowl/Next taps must not duplicate fruit, advance multiple parts or publish failed saves.
4. **Fresh arrangement:** compare row versus triangular placement; tokens and targets stay reachable in portrait/landscape. Toy/shape controls use 64+ dp targets; common navigation retains the existing 48+ dp minimum; verify actual touch behavior and layout on the intended tablet.
5. **Quantity:** visually count all trays; distinguish plates from trays. Check each feedback branch. Read-out/described access reveals quantity by design and must not be treated as independent visual evidence.
6. **Triangle:** verify sharp corners, uniform stroke, a clearly visible gap and genuinely curved foil. Rotated and scalene triangles must be accepted, open/curved/four-sided shapes must explain their feature. No timer/penalty or automatic next round.
7. **Hints/model:** each challenge has three bounded hints. Third hint shows a labelled model. Shape/quantity models do not select an answer for the user; placement help demonstrates one placement and is explicitly labelled and undoable.
8. **Optional reason:** skip G05 and finish. Lab shows five explored plus one optional skipped, never six explored. Repeat the skipped part and explicitly mark explored; remove its skipped status without altering another edition.
9. **Audio/lifecycle:** play instruction or explanation; changing board/help/part stops existing speech. Test Stop, sound off, unavailable Hindi voice, TalkBack, background/foreground, route exit and parent timeout. No autoplay/overlap.
10. **Accessibility:** font scaling, Devanagari shaping, focus order, selected/disabled states, announcements and descriptive labels. Test with an adult using TalkBack; current implementation is not a completed accessibility audit.
11. **Restart:** partially arrange fruit, exit/reopen; the current part starts with a clean board. Previously marked parts remain recorded. Force-close/reopen with Metro and check the same. Not a standalone offline-cold-start certification.
12. **Performance:** measure low-end-tablet responsiveness while rendering sampled curves, font scaling and rapid input. No performance target is certified by JS export or reducer tests.

## Still required before production

Qualified maths/early-years review, native-language read-through/voice quality, actual device/UI/end-to-end checks and editorial approval of script adaptations. The source audit's full safety, rights, privacy and effectiveness caveats remain applicable. Larger curriculum, reviewed illustration/audio library, production review schema/catalog, live edition API/cloud sync, encrypted real-account isolation and deferred real auth remain open. Sixteen high dependency advisories require remediation/risk review; no forced package upgrades were made.

## Verification record

- `npm run check`: TypeScript, zero-warning lint, formatting, **160 tests in 17 files**, 74 unchanged PNG references and eight package/recipe hash checks.
- Android development JS export includes both interactive players/recipes. Android/iOS release JS exports exclude their draft IDs/objectives and retain fail-closed authentication.
- Public content release command deliberately refuses these unapproved drafts.
- This is not a native APK build, native tap/accessibility test, performance benchmark, independent content review or learning-outcome validation. Windows/remote CI results for this batch have not been observed here.
