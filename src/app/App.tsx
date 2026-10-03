import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './navigation/AppNavigator';
import { AppErrorBoundary } from '../shared/components/AppErrorBoundary';

SplashScreen.preventAutoHideAsync().catch(() => {});
export default function App() {
  const ready = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top', 'bottom']} style={styles.root}>
        <StatusBar style="dark" />
        <AppErrorBoundary>
          <AppNavigator onReady={ready} />
        </AppErrorBoundary>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#FFFAF2' } });
