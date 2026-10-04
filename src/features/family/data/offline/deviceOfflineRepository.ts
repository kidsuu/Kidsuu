import { openDatabaseAsync } from 'expo-sqlite';
import { createOfflineFamilyRepository } from './OfflineFamilyRepository';
import { sqliteSnapshotStorage } from './sqliteSnapshotStorage';
// This module is only required inside the development demo composition gate.
// Stable filename: schema versions live in the payload, not in new orphaned files.
const storage = sqliteSnapshotStorage(() => openDatabaseAsync('kidsuu-demo-offline.db'));
export function createDeviceOfflineRepository() {
  return createOfflineFamilyRepository(storage);
}
