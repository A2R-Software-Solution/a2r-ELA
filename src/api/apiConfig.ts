import { appEnv } from '../config/env.generated';

/**
 * API Configuration
 * Contains base URL, endpoints, and timeout settings
 */

export const ApiConfig = {
  BASE_URL: appEnv.API_BASE_URL,

  // API Endpoints
  Endpoints: {
    // Essay
    SUBMIT_ESSAY: appEnv.ENDPOINT_SUBMIT_ESSAY,
    GET_ESSAY_SUBMISSION: appEnv.ENDPOINT_GET_ESSAY_SUBMISSION,
    GET_USER_SUBMISSIONS: appEnv.ENDPOINT_GET_USER_SUBMISSIONS,

    // Progress
    GET_STREAK: appEnv.ENDPOINT_GET_STREAK,
    GET_PROGRESS_STATS: appEnv.ENDPOINT_GET_PROGRESS_STATS,
    GET_CATEGORY_STATS: appEnv.ENDPOINT_GET_CATEGORY_STATS,

    // Gamification
    GET_GAMIFICATION: appEnv.ENDPOINT_GET_GAMIFICATION,

    // User Preferences — state & grade
    SAVE_USER_PREFERENCES: appEnv.ENDPOINT_SAVE_USER_PREFERENCES,
    GET_USER_PREFERENCES: appEnv.ENDPOINT_GET_USER_PREFERENCES,

    // File
    EXTRACT_PDF_TEXT: appEnv.ENDPOINT_EXTRACT_PDF_TEXT,

    // Health
    HEALTH_CHECK: appEnv.ENDPOINT_HEALTH_CHECK,

    // User Profile
    GET_USER_PROFILE: appEnv.ENDPOINT_GET_USER_PROFILE,
    UPDATE_USER_PROFILE: appEnv.ENDPOINT_UPDATE_USER_PROFILE,
    DELETE_ACCOUNT: appEnv.ENDPOINT_DELETE_ACCOUNT,       // ← NEW

    // Games (no AI)
    SUBMIT_GAME_RESULT: appEnv.ENDPOINT_SUBMIT_GAME_RESULT,

    // Games (AI)
    DETAIL_DETECTIVE_EVALUATE: appEnv.ENDPOINT_DETAIL_DETECTIVE_EVALUATE,
    BOSS_BATTLE_SUBMIT: appEnv.ENDPOINT_BOSS_BATTLE_SUBMIT,

    // Leaderboard
    GET_GRADE_LEADERBOARD: appEnv.ENDPOINT_GET_GRADE_LEADERBOARD,
    GET_STATE_LEADERBOARD: appEnv.ENDPOINT_GET_STATE_LEADERBOARD,

    // Vocabulary
    GET_DAILY_VOCAB: appEnv.ENDPOINT_GET_DAILY_VOCAB,

    // PSSA Practice
    GENERATE_PSSA_QUESTIONS: appEnv.ENDPOINT_GENERATE_PSSA_QUESTIONS,   // ← NEW
    EVALUATE_PSSA_WRITING: appEnv.ENDPOINT_EVALUATE_PSSA_WRITING,     // ← NEW
  },

  // Request Timeouts (in milliseconds)
  Timeouts: {
    CONNECT_TIMEOUT: appEnv.CONNECT_TIMEOUT_MS, // 30 seconds
    READ_TIMEOUT: appEnv.READ_TIMEOUT_MS, // 120 seconds — sequential AI calls need more time
    WRITE_TIMEOUT: appEnv.WRITE_TIMEOUT_MS,
  },
} as const;

/**
 * Helper to build full endpoint URL
 */
export const buildEndpointUrl = (endpoint: string): string => {
  return `${ApiConfig.BASE_URL}${endpoint}`;
};
