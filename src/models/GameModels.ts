/**
 * Game Models
 * Data types for mini-games (Bug Catcher, Jumbled Story, Detail Detective, Boss Battle)
 */

// ─── Game IDs ─────────────────────────────────────────────────────────────────

export type GameId =
  | 'bug_catcher'
  | 'jumbled_story'
  | 'stay_on_topic'
  | 'word_swap'
  | 'detail_detective'
  | 'boss_battle';

// ─── Game Submission (no-AI games) ───────────────────────────────────────────

export interface GameSubmissionRequest {
  game_id:          GameId;
  score:            number;       // 0-100
  time_taken?:      number;       // seconds — required for jumbled_story / stay_on_topic
  lives_remaining?: number;       // 0-3    — required for bug_catcher
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
  wordIndex: number;       // index in the words array
  word:      string;       // the incorrect word shown
  fix:       string;       // the correct version (not shown to student)
  type:      'spelling' | 'grammar' | 'punctuation';
}

export interface BugCatcherLevel {
  id:        string;
  paragraph: string;       // full paragraph text
  words:     string[];     // paragraph split into tappable words
  errors:    BugError[];   // which words are bugs
}

// ─── Jumbled Story ────────────────────────────────────────────────────────────

export interface StorySentence {
  id:           string;
  text:         string;
  correctIndex: number;   // 0-based correct position in the story
}

export interface JumbledStoryLevel {
  id:        string;
  title:     string;
  sentences: StorySentence[];
}

// ─── Game Result (local, before API call) ────────────────────────────────────

export interface GameResult {
  gameId:          GameId;
  score:           number;
  timeTaken?:      number;
  livesRemaining?: number;
}

// ─── Detail Detective ─────────────────────────────────────────────────────────

export interface DetailDetectiveSentence {
  id:               string;
  weakSentence:     string;   // the boring sentence shown to the student
  hint?:            string;   // optional hint shown if student is stuck
  topic:            string;   // topic label e.g. "Food", "Animals"
}

export interface DetailDetectiveEvaluation {
  score:             number;   // 1-5
  max_score:         number;   // always 5
  feedback:          string;   // main feedback message shown to student
  what_they_did_well: string;  // specific praise
  how_to_improve:    string;   // specific tip
  xp_earned:         number;   // 10-60 based on score
}

export interface DetailDetectiveRequest {
  original_sentence: string;
  improved_sentence: string;
}

export interface DetailDetectiveResponse {
  evaluation: DetailDetectiveEvaluation;
  rewards:    GameRewards;
}

// ─── Boss Battle ──────────────────────────────────────────────────────────────

export interface BossBattleRequest {
  essay_text: string;
  state?:     string;   // e.g. 'PA' — optional, defaults to user preference
  grade?:     string;   // e.g. '6'  — optional, defaults to user preference
}

export interface BossBattleResult {
  converted_score:    number;   // 0-100
  personal_best:      number;   // previous personal best
  beat_personal_best: boolean;
  improvement:        number;   // how many points above personal best (0 if not beaten)
}

export interface BossBattleEvaluation {
  total_score:           number;
  pssa_total:            number;
  converted_score:       number;
  grade:                 string;
  raw_scores:            Record<string, number>;
  converted_scores:      Record<string, number>;
  rubric_justifications: Record<string, string>;
  strengths:             string[];
  areas_for_improvement: string[];
  personalized_feedback: string;
  word_count:            number;
}

export interface BossBattleResponse {
  evaluation:  BossBattleEvaluation;
  boss_battle: BossBattleResult;
  rewards:     GameRewards;
}