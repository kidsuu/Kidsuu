import { FamilyApiError } from '../../../shared/api/FamilyApiClient';
import type { ActivityId, ProgressInput } from '../../../../packages/contracts/src';
import type {
  FamilyRepository,
  ChildProfile,
  CreateChild,
  Parent,
  ParentSettings,
  ActivityProgress,
} from './FamilyRepository';
export interface FamilyState {
  parent: Parent | null;
  children: ChildProfile[];
  selectedId: string | null;
  progress: ActivityProgress[];
  saved: Record<string, string[]>;
  loading: boolean;
  ready: boolean;
  busy: boolean;
  error: string;
  parentUnlocked: boolean;
}
export function familyError(error: unknown): string {
  if (!(error instanceof FamilyApiError))
    return 'Something went wrong. Please reload and try again.';
  switch (error.code) {
    case 'VERSION_CONFLICT':
    case 'PROGRESS_CONFLICT':
      return 'Details changed elsewhere. Reload before trying again.';
    case 'PARENT_REAUTH_REQUIRED':
      return 'Parent access expired. Close this screen and verify again.';
    case 'UNAUTHENTICATED':
    case 'INVALID_TOKEN':
      return 'Your session has expired. Please sign in again.';
    case 'AUTH_NOT_CONFIGURED':
      return 'Live sign-in is not connected yet. Private data stays locked.';
    case 'NETWORK_ERROR':
    case 'TIMEOUT':
      return 'Could not reach the service. Nothing is queued offline. Reload to check before retrying.';
    case 'RATE_LIMITED':
      return 'Too many requests. Please wait a minute before trying again.';
    default:
      return error.status === 429 ? 'Please wait a minute before trying again.' : error.message;
  }
}
/** Session-scoped state. Stale reads never replace another profile's progress.
 * Mutations are single-flight and never automatically retried. */
export class FamilyStore {
  private state: FamilyState = {
    parent: null,
    children: [],
    selectedId: null,
    progress: [],
    saved: {},
    loading: true,
    ready: false,
    busy: false,
    error: '',
    parentUnlocked: false,
  };
  private listeners = new Set<() => void>();
  private epoch = 0;
  private gateEpoch = 0;
  private disposed = false;
  constructor(
    private repository: FamilyRepository,
    private authorizeParent: () => Promise<void>,
  ) {}
  get isPersistent() {
    return !!this.repository.local;
  }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private set(patch: Partial<FamilyState>) {
    if (this.disposed) return;
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn());
  }
  clearError = () => this.set({ error: '' });
  async load() {
    if (this.state.busy || this.disposed) return;
    const epoch = ++this.epoch;
    this.set({ loading: true, error: '', progress: [] });
    try {
      const [parent, children, preferences] = await Promise.all([
        this.repository.getParent(),
        this.repository.listChildren(),
        this.repository.local?.getPreferences(),
      ]);
      const selectedId = preferences
        ? preferences.selectedId
        : children.some((c) => c.id === this.state.selectedId)
          ? this.state.selectedId
          : (children[0]?.id ?? null);
      const progress = selectedId ? await this.repository.getProgress(selectedId) : [];
      if (epoch === this.epoch)
        this.set({
          parent,
          children,
          selectedId,
          progress,
          ready: true,
          ...(preferences ? { saved: preferences.saved } : {}),
        });
    } catch (e) {
      if (epoch === this.epoch)
        this.set({
          error: familyError(e),
          ready: false,
          parent: null,
          children: [],
          selectedId: null,
          progress: [],
          saved: {},
        });
    } finally {
      if (epoch === this.epoch) this.set({ loading: false });
    }
  }
  async select(id: string) {
    if (
      this.state.busy ||
      !this.state.ready ||
      this.disposed ||
      !this.state.children.some((c) => c.id === id)
    )
      return;
    const previousId = this.state.selectedId;
    const epoch = ++this.epoch;
    this.lock();
    this.set({ selectedId: id, progress: [], loading: true, error: '' });
    try {
      if (this.repository.local) await this.repository.local.setSelected(id);
      const progress = await this.repository.getProgress(id);
      if (epoch === this.epoch) this.set({ progress });
    } catch (e) {
      if (epoch === this.epoch)
        this.set({ error: familyError(e), selectedId: previousId, progress: [] });
    } finally {
      if (epoch === this.epoch) this.set({ loading: false });
    }
  }
  async unlock(): Promise<boolean> {
    const ticket = ++this.gateEpoch;
    try {
      await this.authorizeParent();
      if (ticket !== this.gateEpoch || this.disposed) return false;
      this.set({ parentUnlocked: true, error: '' });
      return true;
    } catch (e) {
      this.set({ error: familyError(e) });
      return false;
    }
  }
  lock = () => {
    this.gateEpoch++;
    this.set({ parentUnlocked: false });
  };
  setSaved(ids: string[]) {
    const id = this.state.selectedId;
    if (!id) return Promise.resolve(false);
    return this.mutate(async () => {
      const values = [...new Set(ids)];
      await this.repository.local?.setSaved(id, values);
      this.set({ saved: { ...this.state.saved, [id]: values } });
    });
  }
  /** Disk erase must succeed before the auth session/navigation is discarded. */
  async prepareSignOut(): Promise<boolean> {
    if (this.disposed || this.state.busy || this.state.loading) return false;
    this.lock();
    this.set({ busy: true, error: '' });
    try {
      await this.repository.local?.clear();
      this.dispose();
      return true;
    } catch (e) {
      this.set({ busy: false, error: familyError(e) });
      return false;
    }
  }
  private async mutate(task: () => Promise<void>, parentOnly = false): Promise<boolean> {
    if (this.disposed || this.state.busy || this.state.loading || !this.state.ready) return false;
    if (parentOnly && !this.state.parentUnlocked) {
      this.set({ error: 'Open the parent gate before changing family details.' });
      return false;
    }
    this.set({ busy: true, error: '' });
    try {
      await task();
      return !this.disposed;
    } catch (e) {
      this.set({ error: familyError(e) });
      if (e instanceof FamilyApiError && (e.status === 401 || e.code === 'PARENT_REAUTH_REQUIRED'))
        this.lock();
      return false;
    } finally {
      this.set({ busy: false });
    }
  }
  saveProfile(input: CreateChild, existing?: ChildProfile) {
    return this.mutate(async () => {
      const child = existing
        ? await this.repository.updateChild(existing.id, { ...input, version: existing.version })
        : await this.repository.createChild(input);
      const children = existing
        ? this.state.children.map((c) => (c.id === child.id ? child : c))
        : [...this.state.children, child];
      this.set({ children, selectedId: this.state.selectedId ?? child.id });
    }, true);
  }
  deleteProfile(child: ChildProfile) {
    return this.mutate(async () => {
      await this.repository.deleteChild(child.id, child.version);
      const children = this.state.children.filter((c) => c.id !== child.id),
        saved = { ...this.state.saved };
      delete saved[child.id];
      // Require an explicit selection rather than briefly exposing another child's progress.
      this.set({
        children,
        saved,
        ...(this.state.selectedId === child.id ? { selectedId: null, progress: [] } : {}),
      });
    }, true);
  }
  saveSettings(settings: ParentSettings, version: number) {
    return this.mutate(async () => {
      this.set({ parent: await this.repository.updateSettings(settings, version) });
    }, true);
  }
  record(activity: ActivityId, input: ProgressInput) {
    const id = this.state.selectedId;
    if (!id) return Promise.resolve(false);
    return this.mutate(async () => {
      const row = await this.repository.putProgress(id, activity, input);
      if (this.state.selectedId === id)
        this.set({
          progress: [row, ...this.state.progress.filter((r) => r.activityId !== activity)],
        });
    });
  }
  deleteFamily() {
    return this.mutate(async () => {
      if (!this.state.parent) throw new Error('No parent');
      const result = await this.repository.deleteFamilyData(this.state.parent.version);
      if (!result.dataDeleted) throw new Error('Deletion was not confirmed');
      this.set({
        parent: null,
        children: [],
        selectedId: null,
        progress: [],
        saved: {},
        parentUnlocked: false,
      });
    }, true);
  }
  dispose() {
    this.lock();
    this.epoch++;
    this.disposed = true;
    this.listeners.clear();
    this.state = {
      ...this.state,
      parent: null,
      children: [],
      selectedId: null,
      progress: [],
      saved: {},
      error: '',
    };
  }
}
