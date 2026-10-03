-- No names, mobile numbers, passwords, tokens or precise birth dates are stored for parents.
CREATE TABLE parents (
 id TEXT PRIMARY KEY,
 sound_enabled INTEGER NOT NULL DEFAULT 1 CHECK (sound_enabled IN (0,1)),
 daily_goal_minutes INTEGER NOT NULL DEFAULT 15 CHECK (daily_goal_minutes BETWEEN 5 AND 60),
 version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE TABLE child_profiles (
 id TEXT PRIMARY KEY,
 parent_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
 nickname TEXT NOT NULL CHECK (length(nickname) BETWEEN 1 AND 32),
 age_group TEXT NOT NULL CHECK (age_group IN ('2–3','4–5','6–7','8–9')),
 avatar TEXT NOT NULL CHECK (avatar IN ('explorer','puppy','star','moon')),
 version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE INDEX child_profiles_parent ON child_profiles(parent_id,created_at,id);
-- Enforce the cap atomically, even when two requests race.
CREATE TRIGGER child_profile_limit BEFORE INSERT ON child_profiles
WHEN (SELECT COUNT(*) FROM child_profiles WHERE parent_id=NEW.parent_id) >= 5
BEGIN SELECT RAISE(ABORT,'profile_limit'); END;
CREATE TABLE activity_progress (
 child_id TEXT NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
 activity_id TEXT NOT NULL CHECK (activity_id IN ('colours','count','shapes','pairs','clap','rainbow','moon','bear')),
 completed_steps INTEGER NOT NULL CHECK (completed_steps >= 0 AND completed_steps <= total_steps),
 total_steps INTEGER NOT NULL CHECK (total_steps BETWEEN 1 AND 200),
 completed_at TEXT,
 updated_at TEXT NOT NULL,
 PRIMARY KEY (child_id,activity_id)
);
