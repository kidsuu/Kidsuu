import { pilotCatalog } from '../src/features/content/data/demo/catalog';
import { afterEach, describe, expect, it } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  sqliteSnapshotStorage,
  type SnapshotDatabase,
} from '../src/features/family/data/offline/sqliteSnapshotStorage';
import { createOfflineFamilyRepository } from '../src/features/family/data/offline/OfflineFamilyRepository';
import { FamilyStore } from '../src/features/family/domain/FamilyStore';
const directories: string[] = [],
  databases: DatabaseSync[] = [];
function openFile(path: string) {
  const db = new DatabaseSync(path);
  databases.push(db);
  const port: SnapshotDatabase = {
    execAsync: async (sql) => {
      db.exec(sql);
    },
    runAsync: async (sql, ...params) => db.prepare(sql).run(...params),
    getFirstAsync: async <T>(sql: string) => (db.prepare(sql).get() as T | undefined) ?? null,
  };
  return { db, storage: sqliteSnapshotStorage(async () => port) };
}
afterEach(() => {
  for (const db of databases.splice(0)) {
    try {
      db.close();
    } catch {}
  }
  for (const dir of directories.splice(0)) rmSync(dir, { recursive: true, force: true });
});
describe('actual SQLite file persistence (Node adapter, not native device QA)', () => {
  it('restores across closing/reopening a real DB connection, then durably erases', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'kidsuu-sqlite-'));
    directories.push(dir);
    const file = join(dir, 'demo.db');
    const first = openFile(file),
      repo = createOfflineFamilyRepository(first.storage),
      store = new FamilyStore(repo, async () => {});
    await store.load();
    await store.unlock();
    await store.saveProfile({ nickname: 'Nia', ageGroup: '8–9', avatar: 'moon' });
    const id = store.getSnapshot().children[1].id;
    await store.select(id);
    await store.setSaved(['bear']);
    await store.record('bear', { completedSteps: 2, totalSteps: 5 });
    await store.unlock();
    await store.recordEdition(pilotCatalog[1], 'R01', 'explore');
    await store.recordEdition(pilotCatalog[1], 'R03', 'skip');
    store.dispose();
    first.db.close();
    const second = openFile(file),
      restored = new FamilyStore(createOfflineFamilyRepository(second.storage), async () => {});
    await restored.load();
    expect(restored.getSnapshot()).toMatchObject({
      ready: true,
      selectedId: id,
      parentUnlocked: false,
      saved: { [id]: ['bear'] },
    });
    expect(restored.getSnapshot().progress[0].completedSteps).toBe(2);
    expect(restored.getSnapshot().editions[id][0]).toMatchObject({
      exploredUnitIds: ['R01'],
      skippedUnitIds: ['R03'],
    });
    expect(await restored.prepareSignOut()).toBe(true);
    second.db.close();
    const third = openFile(file);
    expect(await third.storage.read()).toBeNull();
  });
  it('retains the last complete row if an atomic replacement violates the SQL size limit', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'kidsuu-sqlite-'));
    directories.push(dir);
    const { storage } = openFile(join(dir, 'demo.db'));
    await storage.write('last committed document');
    await expect(storage.write('x'.repeat(65537))).rejects.toThrow();
    expect(await storage.read()).toBe('last committed document');
  });
  it('binds payload as data, not executable SQL', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'kidsuu-sqlite-'));
    directories.push(dir);
    const { storage } = openFile(join(dir, 'demo.db')),
      text = "'); DROP TABLE family_snapshot; --";
    await storage.write(text);
    expect(await storage.read()).toBe(text);
    await storage.clear();
    expect(await storage.read()).toBeNull();
  });
});
