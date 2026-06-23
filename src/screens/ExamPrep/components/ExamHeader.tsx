/**
 * ExamHeader Component
 * Top bar for the Exam Prep screen.
 * Contains back button, title, and tab switcher (PSSA ELA | Placeholder Exam!).
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
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

const PURPLE      = '#6C4DFF';
const PURPLE_LIGHT = '#EDE9FF';
const TEXT_PRIMARY = '#0F172A';
const TEXT_MUTED   = '#475569';
const BG_WHITE     = '#FFFFFF';
const BORDER       = '#E2E8F0';

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

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor:   BG_WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom:     0,
  },

  // Top row
  topRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  backButton: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: PURPLE_LIGHT,
    justifyContent:  'center',
    alignItems:      'center',
  },
  backIcon: {
    fontSize:   18,
    color:      PURPLE,
    fontWeight: '700',
  },
  title: {
    flex:       1,
    textAlign:  'center',
    fontSize:   18,
    fontWeight: '700',
    color:      TEXT_PRIMARY,
  },
  spacer: {
    width: 36, // mirrors back button width to keep title centered
  },

  // Tab row
  tabRow: {
    flexDirection:     'row',
    paddingHorizontal: 16,
    paddingBottom:     0,
    gap:               8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical:   10,
    borderRadius:      0,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginBottom:      0,
  },
  tabActive: {
    borderBottomColor: PURPLE,
  },
  tabText: {
    fontSize:   14,
    fontWeight: '500',
    color:      TEXT_MUTED,
  },
  tabTextActive: {
    color:      PURPLE,
    fontWeight: '700',
  },
});

export default ExamHeader;