import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import { BRIDGES, bridgeLength, bridgeSolved, placePlank } from '../domain/puzzles';
import { TouchPiece } from './TouchPiece';

interface Props {
  index: number;
  hi: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onChange: () => void;
  onSolved: (solved: boolean) => void;
}
const say = (hi: boolean, en: string, hindi: string) => (hi ? hindi : en);
const BIOMES = [
  {
    en: 'Meadow Brook',
    hi: 'मैदान की धारा',
    sky: '#E9F3E6',
    water: '#70C4BE',
    deep: '#43A49F',
    bank: '#88B77A',
    edge: '#578E61',
    sand: '#D2D99D',
    ink: '#275B48',
  },
  {
    en: 'Mountain Gorge',
    hi: 'पहाड़ी घाटी',
    sky: '#E4EEF5',
    water: '#65B7CE',
    deep: '#398CA8',
    bank: '#879C94',
    edge: '#546C69',
    sand: '#CFD3B7',
    ink: '#355B64',
  },
  {
    en: 'Tide Cove',
    hi: 'समुद्र का किनारा',
    sky: '#FFF0D5',
    water: '#74C7C4',
    deep: '#3B9FAD',
    bank: '#E8CF95',
    edge: '#C5A36C',
    sand: '#FAE6B9',
    ink: '#536346',
  },
] as const;
const sceneIndex = (index: number) => ((index % BRIDGES.length) + BRIDGES.length) % BRIDGES.length;

/** A purpose-built vector world; it also makes the river game's library cover. */
export function RiverScenery({
  index = 0,
  biome,
  width = '100%',
  height = '100%',
}: {
  index?: number;
  biome?: 0 | 1 | 2;
  width?: number | string;
  height?: number | string;
}) {
  const level = sceneIndex(index),
    themeIndex = biome ?? Math.floor(level / 2),
    theme = BIOMES[themeIndex];
  const gap = BRIDGES[level].gap,
    unit = 680 / (gap + 8),
    left = (680 - gap * unit) / 2,
    right = 680 - left;
  const odd = level % 2;
  const shapeRatio =
    typeof width === 'number' && typeof height === 'number' ? (width * 380) / (height * 680) : 1;
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 680 380"
      preserveAspectRatio="none"
      accessible={false}
    >
      <Rect width={680} height={380} fill={theme.sky} />
      <Ellipse
        cx={themeIndex === 2 ? 555 : 574}
        cy={themeIndex === 1 ? 62 : 67}
        rx={themeIndex === 2 ? 37 : 29}
        ry={(themeIndex === 2 ? 37 : 29) * shapeRatio}
        fill={themeIndex === 2 ? '#E8B767' : '#EACC7D'}
        opacity={0.82}
      />
      {themeIndex === 0 && (
        <>
          <Path
            d="M0 146 Q110 57 231 138 Q355 42 480 124 Q580 77 680 135 L680 230 L0 230Z"
            fill="#B8D6AA"
          />
          <Path d="M0 172 Q144 103 280 167 Q450 107 680 167 L680 249 L0 249Z" fill="#A0C78E" />
        </>
      )}
      {themeIndex === 1 && (
        <>
          <Polygon points="0,180 110,40 231,175" fill="#B2C4C6" />
          <Polygon points="129,177 289,22 445,178" fill="#9FB4BC" />
          <Polygon points="377,181 536,47 680,175" fill="#B7C8C8" />
          <Polygon points="70,92 110,40 155,91 119,78 104,89 94,76" fill="#F8FBF6" />
          <Polygon points="235,75 289,22 345,79 299,63 284,73 266,57" fill="#F8FBF6" />
          <Path
            d="M0 164 Q85 115 182 170 Q326 127 414 166 Q535 123 680 167 L680 259 L0 259Z"
            fill="#92B4A2"
          />
        </>
      )}
      {themeIndex === 2 && (
        <>
          <Rect y={143} width={680} height={125} fill="#B0D9CE" />
          <Path
            d="M0 161 Q70 148 140 161 T280 161 T420 161 T560 161 T700 161"
            fill="none"
            stroke="#E7F3DF"
            strokeWidth={3}
          />
          <Path d="M0 180 Q149 116 267 164 Q457 130 680 177 L680 267 L0 267Z" fill="#D7D1A1" />
          <G transform="translate(554 108)">
            <Rect x={-9} y={0} width={18} height={61} rx={2} fill="#FAF3D8" />
            <Rect x={-9} y={31} width={18} height={9} fill="#D17858" />
            <Path d="M-15 0 L0 -16 L15 0Z" fill="#C7654D" />
            <Rect x={-6} y={4} width={12} height={12} rx={2} fill="#71928D" />
          </G>
        </>
      )}
      <Path
        d={
          'M0 166 Q' +
          left * 0.55 +
          ' 150 ' +
          (left - 14) +
          ' 168 Q' +
          (left + 12) +
          ' 196 ' +
          left +
          ' 220 Q' +
          (left - 11) +
          ' 299 ' +
          (left + 9) +
          ' 380 L0 380Z'
        }
        fill={theme.bank}
      />
      <Path
        d={
          'M680 166 Q' +
          (right + (680 - right) * 0.55) +
          ' 148 ' +
          (right + 14) +
          ' 168 Q' +
          (right - 12) +
          ' 196 ' +
          right +
          ' 220 Q' +
          (right + 11) +
          ' 299 ' +
          (right - 9) +
          ' 380 L680 380Z'
        }
        fill={theme.bank}
      />
      <Path
        d={
          'M' +
          (left - 14) +
          ' 168 Q' +
          (left + 12) +
          ' 196 ' +
          left +
          ' 220 Q' +
          (left - 11) +
          ' 299 ' +
          (left + 9) +
          ' 380 L' +
          (right - 9) +
          ' 380 Q' +
          (right + 11) +
          ' 299 ' +
          right +
          ' 220 Q' +
          (right - 12) +
          ' 196 ' +
          (right + 14) +
          ' 168 Q340 191 ' +
          (left - 14) +
          ' 168Z'
        }
        fill={theme.water}
      />
      <Path
        d={
          'M' +
          (left - 14) +
          ' 168 Q' +
          (left + 12) +
          ' 196 ' +
          left +
          ' 220 Q' +
          (left - 11) +
          ' 299 ' +
          (left + 9) +
          ' 380'
        }
        fill="none"
        stroke={theme.sand}
        strokeWidth={12}
      />
      <Path
        d={
          'M' +
          (right + 14) +
          ' 168 Q' +
          (right - 12) +
          ' 196 ' +
          right +
          ' 220 Q' +
          (right + 11) +
          ' 299 ' +
          (right - 9) +
          ' 380'
        }
        fill="none"
        stroke={theme.sand}
        strokeWidth={12}
      />
      <Path
        d={'M-20 256 Q' + left * 0.5 + ' 237 ' + (left - 9) + ' 247'}
        fill="none"
        stroke={theme.sand}
        strokeWidth={36}
        strokeLinecap="round"
      />
      <Path
        d={'M' + (right + 9) + ' 247 Q' + (right + (680 - right) * 0.5) + ' 230 700 250'}
        fill="none"
        stroke={theme.sand}
        strokeWidth={36}
        strokeLinecap="round"
      />
      {[left - 11, right - 3].map((x, i) => (
        <G key={i}>
          <Rect x={x} y={218} width={14} height={72} rx={4} fill={theme.edge} />
          <Rect x={x - 5} y={212} width={24} height={10} rx={4} fill={theme.sand} />
        </G>
      ))}
      {themeIndex === 0 && (
        <>
          <Tree x={44} y={174} scale={odd ? 0.94 : 1.14} />
          <Tree x={635} y={180} scale={0.94} />
          {[32, 79, 625, 651].map((x, i) => (
            <G key={x} transform={'translate(' + x + ' ' + (315 + (i % 2) * 25) + ')'}>
              <Path
                d="M0 20 Q-10 0 -14 -5 M0 20 Q8 -1 16 -10 M0 20 L1 -12"
                fill="none"
                stroke="#417A55"
                strokeWidth={4}
                strokeLinecap="round"
              />
              <Circle cx={-14} cy={-5} r={4} fill="#E6B566" />
              <Circle cx={16} cy={-10} r={4} fill="#D88666" />
            </G>
          ))}
        </>
      )}
      {themeIndex === 1 && (
        <>
          <Fir x={42} y={178} scale={0.88} />
          <Fir x={639} y={189} scale={1.12} />
          <Fir x={598} y={176} scale={0.67} />
          {[
            { x: 45, y: 328, s: 1 },
            { x: 117, y: 310, s: 0.72 },
            { x: 633, y: 331, s: 1.14 },
          ].map((p, i) => (
            <G key={i} transform={'translate(' + p.x + ' ' + p.y + ') scale(' + p.s + ')'}>
              <Path d="M-27 7 L-20 -12 L1 -24 L26 -9 L32 11 L7 22Z" fill="#718B83" />
              <Path d="M-20 -12 L1 -24 L6 1 L-27 7Z" fill="#9BAEA1" />
              <Path d="M6 1 L26 -9 L32 11 L7 22Z" fill="#59726E" />
            </G>
          ))}
        </>
      )}
      {themeIndex === 2 && (
        <>
          <Palm x={48} y={184} />
          <Palm x={631} y={201} />
          {[
            { x: 79, y: 335 },
            { x: 592, y: 316 },
          ].map((p, i) => (
            <G
              key={i}
              transform={'translate(' + p.x + ' ' + p.y + ') rotate(' + (i ? 15 : -13) + ')'}
            >
              <Path
                d="M-13 10 Q-25 -8 -10 -15 Q0 -27 10 -15 Q26 -7 13 10Z"
                fill="#F4EBCC"
                stroke="#C69B71"
                strokeWidth={2}
              />
              <Path d="M0 8 L0 -14 M0 8 L-10 -9 M0 8 L10 -9" stroke="#C69B71" strokeWidth={1.5} />
            </G>
          ))}
        </>
      )}
      <G transform={'translate(' + (right + 35) + ' 209)'}>
        <Rect x={0} y={17} width={5} height={47} rx={2} fill="#866C45" />
        <Path
          d="M4 13 L39 13 L49 24 L39 35 L4 35Z"
          fill="#FFF2BE"
          stroke="#B18D54"
          strokeWidth={2}
        />
        <Path
          d="M17 24 H34 M29 19 L34 24 L29 29"
          stroke="#4A7557"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
function Tree({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <G transform={'translate(' + x + ' ' + y + ') scale(' + scale + ')'}>
      <Path d="M-8 2 L-5 -63 L5 -63 L10 2Z" fill="#96724B" />
      <Circle cx={-20} cy={-64} r={29} fill="#448363" />
      <Circle cx={18} cy={-62} r={31} fill="#4E9368" />
      <Circle cx={-1} cy={-85} r={31} fill="#64A376" />
      <Ellipse cx={-8} cy={-96} rx={14} ry={6} fill="#84B88A" opacity={0.7} />
    </G>
  );
}
function Fir({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <G transform={'translate(' + x + ' ' + y + ') scale(' + scale + ')'}>
      <Rect x={-4} y={-15} width={8} height={22} rx={3} fill="#7B674D" />
      <Path
        d="M0 -99 L-20 -59 H-11 L-31 -27 H-18 L-40 -2 H40 L18 -27 H31 L11 -59 H20Z"
        fill="#3D7666"
      />
      <Path d="M0 -99 L0 -2 H-40 L-18 -27 H-31 L-11 -59 H-20Z" fill="#538776" />
    </G>
  );
}
function Palm({ x, y }: { x: number; y: number }) {
  return (
    <G transform={'translate(' + x + ' ' + y + ')'}>
      <Path d="M-3 12 Q10 -27 3 -66" fill="none" stroke="#A68756" strokeWidth={9} />
      <Path
        d="M3 -66 Q-40 -90 -49 -57 Q-17 -73 3 -66 M3 -66 Q-26 -109 -39 -85 Q-11 -86 3 -66 M3 -66 Q18 -112 36 -84 Q16 -85 3 -66 M3 -66 Q53 -88 58 -57 Q26 -74 3 -66"
        fill="#5B9771"
      />
      <Circle cx={4} cy={-64} r={6} fill="#867348" />
    </G>
  );
}

function WoodBoard({
  length,
  unit,
  preview = false,
}: {
  length: number;
  unit: number;
  preview?: boolean;
}) {
  const width = length * unit;
  return (
    <Svg
      width={width}
      height={preview ? 38 : 52}
      viewBox={'0 0 ' + width + ' 52'}
      preserveAspectRatio="none"
      accessible={false}
    >
      <Rect x={1} y={8} width={width - 2} height={43} rx={6} fill="#996941" />
      <Rect
        x={1}
        y={1}
        width={width - 2}
        height={43}
        rx={6}
        fill="#DFB984"
        stroke="#AE7D4C"
        strokeWidth={2}
      />
      <Line x1={6} y1={11} x2={width - 6} y2={11} stroke="#F2D39F" strokeWidth={2} />
      <Line x1={6} y1={35} x2={width - 6} y2={35} stroke="#C28D58" strokeWidth={2} />
      {Array.from({ length }, (_, i) => (
        <G key={i}>
          {i > 0 && (
            <Line x1={i * unit} y1={3} x2={i * unit} y2={42} stroke="#A97748" strokeWidth={1.5} />
          )}
          <Circle cx={(i + 0.5) * unit} cy={22} r={2.4} fill="#916541" />
          <Circle cx={(i + 0.5) * unit} cy={25} r={1} fill="#F6DCB2" />
        </G>
      ))}
    </Svg>
  );
}
function Cart({ movement }: { movement: Animated.Value }) {
  const rotation = movement.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '900deg'] });
  return (
    <View style={{ width: 64, height: 54 }} accessible={false}>
      <Svg width={64} height={54} viewBox="0 0 64 54">
        <Ellipse cx={30} cy={52} rx={30} ry={2} fill="#486B55" opacity={0.2} />
        <Path d="M7 24 L47 24 L45 39 L10 39Z" fill="#CB7756" stroke="#A45E43" strokeWidth={2} />
        <Path d="M6 23 H47" stroke="#EDAC75" strokeWidth={4} strokeLinecap="round" />
        <Path
          d="M44 36 L56 15 L62 15"
          fill="none"
          stroke="#876A43"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path d="M18 23 Q9 5 22 4 Q37 9 29 23Z" fill="#E6D09A" stroke="#B49B62" strokeWidth={2} />
        <Path d="M28 23 Q24 8 36 8 Q48 13 43 23Z" fill="#F0DCB0" stroke="#B49B62" strokeWidth={2} />
        <Path
          d="M22 9 L24 20 M34 12 L35 20"
          stroke="#AA8B50"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
      {[10, 37].map((x) => (
        <Animated.View
          key={x}
          style={{
            position: 'absolute',
            left: x,
            top: 33,
            width: 20,
            height: 20,
            transform: [{ rotate: rotation }],
          }}
        >
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Circle cx={10} cy={10} r={9} fill="#425F52" />
            <Circle cx={10} cy={10} r={5.5} fill="#F5DCA0" />
            <Path d="M10 5 V15 M5 10 H15" stroke="#AA8E58" strokeWidth={2} />
            <Circle cx={10} cy={10} r={2} fill="#4E6754" />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
function Cloud({ wide = false }: { wide?: boolean }) {
  return (
    <Svg width={wide ? 116 : 87} height={42} viewBox="0 0 116 42" accessible={false}>
      <Path
        d="M12 35 Q-2 19 20 17 Q23 -4 45 9 Q59 -8 75 9 Q94 6 97 22 Q125 23 111 35Z"
        fill="#FFFDF0"
        opacity={0.83}
      />
    </Svg>
  );
}

export function RiverAdventure({ index, hi, disabled, reducedMotion, onChange, onSolved }: Props) {
  const level = sceneIndex(index),
    round = BRIDGES[level],
    theme = BIOMES[Math.floor(level / 2)];
  const [sceneWidth, setSceneWidth] = useState(680);
  const [slots, setSlots] = useState<(number | null)[]>([null, null]);
  const [selected, setSelected] = useState<number | null>(null);
  const [history, setHistory] = useState<(number | null)[][]>([]);
  const [message, setMessage] = useState('');
  const [hinted, setHinted] = useState(false);
  const [crossing, setCrossing] = useState(false),
    [crossed, setCrossed] = useState(false);
  const [movement] = useState(() => new Animated.Value(0)),
    [ambient] = useState(() => new Animated.Value(0));
  const targets = useRef<Record<number, View | null>>({}),
    mounted = useRef(false);
  const sceneHeight = sceneWidth < 420 ? 340 : 400,
    unit = sceneWidth / (round.gap + 8),
    gapWidth = round.gap * unit,
    left = (sceneWidth - gapWidth) / 2,
    right = sceneWidth - left;
  const boardY = sceneHeight * 0.58;
  const total = bridgeLength(round, slots),
    solved = bridgeSolved(round, slots);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      movement.stopAnimation();
      ambient.stopAnimation();
    };
  }, [movement, ambient]);
  useEffect(() => {
    onSolved(solved && crossed);
  }, [solved, crossed, onSolved]);
  useEffect(() => {
    if (reducedMotion || disabled) {
      ambient.stopAnimation();
      ambient.setValue(0);
      return;
    }
    const flow = Animated.loop(
      Animated.timing(ambient, {
        toValue: 1,
        duration: 8500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    flow.start();
    return () => flow.stop();
  }, [ambient, reducedMotion, disabled]);
  useEffect(() => {
    if (!crossing || disabled) return;
    const trip = Animated.timing(movement, {
      toValue: 1,
      duration: reducedMotion ? 0 : 2300,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    });
    trip.start(({ finished }) => {
      if (finished && mounted.current) {
        setCrossed(true);
        setCrossing(false);
      }
    });
    return () => trip.stop();
  }, [crossing, disabled, reducedMotion, movement]);
  const stopTrip = () => {
    movement.stopAnimation();
    movement.setValue(0);
    setCrossing(false);
    setCrossed(false);
  };
  const update = (next: (number | null)[]) => {
    onChange();
    stopTrip();
    setHistory((prev) => [...prev.slice(-31), slots]);
    setSlots(next);
    setSelected(null);
    setMessage('');
    setHinted(false);
  };
  const place = (slot: number, piece = selected) => {
    if (disabled || crossing) return;
    if (piece === null) {
      if (slots[slot] !== null) update(slots.map((v, i) => (i === slot ? null : v)));
      return;
    }
    update(placePlank(round, slots, slot, piece));
  };
  const select = (piece: number) => {
    if (disabled || crossing) return;
    onChange();
    setSelected(piece);
    setMessage('');
    setHinted(false);
  };
  const drop = (piece: number, x: number, y: number) => {
    if (disabled || crossing) return;
    const entries = Object.entries(targets.current).filter(
      (entry): entry is [string, View] => !!entry[1],
    );
    void Promise.all(
      entries.map(
        ([slot, node]) =>
          new Promise<number | null>((resolve) =>
            node.measureInWindow((leftX, topY, width, height) =>
              resolve(
                x >= leftX && x <= leftX + width && y >= topY && y <= topY + height
                  ? Number(slot)
                  : null,
              ),
            ),
          ),
      ),
    ).then((hits) => {
      if (mounted.current) {
        const target = hits.find((v) => v !== null);
        if (target !== undefined && target !== null) place(target, piece);
      }
    });
  };
  const check = () => {
    if (disabled || crossing) return;
    onChange();
    setSelected(null);
    setHinted(false);
    if (solved) {
      stopTrip();
      setMessage(
        say(
          hi,
          'A perfect fit! The seed cart can cross safely.',
          'बिलकुल सही लंबाई! बीजों की गाड़ी अब पार जा सकती है।',
        ),
      );
      setCrossing(true);
    } else if (slots.some((piece) => piece === null))
      setMessage(
        say(
          hi,
          'Build with two different planks. Choose one, then touch a bridge space.',
          'दो अलग टुकड़ों से पुल बनाओ। एक चुनो, फिर पुल की खाली जगह छुओ।',
        ),
      );
    else if (total < round.gap)
      setMessage(
        say(
          hi,
          'The bridge is ' + (round.gap - total) + ' units short. Try a longer piece.',
          'पुल ' + (round.gap - total) + ' इकाई छोटा है। एक लंबा टुकड़ा आज़माओ।',
        ),
      );
    else
      setMessage(
        say(
          hi,
          'The bridge reaches ' + (total - round.gap) + ' units too far. Try a shorter piece.',
          'पुल ' + (total - round.gap) + ' इकाई आगे जा रहा है। एक छोटा टुकड़ा आज़माओ।',
        ),
      );
  };
  const toolDisabled = disabled || crossing;
  return (
    <View style={s.root}>
      <View style={[s.chapter, sceneWidth < 420 && s.chapterNarrow]}>
        <View style={sceneWidth < 420 ? { width: '100%' } : { flex: 1 }}>
          <Text style={[s.kicker, { color: theme.ink }]}>
            {say(hi, 'RIVER EXPEDITION', 'नदी का सफ़र')} · {Math.floor(level / 2) + 1}/3
          </Text>
          <Text accessibilityRole="header" style={s.chapterTitle}>
            {hi ? theme.hi : theme.en}
          </Text>
        </View>
        <View style={s.stages}>
          {Array.from({ length: 6 }, (_, i) => (
            <View
              key={i}
              style={[
                s.stageDot,
                i <= level && { backgroundColor: theme.ink },
                i === level && s.currentDot,
              ]}
            >
              <Text style={[s.stageNumber, i <= level && { color: '#FFFBED' }]}>{i + 1}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={s.direction}>
        {say(
          hi,
          'Join two planks to help the seed cart cross.',
          'दो टुकड़े जोड़कर बीजों की गाड़ी को पार पहुँचाओ।',
        )}
      </Text>
      <View
        testID="river-stage"
        style={[s.scene, { height: sceneHeight, borderColor: theme.edge }]}
        onLayout={(e) => setSceneWidth(Math.max(1, e.nativeEvent.layout.width - 4))}
      >
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <RiverScenery index={level} width={sceneWidth} height={sceneHeight} />
        </View>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: sceneWidth * 0.16,
            top: sceneHeight * 0.1,
            transform: [
              { translateX: ambient.interpolate({ inputRange: [0, 1], outputRange: [0, 28] }) },
            ],
          }}
        >
          <Cloud wide />
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: sceneWidth * 0.16,
            top: sceneHeight * 0.18,
            transform: [
              { translateX: ambient.interpolate({ inputRange: [0, 1], outputRange: [10, -12] }) },
            ],
          }}
        >
          <Cloud />
        </Animated.View>
        {[0.53, 0.76, 0.9].map((y, i) => (
          <Animated.View
            key={y}
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: sceneHeight * y,
              left: left + gapWidth * (i % 2 ? 0.47 : 0.17),
              width: gapWidth * 0.27,
              transform: [
                { translateX: ambient.interpolate({ inputRange: [0, 1], outputRange: [-10, 12] }) },
              ],
            }}
          >
            <Svg width="100%" height={9} viewBox="0 0 90 9" preserveAspectRatio="none">
              <Path
                d="M2 5 Q18 0 33 5 T64 5 T87 5"
                stroke="#D0F0E2"
                strokeWidth={3}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
          </Animated.View>
        ))}
        <View pointerEvents="none" style={s.missionBadge}>
          <Text style={[s.missionText, { color: theme.ink }]}>
            {say(hi, 'Crossing ' + round.gap + ' units', 'पार की दूरी ' + round.gap + ' इकाई')}
          </Text>
        </View>
        {slots.map((piece, i) => {
          const first = slots[0] === null ? round.gap / 2 : round.planks[slots[0]],
            offset = i === 0 ? 0 : first;
          const physicalWidth =
            (piece === null ? (i === 0 ? round.gap / 2 : round.gap - first) : round.planks[piece]) *
            unit;
          const touchWidth = Math.max(48, physicalWidth),
            adjust = (touchWidth - physicalWidth) / 2;
          return (
            <View
              key={i}
              ref={(node) => {
                targets.current[i] = node;
              }}
              style={{
                position: 'absolute',
                left: left + offset * unit - adjust,
                top: boardY - 3,
                width: touchWidth,
                height: 62,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={say(
                  hi,
                  'Bridge space ' +
                    (i + 1) +
                    (piece === null ? ' empty' : ', plank ' + round.planks[piece] + ' units'),
                  'पुल की जगह ' +
                    (i + 1) +
                    (piece === null ? ' खाली' : ', टुकड़ा ' + round.planks[piece] + ' इकाई'),
                )}
                accessibilityHint={say(
                  hi,
                  'Choose a plank first. Touch a filled space without selecting a plank to remove it.',
                  'पहले टुकड़ा चुनें। बिना टुकड़ा चुने भरी जगह छूकर उसे निकालें।',
                )}
                disabled={toolDisabled}
                onPress={() => place(i)}
                style={{
                  width: touchWidth,
                  height: 62,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {piece === null ? (
                  <View
                    style={[
                      s.ghost,
                      { width: Math.max(1, physicalWidth - 2) },
                      selected !== null && s.ghostSelected,
                    ]}
                  >
                    <Text style={s.ghostText}>{i === 0 ? 'A' : 'B'} +</Text>
                  </View>
                ) : (
                  <WoodBoard length={round.planks[piece]} unit={unit} />
                )}
              </Pressable>
            </View>
          );
        })}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: Math.max(4, left - 66),
            top: boardY - 54,
            transform: [
              {
                translateX: movement.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.min(sceneWidth - 68, right + 14) - Math.max(4, left - 66)],
                }),
              },
            ],
          }}
        >
          <Cart movement={movement} />
        </Animated.View>
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left, top: boardY + 82, width: gapWidth }}
        >
          <View style={s.measureLine}>
            {Array.from({ length: round.gap }, (_, i) => (
              <View key={i} style={[s.measureUnit, { width: unit }]}>
                <Text style={s.measureNumber}>{i + 1}</Text>
              </View>
            ))}
          </View>
        </View>
        {crossed && (
          <View pointerEvents="none" style={s.arrived}>
            <Text style={s.arrivedText}>{say(hi, 'DELIVERY COMPLETE', 'बीज पहुँच गए')}</Text>
          </View>
        )}
      </View>
      <View style={s.fitRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.fitLabel}>{say(hi, 'YOUR BRIDGE', 'तुम्हारा पुल')}</Text>
          <Text style={[s.equation, solved && { color: '#267859' }]}>
            {slots.map((i) => (i === null ? '?' : round.planks[i])).join(' + ')} = {total}
          </Text>
        </View>
        <View style={[s.fitChip, solved && s.fitChipReady]}>
          <Text style={[s.fitChipText, solved && { color: '#226649' }]}>
            {solved
              ? say(hi, 'Perfect fit', 'सही लंबाई')
              : say(hi, 'Target: ' + round.gap + ' units', 'चाहिए: ' + round.gap + ' इकाई')}
          </Text>
        </View>
      </View>
      <View style={s.placeChoices}>
        {slots.map((piece, i) => (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={say(
              hi,
              'Place selected plank in bridge space ' + (i + 1),
              'चुना टुकड़ा पुल की जगह ' + (i + 1) + ' में रखें',
            )}
            disabled={toolDisabled}
            onPress={() => place(i)}
            style={({ pressed }) => [
              s.placeChoice,
              selected !== null && s.choiceReady,
              pressed && { opacity: 0.8 },
              toolDisabled && { opacity: 0.5 },
            ]}
          >
            <Text style={s.placeChoiceText}>
              {say(hi, 'Space ' + (i + 1), 'जगह ' + (i + 1))} ·{' '}
              {piece === null
                ? say(hi, 'place here', 'यहाँ रखें')
                : say(
                    hi,
                    round.planks[piece] + ' units · remove',
                    round.planks[piece] + ' इकाई · निकालें',
                  )}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={s.workshop}>
        <View style={s.workshopHeading}>
          <Text style={s.workshopTitle}>{say(hi, 'The plank workshop', 'पुल के टुकड़े')}</Text>
          <Text style={s.workshopHint}>
            {say(hi, 'Choose + place, or drag', 'चुनो और रखो, या खींचो')}
          </Text>
        </View>
        <View style={s.inventory}>
          {round.planks.map((length, i) => (
            <View key={i} style={{ maxWidth: '100%' }}>
              <TouchPiece
                label={say(hi, length + ' units', length + ' इकाई')}
                selected={selected === i}
                disabled={toolDisabled || slots.includes(i)}
                reducedMotion={reducedMotion}
                onChoose={() => select(i)}
                onDrop={(x, y) => drop(i, x, y)}
              >
                <WoodBoard length={length} unit={unit} preview />
              </TouchPiece>
              {slots.includes(i) && (
                <Text style={s.used}>{say(hi, 'IN THE BRIDGE', 'पुल में लगा है')}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
      <View style={s.tools}>
        <RiverButton
          label={say(
            hi,
            crossing ? 'Crossing…' : crossed ? 'Cross again' : 'Check my idea',
            crossing ? 'पार जा रही है…' : crossed ? 'फिर पार करो' : 'मेरा तरीका देखें',
          )}
          primary
          disabled={toolDisabled}
          onPress={check}
        />
        <RiverButton
          label={say(hi, 'Undo plank', 'पिछला टुकड़ा')}
          disabled={toolDisabled || history.length === 0}
          onPress={() => {
            onChange();
            stopTrip();
            setSlots(history[history.length - 1]);
            setHistory((prev) => prev.slice(0, -1));
            setSelected(null);
            setHinted(false);
            setMessage('');
          }}
        />
        <RiverButton
          label={say(hi, 'A little hint', 'छोटा संकेत')}
          disabled={toolDisabled || solved}
          onPress={() => {
            onChange();
            setHinted(true);
            setMessage(
              say(
                hi,
                'The marks show one unit each. Find two different lengths that make ' +
                  round.gap +
                  '.',
                'हर निशान एक इकाई है। दो अलग लंबाइयाँ ढूँढो जो मिलकर ' + round.gap + ' बनें।',
              ),
            );
          }}
        />
        <RiverButton
          label={say(hi, 'Start this stop again', 'फिर से शुरू करें')}
          disabled={disabled}
          onPress={() => {
            onChange();
            stopTrip();
            setSlots([null, null]);
            setHistory([]);
            setSelected(null);
            setHinted(false);
            setMessage('');
          }}
        />
      </View>
      {(message || selected !== null) && (
        <View style={[s.feedback, hinted && s.hintFeedback]}>
          <Text accessibilityLiveRegion="polite" style={s.feedbackText}>
            {message ||
              say(
                hi,
                round.planks[selected!] + ' units selected. Touch bridge space 1 or 2.',
                round.planks[selected!] + ' इकाई चुनी। पुल की जगह 1 या 2 छुओ।',
              )}
          </Text>
        </View>
      )}
    </View>
  );
}
function RiverButton({
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
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[s.toolText, primary && { color: '#FFFBEC' }]}>{label}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  root: { gap: 16 },
  chapter: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 14 },
  chapterNarrow: { flexDirection: 'column', alignItems: 'flex-start', gap: 10 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  chapterTitle: { fontSize: 27, fontWeight: '800', color: '#2E5145', marginTop: 5 },
  stages: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  stageDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E4EADD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDot: { borderWidth: 2, borderColor: '#D7AF63' },
  stageNumber: { fontWeight: '800', fontSize: 12, color: '#789077' },
  direction: { color: '#496454', fontSize: 16, lineHeight: 24 },
  scene: {
    width: '100%',
    borderRadius: 28,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#E9F3E6',
  },
  missionBadge: {
    position: 'absolute',
    top: 17,
    left: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFBEA',
  },
  missionText: { fontSize: 14, fontWeight: '800' },
  ghost: {
    height: 52,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3B8D82',
    borderRadius: 8,
    backgroundColor: 'rgba(226,247,224,.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostSelected: { borderColor: '#294F40', backgroundColor: '#F8EFC5' },
  ghostText: { fontSize: 19, fontWeight: '800', color: '#336C5D' },
  measureLine: {
    flexDirection: 'row',
    height: 28,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#F6F5D8',
  },
  measureUnit: {
    borderRightWidth: 2,
    borderColor: '#F6F5D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  measureNumber: { fontSize: 12, fontWeight: '800', color: '#175D61' },
  arrived: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    borderRadius: 11,
    backgroundColor: '#FFF3C8',
    padding: 10,
    alignItems: 'center',
  },
  arrivedText: { fontSize: 13, fontWeight: '800', color: '#3B6647', letterSpacing: 1.2 },
  fitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FFFCF0',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DBE2CB',
  },
  fitLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.6, color: '#83917C' },
  equation: { fontSize: 27, fontWeight: '800', color: '#355D4B', marginTop: 4 },
  fitChip: {
    backgroundColor: '#EEF2E5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fitChipReady: { backgroundColor: '#DCEEDB' },
  fitChipText: { fontSize: 14, fontWeight: '700', color: '#586E52' },
  placeChoices: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  placeChoice: {
    minWidth: 120,
    flexGrow: 1,
    minHeight: 50,
    borderRadius: 15,
    padding: 12,
    backgroundColor: '#F9FCF3',
    borderWidth: 1.5,
    borderColor: '#D1DECA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceReady: { borderColor: '#557E58', backgroundColor: '#E8F1D9' },
  placeChoiceText: { fontSize: 14, fontWeight: '700', color: '#46694F', textAlign: 'center' },
  workshop: {
    backgroundColor: '#F8F7EC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#DEDCCA',
    padding: 18,
    gap: 16,
  },
  workshopHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  workshopTitle: { fontSize: 17, fontWeight: '800', color: '#536348' },
  workshopHint: { fontSize: 12, color: '#7A856C' },
  inventory: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  used: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    color: '#6C8768',
    letterSpacing: 0.7,
    marginTop: 7,
  },
  tools: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  tool: {
    minHeight: 50,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F9FCF3',
    borderWidth: 1.5,
    borderColor: '#D1DECA',
    justifyContent: 'center',
  },
  primary: { backgroundColor: '#326E56', borderColor: '#326E56' },
  toolText: { fontSize: 14, fontWeight: '800', color: '#46694F', textAlign: 'center' },
  feedback: {
    backgroundColor: '#E4EFE0',
    borderRadius: 18,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#609267',
  },
  hintFeedback: { backgroundColor: '#FCF1D8', borderLeftColor: '#C6A15A' },
  feedbackText: { fontSize: 16, lineHeight: 25, color: '#426047' },
});
