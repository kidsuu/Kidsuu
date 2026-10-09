import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { PATTERNS, patternSolved, patternToken, placePattern, type Token } from '../domain/puzzles';
import { TOKEN_LABELS } from './WorldArt';
import { TouchPiece } from './TouchPiece';

type Point = { x: number; y: number };
interface PatternAdventureProps {
  index: number;
  hi: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onChange: () => void;
  onSolved: (solved: boolean) => void;
}
const say = (hi: boolean, en: string, hindi: string) => (hi ? hindi : en);
const BIOMES = [
  { en: 'Woodland', hi: 'जंगल', ink: '#284D43', accent: '#477B58', pale: '#E8F0D7' },
  { en: 'Lily lagoon', hi: 'कमल का ताल', ink: '#245766', accent: '#3D8192', pale: '#DCF0E9' },
  { en: 'Sunrise hills', hi: 'सुबह की पहाड़ी', ink: '#6B5943', accent: '#9B734B', pale: '#F6EAD0' },
] as const;
const STAGE_NAMES = [
  ['A path through the trees', 'पेड़ों के बीच रास्ता'],
  ['After the little rain', 'हल्की बारिश के बाद'],
  ['Across the lily lagoon', 'कमल के ताल के पार'],
  ['An evening by the water', 'पानी के पास एक शाम'],
  ['Follow the sunrise', 'सुबह की ओर चलो'],
  ['Over the rainbow hills', 'इंद्रधनुष वाली पहाड़ियों पर'],
] as const;

function Tree({
  x,
  y,
  scale,
  tone = '#5D8B70',
}: {
  x: number;
  y: number;
  scale: number;
  tone?: string;
}) {
  return (
    <G transform={`translate(${x} ${y}) scale(${scale})`}>
      <Path d="M-13 8 L-7-153 L9-153 L15 8 Z" fill="#BC8A62" />
      <Path
        d="M0-74 L-36-106 M4-115 L32-145 M-3-44 L-26-60"
        fill="none"
        stroke="#946C4D"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <Ellipse cx="-42" cy="-171" rx="65" ry="55" fill={tone} />
      <Ellipse cx="35" cy="-171" rx="57" ry="53" fill={tone} />
      <Ellipse cx="-5" cy="-205" rx="68" ry="58" fill={tone} />
      <Path
        d="M-60-194 C-52-208-34-211-22-210 M-9-229 C8-233 29-225 37-214"
        fill="none"
        stroke="#D1DFC0"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".58"
      />
      <Ellipse cx="0" cy="10" rx="29" ry="8" fill="#456B4D" opacity=".14" />
    </G>
  );
}
function Reed({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${scale})`}>
      <Path
        d="M0 0 Q-6-45-19-56 M0 0 Q-3-47 8-70 M0 0 Q17-24 22-39"
        fill="none"
        stroke="#4A8066"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Path d="M-5-44 Q-29-58-28-78 Q-9-74-5-44 M4-29 Q27-51 35-51 Q32-27 4-29" fill="#73A182" />
      <Rect x="4" y="-82" width="8" height="24" rx="4" fill="#AC805A" />
    </G>
  );
}
function LittleFlower({
  x,
  y,
  scale = 1,
  pink = false,
}: {
  x: number;
  y: number;
  scale?: number;
  pink?: boolean;
}) {
  return (
    <G transform={`translate(${x} ${y}) scale(${scale})`}>
      <Path
        d="M0 0 L0-27 M0-9 Q-13-22-15-16 Q-11-5 0-9 M0-15 Q13-28 14-22 Q12-13 0-15"
        fill="#679366"
        stroke="#679366"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[0, 72, 144, 216, 288].map((a) => (
        <Ellipse
          key={a}
          cx="0"
          cy="-34"
          rx="6"
          ry="10"
          fill={pink ? '#DF9C99' : '#F7E6B4'}
          transform={`rotate(${a} 0 -27)`}
        />
      ))}
      <Circle cx="0" cy="-27" r="5" fill="#D5A453" />
    </G>
  );
}

/** Original native vector scenery. Stops 0–1: woodland; 2–3: lagoon; 4–5: hills.
 * Logical dimensions let library covers and the playable stage share the same art. */
export function PatternScenery({
  index = 0,
  width = 1000,
  height = 560,
}: {
  index?: number;
  width?: number;
  height?: number;
}) {
  const biome = Math.floor(index / 2) % 3;
  const second = index % 2 === 1;
  const w = width,
    h = height;
  const scale = Math.max(0.5, Math.min(1.05, w / 800));
  const sky =
    biome === 0
      ? second
        ? '#D7E9E6'
        : '#DAEADF'
      : biome === 1
        ? second
          ? '#DBDEE9'
          : '#D9EFF0'
        : second
          ? '#E7EAF1'
          : '#F8E8CE';
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} accessible={false}>
      <Rect width={w} height={h} fill={sky} />
      {biome === 2 && (
        <>
          <Circle cx={w * 0.74} cy={h * 0.2} r={38 * scale} fill={second ? '#F7E1A7' : '#F3C584'} />
          {second && (
            <G opacity=".45" fill="none" strokeWidth={9 * scale}>
              <Path
                d={`M${w * 0.15} ${h * 0.36} Q${w * 0.5} ${-h * 0.12} ${w * 0.85} ${h * 0.36}`}
                stroke="#DFAEA1"
              />
              <Path
                d={`M${w * 0.18} ${h * 0.37} Q${w * 0.5} ${-h * 0.05} ${w * 0.82} ${h * 0.37}`}
                stroke="#ECCF92"
              />
              <Path
                d={`M${w * 0.21} ${h * 0.38} Q${w * 0.5} ${h * 0.02} ${w * 0.79} ${h * 0.38}`}
                stroke="#A9C4B0"
              />
            </G>
          )}
          <Path
            d={`M0 ${h * 0.4} L${w * 0.18} ${h * 0.17} L${w * 0.32} ${h * 0.39} L${w * 0.55} ${h * 0.13} L${w * 0.77} ${h * 0.39} L${w * 0.93} ${h * 0.23} L${w} ${h * 0.36} V${h} H0Z`}
            fill={second ? '#ABB6C4' : '#BABFC3'}
          />
          <Path
            d={`M${w * 0.5} ${h * 0.185} L${w * 0.55} ${h * 0.13} L${w * 0.635} ${h * 0.23} L${w * 0.565} ${h * 0.2} L${w * 0.54} ${h * 0.235}Z`}
            fill="#F7F5E9"
          />
        </>
      )}
      <Path
        d={`M0 ${h * 0.43} Q${w * 0.17} ${h * 0.27} ${w * 0.43} ${h * 0.4} T${w} ${h * 0.34} V${h} H0Z`}
        fill={biome === 2 ? '#B8BFA1' : biome === 1 ? '#9FC3B4' : '#A7C4AD'}
      />
      <Path
        d={`M0 ${h * 0.49} Q${w * 0.2} ${h * 0.38} ${w * 0.46} ${h * 0.48} T${w} ${h * 0.43} V${h} H0Z`}
        fill={biome === 2 ? '#CDD2AA' : biome === 1 ? '#B9D6B9' : '#C4D8AA'}
      />
      {biome === 1 ? (
        <>
          <Path
            d={`M0 ${h * 0.57} Q${w * 0.24} ${h * 0.49} ${w * 0.53} ${h * 0.53} T${w} ${h * 0.58} V${h} H0Z`}
            fill={second ? '#8BB7BD' : '#91C9C6'}
          />
          <Path
            d={`M0 ${h * 0.59} Q${w * 0.24} ${h * 0.51} ${w * 0.53} ${h * 0.55} T${w} ${h * 0.6}`}
            fill="none"
            stroke="#D6E8CE"
            strokeWidth="12"
          />
          {[0.16, 0.59, 0.86].map((x, i) => (
            <G key={x} opacity=".6" stroke="#E8F6E5" strokeWidth="3" strokeLinecap="round">
              <Line
                x1={w * x - 13}
                y1={h * (0.66 + i * 0.11)}
                x2={w * x + 21}
                y2={h * (0.66 + i * 0.11)}
              />
              <Line
                x1={w * x - 2}
                y1={h * (0.66 + i * 0.11) + 9}
                x2={w * x + 32}
                y2={h * (0.66 + i * 0.11) + 9}
              />
            </G>
          ))}
          <G transform={`translate(${w * 0.93} ${h * 0.84})`}>
            <Ellipse cx="0" cy="0" rx={42 * scale} ry={12 * scale} fill="#5B9679" />
            <Path
              d={`M0 0 L${28 * scale} ${-5 * scale} L${16 * scale} ${8 * scale}Z`}
              fill={second ? '#8BB7BD' : '#91C9C6'}
            />
            <LittleFlower x={-5} y={-5} scale={scale * 0.65} pink />
          </G>
          <Reed x={w * 0.035} y={h * 0.61} scale={scale * 1.2} />
          <Reed x={w * 0.965} y={h * 0.6} scale={scale} />
          <Reed x={w * 0.015} y={h * 0.97} scale={scale * 1.05} />
        </>
      ) : (
        <>
          <Path
            d={`M0 ${h * 0.69} Q${w * 0.34} ${h * 0.58} ${w * 0.66} ${h * 0.66} T${w} ${h * 0.61} V${h} H0Z`}
            fill={biome === 2 ? '#DFD8B7' : '#D8E3B7'}
          />
          <Path
            d={`M0 ${h * 0.98} Q${w * 0.2} ${h * 0.86} ${w * 0.46} ${h * 0.96} T${w} ${h * 0.9} V${h} H0Z`}
            fill={biome === 2 ? '#BFC799' : '#AFC891'}
          />
        </>
      )}
      {biome === 0 && (
        <>
          <Tree
            x={w * 0.045}
            y={h * 0.57}
            scale={scale * 0.97}
            tone={second ? '#5E8C7F' : '#5D8B70'}
          />
          <Tree
            x={w * 0.93}
            y={h * 0.52}
            scale={scale * 1.14}
            tone={second ? '#4D7E71' : '#6B9374'}
          />
          <Tree x={w * 0.89} y={h * 0.51} scale={scale * 0.65} tone="#84A083" />
          <Path
            d={`M${w * 0.04} ${h * 0.99} Q${w * 0.065} ${h * 0.89} ${w * 0.11} ${h * 0.93} Q${w * 0.15} ${h * 0.84} ${w * 0.19} ${h * 0.98}Z`}
            fill="#6E9868"
          />
          <Path
            d={`M${w * 0.91} ${h * 0.99} Q${w * 0.93} ${h * 0.88} ${w * 0.955} ${h * 0.93} Q${w * 0.99} ${h * 0.84} ${w} ${h * 0.98}Z`}
            fill="#75976A"
          />
        </>
      )}
      {biome === 2 && (
        <>
          <Path
            d={`M${w * 0.025} ${h * 0.55} V${h * 0.34}`}
            stroke="#9C8A6C"
            strokeWidth={5 * scale}
            strokeLinecap="round"
          />
          <Path
            d={`M${w * 0.025} ${h * 0.33} L${w * 0.025 + 53 * scale} ${h * 0.365} L${w * 0.025} ${h * 0.4}Z`}
            fill={second ? '#8CA9A1' : '#D39170'}
          />
          <LittleFlower x={w * 0.055} y={h * 0.86} scale={scale * 0.95} pink />
          <LittleFlower x={w * 0.1} y={h * 0.88} scale={scale * 0.72} />
          <LittleFlower x={w * 0.93} y={h * 0.77} scale={scale * 0.86} pink />
          <LittleFlower x={w * 0.955} y={h * 0.81} scale={scale * 0.65} />
        </>
      )}
      <Ellipse
        cx={w * 0.97}
        cy={h * 0.97}
        rx={40 * scale}
        ry={9 * scale}
        fill={biome === 1 ? '#668F7B' : '#98B182'}
      />
      <Ellipse cx={w * 0.97} cy={h * 0.958} rx={25 * scale} ry={11 * scale} fill="#C0C2A9" />
      <Ellipse
        cx={w * 0.97 - 23 * scale}
        cy={h * 0.971}
        rx={13 * scale}
        ry={8 * scale}
        fill="#D5D1B8"
      />
      {biome !== 1 && (
        <>
          <LittleFlower x={w * 0.025} y={h * 0.93} scale={scale * 0.7} />
          <LittleFlower x={w * 0.87} y={h * 0.96} scale={scale * 0.7} pink />
        </>
      )}
    </Svg>
  );
}

function PatternSymbol({ token, size = 48 }: { token: Token; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60" accessible={false}>
      {token === 'leaf' && (
        <>
          <Path
            d="M13 43 C-1 13 19 5 48 8 C54 39 33 53 13 43Z"
            fill="#55996D"
            stroke="#33754E"
            strokeWidth="2.5"
          />
          <Path
            d="M10 49 L43 13 M21 36 L18 24 M29 28 L40 28 M35 21 L33 13"
            fill="none"
            stroke="#DAE9B5"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <Path d="M13 43 L8 52" stroke="#33754E" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {token === 'flower' && (
        <>
          {[0, 72, 144, 216, 288].map((a) => (
            <Ellipse
              key={a}
              cx="30"
              cy="15"
              rx="8.5"
              ry="12"
              fill="#EEA092"
              stroke="#CD796F"
              strokeWidth="2"
              transform={`rotate(${a} 30 30)`}
            />
          ))}
          <Circle cx="30" cy="30" r="9.5" fill="#F4CF77" stroke="#C6984A" strokeWidth="2" />
          <Circle cx="27" cy="27" r="2" fill="#FFE4A3" />
        </>
      )}
      {token === 'sun' && (
        <>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <Line
              key={a}
              x1="30"
              y1="4"
              x2="30"
              y2="9"
              stroke="#CE9A45"
              strokeWidth="3.5"
              strokeLinecap="round"
              transform={`rotate(${a} 30 30)`}
            />
          ))}
          <Circle cx="30" cy="30" r="16" fill="#F6CB6A" stroke="#CE9A45" strokeWidth="2.5" />
          <Path
            d="M21 25 Q24 19 31 19"
            fill="none"
            stroke="#FFEAC0"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {token === 'drop' && (
        <>
          <Path
            d="M30 5 C25 15 12 25 12 37 A18 18 0 0 0 48 37 C48 25 36 16 30 5Z"
            fill="#6EB4C9"
            stroke="#41879F"
            strokeWidth="2.5"
          />
          <Path
            d="M22 30 Q16 39 23 44"
            fill="none"
            stroke="#D8F4F0"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
}
function Kite() {
  return (
    <Svg width="44" height="68" viewBox="0 0 44 68" accessible={false}>
      <Path
        d="M22 32 C9 42 29 45 18 57 Q12 64 19 66"
        fill="none"
        stroke="#826B50"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <Path d="M22 2 L41 19 L22 38 L3 19Z" fill="#E6A66B" stroke="#A97047" strokeWidth="1.7" />
      <Path d="M22 2 L22 38 L3 19Z" fill="#F3C887" />
      <Path d="M22 2 L22 38 M3 19 L41 19" stroke="#A97047" strokeWidth="1.3" />
      <Path d="M17 50 L12 47 L13 53 L17 50 L23 48 L22 54Z" fill="#A9BF98" />
    </Svg>
  );
}
function PatternTile({
  token,
  label,
  help,
  position,
  editable,
  selected,
  hinted,
  needsAnotherLook,
  solved,
  size,
  disabled,
  reducedMotion,
  onPress,
}: {
  token: Token | null;
  label: string;
  help: string;
  position: number;
  editable: boolean;
  selected: boolean;
  hinted: boolean;
  needsAnotherLook: boolean;
  solved: boolean;
  size: number;
  disabled: boolean;
  reducedMotion: boolean;
  onPress: () => void;
}) {
  const [pop] = useState(() => new Animated.Value(1));
  useEffect(() => {
    pop.stopAnimation();
    if (editable && token && !disabled && !reducedMotion) {
      pop.setValue(0.76);
      Animated.spring(pop, {
        toValue: 1,
        friction: 6,
        tension: 105,
        useNativeDriver: true,
      }).start();
    } else pop.setValue(1);
    return () => pop.stopAnimation();
  }, [token, editable, disabled, reducedMotion, pop]);
  return (
    <Animated.View style={{ transform: [{ scale: pop }] }}>
      <View
        style={[p.stoneShadow, { width: size - 5, height: size * 0.29, left: 2, bottom: -6 }]}
      />
      <Pressable
        accessibilityRole={editable ? 'button' : undefined}
        accessibilityLabel={label}
        accessibilityHint={editable ? help : undefined}
        accessibilityState={editable ? { disabled } : undefined}
        disabled={!editable || disabled}
        onPress={onPress}
        style={({ pressed }) => [
          p.stone,
          { width: size, height: size },
          editable && p.editable,
          selected && editable && p.awaiting,
          hinted && p.hinted,
          needsAnotherLook && p.anotherLook,
          solved && p.completeStone,
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
      >
        {token ? (
          <PatternSymbol token={token} size={size * 0.56} />
        ) : (
          <Text style={[p.question, { fontSize: size * 0.4 }]}>?</Text>
        )}
        <Text style={p.position}>{position}</Text>
        {!editable && <View style={p.fixedDot} />}
      </Pressable>
    </Animated.View>
  );
}

function Control({
  label,
  primary = false,
  disabled,
  onPress,
}: {
  label: string;
  primary?: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        p.control,
        primary && p.primary,
        disabled && { opacity: 0.45 },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[p.controlLabel, primary && { color: '#FFFEF7' }]}>{label}</Text>
    </Pressable>
  );
}

/** Mount with a stage key: each authored stop owns its placement and undo state. */
export function PatternAdventure({
  index,
  hi,
  disabled,
  reducedMotion,
  onChange,
  onSolved,
}: PatternAdventureProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [width, setWidth] = useState(Math.min(966, Math.max(260, windowWidth - 44)));
  const round = PATTERNS[index % PATTERNS.length];
  const biome = Math.floor(index / 2) % BIOMES.length;
  const theme = BIOMES[biome];
  const [slots, setSlots] = useState<(Token | null)[]>(() => Array(round.length).fill(null));
  const [selected, setSelected] = useState<Token | null>(null);
  const [undo, setUndo] = useState<(Token | null)[][]>([]);
  const [hint, setHint] = useState<number | null>(null);
  const [lookAgain, setLookAgain] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const targets = useRef<Record<number, View | null>>({});
  const mounted = useRef(true);
  const active = useRef(!disabled);
  const [entry] = useState(() => new Animated.Value(1));
  const [ambient] = useState(() => new Animated.Value(0));
  const [travel] = useState(() => new Animated.Value(0));
  const solved = patternSolved(round, slots);
  const rows = Math.ceil(round.length / 3);
  const compact = width < 560;
  const height = rows === 3 ? 548 : compact ? 430 : 458;
  const size = Math.max(68, Math.min(compact ? 82 : 102, (width - 48) / 3 - 12));
  const startY = rows === 3 ? 174 : compact ? 172 : 184;
  const endY = height - 116;
  const points = useMemo<Point[]>(
    () =>
      Array.from({ length: round.length }, (_, i) => {
        const row = Math.floor(i / 3),
          column = row % 2 ? 2 - (i % 3) : i % 3;
        return {
          x: width * (0.18 + column * 0.32),
          y: startY + row * ((endY - startY) / (rows - 1)),
        };
      }),
    [round.length, width, startY, endY, rows],
  );
  const inputRange = points.map((_, i) => i / (points.length - 1));
  const tokenLabel = (token: Token) => TOKEN_LABELS[token][hi ? 'hi' : 'en'];
  const title = STAGE_NAMES[index % STAGE_NAMES.length][hi ? 1 : 0];
  const path = points.map((point, i) => `${i ? 'L' : 'M'}${point.x} ${point.y}`).join(' ');
  useEffect(() => {
    active.current = !disabled;
  }, [disabled]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    onSolved(solved);
  }, [solved, onSolved]);
  useEffect(() => {
    entry.stopAnimation();
    if (disabled || reducedMotion) {
      entry.setValue(1);
      return;
    }
    entry.setValue(0);
    const motion = Animated.timing(entry, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    motion.start();
    return () => motion.stop();
  }, [entry, disabled, reducedMotion]);
  useEffect(() => {
    ambient.stopAnimation();
    ambient.setValue(0);
    if (disabled || reducedMotion) return;
    const motion = Animated.loop(
      Animated.sequence([
        Animated.timing(ambient, {
          toValue: 1,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(ambient, {
          toValue: 0,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    motion.start();
    return () => motion.stop();
  }, [ambient, disabled, reducedMotion]);
  useEffect(() => {
    travel.stopAnimation();
    if (!solved) {
      travel.setValue(0);
      return;
    }
    if (disabled || reducedMotion) {
      travel.setValue(1);
      return;
    }
    travel.setValue(0);
    const motion = Animated.timing(travel, {
      toValue: 1,
      duration: round.length * 400,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    motion.start();
    return () => motion.stop();
  }, [travel, solved, disabled, reducedMotion, round.length]);
  const choose = (token: Token) => {
    if (disabled) return;
    onChange();
    setSelected(token);
    setMessage('');
    setLookAgain([]);
  };
  const put = (slot: number, token = selected) => {
    if (disabled || token === null || !round.missing.includes(slot)) return;
    onChange();
    setUndo((prev) => [...prev.slice(-31), slots]);
    setSlots((prev) => placePattern(round, prev, slot, token));
    setSelected(null);
    setHint(null);
    setLookAgain([]);
    setMessage('');
  };
  const drop = (token: Token, x: number, y: number) => {
    if (disabled) return;
    choose(token);
    for (const [key, view] of Object.entries(targets.current)) {
      view?.measureInWindow((left, top, w, h) => {
        if (
          mounted.current &&
          active.current &&
          x >= left &&
          x <= left + w &&
          y >= top &&
          y <= top + h
        )
          put(Number(key), token);
      });
    }
  };
  const check = () => {
    if (disabled) return;
    onChange();
    const needs = round.missing.filter((i) => slots[i] !== patternToken(round, i));
    setLookAgain(needs);
    setMessage(
      needs.length === 0
        ? say(
            hi,
            'The whole pattern fits. Your path is ready!',
            'पूरा पैटर्न मिल गया। रास्ता तैयार है!',
          )
        : say(
            hi,
            'The outlined spaces need another look. Follow the little group that repeats.',
            'घेरे वाली जगहें फिर देखो। दोहराता छोटा समूह ढूँढो।',
          ),
    );
  };
  const help = () => {
    if (disabled) return;
    onChange();
    const next = round.missing.find((i) => slots[i] !== patternToken(round, i));
    setHint(next ?? null);
    setSelected(null);
    setMessage(
      say(hi, 'This group repeats: ', 'यह समूह दोहराता है: ') +
        round.cycle.map(tokenLabel).join(' → ') +
        '.',
    );
  };
  const reset = () => {
    if (disabled) return;
    onChange();
    setSlots(Array(round.length).fill(null));
    setSelected(null);
    setUndo([]);
    setHint(null);
    setLookAgain([]);
    setMessage('');
  };
  return (
    <Animated.View
      style={[
        p.root,
        {
          opacity: entry,
          transform: [
            { translateY: entry.interpolate({ inputRange: [0, 1], outputRange: [7, 0] }) },
          ],
        },
      ]}
    >
      <View style={p.chapterRow}>
        {BIOMES.map((chapter, i) => (
          <View
            key={chapter.en}
            style={[
              p.chapter,
              compact && p.chapterCompact,
              i === biome && { backgroundColor: chapter.pale, borderColor: chapter.accent },
            ]}
          >
            <View
              style={[p.chapterMark, { backgroundColor: i === biome ? chapter.accent : '#DFE7DC' }]}
            >
              <Text style={[p.chapterNumber, { color: i === biome ? '#FFFFFF' : '#6B7E69' }]}>
                {i + 1}
              </Text>
            </View>
            <Text style={[p.chapterText, { color: i === biome ? chapter.ink : '#72806B' }]}>
              {hi ? chapter.hi : chapter.en}
            </Text>
          </View>
        ))}
      </View>
      <View
        testID="pattern-stage"
        style={[p.scene, { height, borderColor: theme.accent }]}
        onLayout={(event) => {
          const next = Math.round(event.nativeEvent.layout.width);
          if (next > 0 && next !== width) setWidth(next);
        }}
      >
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <PatternScenery index={index} width={width} height={height} />
        </View>
        <Animated.View
          pointerEvents="none"
          style={[
            p.cloud,
            {
              left: width * 0.2,
              top: 28,
              opacity: 0.74,
              transform: [
                { translateX: ambient.interpolate({ inputRange: [0, 1], outputRange: [-9, 9] }) },
              ],
            },
          ]}
        >
          <Svg width="110" height="38" viewBox="0 0 110 38" accessible={false}>
            <Path
              d="M13 34 C-1 30 2 15 15 14 C19-5 47-1 50 13 C65-3 89 2 92 19 C110 12 116 34 96 34Z"
              fill="#FFFCED"
            />
          </Svg>
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[
            p.cloud,
            {
              right: width * 0.09,
              top: 72,
              opacity: 0.6,
              transform: [
                { translateX: ambient.interpolate({ inputRange: [0, 1], outputRange: [5, -8] }) },
              ],
            },
          ]}
        >
          <Svg width="72" height="27" viewBox="0 0 110 38" accessible={false}>
            <Path
              d="M13 34 C-1 30 2 15 15 14 C19-5 47-1 50 13 C65-3 89 2 92 19 C110 12 116 34 96 34Z"
              fill="#FFFCED"
            />
          </Svg>
        </Animated.View>
        <View style={p.sceneHeading} pointerEvents="none">
          <Text style={[p.stageTag, { color: theme.ink }]}>
            {say(
              hi,
              'TRAIL ' + (index + 1) + ' / ' + PATTERNS.length,
              'रास्ता ' + (index + 1) + ' / ' + PATTERNS.length,
            )}
          </Text>
          <Text style={[p.sceneTitle, { color: theme.ink }]}>{title}</Text>
        </View>
        <Svg
          pointerEvents="none"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={StyleSheet.absoluteFill}
          accessible={false}
        >
          <Path
            d={path}
            fill="none"
            stroke={biome === 1 ? '#599D9E' : '#B8B88F'}
            strokeWidth={size * 0.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".3"
          />
          <Path
            d={path}
            fill="none"
            stroke={biome === 1 ? '#D5ECE2' : '#FFF9D9'}
            strokeWidth="4"
            strokeDasharray="3 12"
            strokeLinecap="round"
            opacity=".85"
          />
          {points.slice(0, -1).map((point, i) => {
            const next = points[i + 1];
            const x = (point.x + next.x) / 2,
              y = (point.y + next.y) / 2;
            const angle = (Math.atan2(next.y - point.y, next.x - point.x) * 180) / Math.PI;
            return (
              <Path
                key={i}
                d={`M${x - 4} ${y - 5} L${x + 3} ${y} L${x - 4} ${y + 5}`}
                fill="none"
                stroke={theme.accent}
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`rotate(${angle} ${x} ${y})`}
                opacity=".65"
              />
            );
          })}
        </Svg>
        {points.map((point, i) => {
          const editable = round.missing.includes(i),
            token = editable ? slots[i] : patternToken(round, i);
          return (
            <View
              key={i}
              ref={(view) => {
                if (editable) targets.current[i] = view;
              }}
              style={{
                position: 'absolute',
                left: point.x - size / 2,
                top: point.y - size / 2,
                width: size,
                height: size + 7,
              }}
              accessibilityLabel={say(
                hi,
                'Position ' + (i + 1) + ': ' + (token ? tokenLabel(token) : 'empty space'),
                'जगह ' + (i + 1) + ': ' + (token ? tokenLabel(token) : 'खाली जगह'),
              )}
              accessible={false}
            >
              <View accessible={false}>
                <PatternTile
                  token={token}
                  label={say(
                    hi,
                    'Position ' + (i + 1) + ': ' + (token ? tokenLabel(token) : 'empty space'),
                    'जगह ' + (i + 1) + ': ' + (token ? tokenLabel(token) : 'खाली जगह'),
                  )}
                  help={say(
                    hi,
                    'Choose a trail piece, then touch this space. You can replace a piece too.',
                    'रास्ते का टुकड़ा चुनें, फिर यह जगह छुएँ। टुकड़ा बदल भी सकते हैं।',
                  )}
                  position={i + 1}
                  editable={editable}
                  selected={selected !== null}
                  hinted={hint === i}
                  needsAnotherLook={lookAgain.includes(i)}
                  solved={solved}
                  size={size}
                  disabled={disabled}
                  reducedMotion={reducedMotion}
                  onPress={() => put(i)}
                />
              </View>
            </View>
          );
        })}
        <Animated.View
          pointerEvents="none"
          style={[
            p.kite,
            {
              opacity: solved ? 1 : 0.72,
              transform: [
                {
                  translateX: travel.interpolate({
                    inputRange,
                    outputRange: points.map((point) => point.x - 22),
                  }),
                },
                {
                  translateY: travel.interpolate({
                    inputRange,
                    outputRange: points.map((point) => point.y - size / 2 - 58),
                  }),
                },
              ],
            },
          ]}
        >
          <Kite />
        </Animated.View>
        {solved && (
          <View style={[p.success, { borderColor: theme.accent }]} pointerEvents="none">
            <Text style={[p.successText, { color: theme.ink }]}>
              {say(hi, 'The path is ready. Let’s follow it!', 'रास्ता तैयार है। अब आगे चलें!')}
            </Text>
          </View>
        )}
      </View>
      <View style={p.workbench}>
        <View style={p.workbenchHeading}>
          <Text style={p.workbenchTitle}>{say(hi, 'Your trail pieces', 'रास्ते के टुकड़े')}</Text>
          <Text style={p.workbenchCopy}>
            {say(
              hi,
              'Choose a piece, then touch a space. Or drag it there.',
              'टुकड़ा चुनकर जगह छुएँ। चाहें तो उसे वहाँ खींचें।',
            )}
          </Text>
        </View>
        <View style={p.inventory}>
          {[...new Set(round.cycle)].map((token) => (
            <TouchPiece
              key={token}
              label={tokenLabel(token)}
              selected={selected === token}
              disabled={disabled}
              reducedMotion={reducedMotion}
              onChoose={() => choose(token)}
              onDrop={(x, y) => drop(token, x, y)}
            >
              <PatternSymbol token={token} size={48} />
            </TouchPiece>
          ))}
        </View>
        {selected && (
          <Text accessibilityLiveRegion="polite" style={p.selection}>
            {say(
              hi,
              tokenLabel(selected) + ' selected. Touch an outlined space.',
              tokenLabel(selected) + ' चुना है। घेरे वाली जगह छुएँ।',
            )}
          </Text>
        )}
      </View>
      <View style={p.controls}>
        <Control
          label={say(hi, 'Check my idea', 'मेरा तरीका देखें')}
          primary
          disabled={disabled}
          onPress={check}
        />
        <Control
          label={say(hi, 'Undo piece', 'पिछला टुकड़ा')}
          disabled={disabled || undo.length === 0}
          onPress={() => {
            onChange();
            setSlots(undo[undo.length - 1]);
            setUndo((prev) => prev.slice(0, -1));
            setSelected(null);
            setHint(null);
            setLookAgain([]);
            setMessage('');
          }}
        />
        <Control
          label={say(hi, 'A little hint', 'छोटा संकेत')}
          disabled={disabled || solved}
          onPress={help}
        />
        <Control
          label={say(hi, 'Start this stop again', 'फिर से शुरू करें')}
          disabled={disabled}
          onPress={reset}
        />
      </View>
      {!!message && (
        <Text accessibilityLiveRegion="polite" style={p.feedback}>
          {message}
        </Text>
      )}
    </Animated.View>
  );
}

const p = StyleSheet.create({
  root: { gap: 16 },
  chapterRow: { flexDirection: 'row', gap: 8, alignItems: 'stretch' },
  chapter: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.3,
    borderColor: '#DDE5D7',
    backgroundColor: '#F8FAF2',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chapterCompact: { flexDirection: 'column', paddingHorizontal: 6, gap: 5 },
  chapterMark: {
    width: 23,
    height: 23,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumber: { fontSize: 12, fontWeight: '800' },
  chapterText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
  },
  scene: { borderRadius: 27, borderWidth: 1.5, overflow: 'hidden', backgroundColor: '#DDEADD' },
  cloud: { position: 'absolute' },
  sceneHeading: {
    position: 'absolute',
    top: 20,
    left: 26,
    right: 26,
    alignItems: 'center',
    gap: 5,
  },
  stageTag: { fontSize: 11, fontWeight: '800', letterSpacing: 1.8 },
  sceneTitle: { fontSize: 20, lineHeight: 27, fontWeight: '800', textAlign: 'center' },
  stone: {
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: '#C2B795',
    backgroundColor: '#F9F3DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stoneShadow: {
    position: 'absolute',
    backgroundColor: '#668662',
    opacity: 0.23,
    borderRadius: 80,
  },
  editable: { borderColor: '#708A71', borderStyle: 'dashed', backgroundColor: '#FFFCF0' },
  awaiting: { borderColor: '#356E58', backgroundColor: '#FFF8DA' },
  hinted: { borderWidth: 3.5, borderColor: '#BD8B3E', backgroundColor: '#FFF4D1' },
  anotherLook: { borderColor: '#BD8B3E', backgroundColor: '#FFF6E0' },
  completeStone: { borderColor: '#65825B', backgroundColor: '#FCF8DE', borderStyle: 'solid' },
  question: { fontWeight: '700', color: '#849274', marginTop: -4 },
  position: { position: 'absolute', bottom: 5, color: '#7F7D63', fontSize: 11, fontWeight: '800' },
  fixedDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#C5BEA3',
  },
  kite: { position: 'absolute', top: 0, left: 0, width: 44, height: 68 },
  success: {
    position: 'absolute',
    left: 19,
    right: 19,
    bottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: '#FFFCED',
    borderWidth: 1,
  },
  successText: { fontSize: 15, fontWeight: '800', textAlign: 'center', lineHeight: 22 },
  workbench: {
    padding: 18,
    paddingBottom: 20,
    borderRadius: 22,
    backgroundColor: '#FFFEF7',
    borderWidth: 1,
    borderColor: '#DDE6D7',
    gap: 16,
  },
  workbenchHeading: { alignItems: 'center', gap: 5 },
  workbenchTitle: { color: '#3A5C48', fontWeight: '800', fontSize: 17 },
  workbenchCopy: { color: '#687C62', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  inventory: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 14 },
  selection: { fontSize: 14, lineHeight: 22, textAlign: 'center', color: '#3F6F56' },
  controls: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 9 },
  control: {
    minHeight: 49,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1DFC9',
    backgroundColor: '#FFFEF6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: '#356B54', borderColor: '#356B54' },
  controlLabel: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '700',
    color: '#45654D',
    textAlign: 'center',
  },
  feedback: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    color: '#45634C',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#E9F1DF',
  },
});
