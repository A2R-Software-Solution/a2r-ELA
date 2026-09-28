import { styles } from './ExamProgressCard.styles';
/**
 * ExamProgressCard Component
 * Card showing the exam title and circular progress ring.
 * Animations: smooth breathing glow border + slow bg colour shift
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import ProgressRing from './ProgressRing';

interface ExamProgressCardProps {
  examTitle:      string;
  overallPercent: number;
}

// Three matte dark bg shades that cycle (A + B + C)
const BG_A = '#0D0D0D';
const BG_B = '#111018';
const BG_C = '#0E0B1A';

const ExamProgressCard: React.FC<ExamProgressCardProps> = ({
  examTitle,
  overallPercent,
}) => {

  // (F) Breathing glow — smooth sine wave on shadow opacity
  const glowAnim = useRef(new Animated.Value(0)).current;

  // (E) Slow bg colour shift between dark shades
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth breathing — 2.4s in, 2.4s out, no jumps
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue:         1,
          duration:        2400,
          easing:          Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue:         0,
          duration:        2400,
          easing:          Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Slow bg shift — 3.5s per step
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue:         1,
          duration:        3500,
          easing:          Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue:         2,
          duration:        3500,
          easing:          Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue:         0,
          duration:        3500,
          easing:          Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [bgAnim, glowAnim]);

  // Border colour fades from dim purple → vivid purple
  const animatedBorderColor = glowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(108, 77, 255, 0.25)', 'rgba(108, 77, 255, 1)'],
  });

  // Shadow radius grows with the glow
  const animatedShadowRadius = glowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [6, 22],
  });

  // Shadow opacity breathes
  const animatedShadowOpacity = glowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0.2, 0.75],
  });

  // Bg colour cycles across three dark shades
  const animatedBg = bgAnim.interpolate({
    inputRange:  [0, 1, 2],
    outputRange: [BG_A, BG_B, BG_C],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor:  animatedBg,
          borderColor:      animatedBorderColor,
          shadowRadius:     animatedShadowRadius,
          shadowOpacity:    animatedShadowOpacity,
        },
      ]}
    >
      {/* Subtle top highlight line */}
      <View style={styles.topHighlight} pointerEvents="none" />

      {/* Left — badge + title + percent */}
      <View style={styles.leftContent}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Exam Prep</Text>
        </View>

        <Text style={styles.examTitle} numberOfLines={3}>
          {examTitle}
        </Text>

        <Text style={styles.percentLabel}>
          {overallPercent}% Complete
        </Text>
      </View>

      {/* Right — progress ring */}
      <View style={styles.ringContainer}>
        <ProgressRing
          percent={overallPercent}
          size={110}
          thickness={10}
        />
      </View>
    </Animated.View>
  );
};

export default ExamProgressCard;
