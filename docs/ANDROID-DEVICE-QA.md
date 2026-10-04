# Android tablet: first development build and observed QA

## Status

Owner selected an Android tablet, confirmed a computer is available, and approved application ID **`com.kidsuu.app`**. No Expo account/build is available yet. Tablet model/Android version are still to be recorded. This repository now contains a development-only EAS build profile and launcher command. **No EAS build has been submitted, APK installed or physical-device test run by the agent.**

Local checks: app tests, Expo dependency compatibility, Android native configuration generation and Metro exports. Native configuration generation is not Gradle compilation, an APK, device performance measurement or store approval.

## 1. Owner setup on the computer

1. Create an account at <https://expo.dev/signup>. Keep the password and tokens private; do not send them in chat. Check current EAS plan/quota/queue limits in your account. No paid plan or purchase is authorized by this guide; stop if payment approval is requested.
2. Install Git/GitHub Desktop and a supported Node 22 version (at least 22.13; use current patched Node 22). Confirm `node --version` and `npm --version`.
3. Use your own GitHub account to clone the private `kidsuu/Kidsuu` repository. In GitHub Desktop, switch to **`feature/family-app`**, fetch/pull, then open a terminal in that checkout. Do not download an old main-branch ZIP.
4. Install and check:

```sh
npm ci
npm run check
npx expo install --check
```

No local Android SDK is required for an EAS cloud build. The optional ADB commands later require Android Platform Tools on your computer.

## 2. Link to YOUR Expo project (once)

```sh
npx eas-cli@latest login
npx eas-cli@latest whoami
npx eas-cli@latest init
```

Choose your own account/organization and create/link the **Kidsuu** project. Do not link an unrelated project. EAS normally writes the non-secret project ID into `app.json` under `extra.eas.projectId` (and may add ownership metadata). Keep those legitimate project-link changes in your checkout; do not replace them with invented IDs. Commit/review non-secret link changes before collaboration. Never commit credentials or signing keys.

No extra `eas build:configure` is necessary: the reviewed `eas.json` already exists. Do not accept tooling suggestions that replace it with a production profile.

## 3. Build the development APK

```sh
npx eas-cli@latest build --platform android --profile development
```

This explicitly builds the Android **debug development client** (`:app:assembleDebug`) for internal distribution, not a Play Store AAB/release. The post-install guard rejects other EAS profiles/platforms while release readiness is incomplete. No iOS identity/profile is configured. Review any Expo/signing/account prompts yourself; do not send credentials to the agent.

When EAS succeeds, open its install link/QR on the tablet and install the APK. Enable “install unknown apps” only for the installer/browser you are using if Android requires it; disable that allowance afterward. Do not disable Play Protect globally. Share a sanitized failed-build error if the build fails, not secrets or a full environment dump.

This debug APK uses the approved `com.kidsuu.app` ID. A future release with another signing key may not install over it. Uninstalling to change signing keys deletes the app's local demo data. Use dummy records only; a separate development package ID would require an explicit product/config decision.

## 4. Start the app on the tablet

Keep the computer and tablet on the same trusted Wi-Fi. In the project folder:

```sh
npm run qa:start
```

The cross-platform script starts Expo **with the development client**, explicitly selects development-only demo mode, and shows the launcher QR/URL. Open the installed Kidsuu client and scan/open that development server. This is NOT the Cloudflare API URL. Keep the terminal running. If the Windows firewall prompts, allow the Node development server only on the trusted private network.

- LAN blocked? A tunnel is an optional fallback: `npm run qa:start -- --tunnel`. Expo may prompt to install its tunnel helper. A tunnel exposes a development endpoint: do not share the URL or run real child data through it. Stop the server after testing.
- With USB debugging and Android Platform Tools: approve only your own computer, run `adb devices`, then `adb reverse tcp:8081 tcp:8081`. `npm run qa:start -- --localhost` can be used for USB transport. Revoke debugging authorization after the session if appropriate.
- Stale JS? Try `npm run qa:start -- --clear`. Do not erase app storage just to clear Metro's cache.
- Missing native module? Ensure this latest APK includes expo-sqlite, expo-speech and expo-dev-client. Updating JavaScript cannot add a native library to an old binary.

## 5. Run one device QA session

Record **model, Android version, RAM if known, app commit, EAS build URL/ID, connection method, font scale, screen-reader setting and date**. Do not share serial numbers, IMEI, notifications or actual child/account data. Turn on Do Not Disturb before screen recordings.

| Case                     | Actions                                                                                                                    | Expected observation                                                                                | Current result |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------- |
| Q01 Launch/UI            | Start app, use demo sign-in, inspect login/Home/parent screens                                                             | Correct static splash, original animated characters; no missing assets or covered controls          | NOT RUN        |
| Q02 Rotation             | Rotate on login with keyboard, Home, profile editor and reader; try split screen if supported                              | No clipping, overlapping controls, lost input or overflow; full motion stage fits                   | NOT RUN        |
| Q03 Touch                | Rapidly tap bookmark, answer/save, profile select; cancel/delete a dummy profile                                           | No double mutation, wrong card opening, cross-profile data or accidental destructive action         | NOT RUN        |
| Q04 Restart restore      | Add two dummy profiles, change settings, save a card, complete two steps; force-stop without signing out; reopen via Metro | Same selected profile/settings/bookmarks/progress; parent gate locked                               | NOT RUN        |
| Q05 Offline local writes | After JS is loaded, disconnect networking; add/edit/save/progress; reconnect as needed to restart JS                       | Local operations work without Cloudflare; saved data remains                                        | NOT RUN        |
| Q06 Narration            | Read aloud/Stop, Next while reading, Back, background/foreground, sound off/on                                             | No overlapping/stale voice; stops on exit/background; no autoplay; text usable when TTS unavailable | NOT RUN        |
| Q07 Accessibility        | Enable TalkBack, large font, Remove Animations; traverse profiles/questions/reader                                         | Meaningful labels/focus, reachable buttons, no competing TTS, reduced motion respected              | NOT RUN        |
| Q08 Deletion             | Delete one dummy profile and reopen; then sign out and reopen                                                              | Deleted profile/progress stay absent; successful sign-out removes saved family                      | NOT RUN        |
| Q09 Lifecycle            | Background with keyboard/reader/parent settings open, return; repeat 10 times                                              | No crash, stale parent unlock or continuing offscreen animation/audio                               | NOT RUN        |
| Q10 Performance triage   | Compare 90 seconds Home animation vs paused; scroll; open/close readers 10 times                                           | Record frame/memory evidence and reproducible stalls, not an invented FPS target                    | NOT RUN        |

### Important offline and performance limits

The current development client fetches development JavaScript from Metro. **A fresh airplane-mode cold launch without Metro is NOT validated by this setup.** Cached dev bundles are not a reliable standalone-offline acceptance criterion. Q04 tests persisted app data after process restart with JS available; Q05 tests local storage without network after JS has loaded. True offline cold-start needs an embedded-bundle, production-like test binary and its own acceptance run. Do not weaken release authentication to make that test pass.

Debug tooling changes performance. Q10 is bug triage, not a production frame-rate/battery benchmark. Native release/profileable performance testing remains a later release gate. TTS may need a downloaded/network voice depending on the device; no offline-audio guarantee is made.

## 6. Return evidence, then verify fixes

For each failed case send:

```text
Case: Q02
Device/model + Android:
Commit + EAS build ID:
Exact steps:
Expected:
Observed:
Frequency (e.g. 3/3):
Evidence: sanitized screenshot / short recording / relevant error lines
```

Do not mark a case passed because it compiled or because a unit test passed. After a fix, update the code/build, repeat the exact reproduction, then rerun the adjacent cases. Keep both before/after observations.

Optional diagnostics from your computer (with authorized USB debugging):

```sh
adb shell dumpsys gfxinfo com.kidsuu.app reset
# Exercise the measured screen for 90 seconds, then:
adb shell dumpsys gfxinfo com.kidsuu.app framestats > kidsuu-gfxinfo.txt
adb shell dumpsys meminfo com.kidsuu.app > kidsuu-memory.txt
```

These are diagnostic signals, not full React Native JS-thread/battery analysis. Use Android Studio/Perfetto when needed. Record screen/animation state and capture duration alongside numbers.

For app-only logs in Windows PowerShell while Kidsuu is running:

```powershell
$appProcessId = (adb shell pidof -s com.kidsuu.app).Trim()
adb logcat --pid=$appProcessId -d > kidsuu-logcat.txt
```

Review/redact logs before sharing. Do not share a whole-device bugreport or unrelated app logs by default. Keep raw logs outside the repository; do not upload dummy SQLite files unnecessarily.

## Official references

- <https://docs.expo.dev/develop/development-builds/introduction/>
- <https://docs.expo.dev/develop/development-builds/use-development-builds/>
- <https://docs.expo.dev/build/setup/>
