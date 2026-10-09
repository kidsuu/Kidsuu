import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { WORLD_ART } from '../data/assets';
import {
  ALL_LANTERNS,
  BRIDGES,
  LANTERN_STARTS,
  PATTERNS,
  bridgeLength,
  bridgeSolved,
  lanternSolution,
  patternSolved,
  patternToken,
  placePattern,
  placePlank,
  toggleLanterns,
  type Token,
} from '../domain/puzzles';
import { Glyph, Lantern, Plank, Plant, Seed, TOKEN_LABELS } from './WorldArt';
import { TouchPiece } from './TouchPiece';
import type { WorldMode } from '../domain/worldPackage';
const say = (hi: boolean, en: string, hindi: string) => (hi ? hindi : en);
export function PuzzleBoard({
  mode,
  index,
  hi,
  disabled,
  reducedMotion,
  onChange,
  onSolved,
}: {
  mode: WorldMode;
  index: number;
  hi: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onChange: () => void;
  onSolved: (solved: boolean) => void;
}) {
  const { width } = useWindowDimensions();
  const pattern = PATTERNS[index % PATTERNS.length],
    bridge = BRIDGES[index % BRIDGES.length];
  const [patternSlots, setPatternSlots] = useState<(Token | null)[]>(
    Array(pattern.length).fill(null),
  );
  const [selected, setSelected] = useState<Token | number | null>(null);
  const [planks, setPlanks] = useState<(number | null)[]>([null, null]);
  const [bridgeUndo, setBridgeUndo] = useState<(number | null)[][]>([]);
  const [settle] = useState(() => new Animated.Value(1));
  const [lanterns, setLanterns] = useState(LANTERN_STARTS[index % LANTERN_STARTS.length]);
  const [undo, setUndo] = useState<number[]>([]);
  const [hint, setHint] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const pots = index + 1;
  const [seeds, setSeeds] = useState<boolean[]>(Array(pots).fill(false));
  const [quantity, setQuantity] = useState<number | null>(null);
  const [grow, setGrow] = useState(false);
  const targets = useRef<Record<number, View | null>>({});
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );
  const solved =
    mode === 'pattern'
      ? patternSolved(pattern, patternSlots)
      : mode === 'bridge'
        ? bridgeSolved(bridge, planks)
        : mode === 'lantern'
          ? lanterns === ALL_LANTERNS
          : grow;
  useEffect(() => {
    onSolved(solved);
    if (solved && !reducedMotion) {
      settle.setValue(0.97);
      Animated.spring(settle, {
        toValue: 1,
        friction: 6,
        tension: 95,
        useNativeDriver: true,
      }).start();
    }
    return () => settle.stopAnimation();
  }, [solved, onSolved, reducedMotion, settle]);
  const label = (t: Token) => TOKEN_LABELS[t][hi ? 'hi' : 'en'];
  const select = (piece: Token | number) => {
    onChange();
    setSelected(piece);
    setMessage('');
  };
  const put = (slot: number, piece = selected) => {
    if (disabled || piece === null) return;
    onChange();
    setMessage('');
    if (mode === 'pattern' && typeof piece === 'string')
      setPatternSlots((prev) => placePattern(pattern, prev, slot, piece));
    if (mode === 'bridge' && typeof piece === 'number') {
      setBridgeUndo((prev) => [...prev.slice(-31), planks]);
      setPlanks((prev) => placePlank(bridge, prev, slot, piece));
    }
    setSelected(null);
  };
  const drop = (piece: Token | number, x: number, y: number) => {
    select(piece);
    for (const [key, view] of Object.entries(targets.current))
      view?.measureInWindow((left, top, w, h) => {
        if (mounted.current && x >= left && x <= left + w && y >= top && y <= top + h)
          put(Number(key), piece);
      });
  };
  const reset = () => {
    onChange();
    setSelected(null);
    setMessage('');
    setHint(null);
    setPatternSlots(Array(pattern.length).fill(null));
    setPlanks([null, null]);
    setBridgeUndo([]);
    setLanterns(LANTERN_STARTS[index % LANTERN_STARTS.length]);
    setUndo([]);
    setSeeds(Array(pots).fill(false));
    setQuantity(null);
    setGrow(false);
  };
  const check = () => {
    onChange();
    if (mode === 'pattern')
      setMessage(
        solved
          ? say(
              hi,
              'The whole pattern fits. Your path is ready!',
              'पूरा पैटर्न मिल गया। रास्ता तैयार है!',
            )
          : say(
              hi,
              'Look at the group that repeats. Try the next space again.',
              'दोहराता समूह देखो। अगली खाली जगह फिर भरो।',
            ),
      );
    if (mode === 'bridge') {
      const length = bridgeLength(bridge, planks);
      setMessage(
        solved
          ? say(
              hi,
              'The lengths fit exactly. The bridge is ready!',
              'लंबाइयाँ बिल्कुल मिल गईं। पुल तैयार है!',
            )
          : say(
              hi,
              length < bridge.gap
                ? 'The bridge is still short. Try a longer piece.'
                : 'The bridge goes past the bank. Try a shorter piece.',
              length < bridge.gap
                ? 'पुल अभी छोटा है। लंबा टुकड़ा आज़माओ।'
                : 'पुल किनारे से आगे जा रहा है। छोटा टुकड़ा आज़माओ।',
            ),
      );
    }
    if (mode === 'garden') {
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
    }
  };
  const help = () => {
    onChange();
    if (mode === 'pattern')
      setMessage(
        say(
          hi,
          'The repeating group is: ' +
            pattern.cycle.map(label).join(', ') +
            '. Start at the beginning and say it again.',
          'दोहराता समूह है: ' + pattern.cycle.map(label).join(', ') + '। शुरू से फिर बोलो।',
        ),
      );
    if (mode === 'bridge')
      setMessage(
        say(
          hi,
          'Count the little marks. The two plank lengths must add to ' + bridge.gap + '.',
          'छोटे निशान गिनो। दोनों टुकड़ों की कुल लंबाई ' + bridge.gap + ' होनी चाहिए।',
        ),
      );
    if (mode === 'lantern') {
      const next = lanternSolution(lanterns)?.[0] ?? null;
      setHint(next);
      setMessage(
        next === null
          ? say(hi, 'Every lantern is already glowing.', 'सारी लालटेनें जल रही हैं।')
          : say(
              hi,
              'Try row ' +
                (Math.floor(next / 3) + 1) +
                ', column ' +
                ((next % 3) + 1) +
                '. Watch which neighbours change.',
              'पंक्ति ' +
                (Math.floor(next / 3) + 1) +
                ', जगह ' +
                ((next % 3) + 1) +
                ' आज़माओ। देखो, कौन-सी लालटेनें बदलती हैं।',
            ),
      );
    }
    if (mode === 'garden')
      setMessage(
        say(
          hi,
          'Touch one pot at a time and count. Each pot needs just one seed.',
          'एक-एक गमला छूकर गिनो। हर गमले में एक ही बीज चाहिए।',
        ),
      );
  };
  const longestPair = Math.max(
    bridge.gap,
    ...bridge.planks.flatMap((a, i) => bridge.planks.slice(i + 1).map((b) => a + b)),
  );
  const unit = Math.min(
    width < 520 ? 24 : 42,
    Math.max(12, (Math.min(width, 1120) - 148) / longestPair),
  );
  return (
    <View style={b.root}>
      <Animated.View style={{ transform: [{ scale: settle }] }}>
        <ImageBackground
          source={WORLD_ART.woodland}
          accessible={false}
          imageStyle={b.image}
          style={[
            b.stage,
            mode === 'lantern' && { minHeight: 420 },
            mode === 'bridge' && { minHeight: 430 },
          ]}
        >
          {mode === 'bridge' && (
            <View pointerEvents="none" style={b.river}>
              <View style={[b.ripple, { top: 20, left: '8%', width: '32%' }]} />
              <View style={[b.ripple, { top: 62, right: '9%', width: '24%' }]} />
              <View style={[b.ripple, { bottom: 19, left: '19%', width: '43%' }]} />
            </View>
          )}
          {mode === 'lantern' && (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(14,45,46,.83)', borderRadius: 32 },
              ]}
            />
          )}
          <Text
            style={[
              b.sceneTitle,
              mode === 'lantern' && { color: '#FFF4CC', backgroundColor: '#254A43' },
            ]}
          >
            {mode === 'pattern'
              ? say(hi, 'The stepping-stone trail', 'पत्थरों वाला रास्ता')
              : mode === 'bridge'
                ? say(hi, 'A new way across', 'नदी पार का नया रास्ता')
                : mode === 'lantern'
                  ? say(hi, 'A clearing full of light', 'रोशनी से भरा बाग')
                  : say(hi, 'Your little garden', 'तुम्हारा नन्हा बगीचा')}
          </Text>
          {mode === 'pattern' && (
            <View
              style={[b.path, { maxWidth: pattern.length > 6 ? 300 : width < 520 ? 290 : 610 }]}
            >
              {Array.from({ length: pattern.length }, (_, i) => {
                const editable = pattern.missing.includes(i),
                  token = editable ? patternSlots[i] : patternToken(pattern, i);
                return (
                  <View
                    key={i}
                    ref={(view) => {
                      targets.current[i] = view;
                    }}
                    style={[
                      b.stone,
                      editable && b.empty,
                      selected !== null && editable && b.awaiting,
                    ]}
                  >
                    <Pressable
                      accessibilityRole={editable ? 'button' : undefined}
                      accessibilityLabel={say(
                        hi,
                        'Position ' + (i + 1) + ': ' + (token ? label(token) : 'empty space'),
                        'जगह ' + (i + 1) + ': ' + (token ? label(token) : 'खाली जगह'),
                      )}
                      accessibilityHint={
                        editable
                          ? say(
                              hi,
                              'Choose a piece below, then touch this space.',
                              'नीचे से टुकड़ा चुनें, फिर यह जगह छुएँ।',
                            )
                          : undefined
                      }
                      disabled={!editable || disabled}
                      onPress={() => put(i)}
                      style={b.stoneTouch}
                    >
                      {token ? (
                        <Glyph token={token} size={42} />
                      ) : (
                        <Text style={b.question}>?</Text>
                      )}
                      <Text style={b.position}>{i + 1}</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}
          {mode === 'bridge' && (
            <View style={b.bridgeScene}>
              <View style={b.gapLabel}>
                <Text style={b.gapText}>
                  {say(hi, 'Gap: ' + bridge.gap + ' units', 'दूरी: ' + bridge.gap + ' इकाई')}
                </Text>
              </View>
              <View style={b.crossing}>
                <View style={b.bank} />
                <View style={{ alignItems: 'center', gap: 12 }}>
                  <View style={{ width: bridge.gap * unit, flexDirection: 'row' }}>
                    {Array.from({ length: bridge.gap }, (_, i) => (
                      <View
                        key={i}
                        style={{
                          width: unit,
                          height: 25,
                          borderTopWidth: 3,
                          borderRightWidth: 2,
                          borderColor: '#FCF8D9',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            color: '#173D3F',
                            fontSize: 12,
                            fontWeight: '800',
                            backgroundColor: '#FFF9DB',
                            borderRadius: 5,
                            paddingHorizontal: 2,
                          }}
                        >
                          {i + 1}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View style={b.bridgeSlots}>
                    {planks.map((piece, i) => (
                      <View
                        key={i}
                        ref={(v) => {
                          targets.current[i] = v;
                        }}
                      >
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={say(
                            hi,
                            'Bridge space ' +
                              (i + 1) +
                              (piece !== null ? ', plank ' + bridge.planks[piece] : ' empty'),
                            'पुल की जगह ' +
                              (i + 1) +
                              (piece !== null ? ', लंबाई ' + bridge.planks[piece] : ' खाली'),
                          )}
                          disabled={disabled}
                          onPress={() => {
                            if (selected === null && piece !== null) {
                              onChange();
                              setBridgeUndo((prev) => [...prev.slice(-31), planks]);
                              setPlanks((prev) => prev.map((p, j) => (i === j ? null : p)));
                            } else put(i);
                          }}
                          style={[
                            b.plankSpace,
                            {
                              minWidth: piece === null ? Math.max(56, (bridge.gap * unit) / 2) : 0,
                            },
                            selected !== null && b.awaiting,
                          ]}
                        >
                          {piece === null ? (
                            <Text style={b.question}>+</Text>
                          ) : (
                            <Plank length={bridge.planks[piece]} unit={unit} />
                          )}
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={b.bank} />
              </View>
              <Text style={b.equation}>
                {planks.map((i) => (i === null ? '?' : bridge.planks[i])).join(' + ')} ={' '}
                {bridgeLength(bridge, planks)} / {bridge.gap}
              </Text>
            </View>
          )}
          {mode === 'lantern' && (
            <View style={b.lanternGrid}>
              {Array.from({ length: 9 }, (_, i) => {
                const lit = !!(lanterns & (1 << i));
                return (
                  <Pressable
                    key={i}
                    accessibilityRole="button"
                    accessibilityLabel={say(
                      hi,
                      'Row ' +
                        (Math.floor(i / 3) + 1) +
                        ', column ' +
                        ((i % 3) + 1) +
                        ': ' +
                        (lit ? 'lit' : 'unlit'),
                      'पंक्ति ' +
                        (Math.floor(i / 3) + 1) +
                        ', जगह ' +
                        ((i % 3) + 1) +
                        ': ' +
                        (lit ? 'जली' : 'बुझी'),
                    )}
                    accessibilityHint={say(
                      hi,
                      'Changes this lantern and its four direct neighbours.',
                      'यह और चारों ओर की लालटेनें बदलती हैं।',
                    )}
                    disabled={disabled || solved}
                    onPress={() => {
                      onChange();
                      setUndo((prev) => [...prev.slice(-63), lanterns]);
                      setLanterns((prev) => toggleLanterns(prev, i));
                      setHint(null);
                      setMessage('');
                    }}
                    style={({ pressed }) => [
                      b.lanternTile,
                      lit && b.litTile,
                      hint === i && b.hinted,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Lantern lit={lit} />
                  </Pressable>
                );
              })}
            </View>
          )}
          {mode === 'garden' && (
            <View style={b.potGrid}>
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
                    setSeeds((prev) => prev.map((s, j) => (i === j ? !s : s)));
                    setMessage('');
                  }}
                  style={b.potTouch}
                >
                  {grow ? (
                    <Plant size={62} />
                  ) : (
                    <View style={b.potSoil}>
                      {filled ? <Seed size={31} /> : <Text style={b.potPlus}>+</Text>}
                    </View>
                  )}
                  <View style={b.pot}>
                    <View style={b.potRim} />
                    <Text style={b.potIndex}>{i + 1}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
          {solved && (
            <View style={b.ready}>
              <Text style={b.readyText}>
                {say(
                  hi,
                  mode === 'lantern' ? 'The grove is glowing.' : 'Ready to explore the next stop!',
                  mode === 'lantern' ? 'बाग रोशनी से भर गया।' : 'अगली जगह देखने को तैयार!',
                )}
              </Text>
            </View>
          )}
        </ImageBackground>
      </Animated.View>
      {mode === 'pattern' && (
        <View style={b.inventory}>
          {[...new Set(pattern.cycle)].map((token) => (
            <TouchPiece
              key={token}
              label={label(token)}
              selected={selected === token}
              disabled={disabled}
              reducedMotion={reducedMotion}
              onChoose={() => select(token)}
              onDrop={(x, y) => drop(token, x, y)}
            >
              <Glyph token={token} />
            </TouchPiece>
          ))}
        </View>
      )}
      {mode === 'bridge' && (
        <View style={b.inventory}>
          {bridge.planks.map((length, i) => (
            <TouchPiece
              key={i}
              label={say(hi, length + ' units', length + ' इकाई')}
              selected={selected === i}
              disabled={disabled || planks.includes(i)}
              reducedMotion={reducedMotion}
              onChoose={() => select(i)}
              onDrop={(x, y) => drop(i, x, y)}
            >
              <Plank length={length} unit={17} />
            </TouchPiece>
          ))}
        </View>
      )}
      {mode === 'garden' && (
        <View style={b.quantity}>
          <Text style={b.quantityLabel}>{say(hi, 'How many seeds?', 'कितने बीज?')}</Text>
          <View style={b.tools}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                accessibilityRole="button"
                accessibilityLabel={say(hi, n + ' seeds', n + ' बीज')}
                accessibilityState={{ selected: quantity === n, disabled }}
                disabled={disabled || grow}
                onPress={() => {
                  onChange();
                  setQuantity(n);
                  setMessage('');
                }}
                style={[b.number, quantity === n && b.numberSelected]}
              >
                <Text style={[b.numberText, quantity === n && { color: '#FFFFFF' }]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <View style={b.tools}>
        {mode !== 'lantern' && (
          <Tool
            label={say(hi, 'Check my idea', 'मेरा तरीका देखें')}
            primary
            disabled={disabled}
            onPress={check}
          />
        )}
        {mode === 'bridge' && (
          <Tool
            label={say(hi, 'Undo plank', 'पिछला टुकड़ा')}
            disabled={disabled || bridgeUndo.length === 0}
            onPress={() => {
              onChange();
              setPlanks(bridgeUndo[bridgeUndo.length - 1]);
              setBridgeUndo((prev) => prev.slice(0, -1));
              setMessage('');
            }}
          />
        )}
        {mode === 'lantern' && (
          <Tool
            label={say(hi, 'Undo', 'पिछली चाल')}
            disabled={disabled || undo.length === 0}
            onPress={() => {
              onChange();
              setLanterns(undo[undo.length - 1]);
              setUndo((prev) => prev.slice(0, -1));
              setHint(null);
              setMessage('');
            }}
          />
        )}
        <Tool
          label={say(hi, 'A little hint', 'छोटा संकेत')}
          disabled={disabled || solved}
          onPress={help}
        />
        <Tool
          label={say(hi, 'Start this stop again', 'फिर से शुरू करें')}
          disabled={disabled}
          onPress={reset}
        />
      </View>
      {!!message && (
        <Text accessibilityLiveRegion="polite" style={b.feedback}>
          {message}
        </Text>
      )}
      {selected !== null && (
        <Text accessibilityLiveRegion="polite" style={b.feedback}>
          {say(
            hi,
            'Piece selected. Touch an empty space, or choose another piece.',
            'टुकड़ा चुना है। खाली जगह छुएँ या दूसरा टुकड़ा चुनें।',
          )}
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
        b.tool,
        primary && b.primary,
        disabled && { opacity: 0.45 },
        pressed && { opacity: 0.82 },
      ]}
    >
      <Text style={[b.toolText, primary && { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}
const b = StyleSheet.create({
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
  image: { borderRadius: 30 },
  sceneTitle: {
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
  path: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(245,245,211,.84)',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#DDD6B3',
  },
  stone: {
    width: 64,
    height: 80,
    borderRadius: 23,
    backgroundColor: '#F5EBD6',
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: '#C9BB98',
  },
  stoneTouch: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { borderStyle: 'dashed', backgroundColor: '#FFFDF3', borderColor: '#597F6A' },
  awaiting: { borderColor: '#235F51', backgroundColor: '#E1EFDF' },
  question: { fontSize: 30, color: '#6D8267', fontWeight: '800' },
  position: { fontSize: 11, color: '#6D745D', position: 'absolute', bottom: 2 },
  inventory: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 14,
    paddingVertical: 2,
  },
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
  feedback: {
    fontSize: 17,
    lineHeight: 26,
    color: '#355542',
    padding: 16,
    backgroundColor: '#EAF3E7',
    borderRadius: 18,
    textAlign: 'center',
  },
  bridgeScene: { alignItems: 'center', gap: 25, marginTop: 8 },
  gapLabel: { padding: 12, backgroundColor: '#FFFAEA', borderRadius: 16 },
  gapText: { fontWeight: '800', fontSize: 18, color: '#3D5B47' },
  crossing: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  river: {
    position: 'absolute',
    top: '39%',
    left: -20,
    right: -20,
    height: '35%',
    backgroundColor: '#79C7CC',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderColor: '#C8DDB2',
    borderRadius: 60,
  },
  ripple: { position: 'absolute', height: 4, backgroundColor: '#D4F3E9', borderRadius: 10 },
  bank: {
    width: 18,
    height: 115,
    backgroundColor: '#6D8160',
    borderWidth: 2,
    borderColor: '#536448',
    borderRadius: 9,
  },
  bridgeSlots: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  plankSpace: {
    minHeight: 70,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#416D62',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(253,252,226,.87)',
  },
  equation: {
    fontSize: 19,
    fontWeight: '800',
    color: '#2E584C',
    backgroundColor: '#FFF9E6',
    borderRadius: 14,
    padding: 12,
  },
  lanternGrid: {
    width: 270,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    justifyContent: 'center',
  },
  lanternTile: {
    width: 82,
    height: 93,
    borderWidth: 2,
    borderColor: '#587E6E',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(170,192,170,.13)',
  },
  litTile: { borderColor: '#DBB963', backgroundColor: 'rgba(250,208,118,.18)' },
  hinted: { borderColor: '#FFFFFF', borderWidth: 4 },
  ready: {
    position: 'absolute',
    bottom: 13,
    left: 18,
    right: 18,
    backgroundColor: '#FFF7D7',
    padding: 10,
    borderRadius: 14,
  },
  readyText: { color: '#3F644D', fontWeight: '800', fontSize: 16, textAlign: 'center' },
  potGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    justifyContent: 'center',
    maxWidth: 480,
  },
  potTouch: { width: 72, minHeight: 125, justifyContent: 'flex-end', alignItems: 'center' },
  potSoil: {
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
  potRim: {
    position: 'absolute',
    top: 0,
    width: 69,
    height: 13,
    borderRadius: 5,
    backgroundColor: '#DF9E73',
    borderWidth: 2,
    borderColor: '#A76C47',
  },
  potIndex: { color: '#FFF3DF', fontWeight: '800', fontSize: 20 },
  potPlus: { color: '#FCE0B1', fontWeight: '800', fontSize: 25 },
  quantity: { alignItems: 'center', gap: 12 },
  quantityLabel: { fontSize: 18, color: '#345847', fontWeight: '700' },
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
  numberSelected: { backgroundColor: '#286B56', borderColor: '#286B56' },
  numberText: { fontSize: 22, fontWeight: '800', color: '#345847' },
});
