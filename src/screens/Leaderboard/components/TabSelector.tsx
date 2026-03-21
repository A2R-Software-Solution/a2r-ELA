/**
 * TabSelector Component
 * Grade / State toggle tab for the Leaderboard screen.
 * Matches the app's purple color system.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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

      {/* Divider */}
      <View style={styles.divider} />

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

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const PURPLE = '#6C63FF';

const styles = StyleSheet.create({
  container: {
    flexDirection:    'row',
    backgroundColor:  '#F4F3FF',
    borderRadius:     12,
    marginHorizontal: 16,
    marginVertical:   12,
    padding:          4,
  },
  tab: {
    flex:            1,
    paddingVertical: 10,
    alignItems:      'center',
    borderRadius:    10,
    position:        'relative',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor:     '#6C63FF',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.12,
    shadowRadius:    4,
    elevation:       3,
  },
  tabText: {
    fontSize:   14,
    fontWeight: '500',
    color:      '#9E9E9E',
  },
  activeTabText: {
    color:      PURPLE,
    fontWeight: '700',
  },
  activeIndicator: {
    position:        'absolute',
    bottom:          4,
    width:           24,
    height:          3,
    borderRadius:    2,
    backgroundColor: PURPLE,
  },
  divider: {
    width:           1,
    marginVertical:  8,
    backgroundColor: '#E0E0E0',
  },
});

export default TabSelector;