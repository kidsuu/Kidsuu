import type { AuthRoute, Values } from '../../features/auth/domain/types';
export type Route = 'launch' | 'splash' | 'home' | AuthRoute;
export const TITLE: Record<Route, string> = {
  launch: 'A little hello',
  splash: 'Welcome to Kidsuu',
  login: 'Welcome back!',
  register: 'A little adventure awaits',
  forgot: 'Forgot your password?',
  'verify-register': 'One little check',
  'verify-reset': 'Let’s get you back',
  reset: 'A fresh little start',
  success: 'All set, grown-up!',
  home: 'Your little world',
};
export const SUB: Partial<Record<Route, string>> = {
  login: 'Little steps. Big discoveries.',
  register: 'A grown-up account for their little world.',
  forgot: 'It happens. Let’s help you find your way back.',
  'verify-register': 'Verify your mobile to finish your account.',
  'verify-reset': 'Verify your mobile before choosing a new password.',
  reset: 'Choose a new password for your account.',
  success: 'Your next little adventure is waiting.',
};
export const initial: Values = {
  name: '',
  mobile: '',
  password: '',
  confirm: '',
  code: '',
  guardian: false,
};
