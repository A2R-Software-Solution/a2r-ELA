/**
 * Gamification Models
 * TypeScript interfaces for XP, levels, badges, and rewards
 */

// ============================================================================
// BADGE TYPES
// ============================================================================

/**
 * A single badge with unlock status and progress.
 * Returned by GET /get_gamification as part of badge_progress array.
 */
export interface BadgeDefinition {
  id:          string;   // e.g. "first_essay"
  name:        string;   // e.g. "First Steps"
  description: string;   // e.g. "Submit your first essay"
  icon:        string;   // emoji e.g. "✍️"
  unlocked:    boolean;  // true if the user has earned this badge
  progress:    number;   // current progress value e.g. 3
  total:       number;   // target value e.g. 5
}

/**
 * Minimal badge info included in rewards after essay submission.
 * Only newly unlocked badges are included — no progress fields needed.
 */
export interface NewlyUnlockedBadge {
  id:          string;
  name:        string;
  description: string;
  icon:        string;
}

// ============================================================================
// GAMIFICATION DATA (stored in Firestore gamification/{uid})
// ============================================================================

/**
 * Full gamification document from Firestore.
 * Returned by GET /get_gamification.
 */
export interface GamificationData {
  xp:             number;
  level:          number;
  level_name:     string;
  badges_earned:  string[];          // list of unlocked badge ids
  badge_progress: BadgeDefinition[]; // all badges with unlock + progress state
}

// ============================================================================
// REWARDS (returned after every essay submission)
// ============================================================================

/**
 * Rewards earned from a single essay submission.
 * Included in EssaySubmissionResponse as `rewards` field.
 */
export interface RewardsUpdate {
  xp_earned:             number;              // XP earned this submission
  total_xp:              number;              // Cumulative XP after this submission
  level:                 number;              // Current level number (1-5)
  level_name:            string;              // e.g. "Word Explorer"
  level_up:              boolean;             // true if this submission caused a level up
  next_threshold:        number;              // XP needed to reach next level
  newly_unlocked_badges: NewlyUnlockedBadge[]; // badges earned from this submission
}

// ============================================================================
// LEVEL CONFIG (mirrors backend LEVEL_THRESHOLDS)
// ============================================================================

export interface LevelInfo {
  level:   number;
  name:    string;
  min_xp:  number;
  max_xp:  number;
}

export const LEVEL_CONFIG: LevelInfo[] = [
  { level: 1, name: "Beginner Writer", min_xp: 0,     max_xp: 999   },
  { level: 2, name: "Word Explorer",   min_xp: 1000,  max_xp: 4999  },
  { level: 3, name: "Story Builder",   min_xp: 5000,  max_xp: 14999 },
  { level: 4, name: "Essay Master",    min_xp: 15000, max_xp: 29999 },
  { level: 5, name: "Writing Legend",  min_xp: 30000, max_xp: 99999 },
];

// ============================================================================
// BADGE CATALOG (mirrors backend BADGE_DEFINITIONS)
// Single source of truth for badge metadata on the frontend.
// Used to render locked badges before the API responds.
// ============================================================================

export const BADGE_CATALOG: Omit<BadgeDefinition, 'unlocked' | 'progress' | 'total'>[] = [
  { id: 'first_essay',    name: 'First Steps',       description: 'Submit your first essay',              icon: '✍️' },
  { id: 'essay_5',        name: 'Getting Started',   description: 'Submit 5 essays',                      icon: '📝' },
  { id: 'essay_10',       name: 'Dedicated Writer',  description: 'Submit 10 essays',                     icon: '📚' },
  { id: 'perfect_focus',  name: 'Laser Focus',       description: 'Score 4/4 in Focus on any essay',      icon: '🎯' },
  { id: 'perfect_essay',  name: 'Flawless',          description: 'Score 4/4 in all domains on one essay',icon: '⭐' },
  { id: 'level_2',        name: 'Word Explorer',     description: 'Reach Level 2',                        icon: '🚀' },
  { id: 'level_3',        name: 'Story Builder',     description: 'Reach Level 3',                        icon: '🏆' },
  { id: 'xp_500',         name: 'XP Grinder',        description: 'Earn 500 total XP',                    icon: '⚡' },
];

/**
 * Fallback badge progress list — all locked, zero progress.
 * Used while the API call is in-flight so the UI renders immediately.
 */
export const EMPTY_BADGE_PROGRESS: BadgeDefinition[] = BADGE_CATALOG.map(b => ({
  ...b,
  unlocked: false,
  progress: 0,
  total:    1,
}));

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Calculate progress percentage toward next level (0–100).
 * Never exposes raw XP to the UI — only the percentage.
 */
export const getXpProgressPercent = (
  currentXp: number,
  level:     number,
): number => {
  const levelInfo = LEVEL_CONFIG.find(l => l.level === level);
  if (!levelInfo) return 0;

  const xpIntoLevel = currentXp - levelInfo.min_xp;
  const xpForLevel  = levelInfo.max_xp - levelInfo.min_xp;

  return Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100));
};

/**
 * Get motivating message based on current level.
 */
export const getLevelUpMessage = (level: number): string => {
  switch (level) {
    case 1:  return "Keep writing to reach Word Explorer!";
    case 2:  return "Keep writing to reach Story Builder!";
    case 3:  return "Keep writing to reach Essay Master!";
    case 4:  return "Keep writing to reach Writing Legend!";
    case 5:  return "You are a Writing Legend! Keep it up!";
    default: return "Keep writing to level up!";
  }
};

/**
 * Get prestige badge based on level.
 * Returns null if no prestige badge yet.
 */
export const getPrestigeBadge = (level: number): string | null => {
  switch (level) {
    case 3:  return "🥇";  // Gold    — Story Builder
    case 4:  return "🏅";  // Platinum — Essay Master
    case 5:  return "💎";  // Diamond  — Writing Legend
    default: return null;
  }
};