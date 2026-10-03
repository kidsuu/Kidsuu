import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import AnimatedKidsuuLogo from '../../../shared/components/branding/AnimatedKidsuuLogo';
import { brandArt as ART } from '../../../shared/assets/brand';
import { Field, SmallIcon, Link, Button } from '../components/AuthControls';
import { authStyles as s } from '../styles/authStyles';
import type { InputID } from '../domain/types';
import type { AuthScreenProps } from './AuthScreen.types';
export default function AuthScreen(props: AuthScreenProps) {
  const {
    route,
    values,
    errors,
    error,
    info,
    busy,
    foreground,
    reduced,
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
    submit,
    resend,
    isDemo,
    title,
    subtitle,
  } = props;
  const f = (id: InputID, label: string, placeholder: string, hint?: string, last = false) => (
    <Field
      key={route + id}
      id={id}
      label={label}
      value={values[id]}
      placeholder={placeholder}
      hint={hint}
      error={errors[id]}
      busy={busy}
      newPassword={route !== 'login'}
      clayLogin={route === 'login'}
      inputRef={(r) => {
        refs.current[id] = r;
      }}
      onChange={(x) => change(id, x)}
      last={last}
      onSubmit={() => {
        const order: InputID[] =
          route === 'register'
            ? ['name', 'mobile', 'password', 'confirm']
            : route === 'login'
              ? ['mobile', 'password']
              : route === 'reset'
                ? ['password', 'confirm']
                : isVerify
                  ? ['code']
                  : ['mobile'];
        const next = order[order.indexOf(id) + 1];
        if (next) {
          refs.current[next]?.focus();
        } else {
          submit();
        }
      }}
    />
  );
  const compact = route !== 'login';
  const splitLogin = wideLogin && !compact;
  return (
    <KeyboardAvoidingView style={s.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <>
        {compact && (
          <Image
            source={ART.background}
            style={[
              { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
              { opacity: 0.2 },
            ]}
            resizeMode="cover"
            accessible={false}
          />
        )}
      </>
      <>
        {compact && (
          <View style={s.authNav}>
            <Pressable
              disabled={busy}
              style={s.back}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={back}
            >
              <SmallIcon name="arrow" back />
            </Pressable>
          </View>
        )}
      </>
      <ScrollView
        ref={scroll}
        scrollEventThrottle={80}
        onScroll={(e) => {
          if (route === 'login')
            setHeaderVisible(e.nativeEvent.contentOffset.y < headerWidth * 0.97 + 15);
        }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          s.scrollContent,
          route === 'login' && { paddingTop: 24, paddingBottom: 32 },
          splitLogin && { justifyContent: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            s.column,
            splitLogin && {
              maxWidth: 1040,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 40,
              paddingHorizontal: 20,
            },
          ]}
        >
          <View style={splitLogin ? { width: '43%' } : undefined}>
            {route === 'login' ? (
              <View style={s.loginHeader}>
                <AnimatedKidsuuLogo
                  width={headerWidth}
                  active={foreground && headerVisible}
                  reduceMotion={reduced !== false}
                />
              </View>
            ) : (
              <Image
                source={ART.logo}
                resizeMode="contain"
                accessibilityLabel="Kidsuu"
                style={[s.brand, s.brandCompact]}
              />
            )}
            <Text accessibilityRole="header" style={[s.title, compact && s.titleCompact]}>
              {title}
            </Text>
            <Text style={s.subtitle}>{subtitle}</Text>
          </View>
          <View
            style={[
              s.card,
              route === 'login' && s.loginCard,
              splitLogin && { width: '50%', maxWidth: 440 },
            ]}
          >
            {!!error && (
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
                style={s.errorBanner}
              >
                {error}
              </Text>
            )}
            {!!info && (
              <Text accessibilityLiveRegion="polite" style={s.infoBanner}>
                {info}
              </Text>
            )}
            {route === 'login' && (
              <>
                {f('mobile', 'Mobile number', '10-digit mobile number')}
                {f('password', 'Password', 'Enter your password', undefined, true)}
                <View style={s.forgot}>
                  <Link onPress={() => navigate('forgot')} disabled={busy}>
                    Forgot password?
                  </Link>
                </View>
                <Button label="Sign in" onPress={submit} busy={busy} clayLogin />
                <View style={s.signup}>
                  <Text style={s.muted}>New to Kidsuu?</Text>
                  <Link onPress={() => navigate('register')} disabled={busy}>
                    Create an account
                  </Link>
                </View>
              </>
            )}
            {route === 'register' && (
              <>
                {f('name', 'Parent / guardian’s name', 'Your name')}
                {f('mobile', 'Mobile number', '10-digit mobile number')}
                {f(
                  'password',
                  'Create password',
                  'At least 8 characters',
                  'Use a letter and a number, too.',
                )}
                {f('confirm', 'Confirm password', 'Enter password again', undefined, true)}
                <Pressable
                  disabled={busy}
                  onPress={() => change('guardian', !values.guardian)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: values.guardian }}
                  accessibilityLabel="I’m a parent or guardian"
                  style={s.guardian}
                >
                  <View style={[s.checkbox, values.guardian && s.checked]}>
                    {values.guardian && <SmallIcon name="check" color="#fff" />}
                  </View>
                  <Text style={s.guardianText}>I’m a parent or guardian.</Text>
                </Pressable>
                {!!errors.guardian && <Text style={s.errorText}>{errors.guardian}</Text>}
                <Button label="Create account" onPress={submit} busy={busy} />
                <View style={s.signup}>
                  <Text style={s.muted}>Already part of Kidsuu?</Text>
                  <Link onPress={() => navigate('login')} disabled={busy}>
                    Sign in
                  </Link>
                </View>
              </>
            )}
            {route === 'forgot' && (
              <>
                <View style={s.symbol}>
                  <SmallIcon name="lock" />
                </View>
                {f('mobile', 'Registered mobile number', '10-digit mobile number', undefined, true)}
                <Button label="Continue" onPress={submit} busy={busy} />
                <View style={s.signup}>
                  <Link onPress={() => navigate('login')} disabled={busy}>
                    Back to sign in
                  </Link>
                </View>
              </>
            )}
            {isVerify && (
              <>
                {isDemo && (
                  <View style={s.verifyBanner}>
                    <Text style={s.verifyNote}>DEMO ONLY · NO SMS SENT</Text>
                    <Text style={s.demoCode}>123456</Text>
                    <Text style={s.verifyNote}>
                      For +91 ••••••{challenge?.mobile.slice(-4)} · Valid for 5 minutes
                    </Text>
                  </View>
                )}
                {f('code', '6-digit verification code', '••••••', undefined, true)}
                <Button
                  label={route === 'verify-register' ? 'Verify & explore' : 'Verify mobile'}
                  onPress={submit}
                  busy={busy}
                />
                <View style={s.codeActions}>
                  <Link onPress={back} disabled={busy}>
                    Change mobile
                  </Link>
                  <Link disabled={busy || remaining > 0} onPress={resend}>
                    {remaining ? `Resend in ${remaining}s` : 'Resend code'}
                  </Link>
                </View>
              </>
            )}
            {route === 'reset' && (
              <>
                {f(
                  'password',
                  'New password',
                  'At least 8 characters',
                  'Use a letter and a number, too.',
                )}
                {f('confirm', 'Confirm new password', 'Enter password again', undefined, true)}
                <Button label="Save new password" onPress={submit} busy={busy} />
              </>
            )}
            {route === 'success' && (
              <>
                <View style={[s.symbol, { backgroundColor: '#E2EFDF' }]}>
                  <SmallIcon name="check" color="#7CA176" />
                </View>
                <Text style={s.successCopy}>
                  Your password has been updated.{'\n'}Sign in with your new password.
                </Text>
                <Button label="Back to sign in" onPress={submit} />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
