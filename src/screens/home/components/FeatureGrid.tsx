/**
 * Feature Grid Component
 * 5 quick access items in a single row
 * Each: colored icon bubble + label
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FeatureUiModel } from '../../../models/ui/FeatureUiModel';

interface FeatureGridProps {
  features: FeatureUiModel[];
  onFeatureClick?: (feature: FeatureUiModel) => void;
}

// Icon + background color per feature id
const FEATURE_STYLE: Record<string, { emoji: string; bg: string; iconBg: string }> = {
  essay:       { emoji: '✏️', bg: '#F5F3FF', iconBg: '#EDE9FF' },
  games:       { emoji: '🎮', bg: '#FFF7ED', iconBg: '#FFEDD5' },
  practice:    { emoji: '🎯', bg: '#F0FDF4', iconBg: '#DCFCE7' },
  progress:    { emoji: '📊', bg: '#EFF6FF', iconBg: '#DBEAFE' },
  leaderboard: { emoji: '🏆', bg: '#FFFBEB', iconBg: '#FEF3C7' },
};

const FALLBACK = { emoji: '📚', bg: '#F8FAFC', iconBg: '#E2E8F0' };

const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  onFeatureClick = () => {},
}) => {
  return (
    <View style={styles.container}>

      {/* Section Header */}
      <Text style={styles.title}>Quick Access</Text>

      {/* Items row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {features.map((feature) => {
          const style = FEATURE_STYLE[feature.id] ?? FALLBACK;
          return (
            <FeatureItem
              key={feature.id}
              feature={feature}
              emoji={style.emoji}
              iconBg={style.iconBg}
              onPress={() => onFeatureClick(feature)}
            />
          );
        })}
      </ScrollView>

    </View>
  );
};

// ── Single Item ───────────────────────────────────────────────────────────────

interface FeatureItemProps {
  feature: FeatureUiModel;
  emoji: string;
  iconBg: string;
  onPress: () => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  feature,
  emoji,
  iconBg,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.item}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {/* Icon bubble */}
    <View style={[styles.iconBubble, { backgroundColor: iconBg }]}>
      <Text style={styles.emoji}>
        {feature.iconRes || emoji}
      </Text>
    </View>

    {/* Label */}
    <Text style={styles.label} numberOfLines={1}>
      {feature.title}
    </Text>
  </TouchableOpacity>
);

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 4,
  },

  // Each item
  item: {
    alignItems: 'center',
    width: 64,
  },

  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  emoji: {
    fontSize: 26,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
});

export default FeatureGrid;