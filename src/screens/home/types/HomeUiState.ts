/**
 * Home UI State
 * State interface for Home screen
 */

import { StreakUiModel } from '../../../models/ui/StreakUiModel';
import { CategoryUiModel } from '../../../models/ui/CategoryUiModel';
import { FeatureUiModel } from '../../../models/ui/FeatureUiModel';
import { CourseUiModel } from '../../../models/ui/CourseUiModel';

export enum HomeTab {
  HOME = 'HOME',
  PLAYGROUND = 'PLAYGROUND',
  INBOX = 'INBOX',
  PROFILE = 'PROFILE',
}

export interface HomeUiState {
  selectedTab: HomeTab;
  username: string;
  streak: StreakUiModel;
  categories: CategoryUiModel[];
  features: FeatureUiModel[];
  recentCourses: CourseUiModel[];
  isLoading: boolean;
}

export const initialHomeUiState: HomeUiState = {
  selectedTab: HomeTab.HOME,
  username: 'XYZ',
  streak: {
    currentStreak: 90,
    totalDays: 365,
    progressPercentage: 90 / 365,
  },
  categories: [],
  features: [],
  recentCourses: [],
  isLoading: false,
};