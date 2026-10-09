import React, { useEffect, useState } from 'react';
import { Animated, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { WORLD_ART } from '../data/assets';
import { Plant, Seed } from './WorldArt';
const say = (hi: boolean, en: string, hindi: string) => (hi ? hindi : en);
/** Pocket Garden is a separate learning activity; all games have dedicated stage players. */
export function GardenBoard({
  index,
  hi,
  disabled,
  reducedMotion,
  onChange,
  onSolved,
}: {
  index: number;
  hi: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onChange: () => void;
  onSolved: (solved: boolean) => void;
}) {
  const pots = index + 1;
  const [seeds, setSeeds] = useState<boolean[]>(Array(pots).fill(false));
  const [quantity, setQuantity] = useState<number | null>(null),
    [grow, setGrow] = useState(false),
    [message, setMessage] = useState('');
  const [scale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    onSolved(grow);
    if (grow && !reducedMotion && !disabled) {
      scale.setValue(0.97);
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 95,
        useNativeDriver: true,
      }).start();
    }
    return () => scale.stopAnimation();
  }, [grow, reducedMotion, disabled, onSolved, scale]);
  const check = () => {
    onChange();
    const count = seeds.filter(Boolean).length;
    if (count === pots && quantity === pots) {
      setGrow(true);
      setMessage(
        say(
          hi,
          'One seed in every pot! Imagine our garden many days later.',
          'हर गमले में एक बीज! अब कई दिन बाद का बगीचा सोचें।',
        ),
      );
    } else
      setMessage(
        say(
          hi,
          count !== pots
            ? 'Some pots need a seed. Tap each empty pot.'
            : 'Count the pots once more. Choose that many seeds.',
          count !== pots
            ? 'कुछ गमलों में बीज नहीं है। खाली गमले छुओ।'
            : 'गमले फिर गिनो। उतने बीज चुनो।',
        ),
      );
  };
  return (
    <View style={s.root}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <ImageBackground
          source={WORLD_ART.woodland}
          accessible={false}
          imageStyle={{ borderRadius: 30 }}
          style={s.stage}
        >
          <Text style={s.title}>{say(hi, 'Your little garden', 'तुम्हारा नन्हा बगीचा')}</Text>
          <View style={s.pots}>
            {seeds.map((filled, i) => (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={say(
                  hi,
                  'Pot ' + (i + 1) + (filled ? ', one seed' : ', empty'),
                  'गमला ' + (i + 1) + (filled ? ', एक बीज' : ', खाली'),
                )}
                disabled={disabled || grow}
                onPress={() => {
                  onChange();
                  setSeeds((prev) => prev.map((v, j) => (i === j ? !v : v)));
                  setMessage('');
                }}
                style={s.potTouch}
              >
                {grow ? (
                  <Plant size={62} />
                ) : (
                  <View style={s.soil}>
                    {filled ? <Seed size={31} /> : <Text style={s.plus}>+</Text>}
                  </View>
                )}
                <View style={s.pot}>
                  <View style={s.rim} />
                  <Text style={s.index}>{i + 1}</Text>
                </View>
              </Pressable>
            ))}
          </View>
          {grow && (
            <Text style={s.ready}>
              {say(hi, 'Ready to explore the next stop!', 'अगली जगह देखने को तैयार!')}
            </Text>
          )}
        </ImageBackground>
      </Animated.View>
      <Text style={s.quantity}>{say(hi, 'How many seeds?', 'कितने बीज?')}</Text>
      <View style={s.tools}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={say(hi, n + ' seeds', n + ' बीज')}
            accessibilityState={{ selected: quantity === n, disabled: disabled || grow }}
            disabled={disabled || grow}
            onPress={() => {
              onChange();
              setQuantity(n);
              setMessage('');
            }}
            style={[s.number, quantity === n && { backgroundColor: '#286B56' }]}
          >
            <Text style={[s.numberText, quantity === n && { color: '#FFFFFF' }]}>{n}</Text>
          </Pressable>
        ))}
      </View>
      <View style={s.tools}>
        <Tool
          label={say(hi, 'Check my idea', 'मेरा तरीका देखें')}
          primary
          disabled={disabled}
          onPress={check}
        />
        <Tool
          label={say(hi, 'A little hint', 'छोटा संकेत')}
          disabled={disabled || grow}
          onPress={() => {
            onChange();
            setMessage(
              say(
                hi,
                'Touch one pot at a time and count. Each pot needs just one seed.',
                'एक-एक गमला छूकर गिनो। हर गमले में एक ही बीज चाहिए।',
              ),
            );
          }}
        />
        <Tool
          label={say(hi, 'Start this stop again', 'फिर से शुरू करें')}
          disabled={disabled}
          onPress={() => {
            onChange();
            setSeeds(Array(pots).fill(false));
            setQuantity(null);
            setGrow(false);
            setMessage('');
          }}
        />
      </View>
      {!!message && (
        <Text accessibilityLiveRegion="polite" style={s.feedback}>
          {message}
        </Text>
      )}
    </View>
  );
}
export function Tool({
  label,
  primary = false,
  disabled = false,
  onPress,
}: {
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.tool,
        primary && s.primary,
        disabled && { opacity: 0.45 },
        pressed && { opacity: 0.82 },
      ]}
    >
      <Text style={[s.toolText, primary && { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  root: { gap: 18 },
  stage: {
    minHeight: 350,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#C9D8C6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 58,
    paddingBottom: 52,
  },
  title: {
    position: 'absolute',
    top: 20,
    left: 24,
    right: 24,
    color: '#214B3F',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,244,.84)',
    padding: 7,
    borderRadius: 12,
  },
  pots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    justifyContent: 'center',
    maxWidth: 480,
  },
  potTouch: { width: 72, minHeight: 125, justifyContent: 'flex-end', alignItems: 'center' },
  soil: {
    width: 60,
    height: 34,
    borderRadius: 50,
    backgroundColor: '#725A42',
    borderWidth: 3,
    borderColor: '#AE7650',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginBottom: -11,
  },
  pot: {
    width: 62,
    height: 64,
    backgroundColor: '#C98157',
    borderWidth: 3,
    borderColor: '#A25F3E',
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rim: {
    position: 'absolute',
    top: 0,
    width: 69,
    height: 13,
    borderRadius: 5,
    backgroundColor: '#DF9E73',
    borderWidth: 2,
    borderColor: '#A76C47',
  },
  index: { color: '#FFF3DF', fontWeight: '800', fontSize: 20 },
  plus: { color: '#FCE0B1', fontWeight: '800', fontSize: 25 },
  quantity: { textAlign: 'center', fontSize: 18, color: '#345847', fontWeight: '700' },
  number: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: '#CBDAC8',
    backgroundColor: '#FFFBEC',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontSize: 22, fontWeight: '800', color: '#345847' },
  tools: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10 },
  tool: {
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F8FAF1',
    borderWidth: 1.5,
    borderColor: '#C9D9CB',
    borderRadius: 18,
  },
  primary: { backgroundColor: '#286B56', borderColor: '#286B56' },
  toolText: { color: '#345847', fontWeight: '700', fontSize: 15, textAlign: 'center' },
  ready: {
    position: 'absolute',
    bottom: 13,
    left: 18,
    right: 18,
    backgroundColor: '#FFF7D7',
    padding: 10,
    borderRadius: 14,
    color: '#3F644D',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
  },
  feedback: {
    fontSize: 17,
    lineHeight: 26,
    color: '#355542',
    padding: 16,
    backgroundColor: '#EAF3E7',
    borderRadius: 18,
    textAlign: 'center',
  },
});
