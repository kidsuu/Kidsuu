import * as Speech from 'expo-speech';
import { NarrationController, type NarrationPort } from '../domain/NarrationController';
/** Uses the device's configured TTS engine. Availability/offline behaviour depend on
 * the OS and installed voice. Never send nicknames, progress or account data to TTS. */
export const deviceNarration: NarrationPort = {
  stop: () => Speech.stop(),
  speak: (text, callbacks) =>
    Speech.speak(text, {
      language: 'en',
      rate: 0.85,
      pitch: 1,
      useApplicationAudioSession: false,
      onDone: callbacks.onDone,
      onStopped: callbacks.onStopped,
      onError: callbacks.onError,
    }),
};

// One coordinator across reader mounts, so an old screen's asynchronous stop cannot
// race a new screen's utterance. Components cancel ownership on blur/unmount.
export const deviceNarrator = new NarrationController(deviceNarration);
