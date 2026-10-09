import { Hono } from 'hono';
import { ACTIVITY_IDS, type ActivityId } from '../../../packages/contracts/src';
import type { AppEnv } from '../env';
import { recentParentAuth } from '../auth/identity';
import { ApiError } from '../errors';
import { childId, deleteVersion, readBody } from '../http';
import * as schema from '../domain/validation';
import { FamilyRepository } from '../db/repository';
import { R2StorageRepository } from '../storage/r2Repository';
const app = new Hono<AppEnv>();
app.post('/parents/me', recentParentAuth, async (c) => {
  await readBody(c, schema.empty);
  return c.json({
    parent: await new FamilyRepository(c.env.DB, c.get('identity').parentId).initialize(),
  });
});
app.get('/parents/me', recentParentAuth, async (c) =>
  c.json({ parent: await new FamilyRepository(c.env.DB, c.get('identity').parentId).getParent() }),
);
app.patch('/parents/me/settings', recentParentAuth, async (c) =>
  c.json({
    parent: await new FamilyRepository(c.env.DB, c.get('identity').parentId).settings(
      await readBody(c, schema.settings),
    ),
  }),
);
app.delete('/parents/me', recentParentAuth, async (c) => {
  if (c.req.header('x-confirm-delete') !== 'delete-my-data')
    throw new ApiError(
      400,
      'DELETE_CONFIRMATION_REQUIRED',
      'Explicit deletion confirmation is required.',
    );
  const owner = c.get('identity').parentId;
  await new FamilyRepository(c.env.DB, owner).deleteParent(deleteVersion(c));
  await new R2StorageRepository(c.env.STORAGE, owner).deleteAllParentStorage();
  return c.json({ dataDeleted: true, identityAccountDeleted: false });
});
app.get('/children', async (c) =>
  c.json({ children: await new FamilyRepository(c.env.DB, c.get('identity').parentId).children() }),
);
app.post('/children', recentParentAuth, async (c) =>
  c.json(
    {
      child: await new FamilyRepository(c.env.DB, c.get('identity').parentId).create(
        await readBody(c, schema.createChild),
      ),
    },
    201,
  ),
);
app.get('/children/:id', async (c) =>
  c.json({
    child: await new FamilyRepository(c.env.DB, c.get('identity').parentId).getChild(
      childId(c.req.param('id')),
    ),
  }),
);
app.patch('/children/:id', recentParentAuth, async (c) =>
  c.json({
    child: await new FamilyRepository(c.env.DB, c.get('identity').parentId).update(
      childId(c.req.param('id')),
      await readBody(c, schema.updateChild),
    ),
  }),
);
app.delete('/children/:id', recentParentAuth, async (c) => {
  const owner = c.get('identity').parentId,
    id = childId(c.req.param('id')),
    repo = new FamilyRepository(c.env.DB, owner);
  await repo.deleteChild(id, deleteVersion(c));
  const remaining = await repo.children();
  await new R2StorageRepository(c.env.STORAGE, owner).pruneDeletedChild(
    id,
    new Set(remaining.map((ch) => ch.id)),
  );
  return c.body(null, 204);
});
app.get('/children/:id/progress', async (c) =>
  c.json({
    progress: await new FamilyRepository(c.env.DB, c.get('identity').parentId).listProgress(
      childId(c.req.param('id')),
    ),
  }),
);
app.put('/children/:id/progress/:activity', async (c) => {
  const activity = c.req.param('activity');
  if (!(ACTIVITY_IDS as readonly string[]).includes(activity))
    throw new ApiError(400, 'INVALID_ACTIVITY', 'Unknown activity.');
  return c.json({
    progress: await new FamilyRepository(c.env.DB, c.get('identity').parentId).putProgress(
      childId(c.req.param('id')),
      activity as ActivityId,
      await readBody(c, schema.progress),
    ),
  });
});
app.get('/children/:id/summary', recentParentAuth, async (c) => {
  const id = childId(c.req.param('id')),
    rows = await new FamilyRepository(c.env.DB, c.get('identity').parentId).listProgress(id);
  return c.json({
    summary: {
      childId: id,
      activitiesStarted: rows.filter((p) => p.completedSteps > 0).length,
      activitiesCompleted: rows.filter((p) => p.completedAt !== null).length,
      completedSteps: rows.reduce((n, p) => n + p.completedSteps, 0),
      totalSteps: rows.reduce((n, p) => n + p.totalSteps, 0),
      lastActivityAt: rows[0]?.updatedAt ?? null,
    },
  });
});
export default app;
