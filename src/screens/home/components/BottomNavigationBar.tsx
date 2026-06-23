/**
 * Bottom Navigation Bar Component
 * 5 tabs: Home, Exam Prep, Practice, Games, Profile
 * Active tab: purple pill background + colored icon + purple label
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
  activeIcon: string;
}

const TABS: TabItem[] = [
  { key: HomeTab.HOME,       label: 'Home',      icon: '🏠', activeIcon: '🏠' },
  { key: HomeTab.EXAM_PREP,  label: 'Exam Prep', icon: '📖', activeIcon: '📖' },
  { key: HomeTab.PLAYGROUND, label: 'Games',     icon: '🎮', activeIcon: '🎮' },
  { key: HomeTab.PROFILE,    label: 'Profile',   icon: '👤', activeIcon: '👤' },
];

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  selectedTab,
  onTabSelected,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map(tab => {
        const isSelected = tab.key === selectedTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabSelected(tab.key)}
            activeOpacity={0.7}
          >
            {/* Icon pill — highlighted when active */}
            <View style={[styles.iconWrap, isSelected && styles.iconWrapActive]}>
              <Text style={styles.icon}>
                {isSelected ? tab.activeIcon : tab.icon}
              </Text>
            </View>

            {/* Label */}
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
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 40,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  iconWrapActive: {
    backgroundColor: '#EDE9FF',  // light purple pill
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
  },
  labelSelected: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
});

export default BottomNavigationBar;