export type AgeGroup = '2–3' | '4–5' | '6–7' | '8–9';
export type Activity = {
  id: string;
  category: string;
  titles: string[];
  minutes: number[];
  description: string;
  ageGroups?: AgeGroup[];
};
export type ActivitySelection = Activity & {
  title: string;
  durationMinutes: number;
  ageGroup: AgeGroup;
};
export type KidsuuHomeScreenProps = {
  catalog: HomeCatalog;
  profileName?: string;
  onOpenProfiles?: () => void;
  /** Route to your real learning/game/audio/story player. */
  onOpenActivity: (activity: ActivitySelection) => void;
  /** Your app should enforce secure parent access in this callback. */
  onOpenParents: () => void;
  initialAgeGroup?: AgeGroup;
  onAgeGroupChange?: (age: AgeGroup) => void;
  initialSavedIds?: string[];
  savedIds?: string[];
  saving?: boolean;
  onSavedChange?: (ids: string[]) => void;
  /** Supply real progress; omit to hide the continue card. */
  continueProgress?: { activityId: string; completed: number; total: number };
  /** Pass your safe-area bottom inset if the parent doesn't already handle it. */
  bottomInset?: number;
  /** Pass useIsFocused() from your navigation stack. */
  isFocused?: boolean;
};

export type HomeCatalog = {
  categories: { id: string; name: string; hint: string; color: string; ink: string }[];
  ages: AgeGroup[];
  activities: Activity[];
};
