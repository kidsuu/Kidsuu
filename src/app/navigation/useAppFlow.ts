import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Alert,
  Animated,
  AppState,
  BackHandler,
  Easing,
  Keyboard,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import type { FieldErrors, Values, InputID } from '../../features/auth/domain/types';
import {
  validateMobile,
  validatePassword,
  validateRegistration,
} from '../../features/auth/domain/validation';
import { createAuthGateway } from '../composition/createAuthGateway';
import { TITLE, initial, type Route } from './routes';
export function useAppFlow(onReady?: () => void) {
  const [auth] = useState(createAuthGateway);
  const { width, height } = useWindowDimensions();
  const wideLogin = width >= 900 && width > height;
  const headerWidth = wideLogin
    ? Math.min(290, height * 0.48)
    : Math.max(150, Math.min(width - 72, height * 0.29, 275));
  const [headerVisible, setHeaderVisible] = useState(true);
  const [route, setRoute] = useState<Route>('launch'),
    [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<FieldErrors>({}),
    [error, setError] = useState(''),
    [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false),
    [reduced, setReduced] = useState<boolean | null>(null);
  const [foreground, setForeground] = useState(AppState.currentState === 'active'),
    [now, setNow] = useState(Date.now());
  const busyRef = useRef(false),
    alive = useRef(true),
    refs = useRef<Partial<Record<InputID, TextInput | null>>>({});
  const scroll = useRef<ScrollView>(null);
  const [motion] = useState(() => new Animated.Value(0));
  const isVerify = route === 'verify-register' || route === 'verify-reset';
  useEffect(() => {
    alive.current = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((x) => {
        if (alive.current) setReduced(x);
      })
      .catch(() => {
        if (alive.current) setReduced(true);
      });
    const a = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    const b = AppState.addEventListener('change', (x) => {
      setForeground(x === 'active');
      if (x === 'active') setNow(Date.now());
    });
    return () => {
      alive.current = false;
      a.remove();
      b.remove();
      auth.cancelVerification();
    };
  }, [auth]);
  useEffect(() => {
    // Prevent a failed asset load from leaving the native launch screen stuck.
    const t = setTimeout(() => onReady?.(), 3000);
    return () => clearTimeout(t);
  }, [onReady]);
  useEffect(() => {
    if (!foreground || reduced === null || !['launch', 'splash'].includes(route)) return;
    const timer = setTimeout(
      () => setRoute(route === 'launch' ? 'splash' : 'login'),
      reduced ? 450 : route === 'launch' ? 1400 : 2400,
    );
    return () => clearTimeout(timer);
  }, [route, foreground, reduced]);
  useEffect(() => {
    motion.stopAnimation();
    motion.setValue(0);
    if (reduced !== false || !foreground || route !== 'launch') return;
    // Only the first app-launch image animates. The illustrated splash is static.
    const animation = Animated.timing(motion, {
      toValue: 1,
      duration: 1050,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [route, reduced, foreground, motion]);
  useEffect(() => {
    if (!isVerify || !foreground) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [isVerify, foreground]);
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(TITLE[route]);
  }, [route]);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (busyRef.current) return true;
      if (route === 'login' || route === 'launch' || route === 'splash') return false;
      if (route === 'home') {
        Alert.alert('Sign out?', 'You will return to the sign-in screen.', [
          { text: 'Stay', style: 'cancel' },
          { text: 'Sign out', onPress: signOut },
        ]);
        return true;
      }
      back();
      return true;
    });
    return () => sub.remove();
  });
  function change(id: keyof Values, value: string | boolean) {
    setValues((v) => ({ ...v, [id]: value }));
    setErrors((e) => ({ ...e, [id]: '' }));
    setError('');
  }
  function navigate(next: Route, keep = false) {
    if (busyRef.current) return;
    if (next === 'home' && !auth.getSession()) {
      setError('Please sign in first.');
      return;
    }
    Keyboard.dismiss();
    if (!keep) auth.cancelVerification();
    setError('');
    setInfo('');
    setErrors({});
    if (['register', 'forgot', 'reset', 'success', 'home'].includes(next))
      setValues((v) => ({ ...v, password: '', confirm: '', code: '' }));
    if (next === 'verify-register' || next === 'verify-reset')
      setValues((v) => ({ ...v, code: '' }));
    setHeaderVisible(true);
    setNow(Date.now());
    setRoute(next);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }
  function back() {
    const map: Partial<Record<Route, Route>> = {
      register: 'login',
      forgot: 'login',
      'verify-register': 'register',
      'verify-reset': 'forgot',
      reset: 'forgot',
      success: 'login',
      login: 'splash',
    };
    navigate(map[route] || 'login');
  }
  function signOut() {
    auth.signOut();
    setValues((v) => ({ ...v, password: '', confirm: '', code: '' }));
    navigate('login');
  }
  async function action(task: () => Promise<Route | null>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError('');
    Keyboard.dismiss();
    try {
      const next = await task();
      if (!alive.current) return;
      busyRef.current = false;
      setBusy(false);
      if (next) navigate(next, true);
    } catch (e) {
      if (alive.current) {
        const text = e instanceof Error ? e.message : 'Please try again.';
        setError(text);
        AccessibilityInfo.announceForAccessibility(text);
        scroll.current?.scrollTo({ y: 0, animated: true });
      }
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }
  function submit() {
    if (busyRef.current) return;
    if (route === 'login') {
      if (auth.mode !== 'demo') {
        const message =
          validateMobile(values.mobile) || (!values.password ? 'Enter your password.' : '');
        if (message) {
          setError(message);
          return;
        }
      }
      void action(async () => {
        await auth.signIn(values.mobile, values.password);
        return 'home';
      });
      return;
    }
    const e: FieldErrors = {};
    setInfo('');
    if (route === 'forgot' && validateMobile(values.mobile))
      e.mobile = validateMobile(values.mobile);
    if (route === 'register') Object.assign(e, validateRegistration(values));
    if (isVerify && !/^\d{6}$/.test(values.code)) e.code = 'Enter the 6-digit verification code.';
    if (route === 'reset') {
      if (validatePassword(values.password)) e.password = validatePassword(values.password);
      if (values.password !== values.confirm || !values.confirm)
        e.confirm = 'Both passwords must match.';
    }
    if (Object.keys(e).length) {
      setErrors(e);
      setError('Please check the highlighted details.');
      refs.current[Object.keys(e)[0] as InputID]?.focus();
      return;
    }
    if (route === 'success') {
      navigate('login');
      return;
    }
    action(async () => {
      if (route === 'register') {
        await auth.beginRegistration(values);
        return 'verify-register';
      }
      if (route === 'forgot') {
        await auth.beginReset(values.mobile);
        return 'verify-reset';
      }
      if (isVerify) {
        const r = await auth.verify(values.code);
        return r.purpose === 'register' ? 'home' : 'reset';
      }
      if (route === 'reset') {
        await auth.resetPassword(values.password, values.confirm);
        return 'success';
      }
      return null;
    });
  }
  const challenge = auth.getChallenge();
  const remaining = Math.max(0, Math.ceil(((challenge?.resendAt || 0) - now) / 1000));
  const resend = () => {
    void action(async () => {
      await auth.resend();
      setNow(Date.now());
      change('code', '');
      setInfo(
        auth.mode === 'demo'
          ? 'Demo code refreshed. No SMS was sent.'
          : 'A new code has been requested.',
      );
      return null;
    });
  };
  return {
    route,
    values,
    errors,
    error,
    info,
    busy,
    foreground,
    reduced,
    motion,
    headerWidth,
    headerVisible,
    setHeaderVisible,
    wideLogin,
    refs,
    scroll,
    isVerify,
    remaining,
    challenge,
    change,
    navigate,
    back,
    signOut,
    submit,
    resend,
    isDemo: auth.mode === 'demo',
    hasSession: auth.getSession() !== null,
  };
}
