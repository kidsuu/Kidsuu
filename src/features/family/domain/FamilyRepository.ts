import type { EditionProgress, EditionProgressByChild } from '../../content/domain/editionProgress';
import type { createFamilyApiClient } from '../../../shared/api/FamilyApiClient';
/** Same contract for the future authenticated API and the isolated session demo. */
export interface LocalFamilyPreferences {
  selectedId: string | null;
  saved: Record<string, string[]>;
  editions: EditionProgressByChild;
}
export interface LocalFamilyStorage {
  getPreferences(): Promise<LocalFamilyPreferences>;
  setSelected(id: string): Promise<void>;
  setSaved(id: string, activities: string[]): Promise<void>;
  putEditionProgress(id: string, row: EditionProgress): Promise<EditionProgress>;
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
