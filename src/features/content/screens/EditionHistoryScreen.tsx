import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { AGE_GROUPS, type AgeGroup } from '../../../../packages/contracts/src';
import { Button, Notice, Panel, s } from '../../family/components/FamilyControls';
import type { FamilyState } from '../../family/domain/FamilyStore';
import type { ContentLocale } from '../domain/contentPackage';
import {
  buildEditionHistory,
  filterEditionHistory,
  type HistoryCatalogEntry,
  type HistoryEntry,
} from '../domain/editionHistory';

export function EditionHistoryScreen({
  state,
  catalog,
  locale,
  isDemo,
  foreground,
  onBack,
  onReload,
  onOpen,
}: {
  state: FamilyState;
  catalog: readonly HistoryCatalogEntry[];
  locale: ContentLocale;
  isDemo: boolean;
  foreground: boolean;
  onBack: () => void;
  onReload: () => void;
  onOpen: (key: string) => void;
}) {
  const [language, setLanguage] = useState<ContentLocale | 'all'>('all');
  const [age, setAge] = useState<AgeGroup | 'all'>('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const copy = (en: string, hi: string) => (locale === 'hi-IN' ? hi : en);
  const child = state.children.find((c) => c.id === state.selectedId);
  if (!__DEV__ || !isDemo || !foreground || !state.parentUnlocked || !child) return null;
  let entries: HistoryEntry[] = [],
    invalid = false;
  if (!state.loading && !state.error) {
    try {
      entries = buildEditionHistory(catalog, state.editions, child.id);
    } catch {
      invalid = true;
    }
  }
  const visible = filterEditionHistory(entries, { locale: language, ageGroup: age, savedOnly });
  const locked = state.loading || state.busy || !!state.error || invalid;
  const saved = entries.filter((e) => e.hasRecord).length;
  return (
    <Panel
      title={copy('Edition history', 'संस्करणों का रिकॉर्ड')}
      subtitle={copy(
        'Adult draft review · device-local records, not learning scores',
        'वयस्क ड्राफ्ट समीक्षा · डिवाइस पर सहेजे रिकॉर्ड, सीखने के अंक नहीं',
      )}
      onBack={onBack}
    >
      <Notice error={state.error} loading={state.loading} onReload={onReload} />
      <View style={s.card}>
        <Text accessibilityRole="header" style={s.heading}>
          {child.nickname} · {copy('Profile ages', 'प्रोफ़ाइल की उम्र')} {child.ageGroup}
        </Text>
        <Text style={s.body}>
          {copy(
            'Only this profile’s Content Lab records are shown. Home activity totals are separate. No listening time, answers, ability, rank or mastery is inferred.',
            'यहाँ केवल इस प्रोफ़ाइल के कंटेंट लैब रिकॉर्ड हैं। होम की गतिविधियों के रिकॉर्ड अलग हैं। सुनने का समय, जवाब, योग्यता, रैंक या सीखने का स्तर नहीं मापा गया है।',
          )}
        </Text>
        <Text style={s.body}>
          {copy(
            'Older versions and other age bands remain saved after profile edits. They are not recommendations. Use the profile selector outside the lab to review another profile.',
            'प्रोफ़ाइल बदलने के बाद भी पुराने संस्करणों और दूसरी उम्र के रिकॉर्ड सहेजे रहते हैं। ये सुझाव नहीं हैं। दूसरी प्रोफ़ाइल देखने के लिए लैब से बाहर प्रोफ़ाइल चुनें।',
          )}
        </Text>
        {!locked && (
          <Text style={s.body}>
            {copy(
              `Saved edition records: ${saved} / 32. No automatic deletion when storage fills.`,
              `सहेजे संस्करणों के रिकॉर्ड: ${saved} / 32। जगह भरने पर पुराने रिकॉर्ड अपने-आप नहीं मिटेंगे।`,
            )}
          </Text>
        )}
      </View>
      {invalid ? (
        <View style={s.card}>
          <Text accessibilityRole="alert" style={s.body}>
            {copy(
              'History could not be validated. Nothing has been changed. Reload; do not erase storage to repair this view.',
              'रिकॉर्ड की जाँच पूरी नहीं हुई। कुछ बदला नहीं गया है। फिर लोड करें; इसे ठीक करने के लिए डेटा न मिटाएँ।',
            )}
          </Text>
          <Button label={copy('Reload', 'फिर लोड करें')} disabled={state.busy} onPress={onReload} />
        </View>
      ) : (
        !state.loading &&
        !state.error && (
          <>
            <View style={s.card}>
              <Text style={s.label}>{copy('Edition language', 'संस्करण की भाषा')}</Text>
              <View style={s.row}>
                {(['all', 'en-IN', 'hi-IN'] as const).map((l) => (
                  <Button
                    key={l}
                    label={
                      l === 'all'
                        ? copy('All languages', 'सभी भाषाएँ')
                        : l === 'en-IN'
                          ? 'English'
                          : 'हिन्दी'
                    }
                    selected={l === language}
                    disabled={locked}
                    onPress={() => setLanguage(l)}
                  />
                ))}
              </View>
              <Text style={s.label}>
                {copy(
                  'Edition age band — not current profile age',
                  'संस्करण की उम्र — अभी की प्रोफ़ाइल की उम्र नहीं',
                )}
              </Text>
              <View style={s.row}>
                {(['all', ...AGE_GROUPS] as const).map((a) => (
                  <Button
                    key={a}
                    label={a === 'all' ? copy('All ages', 'सभी उम्र') : a}
                    selected={a === age}
                    disabled={locked}
                    onPress={() => setAge(a)}
                  />
                ))}
              </View>
              <View style={s.row}>
                <Button
                  label={copy('All editions', 'सभी संस्करण')}
                  selected={!savedOnly}
                  disabled={locked}
                  onPress={() => setSavedOnly(false)}
                />
                <Button
                  label={copy('Saved records only', 'केवल सहेजे रिकॉर्ड')}
                  selected={savedOnly}
                  disabled={locked}
                  onPress={() => setSavedOnly(true)}
                />
                <Button
                  label={copy('Clear filters', 'फ़िल्टर हटाएँ')}
                  disabled={locked}
                  onPress={() => {
                    setLanguage('all');
                    setAge('all');
                    setSavedOnly(false);
                  }}
                />
              </View>
              <Text accessibilityLiveRegion="polite" style={s.body}>
                {copy(
                  `${visible.length} editions shown. Filters never delete or change history.`,
                  `${visible.length} संस्करण दिख रहे हैं। फ़िल्टर रिकॉर्ड बदलते या मिटाते नहीं हैं।`,
                )}
              </Text>
            </View>
            {saved === 0 && (
              <Text style={s.body}>
                {copy(
                  'No saved Content Lab actions for this profile yet. Opening a draft does not mark it explored.',
                  'इस प्रोफ़ाइल में कंटेंट लैब के चयन अभी सहेजे नहीं गए हैं। ड्राफ्ट खोलने से वह देखा हुआ दर्ज नहीं होता।',
                )}
              </Text>
            )}
            {visible.length === 0 && (
              <Text accessibilityLiveRegion="polite" style={s.body}>
                {copy(
                  'No editions match these filters. Clear filters to see the retained history.',
                  'इन फ़िल्टर में कोई संस्करण नहीं मिला। सहेजे रिकॉर्ड देखने के लिए फ़िल्टर हटाएँ।',
                )}
              </Text>
            )}
            {visible.map((entry) => (
              <HistoryCard
                key={`${child.id}:${entry.editionKey}`}
                entry={entry}
                locale={locale}
                locked={locked}
                onOpen={onOpen}
              />
            ))}
          </>
        )
      )}
    </Panel>
  );
}
function HistoryCard({
  entry: e,
  locale,
  locked,
  onOpen,
}: {
  entry: HistoryEntry;
  locale: ContentLocale;
  locked: boolean;
  onOpen: (key: string) => void;
}) {
  const [details, setDetails] = useState(false);
  const copy = (en: string, hi: string) => (locale === 'hi-IN' ? hi : en);
  const kind = e.kind
    ? {
        story: copy('Story', 'कहानी'),
        rhyme: copy('Spoken rhyme', 'बोली हुई कविता'),
        learning: copy('Learning activity', 'सीखने की गतिविधि'),
        game: copy('Game', 'खेल'),
      }[e.kind]
    : copy('Saved identity — content not linked', 'सहेजी पहचान — सामग्री से जुड़ी नहीं');
  return (
    <View style={s.card}>
      <Text style={s.label}>
        {kind} · {e.ageGroup} · {e.locale} · v{e.version}
      </Text>
      <Text
        accessibilityRole="header"
        accessibilityLanguage={e.title ? e.locale : locale}
        style={s.heading}
      >
        {e.title ?? e.contentId}
      </Text>
      <Text selectable style={s.body}>
        {e.editionKey}
      </Text>
      {e.availability !== 'current' && (
        <Text style={s.body}>
          {e.availability === 'changed'
            ? copy(
                'Changed same-version package. Saved counts below use the old unit list; opening is blocked. Ask the editor to create a new version.',
                'एक ही संस्करण की सामग्री बदल गई है। नीचे के रिकॉर्ड पुरानी इकाइयों के हैं; खोलना बंद है। संपादक से नया संस्करण बनाने को कहें।',
              )
            : e.availability === 'withdrawn'
              ? copy(
                  'Withdrawn from review. Saved history is retained; opening is unavailable.',
                  'समीक्षा से हटाया गया है। सहेजे रिकॉर्ड सुरक्षित हैं; इसे खोल नहीं सकते।',
                )
              : copy(
                  'Not in the current catalog. This may be an older or unavailable edition. History is retained without linking it to a new version.',
                  'अभी के कैटलॉग में नहीं है। यह पुराना या अनुपलब्ध संस्करण हो सकता है। इसे नए संस्करण से जोड़े बिना रिकॉर्ड सुरक्षित है।',
                )}
        </Text>
      )}
      <Text style={s.body}>
        {!e.hasRecord || e.requiredExplored + e.optionalExplored + e.skipped === 0
          ? copy('No saved actions.', 'कोई चयन सहेजा नहीं गया है।')
          : e.allRequiredExplored
            ? copy(
                'Required parts marked explored — not a learning assessment.',
                'ज़रूरी भाग देखे हुए दर्ज हैं — यह सीखने का आकलन नहीं है।',
              )
            : copy(
                'Some actions saved; required parts remain unmarked.',
                'कुछ चयन सहेजे गए हैं; कुछ ज़रूरी भाग अभी दर्ज नहीं हैं।',
              )}
      </Text>
      <Text style={s.body}>
        {copy(
          `Required parts marked explored: ${e.requiredExplored} / ${e.requiredTotal}. Optional parts explored: ${e.optionalExplored}. Optional skips: ${e.skipped}.`,
          `ज़रूरी भाग देखे हुए दर्ज: ${e.requiredExplored} / ${e.requiredTotal}। वैकल्पिक भाग देखे: ${e.optionalExplored}। वैकल्पिक भाग छोड़े: ${e.skipped}।`,
        )}
      </Text>
      {e.updatedAt && (
        <Text style={s.body}>
          {copy('Last save (UTC, device clock): ', 'पिछली बार सहेजा (UTC, डिवाइस की घड़ी): ')}
          {e.updatedAt.replace('T', ' ').slice(0, 16)}
        </Text>
      )}
      <View style={s.row}>
        <Button
          label={
            details
              ? copy('Hide unit records', 'भागों के रिकॉर्ड छिपाएँ')
              : copy('Show unit records', 'भागों के रिकॉर्ड देखें')
          }
          selected={details}
          disabled={locked}
          onPress={() => setDetails(!details)}
        />
        {e.availability === 'current' && (
          <Button
            label={copy('Open current draft', 'अभी का ड्राफ्ट खोलें')}
            disabled={locked}
            onPress={() => onOpen(e.editionKey)}
          />
        )}
      </View>
      {details && (
        <View style={{ gap: 10 }}>
          <Text style={s.label}>
            {copy('Unit IDs and explicit saved actions', 'भागों की पहचान और सहेजे चयन')}
          </Text>
          {e.units.map((u) => (
            <Text key={u.id} style={s.body}>
              {u.id} · {u.optional ? copy('optional', 'वैकल्पिक') : copy('required', 'ज़रूरी')} ·{' '}
              {u.state === 'explored'
                ? copy('marked explored', 'देखा हुआ दर्ज')
                : u.state === 'skipped'
                  ? copy('skipped — not explored', 'छोड़ा — देखा नहीं')
                  : copy('not marked', 'दर्ज नहीं')}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
