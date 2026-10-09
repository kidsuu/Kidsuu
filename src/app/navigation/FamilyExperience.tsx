import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Alert, AppState, BackHandler, ScrollView, Text, View } from 'react-native';
import HomeScreen from '../../features/home/screens/HomeScreen';
import sampleCatalog from '../../features/home/data/sampleCatalog.json';
import type { ActivitySelection, HomeCatalog } from '../../features/home/domain/types';
import { Button, Notice, Panel, s } from '../../features/family/components/FamilyControls';
import {
  ParentSettings,
  ProfileEditor,
  avatarLabels,
} from '../../features/family/screens/ParentScreens';
import type { ChildProfile } from '../../features/family/domain/FamilyRepository';
import type { FamilyStore } from '../../features/family/domain/FamilyStore';

type Screen = 'home' | 'profiles' | 'gate' | 'parents' | 'progress' | 'content-lab';
export function FamilyExperience({
  store,
  isDemo,
  foreground,
  onSignOut,
}: {
  store: FamilyStore;
  isDemo: boolean;
  foreground: boolean;
  onSignOut: () => void;
}) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const catalog: HomeCatalog =
    __DEV__ && isDemo
      ? // Content payload stays behind the development boundary, including Home titles.

        (require('../../features/world/data/homeCatalog.json') as HomeCatalog)
      : (sampleCatalog as HomeCatalog);
  const [screen, setScreen] = useState<Screen>('home');
  const [editor, setEditor] = useState<ChildProfile | 'new' | null>(null);
  const [activity, setActivity] = useState<ActivitySelection | null>(null);
  const selected = state.children.find((c) => c.id === state.selectedId);
  const exitParents = () => {
    store.lock();
    setEditor(null);
    setScreen('home');
  };
  const signOut = () => {
    void store.prepareSignOut().then((ok) => {
      if (ok) onSignOut();
    });
  };
  useEffect(() => {
    void store.load();
  }, [store]);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next !== 'active') {
        store.lock();
        setEditor(null);
        setScreen((value) =>
          value === 'parents' || value === 'gate' || value === 'content-lab' ? 'home' : value,
        );
      }
    });
    return () => sub.remove();
  }, [store]);
  useEffect(() => {
    if (screen !== 'parents' && screen !== 'content-lab') return;
    const timeout = setTimeout(
      () => {
        store.lock();
        setEditor(null);
        setScreen('gate');
      },
      5 * 60 * 1000,
    );
    return () => clearTimeout(timeout);
  }, [screen, store]);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen !== 'home') {
        store.lock();
        setEditor(null);
        setScreen('home');
        return true;
      }
      Alert.alert(
        'Sign out and clear local demo data?',
        'Saved profiles, settings, progress and bookmarks on this device will be erased.',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Sign out',
            style: 'destructive',
            onPress: () => {
              void store.prepareSignOut().then((ok) => {
                if (ok) onSignOut();
              });
            },
          },
        ],
      );
      return true;
    });
    return () => sub.remove();
  }, [screen, store, onSignOut]);
  const notice = (
    <Notice error={state.error} loading={state.loading} onReload={() => void store.load()} />
  );
  const back = () => {
    store.clearError();
    exitParents();
  };
  if (!state.ready)
    return (
      <Panel
        title={state.loading ? 'Opening your little world…' : 'Saved data needs attention'}
        onBack={() => {
          if (!state.loading && !state.busy)
            Alert.alert(
              'Erase local demo data?',
              'This clears saved profiles, settings, progress and bookmarks and returns to sign-in. It cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Erase & sign out', style: 'destructive', onPress: signOut },
              ],
            );
        }}
        subtitle="Demo data stays on this device. No automatic reset or cloud sync."
      >
        {notice}
        {!state.loading && store.isPersistent && (
          <Button
            label="Erase local demo data & sign out"
            disabled={state.busy}
            danger
            onPress={() =>
              Alert.alert(
                'Erase local demo data?',
                'This cannot be undone. Nothing is sent to Cloudflare.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Erase & sign out', style: 'destructive', onPress: signOut },
                ],
              )
            }
          />
        )}
      </Panel>
    );
  if (
    screen === 'gate' ||
    ((screen === 'parents' || screen === 'content-lab') && !state.parentUnlocked)
  )
    return (
      <Panel
        title="Grown-ups"
        onBack={back}
        subtitle={
          isDemo
            ? 'Development preview — not secure parent verification'
            : 'Parent verification required'
        }
      >
        {notice}
        <View style={s.card}>
          <Text style={s.body}>
            {isDemo
              ? 'These controls only change fictitious demo data saved on this device. This button is not an identity or age check. Live family controls will require real parent reauthentication.'
              : 'Verify your parent session before changing family details.'}
          </Text>
          <Button
            label={isDemo ? 'Open demo parent controls' : 'Verify parent access'}
            disabled={state.loading || state.busy}
            onPress={() => {
              void store.unlock().then((ok) => {
                if (ok) setScreen(activity ? 'content-lab' : 'parents');
              });
            }}
          />
        </View>
      </Panel>
    );
  if (__DEV__ && isDemo && screen === 'content-lab' && selected && state.parentUnlocked) {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { ContentLabScreen } =
      require('../../features/content/screens/ContentLabScreen') as typeof import('../../features/content/screens/ContentLabScreen');
    /* eslint-enable @typescript-eslint/no-require-imports */
    return (
      <ContentLabScreen
        key={selected.id}
        store={store}
        state={state}
        foreground={foreground}
        isDemo={isDemo}
        initialContentId={activity?.id}
        onBack={() => {
          setActivity(null);
          setScreen('parents');
        }}
      />
    );
  }
  if (screen === 'parents')
    return (
      <Panel
        title="Your family space"
        subtitle="Profiles, preferences & little milestones"
        onBack={back}
      >
        {notice}
        {editor ? (
          <ProfileEditor
            key={editor === 'new' ? 'new' : `${editor.id}-${editor.version}`}
            child={editor === 'new' ? undefined : editor}
            store={store}
            state={state}
            onDone={() => setEditor(null)}
          />
        ) : (
          <>
            <View style={s.card}>
              <Text style={s.heading}>Little explorers · {state.children.length}/5</Text>
              {state.children.map((child) => (
                <View key={child.id} style={s.card}>
                  <Text style={s.heading}>{child.nickname}</Text>
                  <Text style={s.body}>
                    {avatarLabels[child.avatar]} · Ages {child.ageGroup}
                  </Text>
                  <View style={s.row}>
                    <Button
                      label={`Edit ${child.nickname}`}
                      disabled={state.busy || state.loading}
                      onPress={() => setEditor(child)}
                    />
                    <Button
                      label={`Delete ${child.nickname}`}
                      danger
                      disabled={state.busy || state.loading}
                      onPress={() =>
                        Alert.alert(
                          'Delete this profile?',
                          `${child.nickname} and their progress will be removed. This cannot be undone.`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete profile',
                              style: 'destructive',
                              onPress: () => {
                                void store.deleteProfile(child);
                              },
                            },
                          ],
                        )
                      }
                    />
                  </View>
                </View>
              ))}
              <Button
                label="Add a child profile"
                disabled={state.children.length >= 5 || state.busy || state.loading}
                onPress={() => setEditor('new')}
              />
            </View>
            {__DEV__ && isDemo && selected && store.isPersistent && (
              <View style={s.card}>
                <Text style={s.heading}>Fresh worlds · adult draft review</Text>
                <Text style={s.body}>
                  New games, learning activities, stories and spoken rhymes in Hindi and English.
                  Review drafts together. Content and device approvals are pending.
                </Text>
                <Button
                  label="Open fresh worlds · drafts & history"
                  disabled={state.busy || state.loading}
                  onPress={() => {
                    setActivity(null);
                    setScreen('content-lab');
                  }}
                />
              </View>
            )}
            {state.parent && (
              <ParentSettings
                key={state.parent.version}
                store={store}
                state={state}
                onSignOut={signOut}
              />
            )}
          </>
        )}
      </Panel>
    );
  if (screen === 'profiles')
    return (
      <Panel
        title="Who’s exploring?"
        subtitle="Each profile has its own progress and saved activities."
        onBack={back}
      >
        {notice}
        <View style={s.grid}>
          {state.children.map((child) => (
            <View key={child.id} style={[s.card, { flexGrow: 1, flexBasis: 250 }]}>
              <Text style={s.heading}>{child.nickname}</Text>
              <Text style={s.body}>
                {avatarLabels[child.avatar]} · Ages {child.ageGroup}
              </Text>
              <Button
                label={
                  state.selectedId === child.id ? 'Continue exploring' : `Choose ${child.nickname}`
                }
                disabled={state.busy || state.loading}
                selected={state.selectedId === child.id}
                onPress={() => {
                  void store.select(child.id).then(() => setScreen('home'));
                }}
              />
            </View>
          ))}
        </View>
        <Button label="Manage profiles · Grown-ups" onPress={() => setScreen('gate')} />
      </Panel>
    );
  if (screen === 'progress')
    return (
      <Panel
        title={selected ? `${selected.nickname}’s little steps` : 'My progress'}
        subtitle="Activity steps completed, not a grade or a measure of learning time."
        onBack={back}
      >
        {notice}
        <View style={s.card}>
          <Text style={s.large}>
            {state.progress.filter((p) => p.completedSteps === p.totalSteps).length}
          </Text>
          <Text style={s.body}>Activities completed · {state.progress.length} started</Text>
          <Text style={s.body}>
            Home activity checkpoints only. Content Lab edition history is separate and available in
            the development Grown-ups area; these totals do not include it.
          </Text>
          <Text style={s.body}>
            Family goal: {state.parent?.settings.dailyGoalMinutes ?? 15} minutes. Time is not
            tracked.
          </Text>
        </View>
        {state.progress.length === 0 ? (
          <View style={s.card}>
            <Text style={s.heading}>Every adventure begins with one step.</Text>
            <Text style={s.body}>
              Previous activity records are retained. Fresh worlds use separate edition history.
            </Text>
          </View>
        ) : (
          state.progress.map((row) => {
            const a = catalog.activities.find((a) => a.id === row.activityId),
              index = selected ? catalog.ages.indexOf(selected.ageGroup) : 0;
            return (
              <View key={row.activityId} style={s.card}>
                <Text style={s.heading}>
                  {a?.titles[index] ?? 'Removed activity · ' + row.activityId}
                </Text>
                <Text
                  accessibilityRole="progressbar"
                  accessibilityValue={{ min: 0, max: row.totalSteps, now: row.completedSteps }}
                  style={s.body}
                >
                  {row.completedSteps} of {row.totalSteps} steps ·{' '}
                  {row.completedAt ? 'Complete' : 'In progress'}
                </Text>
              </View>
            );
          })
        )}
      </Panel>
    );
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFAF2' }}>
      <View style={s.badge}>
        {isDemo && (
          <Text style={[s.body, { fontSize: 13 }]}>
            Demo family · saved on this device · no cloud sync
          </Text>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
          <Button
            label={
              selected
                ? `${selected.nickname} · ${avatarLabels[selected.avatar]}`
                : 'Choose profile'
            }
            disabled={state.busy || state.loading}
            onPress={() => setScreen('profiles')}
          />
          <Button
            label="My progress"
            disabled={!selected || state.loading}
            onPress={() => setScreen('progress')}
          />
        </ScrollView>
      </View>
      {(state.loading || state.error) && (
        <ScrollView style={{ flexGrow: 0, maxHeight: 200 }} contentContainerStyle={{ padding: 16 }}>
          {notice}
        </ScrollView>
      )}
      {selected && !state.loading ? (
        <HomeScreen
          key={`${selected.id}-${selected.version}`}
          catalog={catalog}
          profileName={selected.nickname}
          onOpenProfiles={() => setScreen('profiles')}
          initialAgeGroup={selected.ageGroup}
          savedIds={state.saved[selected.id] ?? []}
          saving={state.busy}
          onSavedChange={(ids) => {
            void store.setSaved(ids);
          }}
          isFocused={foreground}
          onOpenParents={() => {
            setActivity(null);
            setScreen('gate');
          }}
          onOpenActivity={(a) => {
            store.clearError();
            setActivity(a);
            if (__DEV__ && isDemo) setScreen(state.parentUnlocked ? 'content-lab' : 'gate');
          }}
        />
      ) : (
        !state.loading && (
          <Panel
            title="A little world of their own"
            onBack={() =>
              Alert.alert(
                'Sign out and erase local demo data?',
                'All saved profiles, settings, progress and bookmarks on this device will be removed.',
                [
                  { text: 'Stay', style: 'cancel' },
                  { text: 'Sign out', style: 'destructive', onPress: signOut },
                ],
              )
            }
            subtitle="Choose or create a profile to start exploring."
          >
            <Button label="Choose a profile" onPress={() => setScreen('profiles')} />
            <Button label="Grown-ups · Add a profile" onPress={() => setScreen('gate')} />
          </Panel>
        )
      )}
    </View>
  );
}
