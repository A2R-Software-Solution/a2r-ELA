import { styles } from './ExamHeader.styles';
/**
 * ExamHeader Component
 * Top bar for the Exam Prep screen.
 * Contains back button, title, and tab switcher (PSSA ELA | Coming Soon).
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ExamTab } from '../types/ExamPrepUiState';

// --------------------------------------------------------------------------
// PROPS
// --------------------------------------------------------------------------

interface ExamHeaderProps {
  tabs:        ExamTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onBackClick: () => void;
}

// --------------------------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------

const ExamHeader: React.FC<ExamHeaderProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onBackClick,
}) => {
  return (
    <View style={styles.wrapper}>

      {/* Top row — back button + title */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackClick}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Exam Preparation</Text>

        {/* Spacer to balance the back button */}
        <View style={styles.spacer} />
      </View>

      {/* Tab switcher */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isActive && styles.tabActive,
              ]}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

    </View>
  );
};

export default ExamHeader;
