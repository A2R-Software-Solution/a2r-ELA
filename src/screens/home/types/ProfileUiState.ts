/**
 * Profile UI State
 * State interface for the Profile screen.
 *
 * Follows the exact same pattern as HomeUiState.ts —
 * a single state object managed by useProfile.ts (the hook/ViewModel).
 *
 * References:
 *   - HomeUiState.ts      (pattern mirror — same structure, same conventions)
 *   - ProfileUiModel.ts   (the data shape this state holds)
 *   - GamificationModels.ts (BadgeDefinition, EMPTY_BADGE_PROGRESS)
 */

import { ProfileUiModel } from '../../../models/ui/ProfileUiModel';
import { BadgeDefinition, EMPTY_BADGE_PROGRESS } from '../../../models/GamificationModels';

// ============================================================================
// MAIN STATE INTERFACE
// ============================================================================

export interface ProfileUiState {
  /**
   * The fully assembled profile data.
   * null while loading or if fetch has not been attempted yet.
   * useProfile.ts populates this once all API calls complete.
   */
  profile: ProfileUiModel | null;

  /**
   * True while any of the API calls are in-flight.
   * ProfileScreen shows a loading spinner when this is true.
   */
  isLoading: boolean;

  /**
   * Error message if any API call failed.
   * null when there is no error.
   * ProfileScreen shows an inline error banner when this is non-null.
   */
  error: string | null;

  /**
   * Controls the StateSelectorSheet visibility.
   * The sheet handles both state AND grade selection together.
   */
  isSelectorSheetOpen: boolean;

  // --------------------------------------------------------------------------
  // Inline edit states
  // --------------------------------------------------------------------------

  /**
   * True when the name TextInput is active.
   * ProfileHeader shows TextInput + confirm/cancel buttons instead of name text.
   */
  isEditingName: boolean;

  /**
   * True while Firebase updateProfile() call is in-flight after name save.
   * ProfileHeader shows ActivityIndicator instead of confirm checkmark.
   */
  isSavingName: boolean;

  /**
   * True when the birthdate TextInput is active.
   * ProfileHeader shows TextInput + confirm/cancel buttons instead of birthdate text.
   */
  isEditingBirthdate: boolean;

  /**
   * True while POST /update_user_profile is in-flight after birthdate save.
   * ProfileHeader shows ActivityIndicator instead of confirm checkmark.
   */
  isSavingBirthdate: boolean;

  /**
   * True while image is being picked, compressed, and saved.
   * ProfileHeader shows ActivityIndicator overlay on avatar.
   */
  isSavingPhoto: boolean;

  // --------------------------------------------------------------------------
  // Badge state
  // --------------------------------------------------------------------------

  /**
   * All 8 badges with unlock status and progress bars.
   * Populated from GET /get_gamification → badge_progress.
   * Initialises as EMPTY_BADGE_PROGRESS (all locked, zero progress)
   * so BadgeCollection renders immediately without waiting for the API.
   */
  badgeProgress: BadgeDefinition[];
}

// ============================================================================
// INITIAL STATE
// ============================================================================

/**
 * Default state before useProfile loads any data.
 * isLoading starts as true so the screen immediately shows
 * a loading indicator on first mount — same pattern as initialHomeUiState.
 *
 * badgeProgress starts as EMPTY_BADGE_PROGRESS so the badge grid
 * renders all 8 locked badges instantly — no layout shift on load.
 */
export const initialProfileUiState: ProfileUiState = {
  profile:             null,
  isLoading:           true,
  error:               null,
  isSelectorSheetOpen: false,
  isEditingName:       false,
  isSavingName:        false,
  isEditingBirthdate:  false,
  isSavingBirthdate:   false,
  isSavingPhoto:       false,
  badgeProgress:       EMPTY_BADGE_PROGRESS,
};