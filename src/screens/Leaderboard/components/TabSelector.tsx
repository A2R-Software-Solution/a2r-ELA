import { styles } from './TabSelector.styles';
/**
 * TabSelector Component
 * Grade / State toggle tab for the Leaderboard screen.
 * Matches the app's purple color system.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LeaderboardTab } from '../../../models/LeaderboardModels';

// --------------------------------------------------------------------------
// PROPS
// --------------------------------------------------------------------------

interface TabSelectorProps {
  activeTab:    LeaderboardTab;
  onTabChange:  (tab: LeaderboardTab) => void;
  gradeLabel:   string; // e.g. "Grade 6"
  stateLabel:   string; // e.g. "Pennsylvania"
}

// --------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------

const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onTabChange,
  gradeLabel,
  stateLabel,
}) => {
  return (
    <View style={styles.container}>
      {/* Grade Tab */}
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'grade' && styles.activeTab,
        ]}
        onPress={() => onTabChange('grade')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'grade' && styles.activeTabText,
          ]}
        >
          {gradeLabel}
        </Text>
        {activeTab === 'grade' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      {/* State Tab */}
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'state' && styles.activeTab,
        ]}
        onPress={() => onTabChange('state')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'state' && styles.activeTabText,
          ]}
        >
          {stateLabel}
        </Text>
        {activeTab === 'state' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

export default TabSelector;
