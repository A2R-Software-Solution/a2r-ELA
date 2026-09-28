import { styles } from './ProgressRing.styles';
/**
 * ProgressRing Component
 * Circular progress ring showing overall exam completion percentage.
 * Built with react-native-svg for smooth rendering.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
// --------------------------------------------------------------------------
// PROPS
// --------------------------------------------------------------------------

interface ProgressRingProps {
  percent:   number; // 0–100
  size?:     number; // Outer diameter in px (default 120)
  thickness?: number; // Stroke width (default 10)
}

// --------------------------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------------------------

const PURPLE       = '#6C4DFF';
const TRACK_COLOR  = '#E5E7EB';

// --------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------

const ProgressRing: React.FC<ProgressRingProps> = ({
  percent,
  size      = 120,
  thickness = 10,
}) => {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  // SVG circle math
  const radius          = (size - thickness) / 2;
  const circumference   = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;
  const center          = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Track circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={TRACK_COLOR}
          strokeWidth={thickness}
          fill="none"
        />

        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={PURPLE}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          // Start from top (12 o'clock)
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {/* Center text overlay */}
      <View style={[styles.labelContainer, { width: size, height: size }]}>
        <Text style={styles.percentText}>{clampedPercent}%</Text>
        <Text style={styles.completeText}>Complete</Text>
      </View>
    </View>
  );
};

export default ProgressRing;
