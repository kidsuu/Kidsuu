import React, { useState } from 'react';
import { Animated, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { WORLD_ART } from '../data/assets';
import { Glyph, Plant, Seed } from './WorldArt';
import type { WorldPackage } from '../domain/worldPackage';
export function StoryStage({
  content,
  index,
  disabled,
  reducedMotion,
  onChange,
}: {
  content: WorldPackage;
  index: number;
  disabled: boolean;
  reducedMotion: boolean;
  onChange: () => void;
}) {
  const page = content.pages[index],
    hi = content.locale === 'hi-IN';
  const [tap, setTap] = useState(false);
  const [scale] = useState(() => new Animated.Value(1));
  const rainy = page.scene === 'rain',
    sprout = page.scene === 'sprout',
    leaves = page.scene === 'leaves',
    flower = page.scene === 'flower';
  const plant = sprout || leaves || flower,
    rhyme = content.kind === 'rhyme';
  const touch = () => {
    onChange();
    setTap((v) => !v);
    if (!reducedMotion)
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.07, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
  };
  React.useEffect(() => () => scale.stopAnimation(), [scale]);
  return (
    <ImageBackground
      source={WORLD_ART.woodland}
      accessible={false}
      imageStyle={{ borderRadius: 30 }}
      style={[s.stage, content.kind === 'rhyme' && s.rhyme]}
    >
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: rainy ? 'rgba(124,169,181,.3)' : 'rgba(248,243,205,.12)',
            borderRadius: 30,
          },
        ]}
      />
      {(rainy || content.kind === 'rhyme') && (
        <View accessible={false} style={s.rain}>
          {Array.from({ length: 6 }, (_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: 25 + i * 47,
                top: 10 + (i % 3) * 24,
                opacity: tap ? 0.9 : 0.55,
              }}
            >
              <Glyph token="drop" size={24} />
            </View>
          ))}
        </View>
      )}
      <Animated.View style={[s.subject, { transform: [{ scale }] }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            rhyme
              ? hi
                ? 'बूँद और पत्ते का चित्र छुएँ'
                : 'Touch the pictured raindrop and leaf'
              : hi
                ? plant
                  ? 'अंकुर और पौधे का चित्र देखें'
                  : 'बीज का चित्र देखें'
                : plant
                  ? 'Look at the pictured plant'
                  : 'Look at the pictured seed'
          }
          disabled={disabled}
          onPress={touch}
          style={s.focus}
        >
          <View
            style={[
              s.soil,
              rhyme && { backgroundColor: 'rgba(231,245,233,.95)', borderColor: '#98B9A4' },
            ]}
          >
            {rhyme ? (
              <>
                <View
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 22,
                    transform: [{ rotate: '-35deg' }],
                  }}
                >
                  <Glyph token="leaf" size={74} />
                </View>
                <Glyph token="drop" size={95} />
                <View style={[s.puddle, { width: tap ? 144 : 106 }]} />
              </>
            ) : plant ? (
              <Plant stage={sprout ? 1 : leaves ? 2 : 3} size={105} />
            ) : (
              <>
                <Seed size={70} />
                <View
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: 27,
                    transform: [{ rotate: '-50deg' }],
                  }}
                >
                  <Glyph token="leaf" size={68} />
                </View>
                <View style={s.pebble} />
              </>
            )}
          </View>
        </Pressable>
      </Animated.View>
      {content.kind === 'rhyme' && (
        <View style={s.verse}>
          <Text style={s.verseText}>{page.text}</Text>
        </View>
      )}
      <View style={s.caption}>
        <Text style={s.captionText}>
          {rhyme
            ? hi
              ? 'बूँद और पत्ता। चाहें तो बूँद छूकर साथ में बोलें।'
              : 'A raindrop and leaf. Touch the drop and say the rhyme together, if you like.'
            : hi
              ? plant
                ? 'अंकुर और पत्तियों का चित्र। पौधे को बढ़ने में समय लगता है।'
                : rainy
                  ? 'नम मिट्टी के पास बीज और बारिश की बूँदों का चित्र।'
                  : 'मिट्टी के पास बीज, पत्ता और कंकड़ का चित्र।'
              : plant
                ? 'A pictured shoot and leaves. Real plants take time to grow.'
                : rainy
                  ? 'A pictured seed, damp soil and raindrops.'
                  : 'A pictured seed, leaf and pebble beside the soil.'}
        </Text>
      </View>
    </ImageBackground>
  );
}
const s = StyleSheet.create({
  stage: {
    minHeight: 365,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#CCD9C8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
    overflow: 'hidden',
  },
  rhyme: { minHeight: 400 },
  subject: { alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  focus: { minWidth: 190, minHeight: 195, alignItems: 'center', justifyContent: 'center' },
  soil: {
    width: 225,
    minHeight: 175,
    backgroundColor: 'rgba(245,228,190,.95)',
    borderRadius: 105,
    borderWidth: 3,
    borderColor: '#C4AB78',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  puddle: {
    position: 'absolute',
    bottom: 12,
    height: 17,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#8FC5CE',
    backgroundColor: '#C3E3DF',
  },
  pebble: {
    position: 'absolute',
    right: 30,
    bottom: 28,
    width: 38,
    height: 24,
    borderRadius: 50,
    backgroundColor: '#A6AC94',
    borderWidth: 2,
    borderColor: '#787F69',
  },
  rain: { position: 'absolute', top: 8, width: 310, height: 120 },
  caption: {
    marginTop: 15,
    backgroundColor: 'rgba(255,253,236,.94)',
    borderRadius: 15,
    padding: 11,
    maxWidth: 440,
  },
  captionText: { fontSize: 14, lineHeight: 21, color: '#476651', textAlign: 'center' },
  verse: {
    padding: 20,
    backgroundColor: 'rgba(255,252,235,.96)',
    borderRadius: 24,
    marginTop: 15,
    maxWidth: 560,
  },
  verseText: {
    fontSize: 25,
    lineHeight: 37,
    fontWeight: '700',
    color: '#355E4B',
    textAlign: 'center',
  },
});
