import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export default function ScreenBackground() {
  return (
    <View pointerEvents="none" accessible={false} style={styles.base}>
      <View style={styles.orange} />
      <View style={styles.emerald} />
      <View style={styles.purple} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.background, overflow: 'hidden' },
  orange: { position: 'absolute', bottom: -120, left: -80, width: 320, height: 320, borderRadius: 160, backgroundColor: '#D93A00', opacity: 0.38 },
  emerald: { position: 'absolute', bottom: -100, right: -60, width: 280, height: 280, borderRadius: 140, backgroundColor: '#005C25', opacity: 0.42 },
  purple: { position: 'absolute', top: -100, left: '25%', width: 300, height: 300, borderRadius: 150, backgroundColor: '#4A007A', opacity: 0.45 },
});
