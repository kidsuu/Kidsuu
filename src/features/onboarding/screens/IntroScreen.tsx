import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { brandArt as ART } from '../../../shared/assets/brand';
import { introStyles as s } from '../styles/introStyles';
export default function IntroScreen({
  route,
  reduced,
  motion,
  onReady,
  onSkip,
}: {
  route: 'launch' | 'splash';
  reduced: boolean | null;
  motion: Animated.Value;
  onReady?: () => void;
  onSkip: () => void;
}) {
  const splash = route === 'splash',
    animate = reduced === false;
  return (
    <View style={s.opening}>
      {splash && (
        <Image
          source={ART.background}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessible={false}
        />
      )}
      <Pressable onPress={onSkip} style={s.skip} accessibilityRole="button">
        <Text style={s.link}>Skip intro</Text>
      </Pressable>
      <View style={s.openingContent}>
        {splash ? (
          <Image
            source={ART.logo}
            onLoadEnd={() => onReady?.()}
            resizeMode="contain"
            accessibilityLabel="Kidsuu boy and puppy"
            style={s.splashLogo}
          />
        ) : (
          <Animated.Image
            source={ART.icon}
            onLoadEnd={() => onReady?.()}
            resizeMode="contain"
            accessibilityLabel="Kidsuu app icon"
            style={[
              s.launchArt,
              animate && {
                opacity: motion.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
                transform: [
                  { scale: motion.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) },
                ],
              },
            ]}
          />
        )}
        <Text style={s.openingSubtitle}>
          {splash ? 'Little steps. Big discoveries.' : 'A little world of wonder.'}
        </Text>
      </View>
      <View style={s.openingFooter}>
        <View style={s.dots}>
          {['#B39BC8', '#D0B67A', '#A9BDA0'].map((c) => (
            <View key={c} style={[s.dot, { backgroundColor: c }]} />
          ))}
        </View>
        <Text style={s.footerCaps}>MADE FOR LITTLE EXPLORERS</Text>
      </View>
    </View>
  );
}
