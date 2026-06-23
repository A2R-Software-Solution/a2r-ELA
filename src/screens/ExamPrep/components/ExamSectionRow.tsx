/**
 * ExamSectionRow Component
 * A single topic/section row in the exam prep checklist.
 * Shows title, completed/total count, progress bar, and status icon.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { ExamSection, SectionStatus } from '../types/ExamPrepUiState';

// --------------------------------------------------------------------------
// PROPS
// --------------------------------------------------------------------------

interface ExamSectionRowProps {
  section: ExamSection;
}

// --------------------------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------------------------

const PURPLE         = '#6C4DFF';
const SUCCESS        = '#22C55E';
const SUCCESS_LIGHT  = '#F0FDF4';
const WARNING        = '#F59E0B';
const WARNING_LIGHT  = '#FFFBEB';
const GREY           = '#94A3B8';
const GREY_LIGHT     = '#F8FAFC';
const TEXT_PRIMARY   = '#0F172A';
const TEXT_MUTED     = '#475569';
const PROGRESS_TRACK = '#E5E7EB';
const BG_WHITE       = '#FFFFFF';
const BORDER         = '#E2E8F0';

// --------------------------------------------------------------------------
// STATUS HELPERS
// --------------------------------------------------------------------------

function getStatusConfig(status: SectionStatus): {
  icon:       string;
  iconColor:  string;
  iconBg:     string;
  barColor:   string;
} {
  switch (status) {
    case 'complete':
      return {
        icon:      '✓',
        iconColor: SUCCESS,
        iconBg:    SUCCESS_LIGHT,
        barColor:  SUCCESS,
      };
    case 'in_progress':
      return {
        icon:      '●',
        iconColor: WARNING,
        iconBg:    WARNING_LIGHT,
        barColor:  PURPLE,
      };
    case 'not_started':
    default:
      return {
        icon:      '○',
        iconColor: GREY,
        iconBg:    GREY_LIGHT,
        barColor:  GREY,
      };
  }
}

// --------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------

const ExamSectionRow: React.FC<ExamSectionRowProps> = ({ section }) => {
  const { icon, iconColor, iconBg, barColor } = getStatusConfig(section.status);
  const progressPercent = section.total > 0
    ? (section.completed / section.total) * 100
    : 0;

  return (
    <View style={styles.row}>

      {/* Status icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
      </View>

      {/* Middle — title + progress bar */}
      <View style={styles.middleContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {section.title}
          </Text>
          <Text style={styles.count}>
            {section.completed} / {section.total}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width:           `${progressPercent}%`,
                backgroundColor: barColor,
              },
            ]}
          />
        </View>
      </View>

    </View>
  );
};

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  row: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   BG_WHITE,
    marginHorizontal:  16,
    marginVertical:    5,
    borderRadius:      12,
    padding:           14,
    borderWidth:       1,
    borderColor:       BORDER,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 1 },
    shadowOpacity:     0.04,
    shadowRadius:      4,
    elevation:         1,
  },

  // Status icon
  iconContainer: {
    width:          40,
    height:         40,
    borderRadius:   12,
    justifyContent: 'center',
    alignItems:     'center',
    marginRight:    14,
  },
  icon: {
    fontSize:   18,
    fontWeight: '700',
    lineHeight: 22,
  },

  // Middle content
  middleContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   8,
  },
  title: {
    flex:       1,
    fontSize:   14,
    fontWeight: '600',
    color:      TEXT_PRIMARY,
    marginRight: 8,
  },
  count: {
    fontSize:   13,
    fontWeight: '600',
    color:      TEXT_MUTED,
  },

  // Progress bar
  progressTrack: {
    height:          6,
    backgroundColor: PROGRESS_TRACK,
    borderRadius:    999,
    overflow:        'hidden',
  },
  progressFill: {
    height:       6,
    borderRadius: 999,
  },
});

export default ExamSectionRow;