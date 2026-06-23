/**
 * Home UI State
 * State interface for Home screen
 */

import { StreakUiModel } from '../../../models/ui/StreakUiModel';
import { CategoryUiModel } from '../../../models/ui/CategoryUiModel';
import { FeatureUiModel } from '../../../models/ui/FeatureUiModel';
import { CourseUiModel } from '../../../models/ui/CourseUiModel';
import { RecentEssayUiItem } from '../../../models/ui/ProfileUiModel';


export enum HomeTab {
  HOME = 'HOME',
  EXAM_PREP = 'EXAM_PREP',
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
  recentEssays: RecentEssayUiItem[];
  recentCourses: CourseUiModel[];
  isLoading: boolean;

  // Gamification
  xp: number;
  level: number;
  levelName: string;
  isLoadingXp: boolean;
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
  recentEssays: [],
  isLoading: false,

  //Gamification
  xp: 0,
  level: 1,
  levelName: 'Beginner Writer',
  isLoadingXp: false,
};