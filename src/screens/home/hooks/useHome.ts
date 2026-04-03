/**
 * useHome Hook
 * Home screen logic (ViewModel equivalent)
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { HomeUiState, initialHomeUiState, HomeTab } from '../types/HomeUiState';
import { CategoryUiModel } from '../../../models/ui/CategoryUiModel';
import { FeatureUiModel } from '../../../models/ui/FeatureUiModel';
import { CourseUiModel } from '../../../models/ui/CourseUiModel';
import { StreakUiModel } from '../../../models/ui/StreakUiModel';
import { useAuth } from '../../../hooks/useAuth';
import auth from '@react-native-firebase/auth';
import { profileEvents } from '../../../utils/profileEvents';
import { apiService } from '../../../api/apiService';

export const useHome = () => {
  const { user } = useAuth();
  const [uiState, setUiState] = useState<HomeUiState>(initialHomeUiState);

  // ✅ Sync username
  useEffect(() => {
    const syncName = () => {
      const currentUser = auth().currentUser;
      const freshName =
        currentUser?.displayName ??
        currentUser?.email?.split('@')[0] ??
        'Student';

      setUiState(prev => ({ ...prev, username: freshName }));
    };

    syncName();

    profileEvents.on('nameChanged', syncName);
    return () => profileEvents.off('nameChanged', syncName);
  }, [user?.uid]);

  // ✅ Load data on mount
  useEffect(() => {
    loadHomeData();
    loadGamification();
  }, []);

  // ✅ Gamification API
  const loadGamification = useCallback(async () => {
    try {
      setUiState(prev => ({ ...prev, isLoadingXp: true }));

      const response = await apiService.getGamification();
      const data = response.data.data;

      if (data) {
        setUiState(prev => ({
          ...prev,
          xp: data.xp,
          level: data.level,
          levelName: data.level_name,
          isLoadingXp: false,
        }));
      }
    } catch (error) {
      console.error('Failed to load gamification data:', error);
      setUiState(prev => ({ ...prev, isLoadingXp: false }));
    }
  }, []);

  // ✅ Handle feature click (MAIN FIX 🔥)
  const onFeaturePress = useCallback((featureId: string, navigation: any) => {
    switch (featureId) {
      case 'rank':
        navigation.navigate('Leaderboard');
        break;

      case 'essay':
        navigation.navigate('EssayWriting');
        break;

      case 'ela':
      case 'notes':
      case 'quiz':
      case 'courses':
        Alert.alert('Coming Soon 🚀', 'This feature will be available soon!');
        break;

      default:
        Alert.alert('Coming Soon 🚀', 'This feature is under development!');
    }
  }, []);

  // ✅ Tabs
  const onTabSelected = useCallback((tab: HomeTab) => {
    setUiState(prev => ({
      ...prev,
      selectedTab: tab,
    }));
  }, []);

  // ✅ Category selection
  const onCategorySelected = useCallback((category: CategoryUiModel) => {
    setUiState(prev => {
      const updatedCategories = prev.categories.map(cat => ({
        ...cat,
        isSelected: cat.id === category.id,
      }));

      return {
        ...prev,
        categories: updatedCategories,
      };
    });
  }, []);

  // ✅ Static Home Data
  const loadHomeData = useCallback(() => {
    const categories: CategoryUiModel[] = [
      { id: '1', title: 'All', isSelected: true },
      { id: '2', title: 'Essay Writing', isSelected: false },
      { id: '3', title: 'ELA', isSelected: false },
      { id: '4', title: 'Math', isSelected: false },
      { id: '5', title: 'Science', isSelected: false },
    ];

    const features: FeatureUiModel[] = [
      { id: 'rank', title: 'Rank', subtitle: 'Top 10%', iconRes: '🏆', colorRes: null },
      { id: 'essay', title: 'Essay Writing', subtitle: 'Advanced', iconRes: '📝', colorRes: null },
      { id: 'ela', title: 'ELA', subtitle: 'Intermediate', iconRes: '📚', colorRes: null },
      { id: 'notes', title: 'Notes', subtitle: 'Review', iconRes: '📓', colorRes: null },
      { id: 'quiz', title: 'Quiz', subtitle: 'Practice', iconRes: '❓', colorRes: null },
      { id: 'courses', title: 'Courses', subtitle: 'Enrolled', iconRes: '🎓', colorRes: null },
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

    setUiState(prev => ({
      ...prev,
      categories,
      features,
      recentCourses,
      streak,
    }));
  }, []);

  // ✅ Return everything
  return {
    uiState,
    onTabSelected,
    onCategorySelected,
    onFeaturePress, // 👈 important
  };
};