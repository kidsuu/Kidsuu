import * as Speech from 'expo-speech';
import { NarrationController, type NarrationPort } from '../domain/NarrationController';
import type { ContentLocale } from '../../content/domain/contentPackage';
const voices = new Map<ContentLocale, string>();
/** Uses the device's configured TTS engine. Availability/offline behaviour depend on
 * the OS and installed voice. Never send nicknames, progress or account data to TTS. */
export const deviceNarration: NarrationPort = {
  stop: () => Speech.stop(),
  prepare: async (locale) => {
    voices.delete(locale);
    const available = await Speech.getAvailableVoicesAsync();
    const normalized = (language: string) => language.toLowerCase().replaceAll('_', '-');
    const voice =
      available.find((v) => normalized(v.language) === normalized(locale)) ??
      available.find((v) => normalized(v.language).split('-')[0] === locale.split('-')[0]);
    if (!voice) return false;
    voices.set(locale, voice.identifier);
    return true;
  },
  speak: (text, callbacks, locale = 'en-IN') => {
    const voice = voices.get(locale);
    if (!voice) {
      callbacks.onError();
      return;
    }
    Speech.speak(text, {
      language: locale,
      voice,
      rate: 0.85,
      pitch: 1,
      useApplicationAudioSession: false,
      onDone: callbacks.onDone,
      onStopped: callbacks.onStopped,
      onError: callbacks.onError,
    });
  },
};

// One coordinator across reader mounts, so an old screen's asynchronous stop cannot
// race a new screen's utterance. Components cancel ownership on blur/unmount.
export const deviceNarrator = new NarrationController(deviceNarration);
