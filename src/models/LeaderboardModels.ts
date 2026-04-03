/**
 * Leaderboard Models
 * TypeScript interfaces mirroring the backend leaderboard API responses.
 */

// --------------------------------------------------------------------------
// CORE ENTRY
// --------------------------------------------------------------------------

/**
 * A single user's entry in the leaderboard.
 * Returned by both grade and state leaderboard endpoints.
 */
export interface LeaderboardEntry {
  rank:           number;   // 1-based rank position
  display_name:   string;   // User's display name e.g. "Alex M."
  xp:             number;   // Total XP earned
  level:          number;   // Level number e.g. 2
  level_name:     string;   // Level label e.g. "Word Explorer"
  essay_count:    number;   // Total essays submitted
  avg_score:      number;   // Average PSSA score (0–100)
  is_current_user: boolean; // true if this entry belongs to the requesting user
}

// --------------------------------------------------------------------------
// API RESPONSE
// --------------------------------------------------------------------------

/**
 * Response shape from GET /get_grade_leaderboard
 * and GET /get_state_leaderboard
 */
export interface LeaderboardResponse {
  entries:           LeaderboardEntry[]; // Top 10 + current user if outside top 10
  current_user_rank: number | null;      // Current user's rank (null if no data yet)
  filter_label:      string;             // e.g. "Grade 6" or "Pennsylvania"
  total_users:       number;             // Total users in this grade/state
}

// --------------------------------------------------------------------------
// TAB TYPE
// --------------------------------------------------------------------------

/**
 * Which leaderboard tab is active
 */
export type LeaderboardTab = 'grade' | 'state';