# Story and rhyme readers

## What is implemented

All eight existing catalog entries now open working samples: four question-based practice activities and four readers. The readers cover `moon`, `bear`, `clap` and `rainbow` across age bands 2–3, 4–5, 6–7 and 8–9: **16 original editorial drafts, 80 pages/verses**. Titles match the existing catalog. The youngest stories are shorter read-together pieces; older editions include inference, problem-solving and creative language prompts. Content still needs educator/editor review; these are not validated learning outcomes or a complete curriculum.

New reader screens reuse the existing story/rhyme category artwork and cream/clay styling. No original characters or choreography were replaced. Text scrolls and scales; buttons wrap and have 48+ dp minimum height. Actual native layout, font scaling and reading order still require device testing.

## Completion semantics

- Opening a reader, playing/stopping its voice, or receiving an audio-finished callback does **not** record progress.
- Only “Mark page/verse explored & next” / “Finish story/rhyme” writes a checkpoint.
- Writes keep the existing total of five and use FamilyStore's single-flight/no-automatic-retry behavior. A failed save keeps the current page.
- Previous page and replay never erase completed progress. Reopening an unfinished reader resumes at its first unexplored page; a completed reader restarts for replay.
- Completion is navigation reported by the client, not verified reading, listening, comprehension or elapsed minutes.
- Progress remains per activity ID, not per age edition. Changing a profile's age does not reset that activity's existing completion ledger. A future edition-aware curriculum requires a reviewed schema/product change.
- Demo progress now restores from device-local SQLite after restart and is erased on sign-out/deletion. Cloud authentication/sync remain deferred; see OFFLINE-STORAGE.md.

## Device read-aloud, not songs

`expo-speech ~57.0.3` was selected by Expo SDK 57's compatibility installer. It uses the OS-configured text-to-speech engine. There are no bundled audio tracks, recorded narration, generated singing, background music or microphone capture. Rhymes are **spoken**, not sung.

Read-aloud is optional and never autoplays. It follows the parent's sound preference. The UI deliberately exposes **Stop** and **Read aloud from the beginning**, not a fake cross-platform mid-sentence pause/resume (Android TTS pause support differs).

One shared narration coordinator serializes native stop/start operations and invalidates stale callbacks. It cancels on page change, completion, screen exit/unmount, app background/inactivity and sound disabling. Returning to the foreground does not resume audio without another tap. Screen-reader detection disables the extra narrator to avoid competing with TalkBack/VoiceOver; detection failure also keeps it disabled.

Only the fixed editorial page text is passed to TTS—never a child nickname, phone number, account data, token or progress. The OS/selected TTS engine controls voice availability, downloads, network processing, routing and language support. **Fully offline audio and “all processing stays on-device” are not promised.** Text is bundled and readable without audio or network. On some iOS devices silent mode may suppress TTS; confirm volume, voice configuration and behavior on target devices.

A custom development client built before adding expo-speech must be rebuilt. Use a matching Expo Go version only if it includes the SDK's native speech module. No APK is produced just by installing this package or exporting JavaScript.

## Verification and limits

Automated tests cover every title/age/page, catalog route coverage, resume bounds, explicit monotonic progress, save failure, native start/stop ordering, rapid replacement, background cancellation, stale callbacks, engine errors, disposal and oversized text. These are pure-domain/mock-native tests, not proof of audible output.

Real-device tests remain required for voices, silent mode, OS interruptions/phone calls, Bluetooth/headphones, TalkBack/VoiceOver, large text, rotations, background/foreground and startup after native-module upgrade. See TABLET-QA.md. Release still blocks on identity, privacy/content review, real-account encryption/backup/sync policy, remaining dependency findings and device QA.
