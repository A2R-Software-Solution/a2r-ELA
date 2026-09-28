import { styles } from './ScreenBackground.styles';
import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export default function ScreenBackground() {
  return (
    <View pointerEvents="none" accessible={false} style={styles.base}>
      <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 400 850">
        <Defs>
          <RadialGradient id="glassTop" cx="15%" cy="10%" rx="85%" ry="60%">
            <Stop offset="0" stopColor="#387887" stopOpacity="0.48" />
            <Stop offset="1" stopColor="#387887" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="glassBottom" cx="100%" cy="85%" rx="95%" ry="65%">
            <Stop offset="0" stopColor="#426C65" stopOpacity="0.38" />
            <Stop offset="1" stopColor="#426C65" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="400" height="850" fill="url(#glassTop)" />
        <Rect width="400" height="850" fill="url(#glassBottom)" />
      </Svg>
    </View>
  );
}
