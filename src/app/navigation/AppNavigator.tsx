import React from 'react';
import { Alert } from 'react-native';
import AuthScreen from '../../features/auth/screens/AuthScreen';
import IntroScreen from '../../features/onboarding/screens/IntroScreen';
import HomeScreen from '../../features/home/screens/HomeScreen';
import sampleCatalog from '../../features/home/data/sampleCatalog.json';
import type { HomeCatalog } from '../../features/home/domain/types';
import { useAppFlow } from './useAppFlow';
import { TITLE, SUB } from './routes';
export default function AppNavigator({ onReady }: { onReady?: () => void }) {
  const flow = useAppFlow(onReady);
  if (flow.route === 'launch' || flow.route === 'splash')
    return (
      <IntroScreen
        route={flow.route}
        reduced={flow.reduced}
        motion={flow.motion}
        onReady={onReady}
        onSkip={() => flow.navigate('login')}
      />
    );
  if (flow.route === 'home' && flow.hasSession)
    return (
      <HomeScreen
        catalog={sampleCatalog as HomeCatalog}
        isFocused={flow.foreground}
        initialAgeGroup="4–5"
        continueProgress={
          flow.isDemo ? { activityId: 'colours', completed: 2, total: 5 } : undefined
        }
        onOpenActivity={(a) =>
          Alert.alert(a.title, 'Activity player integration is not available yet.')
        }
        onOpenParents={() =>
          Alert.alert(
            'Grown-ups',
            'Preview account options. Secure parent verification is not connected.',
            [
              { text: 'Close', style: 'cancel' },
              { text: 'Sign out', onPress: flow.signOut },
            ],
          )
        }
      />
    );
  const authRoute = flow.route === 'home' ? 'login' : flow.route;
  return (
    <AuthScreen {...flow} route={authRoute} title={TITLE[authRoute]} subtitle={SUB[authRoute]} />
  );
}
