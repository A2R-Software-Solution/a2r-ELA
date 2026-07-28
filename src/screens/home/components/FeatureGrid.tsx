/**
 * Feature Grid Component — REDESIGNED
 * Dark glowing icon bubbles, gradient backgrounds per feature
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
  essay:       { emoji: '✏️', colors: ['#5B3FE8', '#7C5CFC'], glow: '#7C5CFC' },
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
        colors={gradientColors}
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

// ── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop:         20,
    marginBottom:      8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  16,
    gap:           8,
  },
  sectionDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: '#7C5CFC',
  },
  title: {
    fontSize:      18,
    fontWeight:    '700',
    color:         '#EDE9FF',
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: 'row',
    gap:           16,
    paddingBottom: 6,
    paddingRight:  4,
  },
  item: {
    alignItems: 'center',
    width:      66,
  },
  glowWrap: {
    borderRadius:  18,
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.50,
    shadowRadius:  10,
    elevation:     8,
    marginBottom:  9,
  },
  iconBubble: {
    width:          58,
    height:         58,
    borderRadius:   18,
    justifyContent: 'center',
    alignItems:     'center',
    borderWidth:    1,
    borderColor:    'rgba(255,255,255,0.15)',
  },
  emoji: {
    fontSize: 26,
  },
  label: {
    fontSize:      11,
    fontWeight:    '600',
    color:         'rgba(255,255,255,0.65)',
    textAlign:     'center',
    letterSpacing: 0.1,
  },
});

export default FeatureGrid;