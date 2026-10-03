import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  AccessibilityInfo,
  AppState,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Notice, s } from '../../family/components/FamilyControls';
import type { FamilyState, FamilyStore } from '../../family/domain/FamilyStore';
import { getReading, type ReadingId } from '../data/readings';
import type { AgeGroup } from '../../../../packages/contracts/src';
import { readingCheckpoint, resumeReading } from '../domain/readerProgress';
import { deviceNarrator } from '../audio/deviceNarration';
const art = {
  story: require('../../home/assets/stories.png'),
  rhyme: require('../../home/assets/rhymes.png'),
};
export function ReadingScreen({
  id,
  ageGroup,
  store,
  state,
  foreground,
  isDemo,
  onBack,
}: {
  id: ReadingId;
  ageGroup: AgeGroup;
  store: FamilyStore;
  state: FamilyState;
  foreground: boolean;
  isDemo: boolean;
  onBack: () => void;
}) {
  const reading = getReading(id, ageGroup);
  const [page, setPage] = useState(() =>
    resumeReading(state.progress.find((row) => row.activityId === id)),
  );
  const [finished, setFinished] = useState(false);
  const [screenReader, setScreenReader] = useState<boolean | null>(null);
  const [active, setActive] = useState(AppState.currentState === 'active');
  const scroll = useRef<ScrollView>(null);
  const mounted = useRef(true);
  const audio = useSyncExternalStore(deviceNarrator.subscribe, deviceNarrator.getSnapshot);
  const sound = state.parent?.settings.soundEnabled === true;
  const allowed = sound && active && foreground && screenReader === false && !finished;
  const unit = reading.kind === 'story' ? 'Page' : 'Verse';
  useEffect(() => {
    mounted.current = true;
    let alive = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((enabled) => {
        if (alive) setScreenReader(enabled);
      })
      .catch(() => {});
    const accessibility = AccessibilityInfo.addEventListener('screenReaderChanged', (enabled) => {
      if (enabled) deviceNarrator.setAllowed(false);
      setScreenReader(enabled);
    });
    const lifecycle = AppState.addEventListener('change', (next) => {
      if (next !== 'active') deviceNarrator.setAllowed(false);
      setActive(next === 'active');
    });
    return () => {
      alive = false;
      mounted.current = false;
      accessibility.remove();
      lifecycle.remove();
      deviceNarrator.setAllowed(false);
    };
  }, []);
  useEffect(() => {
    deviceNarrator.setAllowed(allowed);
    return () => deviceNarrator.setAllowed(false);
  }, [allowed, page]);
  const back = () => {
    deviceNarrator.setAllowed(false);
    onBack();
  };
  const moveBack = () => {
    void deviceNarrator.stop();
    setPage((value) => Math.max(0, value - 1));
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const next = async () => {
    void deviceNarrator.stop();
    const saved = await store.record(id, readingCheckpoint(page));
    if (!saved || !mounted.current) return;
    if (page === reading.pages.length - 1) setFinished(true);
    else setPage((value) => value + 1);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  return (
    <ScrollView
      ref={scroll}
      style={s.screen}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <Button label="← Back to my world" onPress={back} />
      <Text accessibilityRole="header" style={s.title}>
        {reading.title}
      </Text>
      <Text style={s.body}>
        Ages {ageGroup} · Original {reading.kind === 'story' ? 'story' : 'spoken rhyme'} draft
        {isDemo ? ' · session-only progress' : ''}
      </Text>
      <Notice
        error={state.error}
        loading={state.loading}
        onReload={() => {
          void deviceNarrator.stop();
          void store.load();
        }}
      />
      {finished ? (
        <View style={s.card}>
          <Text style={s.large}>★</Text>
          <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={s.heading}>
            {reading.kind === 'story'
              ? 'The end. A little moment to remember.'
              : 'A gentle rhythm, all your own.'}
          </Text>
          <Text style={s.body}>
            All five {reading.kind === 'story' ? 'pages' : 'verses'} marked explored. This records
            your taps, not listening time or a reading score.
          </Text>
          <View style={s.row}>
            <Button
              label="Read again"
              onPress={() => {
                setPage(0);
                setFinished(false);
                scroll.current?.scrollTo({ y: 0, animated: false });
              }}
            />
            <Button label="Back to my world" onPress={back} />
          </View>
        </View>
      ) : (
        <>
          <View style={[s.card, styles.page, reading.kind === 'rhyme' && styles.rhyme]}>
            <View style={s.row}>
              <Image accessible={false} source={art[reading.kind]} style={styles.art} />
              <View style={{ flex: 1, minWidth: 150 }}>
                <Text accessibilityLiveRegion="polite" style={s.label}>
                  {unit} {page + 1} of {reading.pages.length}
                </Text>
                <Text style={s.body}>
                  {reading.kind === 'story'
                    ? 'Read together. Take your time.'
                    : 'Speak, tap gently, or simply listen.'}
                </Text>
              </View>
            </View>
            <Text style={styles.copy}>{reading.pages[page]}</Text>
            <View style={styles.together}>
              <Text style={s.label}>A little pause together</Text>
              <Text style={s.body}>
                {reading.kind === 'story'
                  ? page === 4
                    ? 'What would you like to remember from this story?'
                    : 'What did you notice? You can point, talk, or just think.'
                  : 'Try a word or a gentle beat if you like. Joining in is always optional.'}
              </Text>
            </View>
          </View>
          <View style={s.card}>
            <Text style={s.heading}>Listen together</Text>
            <Text style={s.body}>
              {!sound
                ? 'Sound is off. A grown-up can change it in parent settings.'
                : screenReader === null
                  ? 'Checking accessibility support. If this stays unavailable, you can still read the text together without extra narration.'
                  : screenReader
                    ? 'Use your screen reader to read the text. Extra narration is disabled to avoid overlapping voices.'
                    : 'Optional device voice · spoken, not sung. Voice availability and offline support depend on your device. Stop ends this page; Read aloud starts it again.'}
            </Text>
            {!!audio.error && (
              <Text accessibilityRole="alert" style={s.body}>
                {audio.error}
              </Text>
            )}
            <View style={s.row}>
              <Button
                label={audio.status === 'starting' ? 'Preparing voice…' : 'Read aloud'}
                disabled={!allowed || audio.status !== 'idle' || state.busy || state.loading}
                onPress={() => void deviceNarrator.play(reading.pages[page])}
              />
              <Button
                label="Stop reading"
                disabled={audio.status === 'idle'}
                onPress={() => void deviceNarrator.stop()}
              />
            </View>
            <Text accessibilityLiveRegion="polite" style={s.body}>
              {audio.status === 'speaking'
                ? 'Reading this page.'
                : audio.status === 'starting'
                  ? 'Preparing the device voice.'
                  : 'Nothing plays automatically.'}
            </Text>
          </View>
          <View style={s.row}>
            <Button
              label={`Previous ${unit.toLowerCase()}`}
              disabled={page === 0 || state.busy || state.loading}
              onPress={moveBack}
            />
            <Button
              label={
                state.busy
                  ? 'Saving…'
                  : page === 4
                    ? `Finish ${reading.kind}`
                    : `Mark ${unit.toLowerCase()} explored & next`
              }
              disabled={state.busy || state.loading}
              onPress={() => void next()}
            />
          </View>
          <Text style={s.body}>
            Progress changes only when you mark a {unit.toLowerCase()} explored. Playing audio or
            opening this reader does not complete it. Younger readers may need a grown-up.
          </Text>
        </>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  page: { backgroundColor: '#EFE6F6', padding: 24, gap: 24 },
  rhyme: { backgroundColor: '#FAEBE2' },
  art: { width: 96, height: 96, resizeMode: 'contain' },
  copy: { fontSize: 24, lineHeight: 38, color: '#51405F', fontWeight: '500' },
  together: { borderRadius: 18, padding: 18, gap: 8, backgroundColor: '#FFFAF2' },
});
