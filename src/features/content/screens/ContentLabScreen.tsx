import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Notice, Panel, s } from '../../family/components/FamilyControls';
import type { FamilyState, FamilyStore } from '../../family/domain/FamilyStore';
import { deviceNarrator } from '../../activities/audio/deviceNarration';
import { useReaderNarration } from '../../activities/audio/useReaderNarration';
import { pilotCatalog } from '../data/demo/catalog';
import { interactiveCatalog } from '../data/demo/interactiveCatalog';
import { isInteractive, type LabPackage } from '../domain/interactivePackage';
import { InteractiveStage } from '../components/InteractiveStage';
import { ReaderScene, StoryFriends } from '../components/ReaderScene';
import { canPreview, editionKey, type ContentLocale } from '../domain/contentPackage';
import { hasExploredRequired, progressMatches, resumeEdition } from '../domain/editionProgress';
const labCatalog: readonly LabPackage[] = [...pilotCatalog, ...interactiveCatalog];
interface Props {
  store: FamilyStore;
  state: FamilyState;
  foreground: boolean;
  isDemo: boolean;
  onBack: () => void;
}
/** Internal adult-review route, not a child catalog or educational approval gate. */
export function ContentLabScreen(props: Props) {
  const { state, isDemo, onBack } = props;
  const [locale, setLocale] = useState<ContentLocale>('en-IN');
  const [contentId, setContentId] = useState<string | null>(null);
  const content = labCatalog.find((c) => c.contentId === contentId && c.locale === locale);
  if (!__DEV__ || !isDemo || !state.parentUnlocked || !state.selectedId) return null;
  const editions = state.editions[state.selectedId] ?? [];
  if (content && canPreview(content, __DEV__, isDemo, state.parentUnlocked))
    return (
      <EditionReader
        key={`${state.selectedId}:${editionKey(content)}`}
        {...props}
        content={content}
        onBack={() => {
          deviceNarrator.setAllowed(false);
          setContentId(null);
        }}
      />
    );
  return (
    <Panel
      title="Content Lab"
      subtitle="Adult editorial preview · not approved for children or public release"
      onBack={onBack}
    >
      <View style={s.card}>
        <Text style={s.heading}>Small stories. Thoughtful learning.</Text>
        <Text style={s.body}>
          Four research-informed draft packages, each in Hindi and English: two readers and two
          visual activities. Readers now include unreviewed AI backgrounds/props and reused original
          character artwork. No replacement character drawings, recorded audio or human sign-off are
          included. All visual and language reviews remain pending.
        </Text>
        <Text style={s.body}>
          Reviewing with dummy profile:{' '}
          {state.children.find((c) => c.id === state.selectedId)?.nickname}. All age bands are
          visible here for adult review, not personalized recommendations.
        </Text>
        <View style={s.row}>
          <Button
            label="English"
            selected={locale === 'en-IN'}
            onPress={() => setLocale('en-IN')}
          />
          <Button label="हिन्दी" selected={locale === 'hi-IN'} onPress={() => setLocale('hi-IN')} />
        </View>
      </View>
      {labCatalog
        .filter((c) => c.locale === locale && canPreview(c, __DEV__, isDemo, state.parentUnlocked))
        .map((c) => {
          const row = editions.find((r) => r.editionKey === editionKey(c));
          return (
            <View key={editionKey(c)} style={s.card}>
              <Text style={s.label}>
                {c.kind === 'story'
                  ? 'STORY'
                  : c.kind === 'rhyme'
                    ? 'SPOKEN RHYME'
                    : c.kind === 'learning'
                      ? 'LEARNING'
                      : 'GAME'}{' '}
                · Ages {c.ageGroup} · Draft v{c.contentVersion}
              </Text>
              <Text accessibilityRole="header" style={s.heading}>
                {c.title}
              </Text>
              <Text style={s.body}>
                {c.pages.length} parts ·{' '}
                {c.useMode === 'caregiver-shared'
                  ? 'Grown-up shared use required'
                  : 'Reading support available'}
              </Text>
              <Text style={s.body}>{c.parentNote}</Text>
              {row && (
                <Text style={s.body}>
                  {row.exploredUnitIds.length} marked explored · {row.skippedUnitIds.length}{' '}
                  optional parts skipped.{' '}
                  {hasExploredRequired(row)
                    ? 'Required parts explored; not a learning score.'
                    : 'Review in progress.'}
                </Text>
              )}
              <Button
                label={locale === 'hi-IN' ? 'ड्राफ्ट देखें' : 'Open draft'}
                disabled={state.busy || state.loading}
                onPress={() => setContentId(c.contentId)}
              />
            </View>
          );
        })}
      <Text style={s.body}>
        Edition progress stays on this device and is separate from legacy activity totals. No
        listening time, answers or mastery are recorded. Returning to the lab lets you select
        another language; editions resume independently.
      </Text>
    </Panel>
  );
}
function EditionReader({
  content,
  store,
  state,
  foreground,
  onBack,
}: Props & { content: LabPackage }) {
  const hi = content.locale === 'hi-IN';
  const copy = (en: string, hindi: string) => (hi ? hindi : en);
  const row = (state.editions[state.selectedId ?? ''] ?? []).find(
    (r) => r.editionKey === editionKey(content),
  );
  const [page, setPage] = useState(() => resumeEdition(content, row));
  const [finished, setFinished] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const mounted = useRef(true);
  const locked = state.busy || state.loading || !state.parentUnlocked || !foreground;
  const current = content.pages[page];
  const mismatch = !!row && !progressMatches(content, row);
  const { audio, allowed, screenReader } = useReaderNarration(
    state.parent?.settings.soundEnabled === true,
    foreground && state.parentUnlocked && !state.loading,
    `${editionKey(content)}:${page}`,
    finished,
  );
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const move = (index: number) => {
    void deviceNarrator.stop();
    setPage(index);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const advance = async (action: 'explore' | 'skip') => {
    void deviceNarrator.stop();
    if (locked || mismatch) return;
    const saved = await store.recordEdition(content, current.id, action);
    if (!saved || !mounted.current) return;
    if (page === content.pages.length - 1) setFinished(true);
    else move(page + 1);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  return (
    <ScrollView ref={scroll} style={s.screen} contentContainerStyle={s.content}>
      <Button
        label={copy('← Finish later / Content Lab', '← अभी रुकें / कंटेंट लैब')}
        onPress={() => {
          deviceNarrator.setAllowed(false);
          onBack();
        }}
      />
      <Text style={styles.draft}>
        {copy(
          isInteractive(content)
            ? 'ADULT PREVIEW · UNREVIEWED ACTIVITY'
            : 'ADULT PREVIEW · UNREVIEWED ILLUSTRATED DRAFT',
          isInteractive(content)
            ? 'वयस्क समीक्षा · अनसमीक्षित गतिविधि'
            : 'वयस्क समीक्षा · अनसमीक्षित चित्रों का ड्राफ्ट',
        )}
      </Text>
      <Text accessibilityRole="header" style={s.title}>
        {content.title}
      </Text>
      <Text style={s.body}>
        {copy(
          `Ages ${content.ageGroup} · ${content.locale} · version ${content.contentVersion}`,
          `उम्र ${content.ageGroup} · ${content.locale} · संस्करण ${content.contentVersion}`,
        )}
      </Text>
      <Notice
        error={state.error}
        loading={state.loading}
        onReload={() => {
          void deviceNarrator.stop();
          void store.load();
        }}
      />
      {mismatch && (
        <Text accessibilityRole="alert" style={s.body}>
          This draft changed without a new version. Saving is blocked; ask the editor to version the
          package. Existing progress is preserved.
        </Text>
      )}
      {!finished && content.kind === 'story' && page === 0 && (
        <StoryFriends locale={content.locale} />
      )}
      {finished ? (
        <View style={s.card}>
          <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={s.heading}>
            {copy('A good place to stop.', 'यहाँ रुक सकते हैं।')}
          </Text>
          <Text style={s.body}>
            {copy(
              'This records deliberate page actions, not listening, understanding or mastery. Optional skipped parts remain separate.',
              'यह केवल पन्नों पर किए गए चयन का रिकॉर्ड है, सुनने या सीखने का माप नहीं। छोड़े गए वैकल्पिक भाग अलग दर्ज हैं।',
            )}
          </Text>
          <Text style={s.label}>
            {copy('Optional conversation — no quiz', 'चाहें तो बात करें — कोई परीक्षा नहीं')}
          </Text>
          <Text style={s.body}>{content.discussion}</Text>
          <View style={s.row}>
            <Button
              label={copy('Read again', 'फिर पढ़ें')}
              disabled={locked}
              onPress={() => {
                setFinished(false);
                move(0);
              }}
            />
            <Button label={copy('Back to Content Lab', 'कंटेंट लैब पर जाएँ')} onPress={onBack} />
          </View>
        </View>
      ) : (
        <>
          <View style={[s.card, styles.page, content.kind === 'rhyme' && styles.rhyme]}>
            <Text accessibilityLiveRegion="polite" style={s.label}>
              {copy('Part', 'भाग')} {page + 1} / {content.pages.length}
              {current.optional ? copy(' · optional part', ' · वैकल्पिक भाग') : ''}
            </Text>
            {!isInteractive(content) && content.pages[page].scenes && (
              <ReaderScene
                key={`${editionKey(content)}:${current.id}`}
                frames={content.pages[page].scenes!}
                locale={content.locale}
                locked={locked}
                onChange={() => {
                  void deviceNarrator.stop();
                }}
              />
            )}
            <Text accessibilityLanguage={content.locale} style={styles.copy}>
              {current.text}
            </Text>
            {isInteractive(content) && (
              <InteractiveStage
                key={`${editionKey(content)}:${page}`}
                content={content}
                pageIndex={page}
                disabled={locked || mismatch}
                onInteraction={() => {
                  void deviceNarrator.stop();
                }}
                canRead={allowed && audio.status === 'idle'}
                onRead={(text) => {
                  if (allowed && !locked) void deviceNarrator.play(text, content.locale);
                }}
              />
            )}
          </View>
          <View style={s.row}>
            <Button
              label={copy('Previous', 'पिछला')}
              disabled={page === 0 || locked}
              onPress={() => move(page - 1)}
            />
            <Button
              label={
                state.busy
                  ? copy('Saving…', 'सहेज रहे हैं…')
                  : page === content.pages.length - 1
                    ? copy('Mark explored & finish', 'देखा हुआ दर्ज करें और समाप्त करें')
                    : copy('Mark explored & next', 'देखा हुआ दर्ज करें और आगे बढ़ें')
              }
              disabled={locked || mismatch}
              onPress={() => void advance('explore')}
            />
            {current.optional && (
              <Button
                label={copy('Skip this optional part', 'यह वैकल्पिक भाग छोड़ें')}
                disabled={locked || mismatch}
                onPress={() => void advance('skip')}
              />
            )}
          </View>
          <View style={s.card}>
            <Text style={s.heading}>{copy('Read aloud, if you like', 'चाहें तो सुनें')}</Text>
            <Text style={s.body}>
              {!state.parent?.settings.soundEnabled
                ? copy('Sound is off in parent settings.', 'अभिभावक सेटिंग में आवाज़ बंद है।')
                : screenReader
                  ? copy(
                      'Use your screen reader; extra narration is disabled.',
                      'अपने स्क्रीन रीडर से सुनें; अतिरिक्त आवाज़ बंद है।',
                    )
                  : screenReader === null
                    ? copy(
                        'Checking accessibility support. Text remains available.',
                        'सुलभता सुविधा जाँची जा रही है। पाठ पढ़ सकते हैं।',
                      )
                    : copy(
                        'Spoken, not sung. Requires a matching device voice. Offline availability depends on your device; nothing autoplays.',
                        'यह बोला हुआ पाठ है, गीत नहीं। संबंधित भाषा की डिवाइस आवाज़ चाहिए। ऑफ़लाइन सुविधा डिवाइस पर निर्भर है; आवाज़ अपने-आप नहीं चलेगी।',
                      )}
            </Text>
            <View style={s.row}>
              <Button
                label={copy('Read this part', 'यह भाग सुनें')}
                disabled={!allowed || locked || audio.status !== 'idle'}
                onPress={() => void deviceNarrator.play(current.text, content.locale)}
              />
              <Button
                label={copy('Stop voice', 'आवाज़ रोकें')}
                disabled={audio.status === 'idle'}
                onPress={() => void deviceNarrator.stop()}
              />
            </View>
            <Text accessibilityLiveRegion="polite" style={s.body}>
              {audio.error
                ? copy(
                    'Voice unavailable. Check installed language voices, or read the text together.',
                    'आवाज़ उपलब्ध नहीं है। डिवाइस की भाषा-आवाज़ जाँचें या साथ में पाठ पढ़ें।',
                  )
                : audio.status === 'starting'
                  ? copy('Preparing voice…', 'आवाज़ तैयार हो रही है…')
                  : audio.status === 'speaking'
                    ? copy('Reading this part.', 'यह भाग पढ़ा जा रहा है।')
                    : copy('No audio playing.', 'आवाज़ बंद है।')}
            </Text>
          </View>
        </>
      )}
      <View style={s.card}>
        <Text style={s.label}>{copy('For the grown-up', 'बड़ों के लिए')}</Text>
        <Text style={s.body}>{content.parentNote}</Text>
        <Text style={s.body}>
          {copy(
            'Native-language, educational, safety and asset reviews are pending. Parent preview is not identity verification or child-study consent.',
            'भाषा, शिक्षा, सुरक्षा और चित्रों की समीक्षा बाकी है। यह प्रीव्यू पहचान सत्यापन या बाल-अध्ययन की सहमति नहीं है।',
          )}
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  draft: { fontSize: 12, fontWeight: '700', color: '#755833', letterSpacing: 1 },
  page: { padding: 28, gap: 26, backgroundColor: '#EFE8F6', minHeight: 240 },
  rhyme: { backgroundColor: '#F8EDE3' },
  copy: { fontSize: 26, lineHeight: 42, color: '#493953', fontWeight: '500' },
});
