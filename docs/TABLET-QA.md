# Tablet QA and Android build handoff

**Status: NOT RUN on a physical device/emulator.** Automated store/geometry tests and Metro exports are not device evidence. Do not mark rows passed without observations.

## Build prerequisites (owner decisions)

- Confirm Android application ID (for example `com.kidsuu.app`, only if owner approves), signing owner and whether to use local builds or the owner's Expo/EAS project.
- This workspace has Java, but no configured Android SDK/adb or attached tablet. No APK/AAB is built.
- For immediate SDK-compatible testing, use Expo Go in development with `.env.example` demo opt-in. Otherwise an owner-linked development build is required. Never enable demo authentication in a release APK just to bypass this requirement.
- EAS linking/signing/remote builds require owner authorization; do not paste signing keys or Expo tokens into chat. Release build stays blocked until release requirements are completed.

## Record for each test session

Device/model/OS, RAM, app commit, client/build version, orientation/window size, font scale, screen reader, Reduce Motion, network, tester and date. Use fictitious names only. Store no child data or credentials in screenshots/logs.

| Test                    | Acceptance                                                                                                         | Result  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | ------- |
| Launch/splash/login     | Static repaired splash, full-body login animation, no missing cutouts or keyboard obstruction                      | Not run |
| Rotate and split-screen | No clipped motion stage, hidden save/delete buttons or horizontal overflow                                         | Not run |
| Profiles                | Five-profile cap, unicode nickname, validation, edit/cancel/delete confirmation, empty family recovery             | Not run |
| Profile isolation       | Progress/bookmarks never appear on another profile; rapid switch has no stale flash                                | Not run |
| Parent controls         | Honest demo label; close on background/Back; relock after five minutes; cancelled delete does nothing              | Not run |
| Progress                | Correct answer saves before advancing; replay is monotonic; opening unavailable content records nothing            | Not run |
| Font scaling            | Largest supported text setting keeps buttons and forms reachable                                                   | Not run |
| Screen reader           | Button labels/state, answer feedback, error announcements, reading order and modal focus sensible                  | Not run |
| Touch                   | Minimum 48 dp controls, no overlapping targets, no accidental card open on save-heart tap                          | Not run |
| Reduced motion          | Character animation respects OS preference and pause, including changes while running                              | Not run |
| App lifecycle           | Motion pauses offscreen/background; parent gate relocks; no stale write shown after sign-out                       | Not run |
| Offline/failure         | Demo remains memory-only; future live adapter timeout/conflict/401/429 must be exercised on-device                 | Not run |
| Performance             | Measure frame timing, peak memory and battery on low-end target device; compare animated/paused/home/parent routes | Not run |

Use Android Studio Profiler / native performance tooling for measured results. Choose performance targets against real target hardware; do not invent FPS numbers from unit tests.
