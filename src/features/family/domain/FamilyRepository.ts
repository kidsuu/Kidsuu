import type { createFamilyApiClient } from '../../../shared/api/FamilyApiClient';
/** Same contract for the future authenticated API and the isolated session demo. */
export type FamilyRepository = ReturnType<typeof createFamilyApiClient>;
export type {
  ChildProfile,
  CreateChild,
  ParentSettings,
  ActivityProgress,
  Parent,
  AgeGroup,
  Avatar,
} from '../../../../packages/contracts/src';
