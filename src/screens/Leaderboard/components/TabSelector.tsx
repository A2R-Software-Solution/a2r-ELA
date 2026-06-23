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
    backgroundColor:  '#F8F8FC',
    borderRadius:     16,
    marginHorizontal: 16,
    marginTop:        16,
    marginBottom:     8,
    padding:          6,
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
    shadowColor:     PURPLE,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.15,
    shadowRadius:    8,
    elevation:       4,
  },
  tabText: {
    fontSize:   15,
    fontWeight: '500',
    color:      '#9E9E9E',
  },
  activeTabText: {
    color:      PURPLE,
    fontWeight: '800',
  },
  activeIndicator: {
    position:        'absolute',
    bottom:          4,
    width:           32,
    height:          4,
    borderRadius:    999,
    backgroundColor: PURPLE,
  },
});

export default TabSelector;