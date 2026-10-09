/** Transport-only types shared by the tablet app and Worker; no platform imports. */
export const AGE_GROUPS = ['2–3', '4–5', '6–7', '8–9'] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];
// New IDs are bookmark identities only; legacy activity progress is never relabelled.
export const FRESH_CONTENT_IDS = [
  'pattern-trail',
  'river-builders',
  'lantern-grove',
  'little-seed-lab',
  'pocket-garden',
  'little-seed-journey',
  'tip-tap-rain',
] as const;
export const AVATARS = ['explorer', 'puppy', 'star', 'moon'] as const;
export type Avatar = (typeof AVATARS)[number];
export const ACTIVITY_IDS = [
  'colours',
  'count',
  'shapes',
  'pairs',
  'clap',
  'rainbow',
  'moon',
  'bear',
] as const;
export type ActivityId = (typeof ACTIVITY_IDS)[number];
export interface ParentSettings {
  soundEnabled: boolean;
  dailyGoalMinutes: number;
}
export interface Parent {
  id: string;
  settings: ParentSettings;
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface ChildProfile {
  id: string;
  nickname: string;
  ageGroup: AgeGroup;
  avatar: Avatar;
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateChild {
  nickname: string;
  ageGroup: AgeGroup;
  avatar: Avatar;
}
export type UpdateChild = Partial<CreateChild> & { version: number };
export interface ProgressInput {
  completedSteps: number;
  totalSteps: number;
}
export interface ActivityProgress extends ProgressInput {
  activityId: ActivityId;
  completedAt: string | null;
  updatedAt: string;
}
export interface LearningSummary {
  childId: string;
  activitiesStarted: number;
  activitiesCompleted: number;
  completedSteps: number;
  totalSteps: number;
  lastActivityAt: string | null;
}
export interface StoredEditionProgress {
  editionKey: string;
  contentHash: string;
  unitIds: string[];
  optionalUnitIds: string[];
  exploredUnitIds: string[];
  skippedUnitIds: string[];
  updatedAt: string;
}
export interface FamilyStorageSnapshot {
  selectedId: string | null;
  saved: Record<string, SavedContentId[]>;
  editions: Record<string, StoredEditionProgress[]>;
}
export interface StoredFamilySnapshot {
  version: number;
  sha256: string;
  updatedAt: string;
  snapshot: FamilyStorageSnapshot;
}
export interface PutFamilySnapshotInput {
  version?: number;
  snapshot: FamilyStorageSnapshot;
}
export interface StoredObjectMeta {
  key: string;
  contentType: string;
  size: number;
  sha256: string;
  updatedAt: string;
}
export interface ApiFailure {
  error: { code: string; message: string; requestId: string; fields?: string[] };
}

export const SAVED_CONTENT_IDS = [...ACTIVITY_IDS, ...FRESH_CONTENT_IDS] as const;

export type SavedContentId = (typeof SAVED_CONTENT_IDS)[number];
