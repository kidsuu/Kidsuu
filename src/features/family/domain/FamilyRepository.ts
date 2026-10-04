import type { createFamilyApiClient } from '../../../shared/api/FamilyApiClient';
/** Same contract for the future authenticated API and the isolated session demo. */
export interface LocalFamilyPreferences {
  selectedId: string | null;
  saved: Record<string, string[]>;
}
export interface LocalFamilyStorage {
  getPreferences(): Promise<LocalFamilyPreferences>;
  setSelected(id: string): Promise<void>;
  setSaved(id: string, activities: string[]): Promise<void>;
  clear(): Promise<void>;
}
export type FamilyRepository = ReturnType<typeof createFamilyApiClient> & {
  local?: LocalFamilyStorage;
};
export type {
  ChildProfile,
  CreateChild,
  ParentSettings,
  ActivityProgress,
  Parent,
  AgeGroup,
  Avatar,
} from '../../../../packages/contracts/src';
