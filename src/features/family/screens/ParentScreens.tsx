import React, { useState } from 'react';
import { Alert, Switch, Text, TextInput, View } from 'react-native';
import { AGE_GROUPS, AVATARS } from '../../../../packages/contracts/src';
import type { ChildProfile } from '../domain/FamilyRepository';
import type { FamilyState, FamilyStore } from '../domain/FamilyStore';
import { validateGoal, validateProfile } from '../domain/validation';
import { Button, s } from '../components/FamilyControls';
export const avatarLabels = { explorer: 'Explorer', puppy: 'Puppy', star: 'Star', moon: 'Moon' };
export function ProfileEditor({
  store,
  state,
  child,
  onDone,
}: {
  store: FamilyStore;
  state: FamilyState;
  child?: ChildProfile;
  onDone: () => void;
}) {
  const [nickname, setNickname] = useState(child?.nickname ?? '');
  const [ageGroup, setAge] = useState(child?.ageGroup ?? AGE_GROUPS[0]);
  const [avatar, setAvatar] = useState(child?.avatar ?? AVATARS[0]);
  const [error, setError] = useState('');
  const disabled = state.busy || state.loading || !state.parentUnlocked;
  const save = async () => {
    const input = { nickname: nickname.trim(), ageGroup, avatar },
      message = validateProfile(input);
    if (message) {
      setError(message);
      return;
    }
    setError('');
    if (await store.saveProfile(input, child)) onDone();
  };
  return (
    <View style={s.card}>
      <Text accessibilityRole="header" style={s.heading}>
        {child ? 'Edit profile' : 'A new little explorer'}
      </Text>
      <Text style={s.body}>Use a nickname, not a full name. No date of birth needed.</Text>
      <Text style={s.label}>Nickname</Text>
      <TextInput
        accessibilityLabel="Child nickname"
        editable={!disabled}
        value={nickname}
        onChangeText={setNickname}
        maxLength={32}
        autoCorrect={false}
        style={s.input}
        returnKeyType="done"
      />
      <Text style={s.label}>Age group</Text>
      <View style={s.row}>
        {AGE_GROUPS.map((age) => (
          <Button
            key={age}
            label={age}
            selected={age === ageGroup}
            disabled={disabled}
            onPress={() => setAge(age)}
          />
        ))}
      </View>
      <Text style={s.label}>Avatar</Text>
      <View style={s.row}>
        {AVATARS.map((a) => (
          <Button
            key={a}
            label={avatarLabels[a]}
            selected={a === avatar}
            disabled={disabled}
            onPress={() => setAvatar(a)}
          />
        ))}
      </View>
      {!!error && (
        <Text accessibilityRole="alert" style={s.body}>
          {error}
        </Text>
      )}
      <View style={s.row}>
        <Button
          label={state.busy ? 'Saving…' : 'Save profile'}
          disabled={disabled}
          onPress={() => void save()}
        />
        <Button label="Cancel" disabled={state.busy} onPress={onDone} />
      </View>
    </View>
  );
}
export function ParentSettings({
  store,
  state,
  onSignOut,
}: {
  store: FamilyStore;
  state: FamilyState;
  onSignOut: () => void;
}) {
  const parent = state.parent!;
  const [sound, setSound] = useState(parent.settings.soundEnabled);
  const [goal, setGoal] = useState(String(parent.settings.dailyGoalMinutes));
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const disabled = state.busy || state.loading || !state.parentUnlocked;
  const save = async () => {
    const dailyGoalMinutes = validateGoal(goal);
    if (dailyGoalMinutes === null) {
      setMessage('Choose a whole number from 5 to 60.');
      return;
    }
    if (await store.saveSettings({ soundEnabled: sound, dailyGoalMinutes }, parent.version))
      setMessage('Settings saved for this session.');
  };
  return (
    <>
      <View style={s.card}>
        <Text accessibilityRole="header" style={s.heading}>
          A gentler daily routine
        </Text>
        <View style={s.row}>
          <Text style={s.label}>Sound preference</Text>
          <Switch
            accessibilityLabel="Sound preference"
            value={sound}
            onValueChange={setSound}
            disabled={disabled}
          />
        </View>
        <Text style={s.body}>
          Saved for future audio players. Current practice cards are silent.
        </Text>
        <Text style={s.label}>Daily goal in minutes (5–60)</Text>
        <TextInput
          accessibilityLabel="Daily goal in minutes"
          style={s.input}
          keyboardType="number-pad"
          value={goal}
          onChangeText={setGoal}
          maxLength={2}
          editable={!disabled}
        />
        <Text style={s.body}>
          A family goal, not a screen-time limit. Time tracking is not enabled.
        </Text>
        <Button label="Save settings" disabled={disabled} onPress={() => void save()} />
        {!!message && (
          <Text accessibilityLiveRegion="polite" style={s.body}>
            {message}
          </Text>
        )}
      </View>
      <View style={s.card}>
        <Text style={s.heading}>Family data</Text>
        <Text style={s.body}>
          Delete all profiles and progress. This does not delete an external login account. Demo
          data is only held in memory and also clears on sign-out or app restart.
        </Text>
        <TextInput
          accessibilityLabel="Type DELETE to confirm family data deletion"
          placeholder="Type DELETE"
          autoCapitalize="characters"
          autoCorrect={false}
          value={confirmation}
          onChangeText={setConfirmation}
          editable={!disabled}
          style={s.input}
        />
        <Button
          label="Delete all family data"
          danger
          disabled={disabled || confirmation !== 'DELETE'}
          onPress={() =>
            Alert.alert('Delete all family data?', 'This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  void store.deleteFamily().then((ok) => {
                    if (ok) onSignOut();
                  });
                },
              },
            ])
          }
        />
      </View>
      <Button
        label="Sign out & clear demo session"
        disabled={disabled}
        onPress={() =>
          Alert.alert(
            'Sign out?',
            'Demo profiles, progress and saved activities will be cleared.',
            [
              { text: 'Stay', style: 'cancel' },
              { text: 'Sign out', onPress: onSignOut },
            ],
          )
        }
      />
    </>
  );
}
