import type { SnapshotStorage } from './OfflineFamilyRepository';
/** Small port also exercised with a real SQLite file in automated tests. */
export interface SnapshotDatabase {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, ...params: string[]): Promise<unknown>;
  getFirstAsync<T>(sql: string): Promise<T | null>;
}
export function sqliteSnapshotStorage(open: () => Promise<SnapshotDatabase>): SnapshotStorage {
  let connection: Promise<SnapshotDatabase> | undefined;
  const db = () => {
    if (!connection)
      connection = open()
        .then(async (db) => {
          // A single row replacement is atomic. FULL/DELETE avoids an uncheckpointed WAL.
          await db.execAsync(
            'PRAGMA journal_mode=DELETE; PRAGMA synchronous=FULL; PRAGMA secure_delete=ON; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS family_snapshot (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL CHECK(length(payload)<=65536));',
          );
          return db;
        })
        .catch((error) => {
          connection = undefined;
          throw error;
        });
    return connection;
  };
  return {
    read: async () =>
      (
        await (
          await db()
        ).getFirstAsync<{ payload: string }>('SELECT payload FROM family_snapshot WHERE id=1')
      )?.payload ?? null,
    write: async (text) => {
      await (
        await db()
      ).runAsync(
        'INSERT INTO family_snapshot(id,payload) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload',
        text,
      );
    },
    clear: async () => {
      await (await db()).runAsync('DELETE FROM family_snapshot');
    },
  };
}
