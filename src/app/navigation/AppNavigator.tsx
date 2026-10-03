import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AuthScreen from '../../features/auth/screens/AuthScreen';
import IntroScreen from '../../features/onboarding/screens/IntroScreen';
import { createFamilySession } from '../composition/createFamilySession';
import { FamilyExperience } from './FamilyExperience';
import { Button } from '../../features/family/components/FamilyControls';
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
      <FamilySession isDemo={flow.isDemo} foreground={flow.foreground} onSignOut={flow.signOut} />
    );
  const authRoute = flow.route === 'home' ? 'login' : flow.route;
  return (
    <AuthScreen {...flow} route={authRoute} title={TITLE[authRoute]} subtitle={SUB[authRoute]} />
  );
}

function FamilySession({
  isDemo,
  foreground,
  onSignOut,
}: {
  isDemo: boolean;
  foreground: boolean;
  onSignOut: () => void;
}) {
  const [store] = useState(() => createFamilySession(isDemo));
  useEffect(() => () => store?.dispose(), [store]);
  if (!store)
    return (
      <View style={{ padding: 24, gap: 16 }}>
        <Text>Live family access is locked until real authentication is connected.</Text>
        <Button label="Sign out" onPress={onSignOut} />
      </View>
    );
  return (
    <FamilyExperience store={store} isDemo={isDemo} foreground={foreground} onSignOut={onSignOut} />
  );
}
