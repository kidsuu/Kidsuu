/** Transport-only types shared by the tablet app and Worker; no platform imports. */
export const AGE_GROUPS = ['2–3', '4–5', '6–7', '8–9'] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];
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
export interface ApiFailure {
  error: { code: string; message: string; requestId: string; fields?: string[] };
}
