import { styles } from './ExamSectionRow.styles';
/**
 * ExamSectionRow Component
 * A single topic/section row in the exam prep checklist.
 * Dark-themed to match the black background.
 */

import React from 'react';
import { View, Text } from 'react-native';
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

   // same dark-purple-black as card (C)
 // very subtle purple rim
   // near-invisible track
   // off-white
   // cool grey

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

export default ExamSectionRow;
