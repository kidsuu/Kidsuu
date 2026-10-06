import React from 'react';
import { StyleSheet, View } from 'react-native';
import { pathSegments, segmentLayout, type Shape } from '../domain/geometry';
/** Pure RN geometry: no SVG/native dependency and no generated answer-bearing image.
 * Selection/a11y lives on the parent control; these decorative children stay hidden. */
export function ShapeDrawing({
  shape,
  highlightSides = 0,
}: {
  shape: Shape;
  highlightSides?: number;
}) {
  const size = 120;
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size }}
    >
      {pathSegments(shape).map(([a, b], index) => {
        const line = segmentLayout(a, b, size);
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              left: line.left,
              top: line.top,
              width: line.width + 0.5,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: index < highlightSides ? '#AA4D29' : '#65507C',
              transform: [{ rotate: `${line.angle}deg` }],
            }}
          />
        );
      })}
    </View>
  );
}
export function ToyFruit({ small = false }: { small?: boolean }) {
  return (
    <View
      accessible={false}
      style={[art.fruit, small && { width: 22, height: 22, borderRadius: 11, borderWidth: 2 }]}
    />
  );
}
export function FruitTray({ count }: { count: number }) {
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={art.tray}
    >
      {Array.from({ length: count }, (_, i) => (
        <ToyFruit key={i} small />
      ))}
    </View>
  );
}
export const art = StyleSheet.create({
  fruit: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E9A065',
    borderWidth: 3,
    borderColor: '#AA572C',
  },
  tray: {
    width: 144,
    minHeight: 82,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#B9A88F',
    backgroundColor: '#F7EEDF',
    padding: 14,
    gap: 9,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bowl: {
    width: 88,
    height: 70,
    borderRadius: 18,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    borderWidth: 3,
    borderColor: '#8C799D',
    backgroundColor: '#EDE3F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plate: {
    width: 64,
    height: 40,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#8C799D',
    backgroundColor: '#FFFAF2',
  },
});
