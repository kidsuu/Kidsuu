import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  AppState,
  Easing,
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import rigData from './rig.json';

// Static require paths are essential: Metro cannot resolve dynamic image paths.
const images: Record<string, ImageSourcePropType> = {
  'boy-head': require('./assets/boy-head.png'),
  'boy-torso': require('./assets/boy-torso.png'),
  'boy-wave-arm': require('./assets/boy-wave-arm.png'),
  'boy-hand': require('./assets/boy-hand.png'),
  'boy-down-arm': require('./assets/boy-down-arm.png'),
  'boy-leg-left': require('./assets/boy-leg-left.png'),
  'boy-leg-right': require('./assets/boy-leg-right.png'),
  'boy-shoe-left': require('./assets/boy-shoe-left.png'),
  'boy-shoe-right': require('./assets/boy-shoe-right.png'),
  'dog-tail': require('./assets/dog-tail.png'),
  'dog-body': require('./assets/dog-body.png'),
  'dog-leg-back-left': require('./assets/dog-leg-back-left.png'),
  'dog-leg-back-right': require('./assets/dog-leg-back-right.png'),
  'dog-leg-front-left': require('./assets/dog-leg-front-left.png'),
  'dog-leg-front-right': require('./assets/dog-leg-front-right.png'),
  'dog-ear-left': require('./assets/dog-ear-left.png'),
  'dog-face': require('./assets/dog-face.png'),
  'dog-ear-right': require('./assets/dog-ear-right.png'),
  wordmark: require('./assets/wordmark.png'),
  star: require('./assets/star.png'),
  'confetti-green': require('./assets/confetti-green.png'),
  'confetti-blue': require('./assets/confetti-blue.png'),
  'confetti-coral': require('./assets/confetti-coral.png'),
};

type Motion = Partial<Record<'x' | 'y' | 'rotate' | 'scaleX' | 'scaleY', number[]>>;
type RigNode = {
  id: string;
  pivot: number[];
  asset?: string;
  motion?: Motion;
  children?: RigNode[];
};
type Box = { x: number; y: number; width: number; height: number };
type Character = Box & { sourceWidth: number; sourceHeight: number; rig: RigNode };
type Rig = {
  width: number;
  height: number;
  duration: number;
  boy: Character;
  dog: Character;
  wordmark: Box;
  decorations: (Box & { asset: string; rotate: number[] })[];
};
const rig = rigData as Rig;
const TIMES = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
const ZERO = TIMES.map(() => 0);
const ONE = TIMES.map(() => 1);

function Joint({
  node,
  phase,
  scale,
  width,
  height,
}: {
  node: RigNode;
  phase: Animated.Value;
  scale: number;
  width: number;
  height: number;
}) {
  const [px, py] = node.pivot.map((v) => v * scale);
  const m = node.motion ?? {};
  const translateX = phase.interpolate({
    inputRange: TIMES,
    outputRange: (m.x ?? ZERO).map((v) => v * scale),
  });
  const translateY = phase.interpolate({
    inputRange: TIMES,
    outputRange: (m.y ?? ZERO).map((v) => v * scale),
  });
  const rotate = phase.interpolate({
    inputRange: TIMES,
    outputRange: (m.rotate ?? ZERO).map((v) => `${v}deg`),
  });
  const scaleX = phase.interpolate({ inputRange: TIMES, outputRange: m.scaleX ?? ONE });
  const scaleY = phase.interpolate({ inputRange: TIMES, outputRange: m.scaleY ?? ONE });
  return (
    // Zero-size anchor: portable custom transform origin without a transformOrigin dependency.
    <Animated.View
      style={{
        position: 'absolute',
        left: px,
        top: py,
        width: 0,
        height: 0,
        transform: [{ translateX }, { translateY }, { rotate }, { scaleX }, { scaleY }],
      }}
    >
      <View
        collapsable={false}
        style={{ position: 'absolute', left: -px, top: -py, width, height }}
      >
        {node.asset && (
          <Image
            source={images[node.asset]}
            accessible={false}
            fadeDuration={0}
            resizeMode="stretch"
            style={[StyleSheet.absoluteFill, { width, height }]}
          />
        )}
        {node.children?.map((child) => (
          <Joint
            key={child.id}
            node={child}
            phase={phase}
            scale={scale}
            width={width}
            height={height}
          />
        ))}
      </View>
    </Animated.View>
  );
}

export type KidsuuFullBodyLogoProps = {
  width?: number;
  /** Pass your navigation screen's focus state. */
  active?: boolean;
  /** Force static pose. OS Reduce Motion is also always respected. */
  reduceMotion?: boolean;
  /** Default 4800. Minimum 2000 to avoid an excessively fast greeting. */
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

/** 18 independent image parts, parent/child joints, one native-driver timeline. */
export default function KidsuuFullBodyLogo({
  width = 320,
  active = true,
  reduceMotion = false,
  duration = rig.duration,
  style,
}: KidsuuFullBodyLogoProps) {
  const w = Number.isFinite(width) && width > 0 ? width : 320;
  const s = w / rig.width;
  const h = rig.height * s;
  const ms = Number.isFinite(duration) ? Math.max(2000, duration) : rig.duration;
  const [phase] = useState(() => new Animated.Value(0));
  const [entrance] = useState(() => new Animated.Value(1));
  const [systemReduced, setSystemReduced] = useState(true);
  const [foreground, setForeground] = useState(AppState.currentState === 'active');

  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (live) setSystemReduced(value);
      })
      .catch(() => {
        /* Remain in safe, static mode. */
      });
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', setSystemReduced);
    const app = AppState.addEventListener('change', (state) => setForeground(state === 'active'));
    return () => {
      live = false;
      motion.remove();
      app.remove();
    };
  }, []);

  const moving = active && foreground && !reduceMotion && !systemReduced;
  useEffect(() => {
    phase.setValue(0);
    if (!moving) {
      entrance.setValue(1);
      return;
    }
    entrance.setValue(0);
    const entry = Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    const loop = Animated.loop(
      Animated.timing(phase, {
        toValue: 1,
        duration: ms,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    );
    entry.start();
    loop.start();
    return () => {
      entry.stop();
      loop.stop();
    };
  }, [moving, ms, entrance, phase]);

  const box = (b: Box) => ({
    position: 'absolute' as const,
    left: b.x * s,
    top: b.y * s,
    width: b.width * s,
    height: b.height * s,
  });
  return (
    <View
      pointerEvents="none"
      accessible
      accessibilityRole="image"
      accessibilityLabel="Kidsuu. A happy boy waving beside a playful puppy."
      style={[style, { width: w, height: h, overflow: 'visible' }]}
    >
      <Animated.View
        style={{
          width: w,
          height: h,
          opacity: entrance,
          transform: [
            { translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
            { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
          ],
        }}
      >
        {[rig.boy, rig.dog].map((character, index) => (
          <View key={index} collapsable={false} style={box(character)}>
            <Joint
              node={character.rig}
              phase={phase}
              scale={(character.width * s) / character.sourceWidth}
              width={character.width * s}
              height={character.height * s}
            />
          </View>
        ))}
        <Image
          source={images.wordmark}
          accessible={false}
          fadeDuration={0}
          resizeMode="stretch"
          style={box(rig.wordmark)}
        />
        {rig.decorations.map((d) => (
          <Animated.Image
            key={d.asset}
            source={images[d.asset]}
            accessible={false}
            fadeDuration={0}
            resizeMode="stretch"
            style={[
              box(d),
              {
                transform: [
                  {
                    rotate: phase.interpolate({
                      inputRange: TIMES,
                      outputRange: d.rotate.map((v) => `${v}deg`),
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}
