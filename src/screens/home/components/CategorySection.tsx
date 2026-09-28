import { styles } from './CategorySection.styles';
/**
 * Category Section Component
 * Displays horizontal scrollable category chips
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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

export default CategorySection;
