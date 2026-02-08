/**
 * useHome Hook
 * Home screen logic (ViewModel equivalent)
 */

import { useState, useEffect, useCallback } from 'react';
import { HomeUiState, initialHomeUiState, HomeTab } from '../types/HomeUiState';
import { CategoryUiModel } from '../../../models/ui/CategoryUiModel';
import { FeatureUiModel } from '../../../models/ui/FeatureUiModel';
import { CourseUiModel } from '../../../models/ui/CourseUiModel';
import { StreakUiModel } from '../../../models/ui/StreakUiModel';

export const useHome = () => {
  const [uiState, setUiState] = useState<HomeUiState>(initialHomeUiState);

  // Load home data on mount
  useEffect(() => {
    loadHomeData();
  }, []);

  const onTabSelected = useCallback((tab: HomeTab) => {
    setUiState((prev) => ({
      ...prev,
      selectedTab: tab,
    }));
  }, []);

  const onCategorySelected = useCallback((category: CategoryUiModel) => {
    setUiState((prev) => {
      const updatedCategories = prev.categories.map((cat) => ({
        ...cat,
        isSelected: cat.id === category.id,
      }));
      
      return {
        ...prev,
        categories: updatedCategories,
      };
    });
  }, []);

  const loadHomeData = useCallback(() => {
    // In a real app, this would come from repository/API
    const categories: CategoryUiModel[] = [
      { id: '1', title: 'All', isSelected: true },
      { id: '2', title: 'Essay Writing', isSelected: false },
      { id: '3', title: 'ELA', isSelected: false },
      { id: '4', title: 'Math', isSelected: false },
      { id: '5', title: 'Science', isSelected: false },
    ];

    const features: FeatureUiModel[] = [
      { id: '1', title: 'Rank', subtitle: 'Top 10%', iconRes: '🏆', colorRes: null },
      { id: '2', title: 'Essay Writing', subtitle: 'Advanced', iconRes: '📝', colorRes: null },
      { id: '3', title: 'ELA', subtitle: 'Intermediate', iconRes: '📚', colorRes: null },
      { id: '4', title: 'Notes', subtitle: 'Review', iconRes: '📓', colorRes: null },
      { id: '5', title: 'Quiz', subtitle: 'Practice', iconRes: '❓', colorRes: null },
      { id: '6', title: 'Courses', subtitle: 'Enrolled', iconRes: '🎓', colorRes: null },
    ];

    const recentCourses: CourseUiModel[] = [
      { id: '1', title: 'Advanced Essay Writing', category: 'Writing', duration: '2h 30m', progress: 75 },
      { id: '2', title: 'ELA Comprehension', category: 'Reading', duration: '3h 15m', progress: 60 },
      { id: '3', title: 'Grammar Mastery', category: 'Language', duration: '4h 45m', progress: 40 },
    ];

    const streak: StreakUiModel = {
      currentStreak: 90,
      totalDays: 365,
      progressPercentage: 90 / 365,
    };

    setUiState((prev) => ({
      ...prev,
      categories,
      features,
      recentCourses,
      streak,
    }));
  }, []);

  return {
    uiState,
    onTabSelected,
    onCategorySelected,
  };
};