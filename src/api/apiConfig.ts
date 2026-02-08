/**
 * API Configuration
 * Contains base URL, endpoints, and timeout settings
 */

export const ApiConfig = {
  BASE_URL: 'https://us-central1-e-learning-app-9d86f.cloudfunctions.net/',

  // API Endpoints
  Endpoints: {
    SUBMIT_ESSAY: 'submit_essay',
    GET_ESSAY_SUBMISSION: 'get_essay_submission',
    GET_USER_SUBMISSIONS: 'get_user_submissions',
    GET_STREAK: 'get_streak',
    GET_PROGRESS_STATS: 'get_progress_stats',
    GET_CATEGORY_STATS: 'get_category_stats',
    HEALTH_CHECK: 'health_check',
  },

  // Request Timeouts (in milliseconds for React Native)
  Timeouts: {
    CONNECT_TIMEOUT: 30000, // 30 seconds
    READ_TIMEOUT: 30000, // 30 seconds
    WRITE_TIMEOUT: 30000, // 30 seconds
  },
} as const;

/**
 * Helper to build full endpoint URL
 */
export const buildEndpointUrl = (endpoint: string): string => {
  return `${ApiConfig.BASE_URL}${endpoint}`;
};