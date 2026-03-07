/**
 * Game Models
 * Data types for mini-games (Bug Catcher, Jumbled Story)
 */

//  Game IDs 

export type GameId = 'bug_catcher' | 'jumbled_story';

//  Game Submission 

export interface GameSubmissionRequest {
  game_id:          GameId;
  score:            number;       // 0-100
  time_taken?:      number;       // seconds — required for jumbled_story
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

//  API Wrapper 

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
  error?:  string;
}

//  Bug Catcher 

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

//  Jumbled Story

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

// Game Result (local, before API call) 

export interface GameResult {
  gameId:          GameId;
  score:           number;
  timeTaken?:      number;
  livesRemaining?: number;
}