import { styles } from './BottomNavigationBar.styles';
/**
 * Bottom Navigation Bar Component
 * 5 tabs: Home, Exam Prep, Games, Profile
 * ✅ FIXED: Dark theme colors, proper positioning, no overlap
 * Active tab: translucent highlight with a bright label
 */

import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <View style={[styles.container, { paddingBottom: 8, marginBottom: Math.max(insets.bottom, 12) }]}>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
        style={styles.sheen}
      />
      {TABS.map(tab => {
        const isSelected = tab.key === selectedTab;
        return (
          <TouchableOpacity
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={tab.label}
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

export default BottomNavigationBar;
