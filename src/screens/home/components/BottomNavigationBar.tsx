/**
 * Bottom Navigation Bar Component
 * Tab navigation for Home, Playground, Inbox, Profile
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeTab } from '../types/HomeUiState';

interface BottomNavigationBarProps {
  selectedTab: HomeTab;
  onTabSelected: (tab: HomeTab) => void;
}

interface TabItem {
  key: HomeTab;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { key: HomeTab.HOME, label: 'Home', icon: '🏠' },
  { key: HomeTab.PLAYGROUND, label: 'Playground', icon: '🎮' },
  { key: HomeTab.INBOX, label: 'Inbox', icon: '📧' },
  { key: HomeTab.PROFILE, label: 'Profile', icon: '👤' },
];

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  selectedTab,
  onTabSelected,
}) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isSelected = tab.key === selectedTab;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabSelected(tab.key)}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text
              style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
  },
  labelSelected: {
    color: '#7D55FF',
  },
});

export default BottomNavigationBar;