import type {
  ActivityId,
  ActivityProgress,
  ChildProfile,
  CreateChild,
  Parent,
  ProgressInput,
  UpdateChild,
} from '../../../packages/contracts/src';
import { ApiError } from '../errors';
type ParentRow = {
  id: string;
  sound_enabled: number;
  daily_goal_minutes: number;
  version: number;
  created_at: string;
  updated_at: string;
};
type ChildRow = {
  id: string;
  nickname: string;
  age_group: ChildProfile['ageGroup'];
  avatar: ChildProfile['avatar'];
  version: number;
  created_at: string;
  updated_at: string;
};
type ProgressRow = {
  activity_id: ActivityId;
  completed_steps: number;
  total_steps: number;
  completed_at: string | null;
  updated_at: string;
};
const parent = (r: ParentRow): Parent => ({
  id: r.id,
  settings: { soundEnabled: !!r.sound_enabled, dailyGoalMinutes: r.daily_goal_minutes },
  version: r.version,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});
const child = (r: ChildRow): ChildProfile => ({
  id: r.id,
  nickname: r.nickname,
  ageGroup: r.age_group,
  avatar: r.avatar,
  version: r.version,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});
const progress = (r: ProgressRow): ActivityProgress => ({
  activityId: r.activity_id,
  completedSteps: r.completed_steps,
  totalSteps: r.total_steps,
  completedAt: r.completed_at,
  updatedAt: r.updated_at,
});
export class FamilyRepository {
  constructor(
    private db: D1Database,
    private owner: string,
  ) {}
  async getParent() {
    const r = await this.db
      .prepare('SELECT * FROM parents WHERE id=?')
      .bind(this.owner)
      .first<ParentRow>();
    if (!r) throw new ApiError(404, 'PARENT_NOT_INITIALIZED', 'Initialize parent data first.');
    return parent(r);
  }
  async initialize() {
    const now = new Date().toISOString();
    await this.db
      .prepare(
        'INSERT INTO parents(id,created_at,updated_at) VALUES(?,?,?) ON CONFLICT(id) DO NOTHING',
      )
      .bind(this.owner, now, now)
      .run();
    return this.getParent();
  }
  async settings(v: { version: number; soundEnabled: boolean; dailyGoalMinutes: number }) {
    await this.getParent();
    const r = await this.db
      .prepare(
        'UPDATE parents SET sound_enabled=?, daily_goal_minutes=?, version=version+1, updated_at=? WHERE id=? AND version=? RETURNING *',
      )
      .bind(
        v.soundEnabled ? 1 : 0,
        v.dailyGoalMinutes,
        new Date().toISOString(),
        this.owner,
        v.version,
      )
      .first<ParentRow>();
    if (!r)
      throw new ApiError(409, 'VERSION_CONFLICT', 'Parent settings changed. Reload and retry.');
    return parent(r);
  }
  async children() {
    await this.getParent();
    const r = await this.db
      .prepare('SELECT * FROM child_profiles WHERE parent_id=? ORDER BY created_at,id LIMIT 5')
      .bind(this.owner)
      .all<ChildRow>();
    return r.results.map(child);
  }
  async getChild(id: string) {
    const r = await this.db
      .prepare('SELECT * FROM child_profiles WHERE id=? AND parent_id=?')
      .bind(id, this.owner)
      .first<ChildRow>();
    if (!r) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Profile not found.');
    return child(r);
  }
  async create(v: CreateChild) {
    await this.getParent();
    const id = crypto.randomUUID(),
      now = new Date().toISOString();
    try {
      await this.db
        .prepare(
          'INSERT INTO child_profiles(id,parent_id,nickname,age_group,avatar,created_at,updated_at) VALUES(?,?,?,?,?,?,?)',
        )
        .bind(id, this.owner, v.nickname, v.ageGroup, v.avatar, now, now)
        .run();
    } catch (e) {
      const text = String(e) + (e instanceof Error ? String(e.cause) : '');
      if (text.includes('profile_limit'))
        throw new ApiError(409, 'PROFILE_LIMIT', 'Up to five child profiles are supported.');
      throw e;
    }
    return this.getChild(id);
  }
  async update(id: string, v: UpdateChild) {
    const old = await this.getChild(id);
    const r = await this.db
      .prepare(
        'UPDATE child_profiles SET nickname=?,age_group=?,avatar=?,version=version+1,updated_at=? WHERE id=? AND parent_id=? AND version=? RETURNING *',
      )
      .bind(
        v.nickname ?? old.nickname,
        v.ageGroup ?? old.ageGroup,
        v.avatar ?? old.avatar,
        new Date().toISOString(),
        id,
        this.owner,
        v.version,
      )
      .first<ChildRow>();
    if (!r) throw new ApiError(409, 'VERSION_CONFLICT', 'Profile changed. Reload and retry.');
    return child(r);
  }
  async deleteChild(id: string, version: number) {
    await this.getChild(id);
    const r = await this.db
      .prepare('DELETE FROM child_profiles WHERE id=? AND parent_id=? AND version=?')
      .bind(id, this.owner, version)
      .run();
    if (!r.meta.changes)
      throw new ApiError(409, 'VERSION_CONFLICT', 'Profile changed. Reload and retry.');
  }
  async listProgress(id: string) {
    await this.getChild(id);
    const r = await this.db
      .prepare(
        'SELECT p.* FROM activity_progress p JOIN child_profiles c ON c.id=p.child_id WHERE p.child_id=? AND c.parent_id=? ORDER BY p.updated_at DESC,p.activity_id LIMIT 8',
      )
      .bind(id, this.owner)
      .all<ProgressRow>();
    return r.results.map(progress);
  }
  async putProgress(id: string, activity: ActivityId, v: ProgressInput) {
    await this.getChild(id);
    const now = new Date().toISOString();
    const r = await this.db
      .prepare(
        `INSERT INTO activity_progress(child_id,activity_id,completed_steps,total_steps,completed_at,updated_at)
   SELECT id,?,?,?,?,? FROM child_profiles WHERE id=? AND parent_id=?
   ON CONFLICT(child_id,activity_id) DO UPDATE SET
    completed_steps=MAX(activity_progress.completed_steps,excluded.completed_steps),
    completed_at=CASE WHEN MAX(activity_progress.completed_steps,excluded.completed_steps)=activity_progress.total_steps THEN COALESCE(activity_progress.completed_at,excluded.updated_at) ELSE NULL END,
    updated_at=CASE WHEN excluded.completed_steps>activity_progress.completed_steps THEN excluded.updated_at ELSE activity_progress.updated_at END
   WHERE activity_progress.total_steps=excluded.total_steps
   RETURNING *`,
      )
      .bind(
        activity,
        v.completedSteps,
        v.totalSteps,
        v.completedSteps === v.totalSteps ? now : null,
        now,
        id,
        this.owner,
      )
      .first<ProgressRow>();
    if (!r) {
      await this.getChild(id);
      throw new ApiError(
        409,
        'PROGRESS_TOTAL_CONFLICT',
        'Activity step total does not match existing progress.',
      );
    }
    return progress(r);
  }
  async deleteParent(version: number) {
    await this.getParent();
    const r = await this.db
      .prepare('DELETE FROM parents WHERE id=? AND version=?')
      .bind(this.owner, version)
      .run();
    if (!r.meta.changes)
      throw new ApiError(409, 'VERSION_CONFLICT', 'Parent settings changed. Reload and retry.');
  }
}
