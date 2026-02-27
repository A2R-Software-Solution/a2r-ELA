/**
 * Gamification Models
 * TypeScript interfaces for XP, levels, and rewards
 */

// ============================================================================
// GAMIFICATION DATA (stored in Firestore gamification/{uid})
// ============================================================================

/**
 * Full gamification document from Firestore
 * Returned by GET /get_gamification
 */
export interface GamificationData {
  xp: number;
  level: number;
  level_name: string;
}

// ============================================================================
// REWARDS (returned after every essay submission)
// ============================================================================

/**
 * Rewards earned from a single essay submission
 * Included in EssaySubmissionResponse as `rewards` field
 */
export interface RewardsUpdate {
  xp_earned: number;       // XP earned this submission
  total_xp: number;        // Cumulative XP after this submission
  level: number;           // Current level number (1-5)
  level_name: string;      // e.g. "Word Explorer"
  level_up: boolean;       // true if this submission caused a level up
  next_threshold: number;  // XP needed to reach next level
}

// ============================================================================
// LEVEL CONFIG (mirrors backend LEVEL_THRESHOLDS)
// ============================================================================

export interface LevelInfo {
  level: number;
  name: string;
  min_xp: number;
  max_xp: number;
}

export const LEVEL_CONFIG: LevelInfo[] = [
  { level: 1, name: "Beginner Writer", min_xp: 0,     max_xp: 999   },
  { level: 2, name: "Word Explorer",   min_xp: 1000,  max_xp: 4999  },
  { level: 3, name: "Story Builder",   min_xp: 5000,  max_xp: 14999 },
  { level: 4, name: "Essay Master",    min_xp: 15000, max_xp: 29999 },
  { level: 5, name: "Writing Legend",  min_xp: 30000, max_xp: 99999 },
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Calculate progress percentage toward next level (0-100)
 * Never exposes raw XP to the UI — only the percentage
 */
export const getXpProgressPercent = (
  currentXp: number,
  level: number,
): number => {
  const levelInfo = LEVEL_CONFIG.find((l) => l.level === level);
  if (!levelInfo) return 0;

  const xpIntoLevel = currentXp - levelInfo.min_xp;
  const xpForLevel  = levelInfo.max_xp - levelInfo.min_xp;

  return Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100));
};

/**
 * Get motivating message based on current level
 */
export const getLevelUpMessage = (level: number): string => {
  switch (level) {
    case 1: return "Keep writing to reach Word Explorer!";
    case 2: return "Keep writing to reach Story Builder!";
    case 3: return "Keep writing to reach Essay Master!";
    case 4: return "Keep writing to reach Writing Legend!";
    case 5: return "You are a Writing Legend! Keep it up!";
    default: return "Keep writing to level up!";
  }
};

/**
 * Get prestige badge based on level
 * Returns null if no prestige badge yet
 */
export const getPrestigeBadge = (level: number): string | null => {
  switch (level) {
    case 3: return "🥇";  // Gold — Story Builder
    case 4: return "🏅";  // Platinum — Essay Master
    case 5: return "💎";  // Diamond — Writing Legend
    default: return null;
  }
};