/**
 * ExamSectionRow Component
 * A single topic/section row in the exam prep checklist.
 * Dark-themed to match the black background.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { ExamSection, SectionStatus } from '../types/ExamPrepUiState';

interface ExamSectionRowProps {
  section: ExamSection;
}

// --------------------------------------------------------------------------
// CONSTANTS — dark theme palette
// --------------------------------------------------------------------------

const PURPLE          = '#6C4DFF';
const SUCCESS         = '#22C55E';
const SUCCESS_BG      = 'rgba(34, 197, 94, 0.12)';
const WARNING         = '#F59E0B';
const WARNING_BG      = 'rgba(245, 158, 11, 0.12)';
const GREY            = '#64748B';
const GREY_BG         = 'rgba(100, 116, 139, 0.12)';

const ROW_BG          = '#0E0B1A';   // same dark-purple-black as card (C)
const ROW_BORDER      = 'rgba(108, 77, 255, 0.18)'; // very subtle purple rim
const PROGRESS_TRACK  = 'rgba(255,255,255,0.08)';   // near-invisible track
const TEXT_PRIMARY    = '#F1F5F9';   // off-white
const TEXT_MUTED      = '#94A3B8';   // cool grey

// --------------------------------------------------------------------------
// STATUS HELPERS
// --------------------------------------------------------------------------

function getStatusConfig(status: SectionStatus): {
  icon:      string;
  iconColor: string;
  iconBg:    string;
  barColor:  string;
} {
  switch (status) {
    case 'complete':
      return { icon: '✓', iconColor: SUCCESS, iconBg: SUCCESS_BG, barColor: SUCCESS };
    case 'in_progress':
      return { icon: '●', iconColor: WARNING, iconBg: WARNING_BG, barColor: PURPLE };
    case 'not_started':
    default:
      return { icon: '○', iconColor: GREY,    iconBg: GREY_BG,    barColor: GREY };
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
              { width: `${progressPercent}%`, backgroundColor: barColor },
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
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  ROW_BG,
    marginHorizontal: 16,
    marginVertical:   5,
    borderRadius:     14,
    padding:          14,
    borderWidth:      1,
    borderColor:      ROW_BORDER,
    shadowColor:      '#6C4DFF',
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.10,
    shadowRadius:     8,
    elevation:        3,
  },

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
    flex:        1,
    fontSize:    14,
    fontWeight:  '600',
    color:       TEXT_PRIMARY,
    marginRight: 8,
  },
  count: {
    fontSize:   13,
    fontWeight: '600',
    color:      TEXT_MUTED,
  },

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