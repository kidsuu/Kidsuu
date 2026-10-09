import React, { useEffect, useId, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { ALL_LANTERNS, LANTERN_STARTS, lanternSolution, toggleLanterns } from '../domain/puzzles';

type Biome = 'garden' | 'water' | 'observatory';
interface Props {
  index: number;
  hi: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onChange: () => void;
  onSolved: (solved: boolean) => void;
}
const word = (hi: boolean, en: string, hindi: string) => (hi ? hindi : en);
const BIOMES: readonly Biome[] = ['garden', 'garden', 'water', 'water', 'observatory'];
const STARS = [
  [75, 70, 2],
  [172, 119, 2.4],
  [260, 52, 2],
  [360, 102, 2.2],
  [422, 40, 1.5],
  [553, 140, 2],
  [662, 59, 2.5],
  [618, 219, 1.7],
  [110, 220, 1.6],
  [314, 182, 1.5],
  [65, 330, 1.5],
  [651, 327, 1.8],
  [495, 226, 1.8],
  [210, 263, 2],
];

/** Scalable original environment used both by the playable scene and its library cover. */
export function LanternScenery({ index = 0, biome }: { index?: number; biome?: Biome }) {
  const id = 'night-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const place = biome ?? BIOMES[index % BIOMES.length];
  const moonX = place === 'water' ? 243 : 492;
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 720 650"
      preserveAspectRatio="xMidYMid slice"
      accessible={false}
    >
      <Defs>
        <LinearGradient id={id + '-sky'} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={place === 'observatory' ? '#1C234B' : '#102D43'} />
          <Stop offset="0.62" stopColor={place === 'water' ? '#285861' : '#244D59'} />
          <Stop offset="1" stopColor="#3F7168" />
        </LinearGradient>
        <LinearGradient id={id + '-water'} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4C8B92" />
          <Stop offset="1" stopColor="#1B4D61" />
        </LinearGradient>
        <RadialGradient id={id + '-moon'}>
          <Stop offset="0" stopColor="#F9E4AE" stopOpacity="0.16" />
          <Stop offset="1" stopColor="#F9E4AE" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width="720" height="650" fill={'url(#' + id + '-sky)'} />
      <Circle cx={moonX} cy="178" r="104" fill={'url(#' + id + '-moon)'} />
      {STARS.map(([x, y, r], i) => (
        <Circle key={i} cx={x} cy={y} r={r} fill="#D5E5D9" opacity={0.35 + (i % 3) * 0.16} />
      ))}
      <Circle cx={moonX} cy="179" r="34" fill="#F9EBC0" />
      <Circle cx={moonX - 10} cy="169" r="5.5" fill="#E7D9AC" opacity="0.55" />
      <Circle cx={moonX + 9} cy="190" r="8" fill="#E7D9AC" opacity="0.5" />
      <Circle cx={moonX + 12} cy="163" r="3" fill="#E7D9AC" opacity="0.5" />
      <Path
        d="M0 346 Q82 252 163 343 Q240 242 338 335 Q408 278 473 349 Q592 245 720 335 V650 H0Z"
        fill="#244C59"
      />
      <Path
        d="M0 403 Q80 325 158 378 Q241 321 316 403 Q415 332 486 396 Q592 326 720 383 V650 H0Z"
        fill="#315D61"
      />
      {place === 'water' ? (
        <G>
          <Path d="M0 440 Q165 405 325 450 T720 426 V650 H0Z" fill={'url(#' + id + '-water)'} />
          <Ellipse cx={moonX} cy="481" rx="47" ry="6" fill="#CDE0BC" opacity="0.24" />
          <Path
            d="M192 467 H291 M220 492 H279 M123 538 H229 M435 498 H546 M503 571 H632 M296 589 H399"
            fill="none"
            stroke="#9ABDAF"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.36"
          />
          <Path
            d="M0 565 Q84 534 168 574 Q220 605 327 600 Q491 635 720 552 V650 H0Z"
            fill="#254A4C"
          />
          <Path
            d="M27 555 Q34 512 23 482 M32 546 Q56 496 66 487 M39 551 Q80 522 83 505"
            fill="none"
            stroke="#93A789"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Path
            d="M643 553 Q641 490 655 466 M649 542 Q680 500 685 482 M640 552 Q617 508 620 488"
            fill="none"
            stroke="#819F89"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Ellipse cx="613" cy="539" rx="24" ry="8" fill="#709C8D" />
          <Path d="M602 537 L613 528 L621 537" fill="none" stroke="#AAC7A4" strokeWidth="2" />
        </G>
      ) : place === 'observatory' ? (
        <G>
          <Path
            d="M0 501 Q137 457 277 509 Q402 439 543 490 Q622 463 720 498 V650 H0Z"
            fill="#3A6267"
          />
          <Path
            d="M525 397 A56 56 0 0 1 637 397 V450 H525Z"
            fill="#647B88"
            stroke="#B3C0AC"
            strokeWidth="3"
          />
          <Path
            d="M581 343 V397 M540 371 Q581 385 622 371"
            fill="none"
            stroke="#94A398"
            strokeWidth="3"
          />
          <Rect x="573" y="405" width="17" height="45" rx="7" fill="#243D58" />
          <Path
            d="M90 458 L98 414 L111 458 M99 428 L118 406 M101 420 L72 400"
            fill="none"
            stroke="#B5BDA4"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Path
            d="M72 400 L100 389 L106 403 L78 414Z"
            fill="#DAAE6C"
            stroke="#F1CCA2"
            strokeWidth="2"
          />
          <Path d="M0 578 Q190 530 355 586 Q511 521 720 556 V650 H0Z" fill="#2E5059" />
          <Path
            d="M438 649 Q427 567 504 526 Q538 508 575 453"
            fill="none"
            stroke="#81948B"
            strokeWidth="28"
            opacity="0.45"
          />
          <Path
            d="M438 649 Q427 567 504 526 Q538 508 575 453"
            fill="none"
            stroke="#B8BD9E"
            strokeWidth="2"
            strokeDasharray="10 17"
            opacity="0.45"
          />
        </G>
      ) : (
        <G>
          <Path d="M0 466 Q165 420 324 477 Q499 412 720 457 V650 H0Z" fill="#3C695F" />
          <Path d="M0 552 Q202 495 367 554 Q552 487 720 540 V650 H0Z" fill="#2B514C" />
          <Path
            d="M367 650 Q290 603 320 540 Q337 512 358 488"
            fill="none"
            stroke="#A1AE8D"
            strokeWidth="49"
            opacity="0.22"
          />
          {[72, 130, 595, 653].map((x, i) => (
            <G key={x} transform={'translate(' + x + ' ' + (510 + (i % 2) * 47) + ')'}>
              <Path
                d="M0 37 Q-5 10 0 0 M-2 22 Q-24 3 -27 19 Q-17 29 -2 25 M0 18 Q25 0 25 15 Q14 27 0 22"
                fill="#5F8D6E"
                stroke="#9CB88B"
                strokeWidth="2"
              />
              <Circle r={index >= 1 ? '10' : '6'} fill={index >= 1 ? '#E7AF7A' : '#BACAA0'} />
              <Circle r="3" fill="#F3D298" />
            </G>
          ))}
          <Ellipse cx="167" cy="582" rx="24" ry="10" fill="#577B6B" />
          <Ellipse cx="538" cy="585" rx="35" ry="11" fill="#517666" />
        </G>
      )}
      <Path
        d="M0 650 V372 Q43 414 50 452 Q99 420 99 463 Q92 491 68 508 Q129 491 133 530 Q122 557 95 568 Q178 551 187 592 Q169 626 140 650Z"
        fill="#173E43"
      />
      <Path
        d="M720 650 V358 Q673 415 674 454 Q625 421 615 466 Q622 493 650 513 Q583 499 581 538 Q590 563 626 574 Q539 552 531 597 Q550 627 587 650Z"
        fill="#173E43"
      />
      <Path
        d="M24 649 Q22 536 59 447 M29 594 Q60 561 95 549 M691 650 Q690 541 655 449 M686 599 Q652 564 610 551"
        fill="none"
        stroke="#36615C"
        strokeWidth="3"
      />
      <Ellipse cx="355" cy="585" rx="130" ry="20" fill="#A2BA99" opacity="0.08" />
    </Svg>
  );
}

function HangingLantern({
  lit,
  hinted,
  disabled,
  locked,
  reducedMotion,
  label,
  hint,
  onPress,
}: {
  lit: boolean;
  hinted: boolean;
  disabled: boolean;
  locked: boolean;
  reducedMotion: boolean;
  label: string;
  hint: string;
  onPress: () => void;
}) {
  const id = 'lamp-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [glow] = useState(() => new Animated.Value(lit ? 1 : 0));
  const [pop] = useState(() => new Animated.Value(1));
  const previous = useRef(lit);
  useEffect(() => {
    glow.stopAnimation();
    pop.stopAnimation();
    if (reducedMotion || disabled || previous.current === lit) {
      glow.setValue(lit ? 1 : 0);
      pop.setValue(1);
    } else {
      Animated.parallel([
        Animated.timing(glow, { toValue: lit ? 1 : 0, duration: 300, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(pop, { toValue: 1.08, duration: 110, useNativeDriver: true }),
          Animated.spring(pop, { toValue: 1, friction: 8, tension: 95, useNativeDriver: true }),
        ]),
      ]).start();
    }
    previous.current = lit;
    return () => {
      glow.stopAnimation();
      pop.stopAnimation();
    };
  }, [lit, disabled, reducedMotion, glow, pop]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: disabled || locked }}
      disabled={disabled || locked}
      onPress={onPress}
      style={({ pressed }) => [s.lanternTouch, pressed && { opacity: 0.8 }, hinted && s.hinted]}
    >
      <Animated.View
        pointerEvents="none"
        style={[s.glow, { opacity: glow, transform: [{ scale: pop }] }]}
      />
      <Animated.View
        pointerEvents="none"
        style={{ width: 78, height: 104, transform: [{ scale: pop }] }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 96 128" accessible={false}>
          <Defs>
            <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFF2AE" />
              <Stop offset="0.5" stopColor="#F9CA6D" />
              <Stop offset="1" stopColor="#D8913E" />
            </LinearGradient>
          </Defs>
          <Line x1="48" y1="0" x2="48" y2="22" stroke="#B6AC88" strokeWidth="2" />
          <Path d="M37 34 V26 Q48 12 59 26 V34" fill="none" stroke="#D5BB80" strokeWidth="4" />
          <Path
            d="M18 47 Q48 32 78 47 L72 108 Q48 122 24 108Z"
            fill={lit ? 'url(#' + id + ')' : '#284F59'}
            stroke={lit ? '#EBCB87' : '#6C8D8B'}
            strokeWidth="3"
          />
          <Path
            d="M22 50 Q48 42 74 50 M24 104 Q48 113 72 104 M34 47 L37 110 M62 47 L59 110"
            fill="none"
            stroke={lit ? '#C68F49' : '#698682'}
            strokeWidth="2.5"
          />
          <Path
            d="M17 47 L23 35 Q48 27 73 35 L79 47 Q48 39 17 47Z"
            fill="#B88951"
            stroke="#DABB83"
            strokeWidth="2"
          />
          <Path
            d="M22 108 Q48 119 74 108 L69 117 Q48 126 27 117Z"
            fill="#A37947"
            stroke="#C9AE79"
            strokeWidth="2"
          />
          {lit ? (
            <G>
              <Ellipse cx="48" cy="163" rx="12" ry="19" fill="#FFF2BD" opacity="0.64" />
              <Path d="M48 63 Q59 76 48 89 Q39 81 48 63Z" fill="#FFFBDB" />
              <Rect x="44" y="91" width="8" height="11" rx="2" fill="#F7E2A1" />
            </G>
          ) : (
            <G>
              <Path
                d="M44 69 L53 63 M42 77 L54 69"
                stroke="#94B3AC"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.45"
              />
              <Rect x="44" y="91" width="8" height="11" rx="2" fill="#75928A" />
            </G>
          )}
        </Svg>
      </Animated.View>
      {hinted && (
        <View pointerEvents="none" style={s.hintDot}>
          <Text style={s.hintDotText}>↓</Text>
        </View>
      )}
    </Pressable>
  );
}

export function LanternAdventure({
  index,
  hi,
  disabled,
  reducedMotion,
  onChange,
  onSolved,
}: Props) {
  const level = index % LANTERN_STARTS.length;
  const [board, setBoard] = useState(LANTERN_STARTS[level]);
  const [history, setHistory] = useState<number[]>([]);
  const [hint, setHint] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [drift] = useState(() => new Animated.Value(0));
  const [twinkle] = useState(() => new Animated.Value(0.55));
  const [reveal] = useState(() => new Animated.Value(0));
  const solved = board === ALL_LANTERNS;
  const litCount = Array.from({ length: 9 }, (_, i) => !!(board & (1 << i))).filter(Boolean).length;
  const biome = BIOMES[level];
  const placeName =
    biome === 'garden'
      ? word(
          hi,
          level === 1 ? 'The flowering grove' : 'The moon garden',
          level === 1 ? 'फूलों वाला बाग' : 'चाँद का बगीचा',
        )
      : biome === 'water'
        ? word(hi, 'Lights by the water', 'पानी के पास रोशनी')
        : word(
            hi,
            level === 4 ? 'The hilltop constellation' : 'The little observatory',
            level === 4 ? 'पहाड़ी पर तारों का चित्र' : 'नन्ही वेधशाला',
          );
  useEffect(() => {
    onSolved(solved);
  }, [solved, onSolved]);
  useEffect(() => {
    drift.stopAnimation();
    twinkle.stopAnimation();
    if (reducedMotion || disabled) {
      drift.setValue(0);
      twinkle.setValue(0.65);
      return;
    }
    const ambient = Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(drift, { toValue: 1, duration: 7500, useNativeDriver: true }),
          Animated.timing(drift, { toValue: 0, duration: 7500, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(twinkle, { toValue: 0.9, duration: 2400, useNativeDriver: true }),
          Animated.timing(twinkle, { toValue: 0.4, duration: 2900, useNativeDriver: true }),
        ]),
      ),
    ]);
    ambient.start();
    return () => {
      ambient.stop();
      drift.stopAnimation();
      twinkle.stopAnimation();
    };
  }, [disabled, reducedMotion, drift, twinkle]);
  useEffect(() => {
    reveal.stopAnimation();
    if (reducedMotion || disabled) reveal.setValue(solved ? 1 : 0);
    else
      Animated.timing(reveal, {
        toValue: solved ? 1 : 0,
        duration: 850,
        useNativeDriver: true,
      }).start();
    return () => reveal.stopAnimation();
  }, [solved, disabled, reducedMotion, reveal]);
  const toggle = (cell: number) => {
    if (disabled || solved) return;
    onChange();
    setHistory((prev) => [...prev.slice(-63), board]);
    setBoard((prev) => toggleLanterns(prev, cell));
    setHint(null);
    setMessage('');
  };
  const undo = () => {
    if (disabled || history.length === 0) return;
    onChange();
    setBoard(history[history.length - 1]);
    setHistory((prev) => prev.slice(0, -1));
    setHint(null);
    setMessage('');
  };
  const help = () => {
    if (disabled || solved) return;
    onChange();
    const cell = lanternSolution(board)?.[0] ?? null;
    setHint(cell);
    setMessage(
      cell === null
        ? word(hi, 'Every lantern is already glowing.', 'सारी लालटेनें जल रही हैं।')
        : word(
            hi,
            'Try row ' +
              (Math.floor(cell / 3) + 1) +
              ', column ' +
              ((cell % 3) + 1) +
              '. Watch its direct neighbours change.',
            'पंक्ति ' +
              (Math.floor(cell / 3) + 1) +
              ', जगह ' +
              ((cell % 3) + 1) +
              ' आज़माओ। पास की लालटेनें बदलती देखो।',
          ),
    );
  };
  const reset = () => {
    if (disabled) return;
    onChange();
    setBoard(LANTERN_STARTS[level]);
    setHistory([]);
    setHint(null);
    setMessage('');
  };
  return (
    <View style={s.root}>
      <View testID="lantern-stage" style={s.stage}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <LanternScenery index={level} />
        </View>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: twinkle }]}>
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 720 650"
            preserveAspectRatio="xMidYMid slice"
            accessible={false}
          >
            <Path
              d="M350 49 V63 M343 56 H357 M609 155 V168 M603 161 H615 M161 174 V183 M157 178 H165"
              fill="none"
              stroke="#D6E8D4"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <Circle cx="182" cy="503" r="2.8" fill="#DAEAB3" />
            <Circle cx="564" cy="544" r="2.6" fill="#DAEAB3" />
          </Svg>
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [
                { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [-8, 10] }) },
              ],
            },
          ]}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 720 650"
            preserveAspectRatio="xMidYMid slice"
            accessible={false}
          >
            <Path
              d="M52 150 Q94 119 146 148 Q184 136 209 152 Q129 166 52 150 M481 202 Q523 177 557 198 Q593 194 610 210 Q543 218 481 202"
              fill="#739B9E"
              opacity="0.15"
            />
            <Circle cx="216" cy="553" r="3" fill="#EDDF9C" opacity="0.7" />
            <Circle cx="501" cy="511" r="2.5" fill="#EDDF9C" opacity="0.7" />
          </Svg>
        </Animated.View>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: reveal }]}>
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 720 650"
            preserveAspectRatio="xMidYMid slice"
            accessible={false}
          >
            <Path
              d="M296 554 Q323 548 342 568 Q369 575 389 592 M343 568 L324 592 M389 592 L369 617"
              fill="none"
              stroke="#E8D59C"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.65"
            />
            {[
              [296, 554],
              [342, 568],
              [389, 592],
              [324, 592],
              [369, 617],
            ].map(([x, y], i) => (
              <G key={i}>
                <Circle cx={x} cy={y} r="10" fill="#DACE8F" opacity="0.1" />
                <Circle cx={x} cy={y} r="3" fill="#E8D59C" />
              </G>
            ))}
          </Svg>
        </Animated.View>
        <Animated.View pointerEvents="none" style={[s.constellation, { opacity: reveal }]}>
          <Svg width="100%" height="100%" viewBox="0 0 310 120" accessible={false}>
            <G transform="translate(-190 -45)">
              {' '}
              <Path
                d="M217 113 L279 70 L359 95 L414 57 L476 106 L420 152 L359 95 L324 158 L279 70"
                fill="none"
                stroke="#EBE3AF"
                strokeWidth="3"
                opacity="0.7"
              />
              {[
                [217, 113],
                [279, 70],
                [359, 95],
                [414, 57],
                [476, 106],
                [420, 152],
                [324, 158],
              ].map(([x, y], i) => (
                <G key={i}>
                  <Circle cx={x} cy={y} r="9" fill="#EDE0A4" opacity="0.09" />
                  <Circle cx={x} cy={y} r="3.3" fill="#FFF1BE" />
                </G>
              ))}
            </G>
          </Svg>
        </Animated.View>
        <View style={s.sceneHeading} pointerEvents="none">
          <Text style={s.eyebrow}>
            {word(
              hi,
              'NIGHT WALK · ' + (level + 1) + ' / 5',
              'रात की सैर · ' + (level + 1) + ' / 5',
            )}
          </Text>
          <Text style={s.sceneTitle}>{placeName}</Text>
        </View>
        <View style={s.board}>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Svg width="100%" height="100%" viewBox="0 0 300 330" accessible={false}>
              <Path
                d="M11 309 L18 11 Q149 4 282 11 L290 309"
                fill="none"
                stroke="#776752"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <Path
                d="M19 16 Q146 10 280 16 M19 125 Q147 119 281 125 M19 233 Q145 228 282 233"
                fill="none"
                stroke="#A08B65"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <Path
                d="M9 314 H29 M272 314 H292"
                stroke="#B29E72"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </Svg>
          </View>
          {Array.from({ length: 9 }, (_, i) => (
            <HangingLantern
              key={i}
              lit={!!(board & (1 << i))}
              hinted={hint === i}
              disabled={disabled}
              locked={solved}
              reducedMotion={reducedMotion}
              label={word(
                hi,
                'Row ' +
                  (Math.floor(i / 3) + 1) +
                  ', column ' +
                  ((i % 3) + 1) +
                  ': ' +
                  (board & (1 << i) ? 'lit' : 'unlit'),
                'पंक्ति ' +
                  (Math.floor(i / 3) + 1) +
                  ', जगह ' +
                  ((i % 3) + 1) +
                  ': ' +
                  (board & (1 << i) ? 'जली' : 'बुझी'),
              )}
              hint={word(
                hi,
                'Changes this lantern and its direct neighbours above, below, left and right. No diagonal changes.',
                'यह लालटेन और इसके ठीक ऊपर, नीचे, बाएँ और दाएँ की लालटेनें बदलती हैं। तिरछी लालटेनें नहीं बदलतीं।',
              )}
              onPress={() => toggle(i)}
            />
          ))}
        </View>
        <View style={s.sceneFooter} pointerEvents="none">
          <Text accessibilityLiveRegion="polite" style={s.litCount}>
            {word(
              hi,
              litCount + ' of 9 lanterns glowing',
              '9 में से ' + litCount + ' लालटेनें जलीं',
            )}
          </Text>
          <View style={s.progressDots}>
            {Array.from({ length: 9 }, (_, i) => (
              <View key={i} style={[s.progressDot, !!(board & (1 << i)) && s.progressDotLit]} />
            ))}
          </View>
        </View>
      </View>
      <Text style={s.rule}>
        {word(
          hi,
          'Light all nine. Touching a lantern changes it and the ones directly above, below, left and right. Diagonals stay as they are.',
          'सारी नौ लालटेनें जलाओ। एक लालटेन छूने से वह और उसके ठीक ऊपर, नीचे, बाएँ और दाएँ की लालटेनें बदलती हैं। तिरछी लालटेनें वैसी ही रहती हैं।',
        )}
      </Text>
      {solved && (
        <View accessibilityLiveRegion="polite" style={s.success}>
          <Text style={s.successTitle}>
            {word(hi, 'You brought the night to life.', 'तुमने रात में रोशनी भर दी।')}
          </Text>
          <Text style={s.successText}>
            {word(
              hi,
              'All nine lanterns shine. Take a moment to find the new constellation above.',
              'सारी नौ लालटेनें जल रही हैं। ऊपर तारों का नया चित्र देखो।',
            )}
          </Text>
        </View>
      )}
      <View style={s.tools}>
        <NightTool
          label={word(hi, 'Undo', 'पिछली चाल')}
          disabled={disabled || history.length === 0}
          onPress={undo}
        />
        <NightTool
          label={word(hi, 'A little hint', 'छोटा संकेत')}
          disabled={disabled || solved}
          onPress={help}
          primary
        />
        <NightTool
          label={word(hi, 'Start this stop again', 'फिर से शुरू करें')}
          disabled={disabled}
          onPress={reset}
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
function NightTool({
  label,
  disabled,
  onPress,
  primary = false,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.tool,
        primary && s.primaryTool,
        disabled && { opacity: 0.45 },
        pressed && { opacity: 0.78 },
      ]}
    >
      <Text style={[s.toolText, primary && { color: '#FFF5D6' }]}>{label}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  root: { gap: 16, width: '100%', alignSelf: 'center', maxWidth: 900 },
  stage: {
    height: 545,
    width: '100%',
    backgroundColor: '#173B49',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#597577',
    alignItems: 'center',
  },
  constellation: { position: 'absolute', top: 76, left: 20, right: 20, height: 52 },
  sceneHeading: {
    position: 'absolute',
    top: 22,
    left: 14,
    right: 14,
    alignItems: 'center',
    gap: 6,
  },
  eyebrow: {
    color: '#A7C7BE',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  sceneTitle: { color: '#FFF0C9', fontSize: 24, fontWeight: '700', textAlign: 'center' },
  board: {
    position: 'absolute',
    top: 131,
    width: 270,
    height: 310,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  lanternTouch: {
    width: 86,
    height: 99,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  hinted: { borderWidth: 2, borderColor: '#F8EBAC', backgroundColor: 'rgba(248,235,172,0.07)' },
  glow: {
    position: 'absolute',
    width: 75,
    height: 75,
    top: 29,
    borderRadius: 50,
    backgroundColor: 'rgba(255,221,143,0.13)',
  },
  hintDot: {
    position: 'absolute',
    top: 1,
    right: 3,
    width: 21,
    height: 21,
    backgroundColor: '#F7E4A6',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintDotText: { fontSize: 17, fontWeight: '800', color: '#34524D', lineHeight: 20 },
  sceneFooter: {
    position: 'absolute',
    bottom: 22,
    left: 16,
    right: 16,
    alignItems: 'center',
    gap: 11,
  },
  litCount: { color: '#F5E8BC', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  progressDots: { flexDirection: 'row', gap: 7 },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#73958A',
    backgroundColor: '#204E54',
  },
  progressDotLit: { backgroundColor: '#E9CE8B', borderColor: '#E9CE8B' },
  rule: {
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 10,
    color: '#49615B',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  tools: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  tool: {
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F4F4E8',
    borderWidth: 1,
    borderColor: '#CBD4C7',
    borderRadius: 16,
  },
  primaryTool: { backgroundColor: '#234D50', borderColor: '#234D50' },
  toolText: { fontSize: 15, fontWeight: '700', color: '#345451', textAlign: 'center' },
  success: {
    borderRadius: 20,
    backgroundColor: '#F4ECD2',
    padding: 18,
    gap: 5,
    alignItems: 'center',
  },
  successTitle: { color: '#355449', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  successText: { color: '#506C59', fontSize: 15, lineHeight: 23, textAlign: 'center' },
  feedback: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#E8EFE7',
    color: '#395B4E',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
