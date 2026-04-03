/**
 * Game Models
 * Data types for all mini-games
 */

// ─── Game IDs ─────────────────────────────────────────────────────────────────

export type GameId =
  | 'bug_catcher'
  | 'jumbled_story'
  | 'detail_detective'
  | 'boss_battle'
  | 'stay_on_topic'
  | 'word_swap';

// ─── Game Submission ──────────────────────────────────────────────────────────

export interface GameSubmissionRequest {
  game_id:          GameId;
  score:            number;   // 0–100
  time_taken?:      number;   // seconds
  lives_remaining?: number;   // 0–3, bug_catcher only
}

export interface GameRewards {
  xp_earned:             number;
  total_xp:              number;
  level:                 number;
  level_name:            string;
  level_up:              boolean;
  next_threshold:        number;
  newly_unlocked_badges: UnlockedBadge[];
}

export interface UnlockedBadge {
  id:          string;
  name:        string;
  description: string;
  icon:        string;
}

export interface GameSubmissionResponse {
  game_id: GameId;
  score:   number;
  rewards: GameRewards;
}

// ─── API Wrapper ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
  error?:  string;
}

// ─── Bug Catcher ──────────────────────────────────────────────────────────────

export interface BugError {
  id:        string;
  wordIndex: number;
  word:      string;
  fix:       string;
  type:      'spelling' | 'grammar' | 'punctuation';
}

export interface BugCatcherLevel {
  id:        string;
  paragraph: string;
  words:     string[];
  errors:    BugError[];
}

// ─── Jumbled Story ────────────────────────────────────────────────────────────

export interface StorySentence {
  id:           string;
  text:         string;
  correctIndex: number;
}

export interface JumbledStoryLevel {
  id:        string;
  title:     string;
  sentences: StorySentence[];
}

// ─── Detail Detective ─────────────────────────────────────────────────────────
// Required by useGame.ts — AI-powered sentence improvement game

export interface DetailDetectiveEvaluation {
  score:            number;   // 1–5
  max_score:        number;   // 5
  feedback:         string;
  what_they_did_well: string;
  how_to_improve:   string;
  xp_earned:        number;
}

export interface DetailDetectiveResponse {
  evaluation: DetailDetectiveEvaluation;
  rewards:    GameRewards;
}

// ─── Boss Battle ──────────────────────────────────────────────────────────────
// Required by useGame.ts — weekly personal best essay challenge

export interface BossBattleResult {
  converted_score:    number;
  personal_best:      number;
  beat_personal_best: boolean;
  improvement:        number;
}

export interface BossBattleResponse {
  evaluation:  Record<string, any>;
  boss_battle: BossBattleResult;
  rewards:     GameRewards;
}

// ─── Unified Game Result (local, before API call) ─────────────────────────────
//
//  Single interface covers all games.
//  Optional fields are game-specific:
//    livesRemaining               → bug_catcher
//    timeTaken                    → jumbled_story, stay_on_topic
//    accuracy / correctRemovals
//      wrongRemovals / missedRemovals / badge / xpEarned
//                                 → stay_on_topic, word_swap

export interface GameResult {
  gameId:           GameId;
  score:            number;       // 0–100 sent to backend

  livesRemaining?:  number;       // bug_catcher
  timeTaken?:       number;       // seconds

  accuracy?:        number;       // 0–100
  badge?:           string | null;
  correctRemovals?: number;
  wrongRemovals?:   number;
  missedRemovals?:  number;
  xpEarned?:        number;       // local preview only
}

// ─── XP / Level helpers ───────────────────────────────────────────────────────

export interface PlayerProgress {
  totalXP: number;
  level:   number;
  badges:  string[];
}

export const XP_PER_LEVEL = 100;
export const levelFromXP = (xp: number): number =>
  Math.floor(xp / XP_PER_LEVEL) + 1;