/**
 * Course UI Model
 * Used for displaying courses in the home screen
 */

export interface CourseUiModel {
  id: string;
  title: string;
  category: string;
  duration: string;
  progress: number; // 0-100
}

/**
 * Helper to create a course
 */
export const createCourse = (
  id: string,
  title: string,
  category: string,
  duration: string,
  progress: number = 0
): CourseUiModel => ({
  id,
  title,
  category,
  duration,
  progress: Math.max(0, Math.min(100, progress)), // Clamp between 0-100
});

/**
 * Helper to update course progress
 */
export const updateCourseProgress = (
  course: CourseUiModel,
  progress: number
): CourseUiModel => ({
  ...course,
  progress: Math.max(0, Math.min(100, progress)),
});

/**
 * Check if course is completed
 */
export const isCourseCompleted = (course: CourseUiModel): boolean => {
  return course.progress >= 100;
};

/**
 * Get progress percentage as string
 */
export const getProgressPercentage = (course: CourseUiModel): string => {
  return `${course.progress}%`;
};