# Device-local family demo: save and restore

## Scope

The explicitly opted-in **development demo** now saves one fictitious family household per app installation in SQLite (`expo-sqlite`). It is not linked to a verified parent identity, not encrypted by this app, not cloud sync, and not production child-data storage. Use only dummy nicknames/data until identity, encryption/backup/retention and privacy requirements are resolved.

The database is in the app's private SQLite directory, named `kidsuu-demo-offline.db`. Do not commit the database or export real user data. Release composition still fails closed; both the demo repository and its file/key sentinels are checked to be absent from production JavaScript bundles.

## What survives restart

- Child profiles, age bands, avatar selections and optimistic versions.
- Parent sound preference and daily goal.
- Every child's activity progress, including unfinished story/practice checkpoints.
- Per-child saved activity IDs and the last selected profile.

Auth credentials/OTP, login session, tokens, parent-unlock flags, in-flight operations, temporary errors and navigation state are **not** saved. After restarting, the approved intro/sign-in flow still appears. Enter the development demo again to restore the family; no automatic login was added. Existing pre-upgrade memory-only sessions cannot be recovered once lost.

App reload, background, screen exit and process restart do not erase the family. Sign-out deliberately erases it. Uninstalling the app, clearing OS app storage, using a different installation or changing the application ID may lose the data; this is not a backup service.

## Commit and restore design

`DemoFamilyRepository` remains a pure in-memory domain engine. The offline wrapper constructs a cloned candidate for each mutation, validates it, commits one serialized SQLite row, and only then publishes success to FamilyStore. A failed commit leaves the last committed snapshot and visible successful state unchanged. No cloud fetch, background synchronization or automatic mutation replay is involved.

A per-repository promise queue serializes reads and writes in the single foreground app session. SQLite uses a parameterized single-statement UPSERT with `synchronous=FULL` and rollback-journal mode; the document cannot be half replaced by that statement. `secure_delete=ON` reduces deleted-cell residue but is **not** a forensic wipe guarantee. Independent concurrent app instances writing this database are not supported; future multi-account/background-sync work requires explicit concurrency/version design.

Startup loads and validates data before enabling family screens. Read/open errors show Retry instead of seeding a replacement. Corrupt payloads and unknown/newer schema versions remain unchanged and show recovery controls. An explicit destructive confirmation can erase local data and return to sign-in; this is not a silent reset. If the database file itself cannot be opened/erased, recovery reports failure; OS-level clear-app-storage/reinstallation is a last-resort destructive action, not performed by the app.

## Schema / limits

Current payload: `kind`, `schemaVersion: 2`, `data` and `preferences`. Strict validation checks exact keys, five-profile limit, known age/avatar/activity enums, unique IDs, versions, valid timestamps, nickname restrictions, progress bounds, monotonic ID allocation and profile-scoped references. Credentials/unlock or other unexpected fields are rejected. Payload limit is 65,536 characters, with tighter domain cardinality bounds.

A defined version-1 format (`kind`, `schemaVersion`, `data`) migrates to version 2 by adding default selection and empty bookmarks. Migration is committed atomically before publication. This is compatibility coverage for that defined format, not a claim that previous memory-only app versions stored a database. Future schema versions are never downgraded or discarded automatically.

## Sign-out and deletion

- Every family UI sign-out path, including Android hardware Back confirmation, awaits local erase before auth/navigation is discarded.
- Erase failure keeps the user in the current session, relocks parent access and shows a retryable error. It does not claim successful sign-out.
- Sign-out during a mutation/loading operation is blocked; completed writes cannot resurrect data after the successful clear. Stale operations on a cleared repository are rejected.
- Profile deletion atomically removes that profile's progress/bookmarks/selection. Creating a new profile uses a non-reused local ID.
- Family-data deletion checks the current version, erases the local snapshot and closes the session. It does not delete an external identity account.
- Route cleanup/disposal only clears memory and listeners. It is intentionally different from sign-out.

## Device/security caveats

SQLite is app-private but **not app-level encrypted**. There are no passwords or tokens in it. Anyone allowed into this development demo on the same installation can see the same dummy family. This is not parent authorization or separation between real accounts.

Android app config disables backup (`allowBackup: false`) for newly generated standalone builds. This does not change the Expo Go host's backup settings, guarantee OEM behavior, or configure iOS backup exclusions. iOS/other OS backup handling and encrypted real-account storage need review before real child data. OS backups, flash remnants and historical device snapshots are not erased by deleting the current row.

A custom development client must include the new expo-sqlite native module: rebuild an older client, or use an SDK-compatible Expo Go host that provides the module. Native binary building/device testing is not accomplished by JavaScript export.

## Validation and manual acceptance

Automated tests cover a new repository session restoring all data, actual SQLite file close/reopen, parameter binding, failed atomic writes, progress/bookmark/selection failures, isolation, ID/version preservation, v1 migration, failed migration, newer/corrupt payload preservation, explicit reset, schema tampering, concurrent queued writes, durable deletion and blocked/stale sign-out races. The SQLite file tests use Node's SQLite adapter, **not** Android/iOS instrumentation.

On the intended tablet (still pending):

1. In development demo, add two dummy profiles. Change sound/goal, select the second, save a card and complete two activity steps.
2. Force-close without signing out. Reopen, enter the demo. Verify profile, settings, bookmarks and continue progress; parent controls must be locked.
3. Repeat in airplane mode. Reader text/practice/local saving should work; OS TTS voice availability is a separate device dependency.
4. Delete one profile, restart and verify its data stays absent.
5. Sign out, restart and verify the old family does not return. A new demo starts with its seed profile.
6. Test storage-full, database-access errors, rapid taps, rotation, backgrounding during writes and native speech coexistence. No false saved/signed-out status should be shown.
