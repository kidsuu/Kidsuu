import type { MutableRefObject, RefObject } from 'react';
import type { ScrollView, TextInput } from 'react-native';
import type {
  AuthRoute,
  FieldErrors,
  InputID,
  Values,
  VerificationChallenge,
} from '../domain/types';
export interface AuthScreenProps {
  route: AuthRoute;
  values: Values;
  errors: FieldErrors;
  error: string;
  info: string;
  busy: boolean;
  foreground: boolean;
  reduced: boolean | null;
  headerWidth: number;
  headerVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
  wideLogin: boolean;
  refs: MutableRefObject<Partial<Record<InputID, TextInput | null>>>;
  scroll: RefObject<ScrollView | null>;
  isVerify: boolean;
  remaining: number;
  challenge: VerificationChallenge | null;
  isDemo: boolean;
  title: string;
  subtitle?: string;
  change: (id: keyof Values, value: string | boolean) => void;
  navigate: (next: AuthRoute) => void;
  back: () => void;
  submit: () => void;
  resend: () => void;
}
