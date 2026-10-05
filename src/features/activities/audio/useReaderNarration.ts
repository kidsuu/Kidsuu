import { useEffect, useState, useSyncExternalStore } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
import { deviceNarrator } from './deviceNarration';
/** Shared device coordinator: no autoplay; revoke ownership on page/edition/route change. */
export function useReaderNarration(
  sound: boolean,
  foreground: boolean,
  pageKey: string,
  finished: boolean,
) {
  const [screenReader, setScreenReader] = useState<boolean | null>(null);
  const [active, setActive] = useState(AppState.currentState === 'active');
  const audio = useSyncExternalStore(deviceNarrator.subscribe, deviceNarrator.getSnapshot);
  const allowed = sound && foreground && active && screenReader === false && !finished;
  useEffect(() => {
    let mounted = true;
    let eventSeen = false;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => {
        if (mounted && !eventSeen) setScreenReader(value);
      })
      .catch(() => {});
    const accessibility = AccessibilityInfo.addEventListener('screenReaderChanged', (value) => {
      eventSeen = true;
      if (value) deviceNarrator.setAllowed(false);
      setScreenReader(value);
    });
    const lifecycle = AppState.addEventListener('change', (value) => {
      if (value !== 'active') deviceNarrator.setAllowed(false);
      setActive(value === 'active');
    });
    return () => {
      mounted = false;
      accessibility.remove();
      lifecycle.remove();
      deviceNarrator.setAllowed(false);
    };
  }, []);
  useEffect(() => {
    deviceNarrator.setAllowed(allowed);
    return () => deviceNarrator.setAllowed(false);
  }, [allowed, pageKey]);
  return { audio, allowed, screenReader };
}
