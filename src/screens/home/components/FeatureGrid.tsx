/**
 * Feature Grid Component
 * Displays grid of quick access features
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FeatureUiModel } from '../../../models/ui/FeatureUiModel';

interface FeatureGridProps {
  features: FeatureUiModel[];
  onFeatureClick?: (feature: FeatureUiModel) => void;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  onFeatureClick = () => {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Access</Text>

      <View style={styles.grid}>
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            onPress={() => onFeatureClick(feature)}
          />
        ))}
      </View>
    </View>
  );
};

interface FeatureCardProps {
  feature: FeatureUiModel;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.icon}>{feature.iconRes || '📚'}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {feature.title}
        </Text>
        {feature.subtitle && (
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {feature.subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '31%', // 3 columns with gap
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default FeatureGrid;