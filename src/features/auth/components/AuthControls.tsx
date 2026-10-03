import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native';
import type { InputID } from '../domain/types';
import { authStyles as s } from '../styles/authStyles';
const ICON = {
  phone: require('../assets/icon-phone.png'),
  user: require('../assets/icon-user.png'),
  lock: require('../assets/icon-lock.png'),
  eye: require('../assets/icon-eye.png'),
  eyeOff: require('../assets/icon-eye-off.png'),
  arrow: require('../assets/icon-arrow.png'),
  check: require('../assets/icon-check.png'),
};
export function SmallIcon({
  name,
  color = '#A294AE',
  back = false,
}: {
  name: keyof typeof ICON;
  color?: string;
  back?: boolean;
}) {
  return (
    <Image
      accessible={false}
      source={ICON[name]}
      style={[s.icon, { tintColor: color }, back && { transform: [{ rotate: '180deg' }] }]}
    />
  );
}
export function Link({
  children,
  onPress,
  disabled = false,
}: {
  children: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable disabled={disabled} accessibilityRole="button" onPress={onPress} style={s.linkTap}>
      <Text style={[s.link, disabled && s.disabled]}>{children}</Text>
    </Pressable>
  );
}
export function Button({
  label,
  onPress,
  busy = false,
  clayLogin = false,
}: {
  label: string;
  onPress: () => void;
  busy?: boolean;
  clayLogin?: boolean;
}) {
  return (
    <View style={[s.buttonBase, clayLogin && { borderRadius: 20, backgroundColor: '#8156B0' }]}>
      <Pressable
        onPress={onPress}
        disabled={busy}
        accessibilityRole="button"
        accessibilityState={{ busy, disabled: busy }}
        style={({ pressed }) => [
          s.button,
          clayLogin && { minHeight: 56, borderRadius: 19, backgroundColor: '#8E61B9' },
          pressed && { transform: [{ translateY: 2 }] },
          busy && s.disabled,
        ]}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={s.buttonText}>{label}</Text>
            <View style={s.arrowBubble}>
              <SmallIcon name="arrow" color="#fff" />
            </View>
          </>
        )}
      </Pressable>
    </View>
  );
}
export function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  busy,
  inputRef,
  onSubmit,
  last = false,
  newPassword = false,
  clayLogin = false,
}: {
  id: InputID;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  hint?: string;
  busy: boolean;
  inputRef: (ref: TextInput | null) => void;
  onSubmit: () => void;
  last?: boolean;
  newPassword?: boolean;
  clayLogin?: boolean;
}) {
  const [visible, setVisible] = useState(false),
    [focused, setFocused] = useState(false);
  const password = id === 'password' || id === 'confirm',
    mobile = id === 'mobile',
    code = id === 'code';
  return (
    <View style={s.fieldGroup}>
      <Text style={s.label}>{label}</Text>
      <View
        style={[
          s.field,
          clayLogin && { minHeight: 56, borderRadius: 18, backgroundColor: '#FFFAF4' },
          focused && s.focused,
          !!error && s.fieldInvalid,
        ]}
      >
        {!code && <SmallIcon name={mobile ? 'phone' : password ? 'lock' : 'user'} />}
        {mobile && <Text style={s.country}>+91</Text>}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#AB9CAE"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={password && !visible}
          keyboardType={mobile ? 'phone-pad' : code ? 'number-pad' : 'default'}
          editable={!busy}
          autoCorrect={false}
          autoCapitalize={id === 'name' ? 'words' : 'none'}
          maxLength={mobile ? 14 : code ? 6 : id === 'name' ? 60 : undefined}
          autoComplete={
            mobile
              ? 'tel-national'
              : code
                ? 'sms-otp'
                : password
                  ? newPassword
                    ? 'new-password'
                    : 'current-password'
                  : 'name'
          }
          textContentType={
            mobile
              ? 'telephoneNumber'
              : code
                ? 'oneTimeCode'
                : password
                  ? newPassword
                    ? 'newPassword'
                    : 'password'
                  : 'name'
          }
          accessibilityLabel={label}
          accessibilityHint={error || hint}
          returnKeyType={last ? 'go' : 'next'}
          onSubmitEditing={onSubmit}
          selectionColor="#A37EC2"
          underlineColorAndroid="transparent"
          style={[s.input, clayLogin && { minHeight: 54 }, code && s.codeInput]}
        />
        {password && (
          <Pressable
            onPress={() => setVisible((x) => !x)}
            disabled={busy}
            style={s.eye}
            accessibilityRole="button"
            accessibilityLabel={`${visible ? 'Hide' : 'Show'} ${id === 'confirm' ? 'confirm password' : 'password'}`}
            accessibilityState={{ selected: visible }}
          >
            <SmallIcon name={visible ? 'eyeOff' : 'eye'} />
          </Pressable>
        )}
      </View>
      {!!error && (
        <Text style={s.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
      {!!hint && <Text style={s.hint}>{hint}</Text>}
    </View>
  );
}
