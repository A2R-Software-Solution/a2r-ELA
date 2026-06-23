/**
 * ExamProgressCard Component
 * Card showing the exam title and circular progress ring.
 * Sits at the top of the exam prep content area.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import ProgressRing from './ProgressRing';

// --------------------------------------------------------------------------
// PROPS
// --------------------------------------------------------------------------

interface ExamProgressCardProps {
  examTitle:      string; // e.g. "PSSA ELA Writing Exam Prep"
  overallPercent: number; // 0–100
}

// --------------------------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------------------------

const PURPLE        = '#6C4DFF';
const PURPLE_LIGHT  = '#EDE9FF';
const TEXT_PRIMARY  = '#0F172A';
const TEXT_MUTED    = '#475569';
const BG_WHITE      = '#FFFFFF';
const BORDER        = '#E2E8F0';

// --------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------

const ExamProgressCard: React.FC<ExamProgressCardProps> = ({
  examTitle,
  overallPercent,
}) => {
  return (
    <View style={styles.card}>

      {/* Left — title + label */}
      <View style={styles.leftContent}>

        {/* Exam type badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Exam Prep</Text>
        </View>

        {/* Exam title */}
        <Text style={styles.examTitle} numberOfLines={3}>
          {examTitle}
        </Text>

        {/* Percent label below title */}
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

    </View>
  );
};

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   BG_WHITE,
    marginHorizontal:  16,
    marginTop:         16,
    marginBottom:      8,
    borderRadius:      16,
    padding:           20,
    borderWidth:       1,
    borderColor:       BORDER,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.06,
    shadowRadius:      8,
    elevation:         2,
  },

  // Left side
  leftContent: {
    flex:        1,
    paddingRight: 16,
  },
  badge: {
    alignSelf:         'flex-start',
    backgroundColor:   PURPLE_LIGHT,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      999,
    marginBottom:      10,
  },
  badgeText: {
    fontSize:   11,
    fontWeight: '600',
    color:      PURPLE,
  },
  examTitle: {
    fontSize:     16,
    fontWeight:   '700',
    color:        TEXT_PRIMARY,
    lineHeight:   22,
    marginBottom: 8,
  },
  percentLabel: {
    fontSize:   13,
    fontWeight: '600',
    color:      TEXT_MUTED,
  },

  // Right side
  ringContainer: {
    alignItems:     'center',
    justifyContent: 'center',
  },
});

export default ExamProgressCard;