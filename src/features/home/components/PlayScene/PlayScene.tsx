import React, { memo, useEffect, useState } from 'react';
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
import motionData from './choreography.json';

type Motion = Partial<Record<'x' | 'y' | 'rotate' | 'scaleX' | 'scaleY' | 'opacity', number[]>>;
type Node = { id: string; pivot: number[]; asset?: string; motion?: Motion; children?: Node[] };
type Box = { id: string; x: number; y: number; width: number; height: number };
type Scene = {
  width: number;
  height: number;
  duration: number;
  inputRange: number[];
  characters: (Box & { sourceWidth: number; sourceHeight: number; rig: Node })[];
  shadows: (Box & { motion: Motion })[];
};
const scene = motionData as Scene;
const ART: Record<string, ImageSourcePropType> = {
  'boy-head': require('./assets/boy-head.png'),
  'boy-torso': require('./assets/boy-torso.png'),
  'boy-hips': require('./assets/boy-hips.png'),
  'boy-joint-fill': require('./assets/boy-joint-fill.png'),
  'boy-down-arm': require('./assets/boy-down-arm.png'),
  'boy-wave-arm': require('./assets/boy-wave-arm.png'),
  'boy-hand': require('./assets/boy-hand.png'),
  'boy-thigh-left': require('./assets/boy-thigh-left.png'),
  'boy-thigh-right': require('./assets/boy-thigh-right.png'),
  'boy-shin-left': require('./assets/boy-shin-left.png'),
  'boy-shin-right': require('./assets/boy-shin-right.png'),
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
  shadow: require('./assets/shadow.png'),
};
const STILL = require('./assets/static-scene.png');

const Joint = memo(function Joint({
  node,
  phase,
  scale,
  width,
  height,
}: {
  node: Node;
  phase: Animated.Value;
  scale: number;
  width: number;
  height: number;
}) {
  const m = node.motion ?? {};
  const n = (key: keyof Motion, fallback: number, multiplier = 1) =>
    m[key]
      ? phase.interpolate({
          inputRange: scene.inputRange,
          outputRange: m[key]!.map((v) => v * multiplier),
        })
      : fallback;
  const rotate = m.rotate
    ? phase.interpolate({
        inputRange: scene.inputRange,
        outputRange: m.rotate.map((v) => `${v}deg`),
      })
    : '0deg';
  const x = node.pivot[0] * scale,
    y = node.pivot[1] * scale;
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        transform: [
          { translateX: n('x', 0, scale) },
          { translateY: n('y', 0, scale) },
          { rotate },
          { scaleX: n('scaleX', 1) },
          { scaleY: n('scaleY', 1) },
        ],
      }}
    >
      <View collapsable={false} style={{ position: 'absolute', left: -x, top: -y, width, height }}>
        {node.asset && (
          <Image
            source={ART[node.asset]}
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
});

export type KidsuuPlaySceneProps = {
  /** Width can also be overridden with a percentage in style. */
  width?: number;
  active?: boolean;
  paused?: boolean;
  reduceMotion?: boolean;
  onMotionAvailabilityChange?: (enabled: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

/** 12-second chase → turn → return → wave. 22 character cutouts, nested joints, one clock. */
export default function KidsuuPlayScene({
  width = 180,
  active = true,
  paused = false,
  reduceMotion = false,
  onMotionAvailabilityChange,
  style,
}: KidsuuPlaySceneProps) {
  const fallbackWidth = Number.isFinite(width) && width > 0 ? width : 180;
  const [measuredWidth, setMeasuredWidth] = useState(fallbackWidth);
  const [systemReduced, setSystemReduced] = useState(true);
  const [foreground, setForeground] = useState(AppState.currentState === 'active');
  const [phase] = useState(() => new Animated.Value(0));
  const scale = measuredWidth / scene.width;
  const still = systemReduced || reduceMotion;
  const running = active && !paused && foreground && !still;

  useEffect(() => {
    onMotionAvailabilityChange?.(!still);
  }, [still, onMotionAvailabilityChange]);

  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (live) setSystemReduced(value);
      })
      .catch(() => {
        /* Static remains the safe fallback. */
      });
    const a = AccessibilityInfo.addEventListener('reduceMotionChanged', setSystemReduced);
    const b = AppState.addEventListener('change', (value) => setForeground(value === 'active'));
    return () => {
      live = false;
      a.remove();
      b.remove();
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    // stopAnimation reads the current native value, so pause/resume retains the current pose.
    phase.stopAnimation((value) => {
      if (disposed) return;
      if (still) {
        phase.setValue(0);
        return;
      }
      if (!running) return;
      const nextLap = (from: number) => {
        if (disposed) return;
        const start = Math.max(0, Math.min(1, from));
        Animated.timing(phase, {
          toValue: 1,
          duration: Math.max(1, (1 - start) * scene.duration),
          easing: Easing.linear,
          useNativeDriver: true,
          isInteraction: false,
        }).start(({ finished }) => {
          if (finished && !disposed) {
            phase.setValue(0); // Every track has exactly matching 0/1 poses.
            nextLap(0);
          }
        });
      };
      nextLap(value);
    });
    return () => {
      disposed = true;
      phase.stopAnimation();
    };
  }, [phase, running, still]);

  const box = (b: Box) => ({
    position: 'absolute' as const,
    left: b.x * scale,
    top: b.y * scale,
    width: b.width * scale,
    height: b.height * scale,
  });
  return (
    <View
      pointerEvents="none"
      accessible
      accessibilityRole="image"
      accessibilityLabel="A playful boy and puppy"
      style={[
        { width: fallbackWidth, aspectRatio: scene.width / scene.height, overflow: 'visible' },
        style,
      ]}
      onLayout={(event) => {
        const actual = event.nativeEvent.layout.width;
        if (actual > 0 && Math.abs(actual - measuredWidth) > 0.25) setMeasuredWidth(actual);
      }}
    >
      {still ? (
        <Image
          source={STILL}
          accessible={false}
          resizeMode="contain"
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        />
      ) : (
        <>
          {scene.shadows.map((shadow) => (
            <Animated.Image
              key={shadow.id}
              accessible={false}
              source={ART.shadow}
              fadeDuration={0}
              resizeMode="stretch"
              style={[
                box(shadow),
                {
                  opacity: phase.interpolate({
                    inputRange: scene.inputRange,
                    outputRange: shadow.motion.opacity!,
                  }),
                  transform: [
                    {
                      translateX: phase.interpolate({
                        inputRange: scene.inputRange,
                        outputRange: shadow.motion.x!.map((v) => v * scale),
                      }),
                    },
                    {
                      scaleX: phase.interpolate({
                        inputRange: scene.inputRange,
                        outputRange: shadow.motion.scaleX!,
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
          {scene.characters.map((character) => (
            <View key={character.id} collapsable={false} style={box(character)}>
              <Joint
                node={character.rig}
                phase={phase}
                scale={(character.width * scale) / character.sourceWidth}
                width={character.width * scale}
                height={character.height * scale}
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
}
