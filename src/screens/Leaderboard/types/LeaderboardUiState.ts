/**
 * Leaderboard UI State
 * Defines the state shape managed by useLeaderboard hook.
 */

import { LeaderboardEntry, LeaderboardTab } from '../../../models/LeaderboardModels';

// --------------------------------------------------------------------------
// UI STATE
// --------------------------------------------------------------------------

export interface LeaderboardUiState {
  /** Which tab is currently active */
  activeTab: LeaderboardTab;

  /** True while fetching data from backend */
  isLoading: boolean;

  /** Error message to show if fetch failed */
  errorMessage: string | null;

  /** Top 10 entries for the active tab */
  entries: LeaderboardEntry[];

  /** Current user's rank (null if no data yet) */
  currentUserRank: number | null;

  /** Human-readable filter label e.g. "Grade 6" or "Pennsylvania" */
  filterLabel: string;

  /** Total users competing in this leaderboard */
  totalUsers: number;
}

// --------------------------------------------------------------------------
// INITIAL STATE
// --------------------------------------------------------------------------

export const initialLeaderboardUiState: LeaderboardUiState = {
  activeTab:       'grade',
  isLoading:       false,
  errorMessage:    null,
  entries:         [],
  currentUserRank: null,
  filterLabel:     '',
  totalUsers:      0,
};