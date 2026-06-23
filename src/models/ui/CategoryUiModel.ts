/**
 * Category UI Model
 * Used for displaying category selections in the UI
 */

export interface CategoryUiModel {
  id: string;
  title: string;
  isSelected: boolean;
}

/**
 * Helper to create a default category
 */
export const createCategory = (
  id: string,
  title: string,
  isSelected: boolean = false
): CategoryUiModel => ({
  id,
  title,
  isSelected,
});

/**
 * Helper to toggle category selection
 */
export const toggleCategorySelection = (
  category: CategoryUiModel
): CategoryUiModel => ({
  ...category,
  isSelected: !category.isSelected,
});

/**
 * Helper to update categories with single selection
 */
export const selectCategory = (
  categories: CategoryUiModel[],
  selectedId: string
): CategoryUiModel[] => {
  return categories.map(category => ({
    ...category,
    isSelected: category.id === selectedId,
  }));
};