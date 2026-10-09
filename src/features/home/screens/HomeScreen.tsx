import { homeStyles as styles, tabletStyles as t } from '../styles/homeStyles';
import React, { useRef, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import type { Activity, KidsuuHomeScreenProps } from '../domain/types';
import KidsuuPlayScene from '../components/PlayScene/PlayScene';
import { responsiveHomeLayout } from '../domain/responsiveLayout';

type Tab = 'home' | 'explore' | 'saved';
const ART: Record<string, ImageSourcePropType> = {
  learning: require('../assets/learning.png'),
  games: require('../assets/games.png'),
  rhymes: require('../assets/rhymes.png'),
  stories: require('../assets/stories.png'),
  avatar: require('../assets/avatar.png'),
  wordmark: require('../assets/wordmark.png'),
};
const ICONS: Record<string, ImageSourcePropType> = {
  home: require('../assets/icon-home.png'),
  compass: require('../assets/icon-compass.png'),
  heart: require('../assets/icon-heart.png'),
  shield: require('../assets/icon-shield.png'),
  chevron: require('../assets/icon-chevron.png'),
  arrow: require('../assets/icon-arrow.png'),
  pause: require('../assets/icon-pause.png'),
  play: require('../assets/icon-play.png'),
  clock: require('../assets/icon-clock.png'),
  close: require('../assets/icon-close.png'),
  search: require('../assets/icon-search.png'),
};
function Icon({
  name,
  size = 20,
  color = '#A394AA',
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return (
    <Image
      accessible={false}
      source={ICONS[name]}
      style={{ width: size, height: size, tintColor: color }}
    />
  );
}

/** Place inside your app's existing safe-area container. No navigation package required. */
export default function KidsuuHomeScreen({
  catalog,
  profileName,
  onOpenProfiles,
  onOpenActivity,
  onOpenParents,
  initialAgeGroup = '4–5',
  onAgeGroupChange,
  initialSavedIds = [],
  savedIds,
  saving = false,
  onSavedChange,
  continueProgress,
  bottomInset = 0,
  isFocused = true,
}: KidsuuHomeScreenProps) {
  const { categories, activities, ages } = catalog;
  const windowSize = useWindowDimensions();
  const [pane, setPane] = useState({ width: windowSize.width, height: windowSize.height });
  const layout = responsiveHomeLayout(pane.width, pane.height);
  const tablet = layout.tablet;
  const [age, setAge] = useState(Math.max(0, ages.indexOf(initialAgeGroup)));
  const [tab, setTab] = useState<Tab>('home');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [localSaved, setSaved] = useState<string[]>(initialSavedIds);
  const saved = savedIds ?? localSaved;
  const [ageModal, setAgeModal] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const heroBottom = useRef(400);
  const [heroVisible, setHeroVisible] = useState(true);
  const [scenePaused, setScenePaused] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const visibleActivities = activities.filter(
    (a) => !a.ageGroups || a.ageGroups.includes(ages[age]),
  );
  const title = (a: Activity) => a.titles[age];
  const open = (a: Activity) =>
    onOpenActivity({ ...a, title: title(a), durationMinutes: a.minutes[age], ageGroup: ages[age] });
  const toggleSaved = (id: string) => {
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    if (saving) return;
    if (savedIds === undefined) setSaved(next);
    onSavedChange?.(next);
  };
  const navigate = (next: Tab) => {
    setTab(next);
    setFilter('all');
    setQuery('');
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const explore = (id = 'all') => {
    setTab('explore');
    setFilter(id);
    setQuery('');
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const category = (id: string) => categories.find((c) => c.id === id)!;
  const results = visibleActivities.filter(
    (a) =>
      (filter === 'all' || a.category === filter) &&
      title(a).toLowerCase().includes(query.toLowerCase()),
  );
  const savedItems = visibleActivities.filter((a) => saved.includes(a.id));
  const continuing = activities.find((a) => a.id === continueProgress?.activityId);
  const ratio =
    continueProgress && continueProgress.total > 0
      ? Math.max(0, Math.min(1, continueProgress.completed / continueProgress.total))
      : 0;

  function activityCard(a: Activity, compact = false) {
    const c = category(a.category),
      selected = saved.includes(a.id);
    return (
      <Pressable
        key={a.id}
        accessibilityRole="button"
        accessibilityLabel={`Preview ${title(a)}`}
        onPress={() => open(a)}
        style={[
          styles.activity,
          tablet && t.activity,
          { width: compact ? layout.recommendationWidth : layout.activityWidth },
        ]}
      >
        <View style={[styles.thumb, tablet && t.thumb, { backgroundColor: c.color }]}>
          <Image
            source={ART[a.category]}
            accessible={false}
            style={[styles.thumbImage, tablet && t.thumbImage]}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${selected ? 'Unsave' : 'Save'} ${title(a)}`}
          disabled={saving}
          accessibilityState={{ selected, disabled: saving }}
          hitSlop={6}
          onPress={(e) => {
            e.stopPropagation();
            toggleSaved(a.id);
          }}
          style={[styles.saveButton, tablet && t.saveButton, selected && styles.savedButton]}
        >
          <Icon name="heart" size={16} color={selected ? '#8D5DB6' : '#A89AB3'} />
        </Pressable>
        <Text style={[styles.eyebrow, tablet && t.eyebrow, { color: c.ink }]}>
          {c.name.toUpperCase()}
        </Text>
        <Text style={[styles.activityTitle, tablet && t.activityTitle]}>{title(a)}</Text>
        <View style={styles.meta}>
          <Icon name="clock" size={11} />
          <Text style={[styles.metaText, tablet && t.metaText]}>
            {a.minutes[age]} min · Ages {ages[age]}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View
      style={styles.screen}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setPane((old) =>
          Math.abs(old.width - width) > 1 || Math.abs(old.height - height) > 1
            ? { width, height }
            : old,
        );
      }}
    >
      <ScrollView
        ref={scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          {
            maxWidth: 1120 + 2 * layout.padding,
            paddingHorizontal: layout.padding,
            paddingTop: tablet ? (layout.landscape ? 18 : 24) : 12,
            paddingBottom: tablet ? 32 : 24,
          },
        ]}
        onScroll={(e) => setHeroVisible(e.nativeEvent.contentOffset.y < heroBottom.current)}
        scrollEventThrottle={160}
      >
        <View
          style={[
            styles.topbar,
            tablet && t.topbar,
            tablet && layout.landscape && { marginBottom: 14 },
          ]}
        >
          <Image
            source={ART.wordmark}
            accessibilityLabel="Kidsuu"
            style={[styles.wordmark, tablet && t.wordmark]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              onOpenProfiles
                ? `Choose profile. Current age ${ages[age]}`
                : `Change age group. Current age ${ages[age]}`
            }
            onPress={() => (onOpenProfiles ? onOpenProfiles() : setAgeModal(true))}
            style={[styles.agePill, tablet && t.agePill]}
          >
            <Text style={[styles.agePillText, tablet && t.agePillText]}>Age {ages[age]}</Text>
            <Icon name="chevron" size={13} color="#94776D" />
          </Pressable>
        </View>
        {tab === 'home' && (
          <>
            <View
              style={[
                styles.greeting,
                tablet && t.greeting,
                tablet && layout.landscape && { marginBottom: 16 },
              ]}
            >
              <View style={[styles.avatar, tablet && t.avatar]}>
                <Image source={ART.avatar} accessible={false} style={styles.avatarImage} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.greetingTitle, tablet && t.greetingTitle]}>
                  {profileName ? `Hey, ${profileName}!` : 'Hey, little explorer!'}
                </Text>
                <Text style={[styles.greetingSub, tablet && t.greetingSub]}>
                  A little learning. A whole lot of fun.
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.hero,
                { minHeight: layout.heroHeight, justifyContent: 'center' },
                tablet && t.hero,
              ]}
              onLayout={(e) => {
                heroBottom.current = e.nativeEvent.layout.y + e.nativeEvent.layout.height;
              }}
            >
              <KidsuuPlayScene
                width={layout.sceneWidth}
                active={isFocused && heroVisible && !ageModal}
                paused={scenePaused}
                onMotionAvailabilityChange={setMotionAllowed}
                style={styles.heroScene}
              />
              <Text style={[styles.heroKicker, tablet && t.heroKicker]}>LET CURIOSITY LEAD</Text>
              <Text style={[styles.heroTitle, tablet && t.heroTitle]}>
                {'Big little\nadventures.'}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => explore()}
                style={[styles.primary, tablet && t.primary]}
              >
                <Text style={[styles.primaryText, tablet && t.primaryText]}>Start exploring</Text>
                <Icon name="arrow" color="#FFFFFF" size={14} />
              </Pressable>
              <Pressable
                style={[styles.sceneToggle, tablet && t.sceneToggle]}
                onPress={() => setScenePaused((v) => !v)}
                disabled={!motionAllowed}
                accessibilityRole="button"
                accessibilityState={{ selected: scenePaused, disabled: !motionAllowed }}
                accessibilityLabel={
                  !motionAllowed
                    ? 'Animation disabled by Reduce Motion'
                    : scenePaused
                      ? 'Play character animation'
                      : 'Pause character animation'
                }
              >
                <Icon
                  name={scenePaused || !motionAllowed ? 'play' : 'pause'}
                  size={13}
                  color="#B29370"
                />
              </Pressable>
            </View>
            <SectionTitle
              text="What feels fun today?"
              tablet={tablet}
              landscape={layout.landscape}
            />
            <View style={[styles.categoryGrid, { gap: layout.gap }]}>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Explore ${c.name}`}
                  onPress={() => explore(c.id)}
                  style={[
                    styles.category,
                    tablet && t.category,
                    { backgroundColor: c.color, width: layout.categoryWidth, flexGrow: 0 },
                  ]}
                >
                  <Text style={[styles.categoryTitle, tablet && t.categoryTitle]}>{c.name}</Text>
                  <Text style={[styles.categoryHint, tablet && t.categoryHint, { color: c.ink }]}>
                    {c.hint}
                  </Text>
                  <Image
                    source={ART[c.id]}
                    accessible={false}
                    style={[styles.categoryArt, tablet && t.categoryArt]}
                  />
                </Pressable>
              ))}
            </View>
            {!!continuing && !!continueProgress && (
              <>
                <SectionTitle
                  text="A little more exploring"
                  tablet={tablet}
                  landscape={layout.landscape}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Continue ${title(continuing)}. ${continueProgress.completed} of ${continueProgress.total} activities.`}
                  onPress={() => open(continuing)}
                  style={[styles.continueCard, tablet && t.continueCard]}
                >
                  <View style={[styles.continueArt, tablet && t.continueArt]}>
                    <Image
                      source={ART[continuing.category]}
                      accessible={false}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                  <View style={styles.continueCopy}>
                    <Text style={[styles.eyebrow, tablet && t.eyebrow]}>
                      {continuing.category.toUpperCase()} · {continuing.minutes[age]} MIN
                    </Text>
                    <Text style={[styles.continueTitle, tablet && t.continueTitle]}>
                      {title(continuing)}
                    </Text>
                    <View style={styles.progressRow}>
                      <View style={[styles.track, tablet && t.track]}>
                        <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
                      </View>
                      <Text style={[styles.progressText, tablet && t.progressText]}>
                        {continueProgress.completed} of {continueProgress.total}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.playOrb, tablet && t.playOrb]}>
                    <Icon name="play" color="#FFFFFF" size={14} />
                  </View>
                </Pressable>
              </>
            )}
            <SectionTitle
              text="Picked for your curious mind"
              tablet={tablet}
              landscape={layout.landscape}
              action={() => explore()}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.recommendations, { gap: layout.gap }]}
            >
              {visibleActivities.slice(0, 3).map((a) => activityCard(a, true))}
            </ScrollView>
            <Text style={[styles.bottomNote, tablet && t.bottomNote]}>
              {'Every little discovery counts.\nExplore at your own happy pace.'}
            </Text>
          </>
        )}
        {tab === 'explore' && (
          <>
            <Text style={[styles.pageTitle, tablet && t.pageTitle]}>A world to explore</Text>
            <Text style={[styles.pageSub, tablet && t.pageSub]}>
              Find your next little adventure.
            </Text>
            <View style={[styles.search, tablet && t.search]}>
              <Icon name="search" size={18} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Find something fun…"
                placeholderTextColor="#A491A7"
                accessibilityLabel="Search activities"
                style={[styles.searchInput, tablet && t.searchInput]}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: filter === c.id }}
                  onPress={() => setFilter(c.id)}
                  style={[
                    styles.filter,
                    tablet && t.filter,
                    filter === c.id && styles.activeFilter,
                  ]}
                >
                  <Text style={[styles.filterText, filter === c.id && { color: '#8359AC' }]}>
                    {c.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={[styles.activityGrid, { justifyContent: 'flex-start', gap: layout.gap }]}>
              {results.map((a) => activityCard(a))}
            </View>
            {!results.length && (
              <Text style={styles.emptyText}>
                No adventures found. Try another word or category.
              </Text>
            )}
          </>
        )}
        {tab === 'saved' && (
          <>
            <Text style={[styles.pageTitle, tablet && t.pageTitle]}>Little favourites</Text>
            <Text style={[styles.pageSub, tablet && t.pageSub]}>
              Happy discoveries, ready for another day.
            </Text>
            {savedItems.length ? (
              <View
                style={[styles.activityGrid, { justifyContent: 'flex-start', gap: layout.gap }]}
              >
                {savedItems.map((a) => activityCard(a))}
              </View>
            ) : (
              <View style={styles.empty}>
                <Image source={ART.stories} accessible={false} style={styles.emptyArt} />
                <Text style={styles.emptyTitle}>A place for your favourites</Text>
                <Text style={styles.emptyText}>
                  {'Tap a heart on any activity.\nWe’ll keep it here while you explore.'}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => explore()}
                  style={[styles.primary, tablet && t.primary]}
                >
                  <Text style={[styles.primaryText, tablet && t.primaryText]}>
                    Find something fun
                  </Text>
                  <Icon name="arrow" color="#FFFFFF" size={14} />
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
      <View
        style={[
          styles.nav,
          {
            paddingBottom: Math.max(tablet ? 15 : 12, bottomInset),
            paddingHorizontal: Math.max(tablet ? 20 : 12, (pane.width - 880) / 2),
          },
          tablet && t.nav,
        ]}
      >
        {[
          { id: 'home', icon: 'home', label: 'Home' },
          { id: 'explore', icon: 'compass', label: 'Explore' },
          { id: 'saved', icon: 'heart', label: 'Saved' },
          { id: 'parents', icon: 'shield', label: 'Grown-ups' },
        ].map((n) => {
          const active = n.id === tab;
          return (
            <Pressable
              key={n.id}
              accessibilityRole="tab"
              accessibilityLabel={n.label}
              accessibilityState={{ selected: active }}
              onPress={() => (n.id === 'parents' ? onOpenParents() : navigate(n.id as Tab))}
              style={[styles.navItem, tablet && t.navItem]}
            >
              <View style={[styles.navSymbol, tablet && t.navSymbol, active && styles.navActive]}>
                <Icon name={n.icon} size={22} color={active ? '#9168B6' : '#A394AA'} />
              </View>
              <Text style={[styles.navLabel, tablet && t.navLabel, active && { color: '#9168B6' }]}>
                {n.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Modal
        visible={ageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setAgeModal(false)}
      >
        <View
          style={[
            styles.overlay,
            tablet && { justifyContent: 'center', alignItems: 'center', padding: 28 },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityLabel="Close age selector"
            onPress={() => setAgeModal(false)}
          />
          <View
            style={[styles.ageSheet, tablet && { width: '100%', maxWidth: 520 }]}
            accessibilityViewIsModal
          >
            <View style={styles.sheetTop}>
              <Text style={[styles.pageTitle, tablet && t.pageTitle]}>Made for their age</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setAgeModal(false)}
                style={[styles.closeButton, tablet && t.closeButton]}
              >
                <Icon name="close" size={18} />
              </Pressable>
            </View>
            <Text style={[styles.pageSub, tablet && t.pageSub]}>
              Choose a little world of age-based activities.
            </Text>
            <View style={styles.ageGrid}>
              {ages.map((a, i) => (
                <Pressable
                  key={a}
                  accessibilityRole="button"
                  accessibilityLabel={`Ages ${a}`}
                  accessibilityState={{ selected: age === i }}
                  onPress={() => {
                    setAge(i);
                    setAgeModal(false);
                    setQuery('');
                    onAgeGroupChange?.(a);
                  }}
                  style={[styles.ageOption, age === i && styles.ageSelected]}
                >
                  <Text style={styles.ageNumber}>{a}</Text>
                  <Text style={styles.ageYears}>years</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.ageFine}>Age groups, not individual child profiles.</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SectionTitle({
  text,
  action,
  tablet,
  landscape,
}: {
  text: string;
  action?: () => void;
  tablet: boolean;
  landscape: boolean;
}) {
  return (
    <View
      style={[styles.sectionRow, tablet && t.sectionRow, tablet && landscape && { marginTop: 22 }]}
    >
      <Text style={[styles.sectionTitle, tablet && t.sectionTitle]}>{text}</Text>
      {action && (
        <Pressable accessibilityRole="button" onPress={action} hitSlop={8}>
          <Text style={[styles.smallLink, tablet && t.smallLink]}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}
