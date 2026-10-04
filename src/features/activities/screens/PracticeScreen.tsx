import React, { useState } from 'react';
import { Text, View } from 'react-native';
import type { ActivitySelection } from '../../home/domain/types';
import type { FamilyStore, FamilyState } from '../../family/domain/FamilyStore';
import { Button, Panel, Notice, s } from '../../family/components/FamilyControls';
import { isPractice, questionsFor } from '../domain/practice';
export function PracticeScreen({
  activity,
  store,
  state,
  onBack,
}: {
  activity: ActivitySelection;
  store: FamilyStore;
  state: FamilyState;
  onBack: () => void;
}) {
  const [step, setStep] = useState(() => {
    const row = state.progress.find((p) => p.activityId === activity.id);
    return row && row.completedSteps < 5 ? row.completedSteps : 0;
  });
  const [answer, setAnswer] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  if (!isPractice(activity.id))
    return (
      <Panel title={activity.title} onBack={onBack} subtitle="Activity unavailable">
        <View style={s.card}>
          <Text style={s.body}>
            This activity is not in the current practice catalog. No progress was recorded.
          </Text>
          <Button label="Back to exploring" onPress={onBack} />
        </View>
      </Panel>
    );
  const id = activity.id,
    questions = questionsFor(id, activity.ageGroup),
    question = questions[step];
  const correct = answer === question.answer;
  const advance = async () => {
    const saved = await store.record(id, {
      completedSteps: step + 1,
      totalSteps: questions.length,
    });
    if (!saved) return;
    if (step === questions.length - 1) setDone(true);
    else {
      setStep(step + 1);
      setAnswer(null);
    }
  };
  return (
    <Panel
      title={activity.title}
      onBack={onBack}
      subtitle="Original practice sample • demo progress saved on this device"
    >
      <Notice error={state.error} loading={state.loading} onReload={() => void store.load()} />
      {done ? (
        <View style={s.card}>
          <Text style={s.large}>★</Text>
          <Text style={s.heading}>A little discovery, well done!</Text>
          <Text style={s.body}>
            All five practice steps are complete. You can see them in My progress.
          </Text>
          <Button label="Back to my world" onPress={onBack} />
        </View>
      ) : (
        <View style={s.card}>
          <Text accessibilityLiveRegion="polite" style={s.label}>
            Step {step + 1} of {questions.length}
          </Text>
          <Text accessibilityRole="header" style={s.title}>
            {question.prompt}
          </Text>
          {question.options.map((option, i) => (
            <Button
              key={`${step}-${i}`}
              label={option}
              selected={answer === i}
              disabled={state.busy || state.loading}
              onPress={() => setAnswer(i)}
            />
          ))}
          {answer !== null && (
            <Text accessibilityLiveRegion="polite" style={s.body}>
              {correct
                ? 'That’s it! Ready for the next little step?'
                : 'Have another look. You can try again.'}
            </Text>
          )}
          <Button
            label={state.busy ? 'Saving step…' : step === 4 ? 'Finish practice' : 'Save & continue'}
            disabled={!correct || state.busy || state.loading}
            onPress={() => void advance()}
          />
          <Text style={s.body}>
            No timer. No scores. Take your time, and ask a grown-up to read with you.
          </Text>
        </View>
      )}
    </Panel>
  );
}
