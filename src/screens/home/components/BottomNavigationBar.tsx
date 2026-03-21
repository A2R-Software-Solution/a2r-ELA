/**
 * Bottom Navigation Bar Component
 * Tab navigation for Home, Playground, Inbox, Profile
 *
 * ✅ FIXED: Added safe area insets to prevent clash with iPhone home indicator
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  // ✅ FIX: Get safe area insets — on iPhone this gives us the home indicator height
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        // ✅ FIX: Add bottom padding equal to home indicator height (usually 34px on iPhone)
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      {TABS.map(tab => {
        const isSelected = tab.key === selectedTab;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabSelected(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
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
    // ✅ FIX: Removed fixed height — let content + insets determine height naturally
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
    marginBottom: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999999',
  },
  labelSelected: {
    color: '#7D55FF',
  },
});

export default BottomNavigationBar;
