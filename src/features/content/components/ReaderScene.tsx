import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button, s } from '../../family/components/FamilyControls';
import type { ContentLocale } from '../domain/contentPackage';
import { chooseSceneFrame, type SceneFrame } from '../domain/sceneFrames';
import { sceneAsset } from '../data/demo/sceneAssets';

/** Mounted per page by the caller. No timers, network, animation or progress/store access. */
export function ReaderScene({
  frames,
  locale,
  locked,
  onChange,
}: {
  frames: readonly SceneFrame[];
  locale: ContentLocale;
  locked: boolean;
  onChange: () => void;
}) {
  const [index, setIndex] = useState(0);
  const frame = chooseSceneFrame(frames, index);
  const hi = locale === 'hi-IN';
  return (
    <View style={styles.container}>
      <Text style={s.label}>
        {hi ? 'चित्र का ड्राफ्ट · समीक्षा बाकी' : 'Draft illustration · review pending'}
      </Text>
      {frames.length > 1 && (
        <>
          <View style={s.row}>
            {frames.map((f, i) => (
              <Button
                key={f.assetId}
                label={f.label}
                selected={index === i}
                disabled={locked}
                onPress={() => {
                  if (locked || i === index) return;
                  onChange(); // Cancels any pending/current narration BEFORE changing the visible frame.
                  setIndex(i);
                }}
              />
            ))}
          </View>
          <Text accessibilityLanguage={locale} style={s.body}>
            {hi
              ? 'दो स्थिर चित्र हैं। नीचे और आराम के लिए एक ही चित्र है। चित्र बदलने से प्रगति दर्ज नहीं होती।'
              : 'Two still pictures. Down and rest share one picture. Changing the picture does not record progress.'}
          </Text>
        </>
      )}
      <ScenePicture
        key={frame.assetId}
        assetId={frame.assetId}
        description={frame.description}
        locale={locale}
      />
    </View>
  );
}
function ScenePicture({
  assetId,
  description,
  locale,
}: {
  assetId: string;
  description: string;
  locale: ContentLocale;
}) {
  const [failed, setFailed] = useState(false);
  const asset = sceneAsset(assetId);
  const hi = locale === 'hi-IN';
  return (
    <View style={styles.container}>
      {asset && !failed ? (
        <Image
          source={asset.source}
          resizeMode="contain"
          fadeDuration={0}
          style={[styles.image, { aspectRatio: asset.width / asset.height }]}
          accessible={false}
          importantForAccessibility="no"
          onError={() => setFailed(true)}
        />
      ) : (
        <Text accessibilityRole="alert" style={s.body}>
          {hi
            ? 'चित्र उपलब्ध नहीं है। उसका विवरण और कहानी का पाठ नीचे हैं।'
            : 'Picture unavailable. Its description and the story text remain available.'}
        </Text>
      )}
      {/* A visible, selectable text description is also the single screen-reader equivalent.
        Hiding the image from accessibility avoids duplicate announcements. */}
      <Text accessibilityLanguage={locale} selectable style={s.body}>
        {description}
      </Text>
    </View>
  );
}
export function StoryFriends({ locale }: { locale: ContentLocale }) {
  const hi = locale === 'hi-IN';
  return (
    <View style={[s.card, styles.cast]}>
      <Text accessibilityRole="header" style={s.heading}>
        {hi ? 'कहानी के दोस्त' : 'Story friends'}
      </Text>
      <ScenePicture
        assetId="cast-reference"
        locale={locale}
        description={
          hi
            ? 'मूल चित्र के बच्चे और पपी। यह पात्रों का परिचय है, कहानी की किसी घटना का दृश्य नहीं। आगे के चित्रों में कहानी की वस्तुएँ दिखाई गई हैं।'
            : 'The boy and Puppy from the original artwork. This is a character introduction, not a story action scene. The following illustrations focus on objects in the story.'
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: 14, width: '100%' },
  image: { width: '100%', backgroundColor: '#f6f0e8', borderRadius: 16 },
  cast: { width: '100%', maxWidth: 420, alignSelf: 'center' },
});
