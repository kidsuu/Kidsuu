export interface NarrationPort {
  stop(): Promise<void>;
  speak(
    text: string,
    callbacks: { onDone: () => void; onStopped: () => void; onError: () => void },
  ): void;
}
export interface NarrationState {
  status: 'idle' | 'starting' | 'speaking';
  error: string;
}
/** Serialize native stop/start calls. A late stop cannot cut off a newer utterance.
 * No autoplay, timers, microphone, personal data, progress writes or credential access. */
export class NarrationController {
  private state: NarrationState = { status: 'idle', error: '' };
  private listeners = new Set<() => void>();
  private queue: Promise<void> = Promise.resolve();
  private ticket = 0;
  private allowed = false;
  private disposed = false;
  constructor(private port: NarrationPort) {}
  getSnapshot = () => this.state;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  private set(state: NarrationState) {
    if (this.disposed) return;
    this.state = state;
    this.listeners.forEach((fn) => fn());
  }
  private failure() {
    this.set({
      status: 'idle',
      error: 'Read-aloud is unavailable right now. You can still read every page together.',
    });
  }
  setAllowed(value: boolean) {
    this.allowed = value;
    if (!value) this.stop();
  }
  play(text: string): Promise<void> {
    if (!this.allowed || this.disposed || !text.trim() || text.length > 1500)
      return Promise.resolve();
    const ticket = ++this.ticket;
    this.set({ status: 'starting', error: '' });
    this.queue = this.queue
      .catch(() => {})
      .then(async () => {
        try {
          await this.port.stop();
          if (this.disposed || !this.allowed || ticket !== this.ticket) return;
          const done = () => {
            if (ticket === this.ticket) this.set({ status: 'idle', error: '' });
          };
          this.set({ status: 'speaking', error: '' });
          this.port.speak(text, {
            onDone: done,
            onStopped: done,
            onError: () => {
              if (ticket === this.ticket) this.failure();
            },
          });
        } catch {
          if (ticket === this.ticket) this.failure();
        }
      });
    return this.queue;
  }
  stop(): Promise<void> {
    this.ticket++;
    this.set({ status: 'idle', error: '' });
    this.queue = this.queue
      .catch(() => {})
      .then(async () => {
        try {
          await this.port.stop();
        } catch {
          this.failure();
        }
      });
    return this.queue;
  }
  dispose() {
    this.allowed = false;
    void this.stop();
    this.disposed = true;
    this.listeners.clear();
  }
}
