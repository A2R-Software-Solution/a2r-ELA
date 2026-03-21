/**
 * Profile UI Model
 * Represents the complete, display-ready profile data consumed by the Profile screen.
 *
 * This is the single source of truth for everything the profile UI renders.
 * It is assembled by useProfile.ts from three sources:
 *   - Firebase Auth user object  (displayName, email, photoURL, metadata)
 *   - GET /get_progress_stats    (totalEssays, streak, category stats)
 *   - GET /get_user_preferences  (state, grade)
 *   - GET /get_user_submissions  (recent 5 essays)
 */

// ============================================================================
// RECENT ESSAY ITEM
// Represents a single row in the "Recent Essays" list on the profile screen.
// Sourced from GET /get_user_submissions response.
// ============================================================================

export interface RecentEssayUiItem {
  /** Firestore document ID */
  submissionId: string;

  /**
   * Human-readable category label.
   * Derived from category field using getEssayCategoryDisplayName() from EssayModels.ts
   * e.g. 'essay_writing' → 'Essay Writing'
   */
  categoryLabel: string;

  /**
   * Numeric score out of 100.
   * Sourced from converted_score field in submission document.
   */
  score: number;

  /**
   * Letter grade — A, B, C, D, or F.
   * Sourced from grade field in submission document.
   */
  letterGrade: string;

  /**
   * Human-readable submission date.
   * Pre-formatted as 'MMM DD, YYYY' (e.g. 'Feb 18, 2025') by useProfile.ts.
   * Sourced from submitted_at field.
   */
  submittedAt: string;

  /**
   * Score badge color — used by RecentEssaysList.tsx to color the score chip.
   * Computed from letterGrade:
   *   A → '#22C55E' (green)
   *   B → '#84CC16' (lime)
   *   C → '#F59E0B' (amber)
   *   D → '#F97316' (orange)
   *   F → '#EF4444' (red)
   */
  scoreColor: string;
}

// ============================================================================
// PROFILE STATS
// Aggregated learning statistics shown in the StatsRow component.
// Sourced from GET /get_progress_stats response.
// ============================================================================

export interface ProfileStatsUiModel {
  /** Total number of essays submitted across all categories */
  totalEssays: number;

  /**
   * Active daily streak count.
   * Uses current_streak from progress_service which already handles
   * streak expiry (resets to 0 if more than 1 day has passed).
   */
  currentStreak: number;

  /** All-time best streak — shown as a secondary stat */
  maxStreak: number;

  /**
   * Overall average score across all submitted essays (0–100).
   * Computed by useProfile.ts from category_stats:
   *   sum of (avg_score × count) for all categories / total essays
   * Returns 0 if no essays submitted yet.
   */
  avgScore: number;
}

// ============================================================================
// PROFILE PREFERENCES
// User's saved learning context.
// Sourced from GET /get_user_preferences response.
// ============================================================================

export interface ProfilePreferencesUiModel {
  /** State code — e.g. 'PA' */
  state: string;

  /** Full state name — e.g. 'Pennsylvania' */
  stateDisplay: string;

  /** Grade code — e.g. '7', 'k', 'prek' */
  grade: string;

  /** Full grade label — e.g. 'Grade 7', 'Kindergarten', 'Pre-K' */
  gradeDisplay: string;
}

// ============================================================================
// ROOT PROFILE UI MODEL
// The complete assembled model passed into all Profile sub-components.
// ============================================================================

export interface ProfileUiModel {
  // --------------------------------------------------------------------------
  // User Identity
  // Sourced from Firebase Auth user object (available in useAuth → user field).
  // --------------------------------------------------------------------------

  /**
   * Firebase UID — used for API calls but not displayed.
   * Sourced from user.uid
   */
  uid: string;

  /**
   * Display name shown as the headline on the profile.
   * Sourced from user.displayName.
   * Falls back to the portion of email before '@' if displayName is null
   * (e.g. 'john.doe@gmail.com' → 'john.doe').
   */
  displayName: string;

  /** Full email address. Sourced from user.email */
  email: string;

  /**
   * Remote photo URL for avatar image.
   * Sourced from user.photoURL.
   * Will be null for email/password sign-ups (no photo set).
   * ProfileHeader.tsx renders initials avatar when this is null.
   */
  photoURL: string | null;

  /**
   * 1–2 character initials for the avatar fallback circle.
   * Computed from displayName:
   *   'John Doe'  → 'JD'
   *   'john.doe'  → 'JD' (splits on dot/underscore/hyphen too)
   *   'Alice'     → 'A'
   * Computed by useProfile.ts so ProfileHeader.tsx stays purely presentational.
   */
  initials: string;

  /**
   * Account creation date formatted as 'Month YYYY' (e.g. 'January 2025').
   * Sourced from user.metadata.creationTime (Firebase Auth).
   * Displayed as "Joined January 2025" in ProfileHeader.
   */
  joinedDate: string;

  // --------------------------------------------------------------------------
  // Stats, Preferences, Recent Essays
  // --------------------------------------------------------------------------

  /** Learning statistics for the StatsRow component */
  stats: ProfileStatsUiModel;

  /** Saved state and grade preferences for ProfileSettingsSection */
  preferences: ProfilePreferencesUiModel;

  /** Last 5 submissions for RecentEssaysList — empty array if none yet */
  recentEssays: RecentEssayUiItem[];

  // --------------------------------------------------------------------------
  // Firestore User Profile fields
  // Sourced from GET /get_user_profile — stored in users/{uid} collection.
  // --------------------------------------------------------------------------

  /**
   * Birthdate in MM/DD/YY format (e.g. '02/18/12').
   * null if user has never set a birthdate.
   * Stored only in Firestore — Firebase Auth has no birthdate field.
   */
  birthdate: string | null;

  /**
   * Base64 compressed avatar photo.
   * Format: 'data:image/jpeg;base64,...'
   * Sourced from Firestore users/{uid}.photo_url.
   *
   * Display priority in ProfileHeader:
   *   1. firestorePhotoUrl (if set) — user's custom uploaded photo
   *   2. photoURL from Firebase Auth (if set) — e.g. Google sign-in photo
   *   3. Initials circle fallback
   */
  firestorePhotoUrl: string | null;
}

// ============================================================================
// HELPERS
// Pure functions used by useProfile.ts to build ProfileUiModel.
// Kept here so the logic is co-located with the types it produces.
// ============================================================================

/**
 * Compute initials from a display name string.
 * Splits on spaces, dots, underscores, and hyphens.
 * Returns up to 2 uppercase characters.
 *
 * Examples:
 *   'John Doe'    → 'JD'
 *   'john.doe'    → 'JD'
 *   'Alice'       → 'A'
 *   ''            → '?'
 */
export const computeInitials = (displayName: string): string => {
  if (!displayName || displayName.trim() === '') return '?';

  const parts = displayName.trim().split(/[\s._-]+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Derive a display name from email when displayName is not set.
 * Takes the local part (before @) and replaces dots/underscores with spaces,
 * then title-cases it.
 *
 * Example: 'john.doe@gmail.com' → 'John Doe'
 */
export const displayNameFromEmail = (email: string): string => {
  const local = email.split('@')[0] ?? email;
  return local
    .split(/[._-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format a Firebase Auth creationTime string into 'Month YYYY'.
 * Firebase returns ISO strings like 'Mon, 01 Jan 2025 00:00:00 GMT'.
 *
 * Returns 'Unknown' if the date cannot be parsed.
 */
export const formatJoinedDate = (creationTime: string | undefined): string => {
  if (!creationTime) return 'Unknown';

  try {
    const date = new Date(creationTime);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return 'Unknown';
  }
};

/**
 * Format a Firestore timestamp string into 'MMM DD, YYYY'.
 * Accepts ISO strings (e.g. '2025-02-18T10:30:00.000Z').
 *
 * Returns 'Unknown date' if parsing fails.
 */
export const formatSubmissionDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Unknown date';
  }
};

/**
 * Map a letter grade to a display color for the score chip.
 *
 * A → green   (excellent)
 * B → lime    (good)
 * C → amber   (average)
 * D → orange  (below average)
 * F → red     (failing)
 */
export const gradeToScoreColor = (letterGrade: string): string => {
  switch (letterGrade.toUpperCase()) {
    case 'A': return '#22C55E';
    case 'B': return '#84CC16';
    case 'C': return '#F59E0B';
    case 'D': return '#F97316';
    case 'F': return '#EF4444';
    default:  return '#9CA3AF'; // gray fallback for unexpected values
  }
};

/**
 * Format birthdate for display.
 * Input:  'MM/DD/YYYY' (4-digit year, e.g. '08/22/1998')
 * Output: 'Aug 22, 1998' (human-readable)
 *
 * Returns null if birthdate is null or cannot be parsed.
 */
export const formatBirthdate = (birthdate: string | null): string | null => {
  if (!birthdate) return null;

  try {
    const parts = birthdate.split('/');
    if (parts.length !== 3) return null;

    const [month, day, year] = parts;
    const fullYear = parseInt(year, 10);

    // Reject obviously invalid years
    if (fullYear < 1900 || fullYear > new Date().getFullYear()) return null;

    const date = new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10));

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      year:  'numeric',
    });
  } catch {
    return null;
  }
};

/**
 * Resolve the best available photo URI for avatar display.
 * Priority: firestorePhotoUrl > Firebase Auth photoURL > null (shows initials)
 */
export const resolveAvatarUri = (
  firestorePhotoUrl: string | null,
  authPhotoUrl: string | null,
): string | null => {
  return firestorePhotoUrl ?? authPhotoUrl ?? null;
};

/**
 * Compute overall average score from category stats.
 * Uses weighted average: sum(avg_score × count) / total_count
 * Returns 0 if no essays have been submitted.
 */
export const computeOverallAvgScore = (
  categoryStats: { [key: string]: { count: number; avg_score: number } },
  totalEssays: number,
): number => {
  if (totalEssays === 0) return 0;

  const weightedSum = Object.values(categoryStats).reduce((acc, cat) => {
    return acc + cat.avg_score * cat.count;
  }, 0);

  return Math.round(weightedSum / totalEssays);
};