# Family preview: auth deferred by the owner

## Implemented in this branch

Native profile picker, parent profile editor (nickname/age band/avatar, maximum five), versioned settings, confirmed profile/family deletion, per-child saved IDs and learning progress. The original full-body 2D motion/splash/login artwork is untouched. New screens use responsive wrapped cards, scrolling, 48+ dp buttons, accessible labels and live status messages. Actual device/a11y inspection remains necessary.

Four original text-based sample activities cover colours/words, counting/arithmetic, shapes/patterns and matching. Each activity has five checkpoints across age bands so the backend's fixed-total rule remains consistent. Completed answers advance progress only after the repository accepts the write. Replaying does not reduce progress. No fabricated time tracking, scores or educational mastery claims.

These are **samples**, not a full ages 2–9 curriculum. Some prompts require a grown-up to read. Rhymes/stories now open 16 age-wise original editorial drafts (80 pages/verses), with optional OS-device read-aloud and explicit explored-page checkpoints. No recorded songs or generated singing is included. See READERS.md.

## Run and try

1. Node 22.13+, `npm ci`, copy `.env.example` to `.env`, `npm start`.
2. Use an SDK-57-compatible Expo Go client or a development build. Sign in in demo mode.
3. Grown-ups → Open demo parent controls. Add profiles, edit ages, change settings, confirm deletes.
4. Exit parent controls. Switch profiles, answer sample practice questions, inspect My progress and the continue card; save activities per child.
5. Background/foreground the app: parent controls close/relock. Reopen after five minutes: gate required again.
6. Sign out/restart: demo family data is erased. Never enter real child information.

## Honest storage and auth boundaries

- **Memory only**, not AsyncStorage, D1 sync or durable offline persistence. Reloaded/restarted app and signed-out sessions start fresh. Bookmark IDs are also session-only.
- Demo repository never calls `fetch` or stores credentials. Release bundle sentinels ensure it is excluded.
- `FamilyRepository` matches the existing typed HTTP API client. `createFamilySession` accepts future `getAccessToken` and `reauthenticateParent` functions. No live adapter is supplied today.
- API errors never switch the user into demo mode. Server ownership/JWT/reauth checks remain unchanged.
- UI parent confirmation is deliberately labelled as demo, **not a PIN, identity check, adult verification or legal consent**. Background/exit/five-minute relock is a preview UX precaution, not a replacement for server authorization.
- Store serializes mutations, suppresses duplicate taps, handles version conflicts, clears old profile progress before selection and rejects late async responses. No offline write queue, silent retries or saved-success claim on network failure.
- Settings persist in the demo session. Sound preference controls optional reader narration; daily goal is not an enforced limit.

## Still needed before calling “everything except auth” complete

- Full reviewed curriculum and any recorded music/media. Text readers and device narration lifecycle are implemented, but not yet verified on physical hardware.
- Product decision on durable offline storage, encryption, retention, sync/conflict policy and bookmarks backend support.
- Actual tablet rotation/font-scale/TalkBack/VoiceOver/touch/performance testing; see TABLET-QA.md.
- Android package ID and build/signing ownership confirmed by owner; native SDK/build access.
- Remaining 16 high dependency findings mitigated or formally reviewed; native-build validation of scoped UUID override.

No APK is claimed by JS bundle export. Production guard remains intentionally red.
