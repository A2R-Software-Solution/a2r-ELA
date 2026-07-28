/**
 * ExamProgressCard Component
 * Card showing the exam title and circular progress ring.
 * Animations: smooth breathing glow border + slow bg colour shift
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import ProgressRing from './ProgressRing';

interface ExamProgressCardProps {
  examTitle:      string;
  overallPercent: number;
}

const PURPLE_BORDER   = '#6C4DFF';
const PURPLE_BRIGHT   = '#A78BFA';
const PURPLE_BADGE_BG = 'rgba(108, 77, 255, 0.18)';
const TEXT_PRIMARY    = '#FFFFFF';
const TEXT_MUTED      = '#C4B5FD';

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
  }, []);

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

const styles = StyleSheet.create({
  card: {
    flexDirection:    'row',
    alignItems:       'center',
    marginHorizontal: 16,
    marginTop:        16,
    marginBottom:     8,
    borderRadius:     20,
    padding:          20,
    borderWidth:      1.5,
    overflow:         'hidden',
    shadowColor:      PURPLE_BORDER,
    shadowOffset:     { width: 0, height: 0 },
  },
  topHighlight: {
    position:        'absolute',
    top:             0,
    left:            24,
    right:           24,
    height:          1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius:    999,
  },
  leftContent: {
    flex:         1,
    paddingRight: 16,
  },
  badge: {
    alignSelf:         'flex-start',
    backgroundColor:   PURPLE_BADGE_BG,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      999,
    marginBottom:      10,
    borderWidth:       1,
    borderColor:       'rgba(167,139,250,0.30)',
  },
  badgeText: {
    fontSize:      11,
    fontWeight:    '600',
    color:         PURPLE_BRIGHT,
    letterSpacing: 0.4,
  },
  examTitle: {
    fontSize:     16,
    fontWeight:   '700',
    color:        TEXT_PRIMARY,
    lineHeight:   22,
    marginBottom: 8,
  },
  percentLabel: {
    fontSize:      13,
    fontWeight:    '600',
    color:         TEXT_MUTED,
    letterSpacing: 0.2,
  },
  ringContainer: {
    alignItems:     'center',
    justifyContent: 'center',
  },
});

export default ExamProgressCard;