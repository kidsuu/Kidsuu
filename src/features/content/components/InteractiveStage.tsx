import React, { useReducer, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, s } from '../../family/components/FamilyControls';
import type { InteractivePackage } from '../domain/interactivePackage';
import { correctShapeId, shapeReason, type Shape } from '../domain/geometry';
import {
  newPlacement,
  placementComplete,
  reducePlacement,
  type PlacementAction,
} from '../domain/placement';
import { interactiveRecipes as recipes } from '../data/demo/interactiveCatalog';
import { ShapeDrawing, ToyFruit, FruitTray, art } from './ProceduralArt';
export function InteractiveStage({
  content,
  pageIndex,
  disabled,
  onInteraction,
  onRead,
  canRead,
}: {
  content: InteractivePackage;
  pageIndex: number;
  disabled: boolean;
  onInteraction: () => void;
  onRead: (text: string) => void;
  canRead: boolean;
}) {
  const page = content.pages[pageIndex],
    mode = page.mode,
    hi = content.locale === 'hi-IN';
  const copy = (en: string, hindi: string) => (hi ? hindi : en);
  const [board, dispatch] = useReducer(
    reducePlacement,
    newPlacement(mode === 'picnic-model' ? recipes.modelCount : recipes.placementCount),
  );
  const [hint, setHint] = useState(-1),
    [choice, setChoice] = useState<string | null>(null),
    [sides, setSides] = useState(0),
    [showModel, setShowModel] = useState(false);
  const isPlacing = mode === 'picnic-row' || mode === 'picnic-triangle',
    isModel = mode === 'picnic-model';
  const shapeRound =
    mode === 'triangle-familiar' || mode === 'triangle-turned' || mode === 'triangle-scalene';
  const options = shapeRound
    ? recipes.rounds[mode].map((id) => recipes.shapes.find((s) => s.id === id)!)
    : [];
  const chosen = options.find((shape) => shape.id === choice);
  const triangle = recipes.shapes.find((shape) => shape.id === 'closed-tri')!;
  const modelShape = shapeRound
    ? options.find((shape) => shape.id === correctShapeId(options))!
    : triangle;
  const description = (shape: Shape) => {
    const reason = shapeReason(shape);
    return reason === 'triangle'
      ? copy('Closed outline with three straight sides.', 'तीन सीधे किनारों वाला बंद आकार।')
      : reason === 'four'
        ? copy('Closed outline with four straight sides.', 'चार सीधे किनारों वाला बंद आकार।')
        : reason === 'open'
          ? copy('Three straight segments with an opening.', 'तीन सीधे किनारे, एक जगह खुली है।')
          : copy('An outline with a curved boundary.', 'मुड़े हुए किनारे वाला आकार।');
  };
  let feedback = '';
  if (isPlacing) feedback = content.feedback[board.message];
  if (isModel) {
    const placed = board.locations.filter((b) => b !== null).length;
    feedback =
      content.feedback[placed === 0 ? 'model-empty' : placed === 1 ? 'model-one' : 'model-two'];
  }
  if (chosen) feedback = content.feedback[shapeReason(chosen)];
  if (mode === 'picnic-quantity' && choice)
    feedback =
      content.feedback[
        choice === '2' ? 'quantity-two' : choice === '4' ? 'quantity-four' : 'quantity-three'
      ];
  if (mode === 'triangle-model')
    feedback =
      content.feedback[(['sides-zero', 'sides-one', 'sides-two', 'sides-three'] as const)[sides]];
  const act = (action: PlacementAction) => {
    if (disabled) return;
    onInteraction();
    dispatch(action);
  };
  const select = (value: string) => {
    if (disabled) return;
    onInteraction();
    setChoice(value);
  };
  const bowls = (
    count: number,
    filled: (index: number) => boolean,
    interactive: boolean,
    triangular = false,
  ) => {
    const bowl = (index: number) => (
      <Pressable
        key={index}
        accessible={interactive}
        accessibilityRole={interactive ? 'button' : undefined}
        accessibilityLabel={copy(
          `Bowl ${index + 1}, ${filled(index) ? 'one fruit' : 'empty'}`,
          `कटोरी ${index + 1}, ${filled(index) ? 'एक फल' : 'खाली'}`,
        )}
        accessibilityHint={
          interactive
            ? copy(
                'Choose a fruit first, then tap this bowl.',
                'पहले फल चुनें, फिर इस कटोरी पर टैप करें।',
              )
            : undefined
        }
        accessibilityState={{ disabled: disabled || !interactive }}
        disabled={disabled || !interactive}
        onPress={() => act({ type: 'place', bowl: index })}
        style={({ pressed }) => [styles.bowlControl, pressed && { opacity: 0.65 }]}
      >
        <View style={art.bowl}>{filled(index) && <ToyFruit />}</View>
      </Pressable>
    );
    return (
      <View
        style={styles.board}
        accessible={!interactive}
        accessibilityLabel={
          !interactive
            ? copy(
                `${count} bowls; ${Array.from({ length: count }, (_, i) => i).filter(filled).length} with one fruit each.`,
                `${count} कटोरियाँ; ${Array.from({ length: count }, (_, i) => i).filter(filled).length} में एक-एक फल है।`,
              )
            : undefined
        }
      >
        {triangular ? (
          <>
            <View style={styles.center}>{bowl(0)}</View>
            <View style={styles.center}>
              {bowl(1)}
              {bowl(2)}
            </View>
          </>
        ) : (
          <View style={styles.center}>{Array.from({ length: count }, (_, i) => bowl(i))}</View>
        )}
      </View>
    );
  };
  const help = () => {
    if (disabled) return;
    onInteraction();
    const next = Math.min(hint + 1, page.hints.length - 1);
    setHint(next);
    if (next === 2) {
      setShowModel(true);
      if (isPlacing) dispatch({ type: 'model-one' });
    }
  };
  return (
    <View style={styles.stage}>
      {(mode === 'picnic-intro' || mode === 'picnic-end') && (
        <>
          {bowls(3, () => mode === 'picnic-end', false)}
          {mode === 'picnic-intro' && (
            <View
              style={styles.center}
              accessible
              accessibilityLabel={copy('Three toy fruit tokens.', 'तीन खिलौना फल।')}
            >
              <FruitTray count={3} />
            </View>
          )}
        </>
      )}
      {(isPlacing || isModel) && (
        <>
          {bowls(
            board.count,
            (i) => board.locations.includes(i),
            isPlacing,
            mode === 'picnic-triangle',
          )}
          {isModel && (
            <View
              style={styles.center}
              accessible
              accessibilityLabel={copy(
                `${board.locations.filter((b) => b === null).length} fruits not placed yet.`,
                `${board.locations.filter((b) => b === null).length} फल अभी रखने हैं।`,
              )}
            >
              <FruitTray count={board.locations.filter((b) => b === null).length} />
            </View>
          )}
          {isPlacing && (
            <View style={styles.center}>
              {board.locations.map((location, token) => (
                <Pressable
                  key={token}
                  accessibilityRole="button"
                  accessibilityLabel={copy(
                    `Toy fruit ${token + 1}${location !== null ? ', already placed' : ''}`,
                    `खिलौना फल ${token + 1}${location !== null ? ', रखा जा चुका है' : ''}`,
                  )}
                  accessibilityState={{
                    selected: board.selected === token,
                    disabled: disabled || location !== null,
                  }}
                  disabled={disabled || location !== null}
                  onPress={() => act({ type: 'select', token })}
                  style={({ pressed }) => [
                    styles.token,
                    board.selected === token && styles.selected,
                    (location !== null || pressed) && { opacity: 0.45 },
                  ]}
                >
                  {location === null ? <ToyFruit /> : <Text style={s.body}>✓</Text>}
                </Pressable>
              ))}
            </View>
          )}
          <View style={s.row}>
            {isModel ? (
              <Button
                label={copy('Show one placement', 'एक करके दिखाएँ')}
                disabled={disabled || placementComplete(board)}
                onPress={() => act({ type: 'model-one' })}
              />
            ) : (
              <Button
                label={copy('Cancel selection', 'चयन हटाएँ')}
                disabled={disabled || board.selected === null}
                onPress={() => act({ type: 'cancel' })}
              />
            )}
            <Button
              label={copy('Undo placement', 'पिछला फल वापस लाएँ')}
              disabled={disabled || board.history.length === 0}
              onPress={() => act({ type: 'undo' })}
            />
            <Button
              label={copy('Start this board again', 'यह बोर्ड फिर शुरू करें')}
              disabled={disabled}
              onPress={() => {
                act({ type: 'reset' });
                setHint(-1);
                setShowModel(false);
              }}
            />
          </View>
          {board.modelled && (
            <Text style={s.body}>
              {copy(
                'An example/help was shown. This is not an independent skill score.',
                'उदाहरण या मदद दिखाई गई है। यह स्वतंत्र कौशल का स्कोर नहीं है।',
              )}
            </Text>
          )}
        </>
      )}
      {mode === 'picnic-quantity' && (
        <>
          <View
            accessible
            accessibilityLabel={copy('Three empty plates.', 'तीन खाली प्लेटें।')}
            style={styles.center}
          >
            {[0, 1, 2].map((i) => (
              <View key={i} style={art.plate} />
            ))}
          </View>
          <Text style={s.label}>{copy('Choose a tray', 'ट्रे चुनें')}</Text>
          <View style={styles.center}>
            {recipes.quantityChoices.map((count, i) => (
              <Pressable
                key={count}
                accessibilityRole="button"
                accessibilityLabel={copy(
                  `Tray ${i + 1}, ${count} toy fruits.`,
                  `ट्रे ${i + 1}, ${count} खिलौना फल।`,
                )}
                accessibilityState={{ selected: choice === String(count), disabled }}
                disabled={disabled}
                onPress={() => select(String(count))}
                style={({ pressed }) => [
                  styles.option,
                  choice === String(count) && styles.selected,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <FruitTray count={count} />
              </Pressable>
            ))}
          </View>
          {showModel && (
            <View style={styles.example}>
              <Text style={s.label}>
                {copy('Example, not your answer', 'उदाहरण, आपका जवाब नहीं')}
              </Text>
              <FruitTray count={3} />
              <Text style={s.body}>{content.feedback['quantity-three']}</Text>
            </View>
          )}
        </>
      )}
      {mode === 'triangle-model' && (
        <>
          <View style={styles.center} accessible accessibilityLabel={description(triangle)}>
            <ShapeDrawing shape={triangle} highlightSides={sides} />
          </View>
          <View style={s.row}>
            <Button
              label={copy('Show next side', 'अगला किनारा दिखाएँ')}
              disabled={disabled || sides === 3}
              onPress={() => {
                onInteraction();
                setSides((v) => Math.min(3, v + 1));
              }}
            />
            <Button
              label={copy('Look again', 'फिर देखें')}
              disabled={disabled}
              onPress={() => {
                onInteraction();
                setSides(0);
              }}
            />
          </View>
        </>
      )}
      {shapeRound && (
        <>
          <View style={styles.center}>
            {options.map((shape, i) => (
              <Pressable
                key={shape.id}
                accessibilityRole="button"
                accessibilityLabel={
                  copy(`Option ${i + 1}. `, `विकल्प ${i + 1}। `) + description(shape)
                }
                accessibilityState={{ selected: choice === shape.id, disabled }}
                disabled={disabled}
                onPress={() => select(shape.id)}
                style={({ pressed }) => [
                  styles.option,
                  choice === shape.id && styles.selected,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <ShapeDrawing shape={shape} />
              </Pressable>
            ))}
          </View>
          {showModel && (
            <View
              style={styles.example}
              accessible
              accessibilityLabel={
                copy('Shown example. ', 'दिखाया गया उदाहरण। ') + description(modelShape)
              }
            >
              <Text style={s.label}>
                {copy('An example to explore together', 'साथ में देखने का उदाहरण')}
              </Text>
              <ShapeDrawing shape={modelShape} highlightSides={3} />
              <Text style={s.body}>{content.feedback.triangle}</Text>
            </View>
          )}
        </>
      )}
      {(mode === 'triangle-reason' || mode === 'triangle-end') && (
        <View style={styles.center}>
          {['closed-tri', 'turned-tri', 'scalene-tri'].map((id) => (
            <View
              key={id}
              accessible
              accessibilityLabel={description(recipes.shapes.find((s) => s.id === id)!)}
            >
              <ShapeDrawing shape={recipes.shapes.find((s) => s.id === id)!} />
            </View>
          ))}
        </View>
      )}
      {!!feedback && (
        <View style={styles.feedback}>
          <Text accessibilityLiveRegion="polite" style={s.body}>
            {feedback}
          </Text>
          <Button
            label={copy('Read this explanation', 'यह समझाइश सुनें')}
            disabled={!canRead || disabled}
            onPress={() => onRead(feedback)}
          />
        </View>
      )}
      {page.hints.length > 0 && (
        <View style={styles.feedback}>
          <Button
            label={copy(hint < 0 ? 'Help' : 'Another hint', hint < 0 ? 'मदद' : 'अगला संकेत')}
            disabled={disabled || hint === 2}
            onPress={help}
          />
          {hint >= 0 && (
            <>
              <Text accessibilityLiveRegion="polite" style={s.body}>
                {page.hints[hint]}
              </Text>
              <Button
                label={copy('Read hint', 'संकेत सुनें')}
                disabled={!canRead || disabled}
                onPress={() => onRead(page.hints[hint])}
              />
            </>
          )}
        </View>
      )}
      <Text style={styles.note}>
        {copy(
          'Watching, trying with help, or stopping are all welcome. Next does not require a correct answer. Only your explicit exploration action is saved; choices, hints and board positions are not stored.',
          'देखना, मदद से आज़माना या रुकना—सब ठीक हैं। आगे बढ़ने के लिए सही जवाब ज़रूरी नहीं। केवल आपका स्पष्ट देखा/आज़माया चयन सहेजा जाता है; जवाब, संकेत और बोर्ड की स्थिति नहीं।',
        )}
      </Text>
      <Text style={styles.note}>
        {copy(
          'For descriptive/screen-reader access, quantities and boundaries are named. This supported task is not treated as an independent visual assessment.',
          'स्क्रीन रीडर में संख्या और किनारों का वर्णन मिलता है। इस सहायता को स्वतंत्र दृश्य परीक्षा नहीं माना जाता।',
        )}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  stage: { gap: 18 },
  board: { gap: 10 },
  center: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  bowlControl: {
    minWidth: 96,
    minHeight: 80,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  token: {
    minWidth: 64,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#D6C9E0',
    backgroundColor: '#FFFAF2',
  },
  option: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#D6C9E0',
    backgroundColor: '#FFFAF2',
    minWidth: 148,
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { borderColor: '#694A83', backgroundColor: '#EAE0F2' },
  example: {
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderRadius: 18,
    backgroundColor: '#F1E9F6',
  },
  feedback: { gap: 12, padding: 16, borderRadius: 18, backgroundColor: '#F6F1E9' },
  note: { fontSize: 14, lineHeight: 23, color: '#655A6E' },
});
