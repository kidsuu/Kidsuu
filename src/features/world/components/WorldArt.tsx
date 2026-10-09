import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { Token } from '../domain/puzzles';
export const TOKEN_LABELS = {
  leaf: { en: 'leaf', hi: 'पत्ता' },
  flower: { en: 'flower', hi: 'फूल' },
  sun: { en: 'sun', hi: 'सूरज' },
  drop: { en: 'raindrop', hi: 'बूँद' },
};
export function Glyph({ token, size = 42 }: { token: Token; size?: number }) {
  return (
    <View
      accessible={false}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      {token === 'leaf' && (
        <>
          <View
            style={{
              width: size * 0.65,
              height: size * 0.84,
              borderTopLeftRadius: size,
              borderBottomRightRadius: size,
              borderTopRightRadius: size * 0.12,
              borderBottomLeftRadius: size * 0.12,
              backgroundColor: '#398969',
              borderWidth: 2,
              borderColor: '#236B54',
              transform: [{ rotate: '30deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              height: size * 0.66,
              width: 2,
              backgroundColor: '#B4D891',
              transform: [{ rotate: '30deg' }],
            }}
          />
        </>
      )}
      {token === 'flower' && (
        <>
          {Array.from({ length: 5 }, (_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: size * 0.38,
                height: size * 0.38,
                borderRadius: size,
                backgroundColor: '#EF967E',
                borderWidth: 1.5,
                borderColor: '#CD745C',
                left: size * 0.31 + Math.cos(((i * 72 - 90) * Math.PI) / 180) * size * 0.24,
                top: size * 0.31 + Math.sin(((i * 72 - 90) * Math.PI) / 180) * size * 0.24,
              }}
            />
          ))}
          <View
            style={{
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: size,
              backgroundColor: '#F4C456',
              borderWidth: 2,
              borderColor: '#BD8C36',
            }}
          />
        </>
      )}
      {token === 'sun' && (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: 3,
                height: size * 0.15,
                borderRadius: 2,
                backgroundColor: '#C58D31',
                left: size * 0.47 + Math.cos((i * Math.PI) / 4) * size * 0.39,
                top: size * 0.43 + Math.sin((i * Math.PI) / 4) * size * 0.39,
                transform: [{ rotate: i * 45 + 90 + 'deg' }],
              }}
            />
          ))}
          <View
            style={{
              width: size * 0.56,
              height: size * 0.56,
              borderRadius: size,
              backgroundColor: '#F5C760',
              borderWidth: 2,
              borderColor: '#CD973A',
            }}
          />
        </>
      )}
      {token === 'drop' && (
        <View
          style={{
            width: size * 0.57,
            height: size * 0.7,
            borderRadius: size,
            borderTopLeftRadius: 3,
            backgroundColor: '#6CA9CD',
            borderWidth: 2,
            borderColor: '#427F9E',
            transform: [{ rotate: '45deg' }],
          }}
        />
      )}
    </View>
  );
}
export function Seed({ size = 42 }: { size?: number }) {
  return (
    <View
      accessible={false}
      style={{
        width: size,
        height: size * 0.7,
        backgroundColor: '#A46B43',
        borderColor: '#754B33',
        borderWidth: 2,
        borderRadius: size,
        transform: [{ rotate: '-22deg' }],
      }}
    >
      <View
        style={{
          width: size * 0.4,
          height: 2,
          marginTop: size * 0.29,
          marginLeft: size * 0.19,
          backgroundColor: '#CF9C6B',
        }}
      />
    </View>
  );
}
export function Plant({ stage = 3, size = 100 }: { stage?: number; size?: number }) {
  return (
    <View
      accessible={false}
      style={{ width: size, height: size * 1.4, alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.15,
          width: 6,
          height: size * (stage >= 2 ? 0.85 : 0.4),
          backgroundColor: '#2F7756',
          borderRadius: 6,
        }}
      />
      {stage >= 1 && (
        <View
          style={{
            position: 'absolute',
            bottom: size * 0.4,
            left: size * 0.18,
            transform: [{ rotate: '-25deg' }],
          }}
        >
          <Glyph token="leaf" size={size * 0.4} />
        </View>
      )}
      {stage >= 2 && (
        <View
          style={{
            position: 'absolute',
            bottom: size * 0.58,
            right: size * 0.1,
            transform: [{ rotate: '-55deg' }],
          }}
        >
          <Glyph token="leaf" size={size * 0.42} />
        </View>
      )}
      {stage >= 3 && (
        <View style={{ position: 'absolute', bottom: size * 0.84 }}>
          <Glyph token="flower" size={size * 0.64} />
        </View>
      )}
      <View
        style={{
          width: size * 0.75,
          height: size * 0.2,
          borderRadius: 100,
          backgroundColor: '#806146',
          borderWidth: 2,
          borderColor: '#654F3B',
        }}
      />
    </View>
  );
}
export function Plank({ length, unit = 26 }: { length: number; unit?: number }) {
  return (
    <View accessible={false} style={[art.plank, { width: length * unit, minHeight: 42 }]}>
      {Array.from({ length }, (_, i) => (
        <View
          key={i}
          style={{
            width: unit,
            height: 38,
            alignItems: 'center',
            justifyContent: 'center',
            borderRightWidth: i < length - 1 ? 1 : 0,
            borderRightColor: '#AF7D51',
          }}
        >
          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#805A3B' }} />
        </View>
      ))}
    </View>
  );
}
export function Lantern({ lit, size = 62 }: { lit: boolean; size?: number }) {
  return (
    <View
      accessible={false}
      style={{ width: size, height: size * 1.2, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        style={{
          width: size * 0.28,
          height: size * 0.2,
          borderWidth: 3,
          borderColor: lit ? '#A57731' : '#748985',
          borderRadius: size,
          marginBottom: -2,
        }}
      />
      <View
        style={{
          width: size * 0.68,
          height: size * 0.74,
          backgroundColor: lit ? '#F5CE75' : '#C1D0C8',
          borderWidth: 3,
          borderColor: lit ? '#B58838' : '#768D82',
          borderRadius: 13,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: size * 0.3,
            height: size * 0.42,
            borderRadius: 20,
            backgroundColor: lit ? '#FFF3C1' : '#8FA799',
          }}
        />
        {lit && (
          <View
            style={{
              position: 'absolute',
              width: 2,
              height: size * 0.51,
              backgroundColor: '#CDA253',
              left: size * 0.13,
            }}
          />
        )}
      </View>
      <View
        style={{
          width: size * 0.78,
          height: 7,
          borderRadius: 5,
          backgroundColor: lit ? '#A57731' : '#748985',
        }}
      />
    </View>
  );
}
const art = StyleSheet.create({
  plank: {
    flexDirection: 'row',
    backgroundColor: '#DDB180',
    borderWidth: 3,
    borderColor: '#9E704A',
    borderRadius: 12,
    borderBottomWidth: 6,
  },
});
