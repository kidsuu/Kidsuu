# Parent edition history — batch 4

6 October 2026. **Development-only adult review; not learning assessment or publication approval.** The owner authorized verified batches to be pushed to `main`. Previously completed family/content batches were fast-forwarded to main at `f08a4ec`; this follow-up is also delivered on main. Cloudflare deployment remains a separate manual action.

## What changed

Go to **Grown-ups → Open demo parent controls → Open Content Lab · drafts & history → View edition history**. Choose English/Hindi in the lab before entering to change this view's interface language. Edition-language filters inside the view do not change interface language.

- Read-only, selected-profile history for all four Content Lab kinds: story, spoken rhyme, learning and game. Eight current locale editions remain; no new content or approval is created.
- Filter by edition language, edition age band, or saved records only. Defaults show all; empty filter results explain that records are retained. Current profile age is shown separately, never used to rewrite or hide older records.
- Required parts marked explored, optional parts explored and optional skips are separate. Unit details show stored IDs, required/optional status and explicit actions. No percentage, mastery score, ability inference, ranking, answer data or listening-time claim.
- An unstarted edition has no invented save timestamp. Existing timestamps are labelled UTC/device clock, not verified activity duration. A saved record with no actions does not imply exploration.
- Reader v1 records remain separate from v2. Saved-only/unavailable editions use their stored identity, not a guessed title/kind from a newer catalog. The old content is not reintroduced into the player.
- Same-version hash/unit-structure changes retain the original saved counts, display a warning and disallow opening. Withdrawn editions also cannot open. Only an exact current draft identity/hash/structure can open for review, subject to the existing parent/demo/development boundary.
- History browsing, filtering, expanding units and resolving a draft do not mutate the ledger. There is no reset/delete/export/share action in this view. It does not import archived JSON, network media or a new cloud client.
- Home's existing activity totals now explicitly say they are separate from Content Lab records. Existing backend/legacy activity history is not migrated or combined.

## Access, storage and rendering

The history view lives within the existing Content Lab parent route, so entering it does not restart the five-minute parent timeout. Background/parent-lock behavior remains in the route; foreground, demo, development, selected profile and unlocked-parent checks also guard rendering. Content Lab is keyed by selected profile to avoid carrying another profile's local page/filter state across a profile change. Opening a history item rechecks the latest store state; pending load/save/error, changed selection or parent lock prevents opening.

Loading/error/invalid-history states do not display stale records or silently repair data. Invalid selected-profile rows fail closed; a reload action is offered without erasing storage. The projection does not inspect another child's rows. Normal storage/schema validation still applies before this UI is reached.

Snapshot v3, 32 rows per child, 65,536-character document bound and atomic save/failure/delete/sign-out semantics are unchanged. Up to 32 retained rows plus eight unstarted current editions can be visible; there is no automatic eviction. The displayed `saved / 32` count is not a guarantee of remaining byte capacity. Production-scale authenticated storage remains separate work.

Filters use the shared wrapping button layout and scrollable panel, with visible selection states, live result-count text and readable per-unit labels. There are no charts, color-only meanings, timers or forced answers. Native layout, TalkBack, font scale and Hindi quality still require actual review.

## Engineering checks

- **186 tests across 19 files**, including 16 new history tests: current/unstarted states, empty saved record, child/locale/age/version isolation, unknown and withdrawn editions, hash/structure mismatch, exact/stale open identity, filters, input immutability, invalid/duplicate/oversized rows, full 32-row retention and no invented outcome fields.
- Durable integration test: browse/filter/resolve leaves persisted bytes and write count unchanged; restart retains v1/v2 history and relocks the parent gate. This is not Android UI instrumentation.
- Existing 83 PNG and eight current content/scene/recipe integrity checks remain unchanged.
- Android development JS export includes history labels and all nine reader image hashes. Android/iOS release exports exclude the history screen/projection sentinels, draft content and image bytes, and retain fail-closed auth.
- Public-content and app-release checks still intentionally refuse release. No APK/IPA build, device acceptance, remote GitHub Actions result, content/language/rights approval or automatic Cloudflare deployment is claimed.
- No new dependencies, native modules, permissions or auth/SMS integration. Dependency advisories remain unresolved; the install still reports 16 high findings.

## Tablet acceptance — all NOT RUN

| Case | Expected result to verify on the real tablet                                                                                                                                                                                          |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H01  | Fresh dummy profile: eight current editions, no saved actions/timestamps. Open/back/filter must not add progress.                                                                                                                     |
| H02  | English rhyme R01/R02/R04 explored, optional R03 skipped: required 3/3, optional explored 0, optional skips 1; not four learned/listened parts. Explore R03 later: optional explored 1, skips 0.                                      |
| H03  | Switch to Hindi and another profile; only exact-profile records appear. Return to original profile with no change to saved data.                                                                                                      |
| H04  | Retain reader v1 data before update. History shows v1 saved-only plus v2 separately; opening v1 unavailable. Do not clear data to achieve the expected result.                                                                        |
| H05  | Filter language/age/saved status, reach an empty result and clear filters. All records return; changing profile age preserves old edition-age labels.                                                                                 |
| H06  | Open a current history card; correct locale/version resumes. Replaying required-explored content makes no new progress until an explicit action.                                                                                      |
| H07  | Background, parent timeout and route exit from history. Re-entry requires the existing gate; no saved record or UI selection leaks across profiles.                                                                                   |
| H08  | Rotate, enlarge fonts and enable TalkBack. Filters, result count, titles, unit rows and selected states remain understandable and reachable in both interface languages.                                                              |
| H09  | In a controlled developer fixture only: changed hash/structure, withdrawn content, invalid record and failed reload show truthful retained/error states and never open mismatched content. Do not weaken the committed schema guards. |
| H10  | With JS available, restart/offline-read retained history. Confirm no network dependency or extra write from filters. A Metro client still does not prove standalone airplane-mode cold launch.                                        |
| H11  | Existing profile deletion/sign-out removes the relevant records; history has no separate stale cache. Check low-end tablet responsiveness with 32 saved records and expanded unit details.                                            |

Record device/model, Android version, commit/build ID, steps and actual evidence. Automated checks and JS exports cannot fill these cases with PASS.

## Pull current main safely

```powershell
cd "$HOME\Kidsuu"
git fetch origin
git switch main
git pull --ff-only origin main
npm ci
npm run check
npm run qa:start
```

If Git reports local changes/conflicts, stop and preserve them; do not reset/force checkout or erase app data. Keep the owner's legitimate Expo link/configuration. Source delivery on main is not permission to bypass draft/release guards.
