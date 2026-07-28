/**
 * Bottom Navigation Bar Component
 * 5 tabs: Home, Exam Prep, Games, Profile
 * ✅ FIXED: Dark theme colors, proper positioning, no overlap
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
    backgroundColor: '#12102A',           // ← FIX: Dark background matching theme
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)', // ← Subtle dark border
    paddingTop: 12,                       // ← Increased padding
    paddingHorizontal: 4,
    paddingRight: 4,
    paddingLeft: 4,
    elevation: 8,                         // Android shadow
    shadowColor: '#000000',               // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent', // ← Transparent when inactive
  },
  iconWrapActive: {
    backgroundColor: '#6D28D9',           // ← FIX: Dark purple pill
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8B7BA8',                     // ← FIX: Muted light color for inactive
    marginTop: 2,
  },
  labelSelected: {
    color: '#C4B5FD',                     // ← FIX: Bright purple for active
    fontWeight: '700',
  },
});

export default BottomNavigationBar;