import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { worldCatalog } from '../data/catalog';
import { WORLD_ART } from '../data/assets';
import { Glyph, Lantern, Plank, Plant } from '../components/WorldArt';
import { PuzzleBoard, Tool } from '../components/PuzzleBoard';
import { StoryStage } from '../components/StoryStage';
import type { WorldPackage } from '../domain/worldPackage';
import { editionKey, type ContentLocale } from '../../content/domain/contentPackage';
import { progressMatches, resumeEdition } from '../../content/domain/editionProgress';
import { deviceNarrator } from '../../activities/audio/deviceNarration';
import { useReaderNarration } from '../../activities/audio/useReaderNarration';
import { EditionHistoryScreen } from '../../content/screens/EditionHistoryScreen';
import type { FamilyState, FamilyStore } from '../../family/domain/FamilyStore';
interface Props {
  store: FamilyStore;
  state: FamilyState;
  foreground: boolean;
  isDemo: boolean;
  onBack: () => void;
  initialContentId?: string | null;
}
const text = (hi: boolean, en: string, hindi: string) => (hi ? hindi : en);
const kindName = (kind: WorldPackage['kind'], hi: boolean) =>
  ({
    game: text(hi, 'Games', 'खेल'),
    learning: text(hi, 'Learning', 'सीखें'),
    story: text(hi, 'Stories', 'कहानियाँ'),
    rhyme: text(hi, 'Spoken rhymes', 'बोली हुई कविताएँ'),
  })[kind];
const accent: Record<WorldPackage['mode'], string> = {
  pattern: '#D8E9CE',
  bridge: '#DAECED',
  lantern: '#E7DEBB',
  seed: '#F5E5CC',
  garden: '#D5E6CD',
  story: '#EBDDCB',
  rhyme: '#E4E4F1',
};
function Cover({ mode }: { mode: WorldPackage['mode'] }) {
  return (
    <View style={w.coverArt}>
      {mode === 'pattern' ? (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Glyph token="leaf" size={46} />
          <Glyph token="flower" size={46} />
          <Glyph token="leaf" size={46} />
        </View>
      ) : mode === 'bridge' ? (
        <View style={{ transform: [{ rotate: '-7deg' }] }}>
          <Plank length={5} unit={24} />
        </View>
      ) : mode === 'lantern' ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Lantern lit size={56} />
          <Lantern lit={false} size={56} />
        </View>
      ) : mode === 'rhyme' ? (
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <Glyph token="drop" size={44} />
          <Glyph token="drop" size={34} />
          <Glyph token="sun" size={46} />
        </View>
      ) : (
        <Plant size={65} />
      )}
    </View>
  );
}
export function WorldLibraryScreen(props: Props) {
  const { state, isDemo, foreground, onBack, store } = props;
  const [locale, setLocale] = useState<ContentLocale>('en-IN');
  const [id, setId] = useState<string | null>(props.initialContentId ?? null);
  const [filter, setFilter] = useState('all');
  const [history, setHistory] = useState(false);
  const { width } = useWindowDimensions();
  const hi = locale === 'hi-IN';
  const current = worldCatalog.find((p) => p.contentId === id && p.locale === locale);
  if (!__DEV__ || !isDemo || !foreground || !state.parentUnlocked || !state.selectedId) return null;
  if (history)
    return (
      <EditionHistoryScreen
        state={state}
        catalog={worldCatalog}
        locale={locale}
        isDemo={isDemo}
        foreground={foreground}
        onBack={() => setHistory(false)}
        onReload={() => void store.load()}
        onOpen={(key) => {
          const p = worldCatalog.find((p) => editionKey(p) === key);
          const latest = store.getSnapshot();
          if (
            p &&
            !latest.loading &&
            !latest.busy &&
            !latest.error &&
            latest.parentUnlocked &&
            latest.selectedId === state.selectedId
          ) {
            setLocale(p.locale);
            setId(p.contentId);
            setHistory(false);
          }
        }}
      />
    );
  if (current) {
    const row = state.editions[state.selectedId]?.find((r) => r.editionKey === editionKey(current));
    if (!row || progressMatches(current, row))
      return (
        <WorldPlayer
          key={state.selectedId + editionKey(current)}
          {...props}
          content={current}
          onBack={() => {
            deviceNarrator.setAllowed(false);
            setId(null);
          }}
          onLanguage={() => {
            deviceNarrator.setAllowed(false);
            setLocale(hi ? 'en-IN' : 'hi-IN');
          }}
        />
      );
  }
  return (
    <ScrollView style={w.screen} contentContainerStyle={w.library}>
      <View style={w.top}>
        <Tool label={text(hi, 'Back', 'वापस')} onPress={onBack} />
        <View style={w.language}>
          <Tool
            label="English"
            primary={!hi}
            disabled={state.busy}
            onPress={() => setLocale('en-IN')}
          />
          <Tool
            label="हिन्दी"
            primary={hi}
            disabled={state.busy}
            onPress={() => setLocale('hi-IN')}
          />
        </View>
      </View>
      <ImageBackground
        source={WORLD_ART.woodland}
        accessible={false}
        imageStyle={{ borderRadius: 28 }}
        style={w.hero}
      >
        <View style={w.heroPaper}>
          <Text style={w.eyebrow}>{text(hi, 'KIDSUU • FRESH WORLDS', 'KIDSUU • नई दुनिया')}</Text>
          <Text accessibilityRole="header" style={w.heroTitle}>
            {text(hi, 'Small worlds.\nBig discoveries.', 'छोटी दुनिया।\nनई खोज।')}
          </Text>
          <Text style={w.heroCopy}>
            {text(
              hi,
              'Build a trail, cross a river, light up a grove. Every adventure begins with an idea.',
              'रास्ता बनाओ, नदी पार करो, बाग रोशन करो। हर सफ़र एक नए विचार से शुरू होता है।',
            )}
          </Text>
        </View>
      </ImageBackground>
      <View style={w.review}>
        <Text style={w.reviewTitle}>
          {text(hi, 'Internal adult review', 'बड़ों के लिए समीक्षा')}
        </Text>
        <Text style={w.reviewText}>
          {text(
            hi,
            'Fresh original drafts. Content, language, rights and device review are pending. Explore together using a dummy profile.',
            'नए मौलिक ड्राफ्ट। विषय, भाषा, अधिकार और डिवाइस की समीक्षा बाकी है। डमी प्रोफ़ाइल से साथ में देखें।',
          )}
        </Text>
        <Tool
          label={text(hi, 'View edition history', 'संस्करणों का रिकॉर्ड देखें')}
          disabled={state.busy || state.loading}
          onPress={() => setHistory(true)}
        />
      </View>
      <View style={w.filters}>
        {['all', 'game', 'learning', 'story', 'rhyme'].map((kind) => (
          <Tool
            key={kind}
            label={
              kind === 'all'
                ? text(hi, 'All worlds', 'सभी')
                : kindName(kind as WorldPackage['kind'], hi)
            }
            primary={filter === kind}
            disabled={state.busy}
            onPress={() => setFilter(kind)}
          />
        ))}
      </View>
      {!!state.error && (
        <Text accessibilityRole="alert" style={w.error}>
          {state.error}
          <Text onPress={() => void store.load()}> {text(hi, 'Reload', 'फिर खोलें')}</Text>
        </Text>
      )}
      <View style={w.grid}>
        {worldCatalog
          .filter((p) => p.locale === locale && (filter === 'all' || p.kind === filter))
          .map((p) => {
            const row = state.editions[state.selectedId!]?.find(
              (r) => r.editionKey === editionKey(p),
            );
            const changed = !!row && !progressMatches(p, row);
            return (
              <Pressable
                key={p.contentId}
                accessibilityRole="button"
                accessibilityLabel={
                  p.title +
                  ', ' +
                  kindName(p.kind, hi) +
                  ', ' +
                  text(hi, 'ages ', 'उम्र ') +
                  p.ageGroup
                }
                accessibilityState={{ disabled: changed || state.busy || state.loading }}
                disabled={changed || state.busy || state.loading}
                onPress={() => {
                  store.clearError();
                  setId(p.contentId);
                }}
                style={({ pressed }) => [
                  w.card,
                  { width: width >= 1000 ? '31.8%' : width >= 600 ? '48.5%' : '100%' },
                  pressed && { opacity: 0.86 },
                  changed && { opacity: 0.5 },
                ]}
              >
                <View style={[w.cardScene, { backgroundColor: accent[p.mode] }]}>
                  <Cover mode={p.mode} />
                  <View style={w.age}>
                    <Text style={w.ageText}>{p.ageGroup}</Text>
                  </View>
                </View>
                <View style={w.cardBody}>
                  <Text style={w.cardKind}>{kindName(p.kind, hi)}</Text>
                  <Text style={w.cardTitle}>{p.title}</Text>
                  <Text style={w.cardCopy}>{p.subtitle}</Text>
                  <View style={w.cardFooter}>
                    <Text style={w.small}>
                      {row
                        ? text(
                            hi,
                            row.exploredUnitIds.length + ' parts explored',
                            row.exploredUnitIds.length + ' हिस्से देखे',
                          )
                        : text(
                            hi,
                            p.pages.length + ' little stops',
                            p.pages.length + ' छोटे पड़ाव',
                          )}
                    </Text>
                    <Text style={w.play}>
                      {changed
                        ? text(hi, 'Unavailable', 'उपलब्ध नहीं')
                        : text(hi, 'Explore →', 'देखें →')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
      </View>
    </ScrollView>
  );
}
function WorldPlayer(props: Props & { content: WorldPackage; onLanguage: () => void }) {
  const { content, state, store, foreground, onBack, onLanguage } = props;
  const hi = content.locale === 'hi-IN';
  const row = state.editions[state.selectedId!]?.find((r) => r.editionKey === editionKey(content));
  const [index, setIndex] = useState(() => resumeEdition(content, row));
  const [finished, setFinished] = useState(false),
    [notes, setNotes] = useState(false),
    [reducedMotion, setReducedMotion] = useState(true);
  const [solved, setSolved] = useState(false);
  const advancing = useRef(false);
  const page = content.pages[index];
  const audio = useReaderNarration(
    state.parent?.settings.soundEnabled ?? false,
    foreground && state.parentUnlocked,
    editionKey(content) + ':' + page.id,
    finished,
  );
  useEffect(() => {
    let mounted = true,
      eventSeen = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (mounted && !eventSeen) setReducedMotion(v);
      })
      .catch(() => {});
    const event = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => {
      eventSeen = true;
      setReducedMotion(v);
    });
    return () => {
      mounted = false;
      event.remove();
    };
  }, []);
  const onSolved = useCallback((value: boolean) => setSolved(value), []);
  const stop = useCallback(() => {
    void deviceNarrator.stop();
  }, []);
  const locked =
    state.busy || state.loading || !!state.error || !foreground || !state.parentUnlocked;
  const advance = async (action: 'explore' | 'skip') => {
    if (advancing.current || locked) return;
    advancing.current = true;
    stop();
    try {
      const ok = await store.recordEdition(content, page.id, action);
      if (!ok) return;
      if (index === content.pages.length - 1) setFinished(true);
      else {
        setSolved(false);
        setIndex((i) => i + 1);
      }
    } finally {
      advancing.current = false;
    }
  };
  const puzzle = ['pattern', 'bridge', 'lantern', 'garden'].includes(content.mode);
  const nextLabel =
    content.kind === 'story'
      ? text(hi, 'Next page', 'अगला पन्ना')
      : content.kind === 'rhyme'
        ? text(hi, 'Next verse', 'अगली पंक्तियाँ')
        : text(hi, solved ? 'Next stop' : 'Explore next stop', 'अगला पड़ाव देखें');
  return (
    <ScrollView
      style={w.screen}
      contentContainerStyle={w.player}
      keyboardShouldPersistTaps="handled"
    >
      <View style={w.top}>
        <Tool
          label={text(hi, 'Back to worlds', 'दुनिया में वापस')}
          disabled={state.busy}
          onPress={onBack}
        />
        <View style={w.language}>
          <Tool label={hi ? 'English' : 'हिन्दी'} disabled={locked} onPress={onLanguage} />
          <Tool
            label={text(hi, 'Grown-up notes', 'बड़ों के लिए नोट')}
            disabled={locked}
            onPress={() => {
              stop();
              setNotes((v) => !v);
            }}
          />
        </View>
      </View>
      <View style={w.playerHeading}>
        <View style={{ flex: 1 }}>
          <Text style={w.eyebrow}>
            {kindName(content.kind, hi)} · {text(hi, 'ages ', 'उम्र ')}
            {content.ageGroup}
          </Text>
          <Text accessibilityRole="header" style={w.playerTitle}>
            {content.title}
          </Text>
          <Text style={w.subtitle}>{content.subtitle}</Text>
        </View>
        <View style={w.stopBadge}>
          <Text style={w.stopText}>
            {text(hi, 'Stop ', 'पड़ाव ')}
            {index + 1}/{content.pages.length}
          </Text>
        </View>
      </View>
      {notes && (
        <View style={w.review}>
          <Text style={w.reviewTitle}>{text(hi, 'Draft review notes', 'ड्राफ्ट की समीक्षा')}</Text>
          <Text style={w.reviewText}>{content.parentNote}</Text>
          <Text style={w.small}>
            {text(
              hi,
              'Saved records mean parts deliberately explored. They do not measure correctness, understanding or time. No recorded singing or educational approval.',
              'रिकॉर्ड में जानबूझकर देखे गए हिस्से हैं। सही जवाब, समझ या समय का माप नहीं है। रिकॉर्ड किया गीत या शैक्षिक मंज़ूरी नहीं है।',
            )}
          </Text>
        </View>
      )}
      {!!state.error && (
        <View style={w.review}>
          <Text accessibilityRole="alert" style={w.error}>
            {state.error}
          </Text>
          <Tool
            label={text(hi, 'Reload saved records', 'रिकॉर्ड फिर खोलें')}
            onPress={() => {
              stop();
              void store.load();
            }}
          />
        </View>
      )}
      {finished ? (
        <View style={w.finish}>
          <Plant size={115} />
          <Text accessibilityRole="header" style={w.finishTitle}>
            {text(hi, 'A good place to pause.', 'यहाँ थोड़ा रुकें।')}
          </Text>
          <Text style={w.finishCopy}>
            {text(
              hi,
              'Our little adventure ends here. You can rest, talk together, or explore it again another day.',
              'हमारा छोटा सफ़र यहाँ पूरा हुआ। आराम करें, साथ में बात करें, या किसी और दिन फिर देखें।',
            )}
          </Text>
          {!!content.discussion && (
            <View style={w.review}>
              <Text style={w.reviewTitle}>
                {text(hi, 'If you feel like talking…', 'चाहें तो बात करें…')}
              </Text>
              <Text style={w.reviewText}>{content.discussion}</Text>
            </View>
          )}
          <View style={w.filters}>
            <Tool primary label={text(hi, 'Back to worlds', 'दुनिया में वापस')} onPress={onBack} />
            <Tool
              label={text(hi, 'Explore again', 'फिर देखें')}
              disabled={locked}
              onPress={() => {
                setIndex(0);
                setFinished(false);
                setSolved(false);
              }}
            />
          </View>
        </View>
      ) : (
        <>
          {content.kind !== 'rhyme' && (
            <Text style={[w.instruction, content.kind === 'story' && w.storyText]}>
              {page.text}
            </Text>
          )}
          {puzzle ? (
            <PuzzleBoard
              key={page.id}
              mode={content.mode}
              index={index}
              hi={hi}
              disabled={locked}
              reducedMotion={reducedMotion}
              onChange={stop}
              onSolved={onSolved}
            />
          ) : (
            <StoryStage
              key={page.id}
              content={content}
              index={index}
              disabled={locked}
              reducedMotion={reducedMotion}
              onChange={stop}
            />
          )}
          <View style={w.navigation}>
            <Tool
              label={text(hi, 'Previous', 'पिछला')}
              disabled={locked || index === 0}
              onPress={() => {
                stop();
                setSolved(false);
                setIndex((i) => i - 1);
              }}
            />
            <Tool
              label={
                audio.audio.status === 'idle'
                  ? text(hi, 'Listen', 'सुनें')
                  : text(hi, 'Stop voice', 'आवाज़ रोकें')
              }
              disabled={audio.audio.status === 'idle' && !audio.allowed}
              onPress={() => {
                if (audio.audio.status === 'idle')
                  void deviceNarrator.play(page.text, content.locale);
                else stop();
              }}
            />
            {page.optional && (
              <Tool
                label={text(hi, 'Skip this repeat', 'दोहराना छोड़ें')}
                disabled={locked}
                onPress={() => void advance('skip')}
              />
            )}
            <Tool
              primary
              label={
                state.busy
                  ? text(hi, 'Saving…', 'सहेज रहे हैं…')
                  : index === content.pages.length - 1
                    ? text(hi, 'Finish here', 'यहीं पूरा करें')
                    : nextLabel
              }
              disabled={locked}
              onPress={() => void advance('explore')}
            />
          </View>
          {audio.audio.error && (
            <Text accessibilityRole="alert" style={w.small}>
              {text(
                hi,
                'Read-aloud is unavailable. Every page can still be read together.',
                'आवाज़ अभी उपलब्ध नहीं है। हर पन्ना साथ में पढ़ सकते हैं।',
              )}
            </Text>
          )}
          <Text style={w.footerNote}>
            {text(
              hi,
              'Take your time. Help, watching, and stopping are always welcome.',
              'आराम से देखें। मदद लें, केवल देखें, या जब चाहें रुकें।',
            )}
          </Text>
        </>
      )}
    </ScrollView>
  );
}
const w = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F6ED' },
  library: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    padding: 24,
    paddingBottom: 50,
    gap: 24,
  },
  player: {
    width: '100%',
    maxWidth: 1010,
    alignSelf: 'center',
    padding: 22,
    paddingBottom: 40,
    gap: 20,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  language: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  hero: {
    minHeight: 300,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 22,
  },
  heroPaper: {
    maxWidth: 420,
    backgroundColor: 'rgba(255,253,237,.93)',
    padding: 22,
    borderRadius: 22,
  },
  eyebrow: { color: '#397360', fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  heroTitle: { color: '#254F3E', fontWeight: '800', fontSize: 38, lineHeight: 44, marginTop: 12 },
  heroCopy: { fontSize: 17, lineHeight: 26, color: '#4B6B55', marginTop: 12 },
  review: {
    backgroundColor: '#FFFCED',
    borderWidth: 1,
    borderColor: '#E1DDC6',
    padding: 18,
    borderRadius: 22,
    gap: 12,
  },
  reviewTitle: { fontWeight: '800', fontSize: 17, color: '#655D40' },
  reviewText: { fontSize: 16, lineHeight: 25, color: '#645F48' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: {
    backgroundColor: '#FFFEF9',
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#D8E4D5',
    overflow: 'hidden',
  },
  cardScene: { height: 155, padding: 16, alignItems: 'center', justifyContent: 'center' },
  coverArt: { alignItems: 'center', justifyContent: 'center', minHeight: 120 },
  age: {
    position: 'absolute',
    right: 14,
    top: 14,
    backgroundColor: 'rgba(255,255,246,.9)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  ageText: { color: '#3C5B45', fontWeight: '800', fontSize: 13 },
  cardBody: { padding: 19, gap: 9 },
  cardKind: { color: '#4A7A61', fontSize: 12, fontWeight: '800', letterSpacing: 0.7 },
  cardTitle: { fontSize: 23, lineHeight: 29, fontWeight: '800', color: '#2D5140' },
  cardCopy: { fontSize: 15, lineHeight: 23, color: '#64806A', minHeight: 46 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  small: { fontSize: 13, lineHeight: 21, color: '#697C64' },
  play: { fontSize: 15, fontWeight: '800', color: '#286B56' },
  playerHeading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 16 },
  playerTitle: { fontSize: 34, lineHeight: 42, color: '#284F3C', fontWeight: '800', marginTop: 8 },
  subtitle: { fontSize: 16, lineHeight: 25, color: '#64806A', marginTop: 6 },
  stopBadge: {
    borderWidth: 1.5,
    borderColor: '#D8DDC0',
    borderRadius: 18,
    padding: 13,
    backgroundColor: '#FFFAE8',
  },
  stopText: { fontSize: 15, fontWeight: '800', color: '#6A714C' },
  instruction: {
    fontSize: 20,
    lineHeight: 30,
    color: '#345A44',
    backgroundColor: '#FFFEF3',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DEE4CD',
  },
  storyText: { fontSize: 23, lineHeight: 35 },
  navigation: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    paddingTop: 10,
  },
  footerNote: { fontSize: 14, lineHeight: 22, textAlign: 'center', color: '#64765B' },
  finish: {
    padding: 25,
    alignItems: 'center',
    gap: 25,
    backgroundColor: '#FFFCED',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#D7E1C5',
  },
  finishTitle: {
    fontSize: 30,
    lineHeight: 39,
    fontWeight: '800',
    color: '#315940',
    textAlign: 'center',
  },
  finishCopy: {
    fontSize: 18,
    lineHeight: 29,
    color: '#5E7356',
    textAlign: 'center',
    maxWidth: 580,
  },
  error: { color: '#88433A', fontSize: 16, lineHeight: 25 },
});
