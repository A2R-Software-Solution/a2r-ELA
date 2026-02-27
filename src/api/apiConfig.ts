/**
 * API Configuration
 * Contains base URL, endpoints, and timeout settings
 */

export const ApiConfig = {
  BASE_URL: 'https://us-central1-e-learning-app-9d86f.cloudfunctions.net/',

  // API Endpoints
  Endpoints: {
    // Essay
    SUBMIT_ESSAY:         'submit_essay',
    GET_ESSAY_SUBMISSION: 'get_essay_submission',
    GET_USER_SUBMISSIONS: 'get_user_submissions',

    // Progress
    GET_STREAK:           'get_streak',
    GET_PROGRESS_STATS:   'get_progress_stats',
    GET_CATEGORY_STATS:   'get_category_stats',

    // Gamification 
    GET_GAMIFICATION:     'get_gamification',

    // User Preferences — state & grade
    SAVE_USER_PREFERENCES: 'save_user_preferences',
    GET_USER_PREFERENCES:  'get_user_preferences',

    // File
    EXTRACT_PDF_TEXT: 'extract_pdf_text',

    // Health
    HEALTH_CHECK: 'health_check',

    // User Profile
    GET_USER_PROFILE:    'get_user_profile',
    UPDATE_USER_PROFILE: 'update_user_profile',
  },

  // Request Timeouts (in milliseconds)
  Timeouts: {
    CONNECT_TIMEOUT: 30000, // 30 seconds
    READ_TIMEOUT:    30000,
    WRITE_TIMEOUT:   30000,
  },
} as const;

/**
 * Helper to build full endpoint URL
 */
export const buildEndpointUrl = (endpoint: string): string => {
  return `${ApiConfig.BASE_URL}${endpoint}`;
};