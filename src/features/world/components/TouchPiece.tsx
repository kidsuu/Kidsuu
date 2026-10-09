import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
/** Optional drag enhancement; every action also has a tap and screen-reader route. */
export function TouchPiece({
  label,
  selected,
  disabled,
  reducedMotion,
  onChoose,
  onDrop,
  children,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onChoose: () => void;
  onDrop: (x: number, y: number) => void;
  children: React.ReactNode;
}) {
  const [shift] = useState(() => new Animated.ValueXY());
  const [lift] = useState(() => new Animated.Value(1));
  const current = useRef({ disabled, reducedMotion, onChoose, onDrop });
  useEffect(() => {
    current.current = { disabled, reducedMotion, onChoose, onDrop };
  }, [disabled, reducedMotion, onChoose, onDrop]);
  const dragged = useRef(false);
  // PanResponder stores event callbacks; ref reads occur only when those events fire.
  // eslint-disable-next-line react-hooks/refs
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_e, g) =>
        !current.current.disabled && (Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10),
      onPanResponderGrant: () => {
        dragged.current = true;
        lift.setValue(current.current.reducedMotion ? 1 : 1.08);
      },
      onPanResponderMove: (_e, g) => shift.setValue({ x: g.dx, y: g.dy }),
      onPanResponderRelease: (_e, g) => {
        if (!current.current.disabled) current.current.onDrop(g.moveX, g.moveY);
        shift.setValue({ x: 0, y: 0 });
        lift.setValue(1);
      },
      onPanResponderTerminate: () => {
        shift.setValue({ x: 0, y: 0 });
        lift.setValue(1);
      },
      onPanResponderTerminationRequest: () => true,
    }),
  );
  useEffect(
    () => () => {
      shift.stopAnimation();
      lift.stopAnimation();
    },
    [shift, lift],
  );
  return (
    <Animated.View
      {...pan.panHandlers}
      style={{ zIndex: 50, transform: [...shift.getTranslateTransform(), { scale: lift }] }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected, disabled }}
        disabled={disabled}
        onPressIn={() => {
          dragged.current = false;
        }}
        onPress={() => {
          if (!dragged.current) onChoose();
        }}
        style={({ pressed }) => [
          piece.button,
          selected && piece.selected,
          pressed && { opacity: 0.85 },
          disabled && { opacity: 0.55 },
        ]}
      >
        <View style={piece.art}>{children}</View>
        <Text style={piece.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}
const piece = StyleSheet.create({
  button: {
    minWidth: 76,
    minHeight: 92,
    padding: 9,
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: '#D7E5DB',
    backgroundColor: '#FFFEF8',
    alignItems: 'center',
    gap: 6,
  },
  selected: { borderColor: '#236C58', backgroundColor: '#E5F2E5' },
  art: { minHeight: 42, justifyContent: 'center' },
  label: { color: '#304F43', fontSize: 14, fontWeight: '700', textAlign: 'center', maxWidth: 125 },
});
