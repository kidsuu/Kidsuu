import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
/** Do not expose exceptions, credentials or child data in the fallback UI. */
export class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={styles.root}>
        <Text accessibilityRole="header" style={styles.title}>
          Let’s try that again
        </Text>
        <Text style={styles.body}>Something went wrong. Restarting this screen may help.</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={() => this.setState({ failed: false })}
        >
          <Text style={styles.label}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    backgroundColor: '#FFFAF2',
  },
  title: { fontSize: 24, color: '#40344C', fontWeight: '700' },
  body: { fontSize: 16, color: '#6F5E78', textAlign: 'center', marginVertical: 20 },
  button: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#8E61B9',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  label: { color: '#FFFFFF', fontWeight: '700' },
});
