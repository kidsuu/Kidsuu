import type { FamilyRepository } from '../../domain/FamilyRepository';
import { validateProfile } from '../../domain/validation';
import { FamilyApiError } from '../../../../shared/api/FamilyApiClient';
import {
  ACTIVITY_IDS,
  type ActivityProgress,
  type ChildProfile,
  type Parent,
} from '../../../../../packages/contracts/src';
/** Fictitious data only. Memory-only: no disk, network, credentials or real child records. */
export function createDemoFamilyRepository(): FamilyRepository {
  const stamp = () => new Date().toISOString();
  let parent: Parent = {
    id: 'demo-family-session',
    settings: { soundEnabled: true, dailyGoalMinutes: 15 },
    version: 1,
    createdAt: stamp(),
    updatedAt: stamp(),
  };
  let sequence = 1;
  const uuid = () => `00000000-0000-4000-8000-${String(sequence++).padStart(12, '0')}`;
  let children: ChildProfile[] = [
    {
      id: uuid(),
      nickname: 'Little explorer',
      ageGroup: '4–5',
      avatar: 'explorer',
      version: 1,
      createdAt: stamp(),
      updatedAt: stamp(),
    },
  ];
  const progress = new Map<string, ActivityProgress[]>();
  let deleted = false;
  const copy = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
  const fail = (code: string, message: string, status = 409): never => {
    throw new FamilyApiError(code, message, status);
  };
  const active = () => {
    if (deleted) fail('NOT_FOUND', 'Family data was deleted. Sign out to start a new demo.', 404);
  };
  const child = (id: string) => {
    active();
    return children.find((c) => c.id === id) ?? fail('NOT_FOUND', 'Profile not found.', 404);
  };
  const version = (actual: number, expected: number) => {
    if (actual !== expected)
      fail('VERSION_CONFLICT', 'Details changed. Reload before trying again.');
  };
  return {
    initializeParent: async () => {
      active();
      return copy(parent);
    },
    getParent: async () => {
      active();
      return copy(parent);
    },
    updateSettings: async (settings, expected) => {
      active();
      version(parent.version, expected);
      if (
        typeof settings.soundEnabled !== 'boolean' ||
        !Number.isInteger(settings.dailyGoalMinutes) ||
        settings.dailyGoalMinutes < 5 ||
        settings.dailyGoalMinutes > 60
      )
        fail('INVALID_INPUT', 'Choose a daily goal between 5 and 60 minutes.', 400);
      parent = {
        ...parent,
        settings: copy(settings),
        version: parent.version + 1,
        updatedAt: stamp(),
      };
      return copy(parent);
    },
    listChildren: async () => {
      active();
      return copy(children);
    },
    createChild: async (input) => {
      active();
      const error = validateProfile(input);
      if (error) fail('INVALID_INPUT', error, 400);
      if (children.length >= 5) fail('PROFILE_LIMIT', 'A family can have up to five profiles.');
      const profile = {
        ...input,
        nickname: input.nickname.trim(),
        id: uuid(),
        version: 1,
        createdAt: stamp(),
        updatedAt: stamp(),
      };
      children.push(profile);
      return copy(profile);
    },
    updateChild: async (id, input) => {
      const current = child(id);
      version(current.version, input.version);
      const next = {
        ...current,
        ...input,
        nickname: (input.nickname ?? current.nickname).trim(),
        version: current.version + 1,
        updatedAt: stamp(),
      };
      const error = validateProfile(next);
      if (error) fail('INVALID_INPUT', error, 400);
      children = children.map((c) => (c.id === id ? next : c));
      return copy(next);
    },
    deleteChild: async (id, expected) => {
      version(child(id).version, expected);
      children = children.filter((c) => c.id !== id);
      progress.delete(id);
    },
    getProgress: async (id) => {
      child(id);
      return copy(progress.get(id) ?? []);
    },
    putProgress: async (id, activityId, input) => {
      child(id);
      if (
        !ACTIVITY_IDS.includes(activityId) ||
        !Number.isInteger(input.completedSteps) ||
        !Number.isInteger(input.totalSteps) ||
        input.totalSteps < 1 ||
        input.totalSteps > 200 ||
        input.completedSteps < 0 ||
        input.completedSteps > input.totalSteps
      )
        fail('INVALID_INPUT', 'Invalid progress.', 400);
      const rows = progress.get(id) ?? [],
        old = rows.find((r) => r.activityId === activityId);
      if (old && old.totalSteps !== input.totalSteps)
        fail('PROGRESS_CONFLICT', 'This activity has a different step count.');
      if (old && old.completedSteps >= input.completedSteps) return copy(old);
      const next: ActivityProgress = {
        ...input,
        activityId,
        updatedAt: stamp(),
        completedAt: input.completedSteps === input.totalSteps ? stamp() : null,
      };
      progress.set(id, [next, ...rows.filter((r) => r.activityId !== activityId)]);
      return copy(next);
    },
    getSummary: async (id) => {
      child(id);
      const rows = progress.get(id) ?? [];
      return {
        childId: id,
        activitiesStarted: rows.length,
        activitiesCompleted: rows.filter((r) => r.completedSteps === r.totalSteps).length,
        completedSteps: rows.reduce((n, r) => n + r.completedSteps, 0),
        totalSteps: rows.reduce((n, r) => n + r.totalSteps, 0),
        lastActivityAt:
          rows
            .map((r) => r.updatedAt)
            .sort()
            .at(-1) ?? null,
      };
    },
    deleteFamilyData: async (expected) => {
      active();
      version(parent.version, expected);
      children = [];
      progress.clear();
      deleted = true;
      return { dataDeleted: true, identityAccountDeleted: false };
    },
  };
}
