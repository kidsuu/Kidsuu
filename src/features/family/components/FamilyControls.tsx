import React, { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
export function Button({
  label,
  onPress,
  disabled = false,
  selected = false,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  selected?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        selected && s.selected,
        danger && s.danger,
        (disabled || pressed) && { opacity: 0.55 },
      ]}
    >
      <Text
        style={[s.buttonText, selected && { color: '#FFFFFF' }, danger && { color: '#853A40' }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
export function Panel({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <Button label="← Back" onPress={onBack} />
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      {subtitle && <Text style={s.body}>{subtitle}</Text>}
      {children}
    </ScrollView>
  );
}
export function Notice({
  error,
  loading,
  onReload,
}: {
  error: string;
  loading: boolean;
  onReload: () => void;
}) {
  return (
    <>
      {loading && (
        <View style={s.card}>
          <ActivityIndicator accessibilityLabel="Loading family details" />
          <Text style={s.body}>Loading your little world…</Text>
        </View>
      )}
      {!!error && (
        <View style={s.error}>
          <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={s.body}>
            {error}
          </Text>
          <Button label="Reload details" disabled={loading} onPress={onReload} />
        </View>
      )}
    </>
  );
}
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFAF2' },
  content: {
    width: '100%',
    maxWidth: 1060,
    alignSelf: 'center',
    padding: 24,
    gap: 18,
    paddingBottom: 40,
  },
  title: { fontSize: 30, fontWeight: '800', color: '#58476D' },
  heading: { fontSize: 21, fontWeight: '700', color: '#58476D' },
  body: { fontSize: 16, lineHeight: 25, color: '#655A6E' },
  label: { fontSize: 16, color: '#58476D', fontWeight: '700' },
  card: {
    backgroundColor: '#F6F0FA',
    borderRadius: 25,
    padding: 22,
    gap: 14,
    borderWidth: 1,
    borderColor: '#E8DFF0',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  button: {
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: '#EAE0F2',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4C4E2',
  },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#58416E', textAlign: 'center' },
  selected: { backgroundColor: '#76548F' },
  danger: { backgroundColor: '#FCE8E7', borderColor: '#E9C5C5' },
  input: {
    minHeight: 52,
    backgroundColor: '#FFFCFF',
    borderWidth: 1,
    borderColor: '#BAA6C9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: '#493B59',
  },
  error: { borderRadius: 20, padding: 18, backgroundColor: '#FFF0DF', gap: 12 },
  badge: { backgroundColor: '#F0E9F6', padding: 12 },
  large: { fontSize: 40, color: '#58476D', textAlign: 'center' },
});
