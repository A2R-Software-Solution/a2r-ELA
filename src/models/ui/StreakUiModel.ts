/**
 * Streak UI Model
 * Used for displaying user's learning streak
 */

export interface StreakUiModel {
  currentStreak: number;
  totalDays: number;
  progressPercentage: number; // 0-1 (e.g., 0.25 for 25%)
}

/**
 * Helper to create a streak model
 */
export const createStreak = (
  currentStreak: number = 90,
  totalDays: number = 365
): StreakUiModel => ({
  currentStreak,
  totalDays,
  progressPercentage: totalDays > 0 ? currentStreak / totalDays : 0,
});

/**
 * Calculate remaining days
 */
export const getRemainingDays = (streak: StreakUiModel): number => {
  return Math.max(0, streak.totalDays - streak.currentStreak);
};

/**
 * Get progress percentage as a formatted string
 */
export const getProgressPercentageString = (streak: StreakUiModel): string => {
  return `${Math.round(streak.progressPercentage * 100)}%`;
};

/**
 * Check if streak goal is achieved
 */
export const isGoalAchieved = (streak: StreakUiModel): boolean => {
  return streak.currentStreak >= streak.totalDays;
};

/**
 * Get motivational message based on streak
 */
export const getMotivationalMessage = (streak: StreakUiModel): string => {
  const percentage = streak.progressPercentage * 100;
  
  if (percentage >= 100) {
    return '🎉 Goal achieved! Amazing work!';
  } else if (percentage >= 75) {
    return '🔥 You\'re almost there! Keep it up!';
  } else if (percentage >= 50) {
    return '💪 Halfway there! Great progress!';
  } else if (percentage >= 25) {
    return '✨ Good start! Keep going!';
  } else {
    return '🚀 Start your journey today!';
  }
};

/**
 * Format streak display text
 */
export const formatStreakDisplay = (streak: StreakUiModel): string => {
  return `${streak.currentStreak} / ${streak.totalDays} days`;
};