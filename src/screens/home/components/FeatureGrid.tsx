import { styles } from './FeatureGrid.styles';
/**
 * Feature Grid Component — REDESIGNED
 * Dark glowing icon bubbles, gradient backgrounds per feature
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FeatureUiModel } from '../../../models/ui/FeatureUiModel';

interface FeatureGridProps {
  features: FeatureUiModel[];
  onFeatureClick?: (feature: FeatureUiModel) => void;
}

// Gradient colors + glow per feature
const FEATURE_STYLE: Record<string, {
  emoji:   string;
  colors:  [string, string];
  glow:    string;
}> = {
  essay:       { emoji: '✏️', colors: ['#65A6B3', '#8FC4CC'], glow: '#65A6B3' },
  games:       { emoji: '🎮', colors: ['#EA580C', '#F97316'], glow: '#F97316' },
  practice:    { emoji: '🎯', colors: ['#15803D', '#22C55E'], glow: '#22C55E' },
  progress:    { emoji: '📊', colors: ['#1D4ED8', '#3B82F6'], glow: '#3B82F6' },
  leaderboard: { emoji: '🏆', colors: ['#B45309', '#F59E0B'], glow: '#F59E0B' },
};

const FALLBACK = { emoji: '📚', colors: ['#374151', '#6B7280'] as [string, string], glow: '#6B7280' };

const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  onFeatureClick = () => {},
}) => (
  <View style={styles.container}>
    <View style={styles.sectionRow}>
      <View style={styles.sectionDot} />
      <Text style={styles.title}>Quick Access</Text>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {features.map((feature) => {
        const s = FEATURE_STYLE[feature.id] ?? FALLBACK;
        return (
          <FeatureItem
            key={feature.id}
            feature={feature}
            emoji={s.emoji}
            gradientColors={s.colors}
            glowColor={s.glow}
            onPress={() => onFeatureClick(feature)}
          />
        );
      })}
    </ScrollView>
  </View>
);

// ── Single Item ───────────────────────────────────────────────────

interface FeatureItemProps {
  feature:        FeatureUiModel;
  emoji:          string;
  gradientColors: [string, string];
  glowColor:      string;
  onPress:        () => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  feature,
  emoji,
  gradientColors,
  glowColor,
  onPress,
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
    {/* Glow wrap */}
    <View style={[styles.glowWrap, { shadowColor: glowColor }]}>
      <LinearGradient
        colors={gradientColors.map(color => `${color}30`)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconBubble}
      >
        <Text style={styles.emoji}>{feature.iconRes || emoji}</Text>
      </LinearGradient>
    </View>
    <Text style={styles.label} numberOfLines={1}>{feature.title}</Text>
  </TouchableOpacity>
);

export default FeatureGrid;
