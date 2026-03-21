/**
 * Feature UI Model
 * Used for displaying feature cards/tiles in the home screen
 */

export interface FeatureUiModel {
  id: string;
  title: string;
  subtitle?: string | null;
  iconRes?: string | null; // Emoji or icon name
  colorRes?: string | null; // Hex color code for background
}

/**
 * Helper to create a feature
 */
export const createFeature = (
  id: string,
  title: string,
  subtitle?: string,
  iconRes?: string,
  colorRes?: string
): FeatureUiModel => ({
  id,
  title,
  subtitle: subtitle || null,
  iconRes: iconRes || null,
  colorRes: colorRes || null,
});

/**
 * Default features for the app
 */
export const DEFAULT_FEATURES: FeatureUiModel[] = [
  {
    id: 'essay',
    title: 'Essay Writing',
    subtitle: 'Practice and improve',
    iconRes: '📝',
    colorRes: '#4CAF50',
  },
  {
    id: 'ela',
    title: 'ELA',
    subtitle: 'English Language Arts',
    iconRes: '📚',
    colorRes: '#2196F3',
  },
  {
    id: 'math',
    title: 'Math',
    subtitle: 'Solve problems',
    iconRes: '🔢',
    colorRes: '#FF9800',
  },
  {
    id: 'science',
    title: 'Science',
    subtitle: 'Explore concepts',
    iconRes: '🔬',
    colorRes: '#9C27B0',
  },
];