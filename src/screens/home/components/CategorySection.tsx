/**
 * Category Section Component
 * Displays horizontal scrollable category chips
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { CategoryUiModel } from '../../../models/ui/CategoryUiModel';

interface CategorySectionProps {
  categories: CategoryUiModel[];
  onCategoryClick?: (category: CategoryUiModel) => void;
  onSeeAllClick?: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onCategoryClick = () => {},
  onSeeAllClick = () => {},
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity onPress={onSeeAllClick}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.chip,
              category.isSelected && styles.chipSelected,
            ]}
            onPress={() => onCategoryClick(category)}
          >
            <Text
              style={[
                styles.chipText,
                category.isSelected && styles.chipTextSelected,
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#7D55FF',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#7D55FF',
    borderColor: '#7D55FF',
  },
  chipText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});

export default CategorySection;