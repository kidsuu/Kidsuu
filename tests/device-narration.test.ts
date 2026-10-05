import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as Speech from 'expo-speech';
import { deviceNarration } from '../src/features/activities/audio/deviceNarration';
vi.mock('expo-speech', () => ({
  stop: vi.fn(async () => {}),
  speak: vi.fn(),
  getAvailableVoicesAsync: vi.fn(async () => []),
}));
const callbacks = () => ({ onDone: vi.fn(), onStopped: vi.fn(), onError: vi.fn() });
const voice = (language: string, identifier: string) => ({
  language,
  identifier,
  name: identifier,
  quality: 'Default' as Speech.VoiceQuality,
});
beforeEach(() => vi.clearAllMocks());
describe('native voice selection adapter (mocked, not audible QA)', () => {
  it('selects a Hindi voice and sends only final script with explicit locale', async () => {
    vi.mocked(Speech.getAvailableVoicesAsync).mockResolvedValue([
      voice('en-US', 'english'),
      voice('hi_IN', 'hindi'),
    ]);
    expect(await deviceNarration.prepare!('hi-IN')).toBe(true);
    deviceNarration.speak('ऊपर, नीचे।', callbacks(), 'hi-IN');
    expect(Speech.speak).toHaveBeenCalledWith(
      'ऊपर, नीचे।',
      expect.objectContaining({ language: 'hi-IN', voice: 'hindi' }),
    );
  });
  it('fails closed when a language disappears rather than reusing a stale voice', async () => {
    vi.mocked(Speech.getAvailableVoicesAsync).mockResolvedValue([voice('hi-IN', 'old-hindi')]);
    await deviceNarration.prepare!('hi-IN');
    vi.mocked(Speech.getAvailableVoicesAsync).mockResolvedValue([voice('en-IN', 'english')]);
    expect(await deviceNarration.prepare!('hi-IN')).toBe(false);
    const cb = callbacks();
    deviceNarration.speak('पाठ', cb, 'hi-IN');
    expect(Speech.speak).not.toHaveBeenCalled();
    expect(cb.onError).toHaveBeenCalledOnce();
  });
  it('prefers exact locale before same-language fallback; never another language', async () => {
    vi.mocked(Speech.getAvailableVoicesAsync).mockResolvedValue([
      voice('en-US', 'us'),
      voice('en-IN', 'india'),
    ]);
    await deviceNarration.prepare!('en-IN');
    deviceNarration.speak('Text', callbacks(), 'en-IN');
    expect(Speech.speak).toHaveBeenLastCalledWith(
      'Text',
      expect.objectContaining({ voice: 'india' }),
    );
    vi.mocked(Speech.getAvailableVoicesAsync).mockResolvedValue([voice('en-GB', 'uk')]);
    await deviceNarration.prepare!('en-IN');
    deviceNarration.speak('Text', callbacks(), 'en-IN');
    expect(Speech.speak).toHaveBeenLastCalledWith('Text', expect.objectContaining({ voice: 'uk' }));
  });
});
