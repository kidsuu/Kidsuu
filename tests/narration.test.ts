import { describe, it, expect, vi } from 'vitest';
import {
  NarrationController,
  type NarrationPort,
} from '../src/features/activities/domain/NarrationController';
function setup() {
  const stop = vi.fn(async () => {}),
    speak = vi.fn<NarrationPort['speak']>();
  const controller = new NarrationController({ stop, speak });
  return { controller, stop, speak };
}
describe('device narration lifecycle', () => {
  it('never autoplays and refuses speech until explicitly allowed', async () => {
    const { controller, speak } = setup();
    await controller.play('A story.');
    expect(speak).not.toHaveBeenCalled();
    controller.setAllowed(true);
    expect(speak).not.toHaveBeenCalled();
    await controller.play('A story.');
    expect(speak).toHaveBeenCalledOnce();
    expect(controller.getSnapshot().status).toBe('speaking');
  });
  it('always flushes the native queue before speaking', async () => {
    const { controller, stop, speak } = setup();
    controller.setAllowed(true);
    await controller.play('First page.');
    expect(stop.mock.invocationCallOrder[0]).toBeLessThan(speak.mock.invocationCallOrder[0]);
  });
  it('cancels a pending start when the app backgrounds or sound is disabled', async () => {
    const { controller, stop, speak } = setup();
    let finish!: () => void;
    stop.mockImplementationOnce(
      () =>
        new Promise<void>((done) => {
          finish = done;
        }),
    );
    controller.setAllowed(true);
    const pending = controller.play('Do not speak this after background.');
    await Promise.resolve();
    await Promise.resolve();
    controller.setAllowed(false);
    finish();
    await pending;
    await controller.stop();
    expect(speak).not.toHaveBeenCalled();
    controller.setAllowed(true);
    expect(speak).not.toHaveBeenCalled();
  });
  it('supersedes queued pages rather than speaking stale text', async () => {
    const { controller, speak } = setup();
    controller.setAllowed(true);
    const first = controller.play('Old page.');
    const second = controller.play('New page.');
    await Promise.all([first, second]);
    expect(speak).toHaveBeenCalledOnce();
    expect(speak.mock.calls[0][0]).toBe('New page.');
  });
  it('ignores old native callbacks after another page starts', async () => {
    const { controller, speak } = setup();
    controller.setAllowed(true);
    await controller.play('First.');
    const old = speak.mock.calls[0][1];
    await controller.play('Second.');
    old.onDone();
    old.onError();
    old.onStopped();
    expect(controller.getSnapshot()).toEqual({ status: 'speaking', error: '' });
    speak.mock.calls[1][1].onDone();
    expect(controller.getSnapshot().status).toBe('idle');
  });
  it('stops without advancing any page or claiming audio can resume mid-sentence', async () => {
    const { controller, speak } = setup();
    controller.setAllowed(true);
    await controller.play('One whole page.');
    await controller.stop();
    expect(controller.getSnapshot().status).toBe('idle');
    await controller.play('One whole page.');
    expect(speak).toHaveBeenCalledTimes(2);
  });
  it('recovers cleanly after native speech failure', async () => {
    const { controller, speak } = setup();
    controller.setAllowed(true);
    speak.mockImplementationOnce(() => {
      throw new Error('Engine missing');
    });
    await controller.play('First.');
    expect(controller.getSnapshot().error).toContain('unavailable');
    await controller.play('Retry.');
    expect(controller.getSnapshot()).toEqual({ status: 'speaking', error: '' });
    speak.mock.calls[1][1].onError();
    expect(controller.getSnapshot().status).toBe('idle');
  });
  it('does not speak when flushing the engine fails', async () => {
    const { controller, stop, speak } = setup();
    controller.setAllowed(true);
    stop.mockRejectedValueOnce(new Error('Cannot stop engine'));
    await controller.play('Text');
    expect(speak).not.toHaveBeenCalled();
    expect(controller.getSnapshot().error).toContain('unavailable');
  });
  it('disposal cancels pending work and rejects subsequent playback', async () => {
    const { controller, speak } = setup();
    controller.setAllowed(true);
    const pending = controller.play('Queued text');
    controller.dispose();
    await pending;
    await controller.play('Ignored');
    expect(speak).not.toHaveBeenCalled();
  });
  it('rejects empty/oversized text without native calls', async () => {
    const { controller, speak } = setup();
    controller.setAllowed(true);
    await controller.play(' ');
    await controller.play('x'.repeat(1501));
    expect(speak).not.toHaveBeenCalled();
  });
});

describe('locale preparation and cancellation', () => {
  it('passes Hindi explicitly and refuses missing voices instead of silently falling back', async () => {
    const speak = vi.fn<NarrationPort['speak']>(),
      prepare = vi.fn(async () => false);
    const c = new NarrationController({ stop: async () => {}, speak, prepare });
    c.setAllowed(true);
    await c.play('ऊपर और नीचे।', 'hi-IN');
    expect(prepare).toHaveBeenCalledWith('hi-IN');
    expect(speak).not.toHaveBeenCalled();
    expect(c.getSnapshot().error).toContain('unavailable');
    prepare.mockResolvedValue(true);
    await c.play('ऊपर और नीचे।', 'hi-IN');
    expect(speak.mock.calls[0][2]).toBe('hi-IN');
  });
  it('cancels after a slow voice lookup when backgrounded', async () => {
    let finish!: (v: boolean) => void;
    const speak = vi.fn<NarrationPort['speak']>(),
      prepare = vi.fn(
        () =>
          new Promise<boolean>((resolve) => {
            finish = resolve;
          }),
      );
    const c = new NarrationController({ stop: async () => {}, speak, prepare });
    c.setAllowed(true);
    const pending = c.play('Hindi draft', 'hi-IN');
    await vi.waitFor(() => expect(finish).toBeTypeOf('function'));
    c.setAllowed(false);
    finish(true);
    await pending;
    expect(speak).not.toHaveBeenCalled();
  });
  it('recovers from lookup failure and keeps default English for legacy readers', async () => {
    const speak = vi.fn<NarrationPort['speak']>(),
      prepare = vi.fn(async () => true).mockRejectedValueOnce(new Error('Unavailable'));
    const c = new NarrationController({ stop: async () => {}, speak, prepare });
    c.setAllowed(true);
    await c.play('Old reader');
    expect(speak).not.toHaveBeenCalled();
    await c.play('Old reader');
    expect(speak.mock.calls[0][2]).toBe('en-IN');
  });
});
