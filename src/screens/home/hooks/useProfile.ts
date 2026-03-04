/**
 * useProfile Hook
 * Profile screen logic (ViewModel equivalent).
 *
 * Follows the exact same pattern as useHome.ts and useSignIn.ts.
 *
 * References:
 *   - useHome.ts             (hook pattern — useState, useEffect, useCallback)
 *   - useAuth.ts             (user object + signOut)
 *   - apiService.ts          (API calls)
 *   - EssayModels.ts         (response types: ProgressStats, UserPreferences)
 *   - ProfileUiModel.ts      (assembled model + all helper functions)
 *   - ProfileUiState.ts      (state shape + initialProfileUiState)
 *   - GamificationModels.ts  (BadgeDefinition, EMPTY_BADGE_PROGRESS)
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import { profileEvents } from '../../../utils/profileEvents';
import { useAuth } from '../../../hooks/useAuth';
import { apiService } from '../../../api/apiService';
import {
  ProfileUiState,
  initialProfileUiState,
} from '../types/ProfileUiState';
import {
  ProfileUiModel,
  RecentEssayUiItem,
  computeInitials,
  displayNameFromEmail,
  formatJoinedDate,
  formatSubmissionDate,
  gradeToScoreColor,
} from '../../../models/ui/ProfileUiModel';
import {
  getEssayCategoryDisplayName,
  stringToEssayCategory,
} from '../../../models/EssayModels';
import { BadgeDefinition, EMPTY_BADGE_PROGRESS } from '../../../models/GamificationModels';

// ============================================================================
// CONSTANTS
// ============================================================================

// Birthdate MM/DD/YYYY format
const BIRTHDATE_REGEX = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/;

// Max base64 size — 800KB stays safely under Firestore 1MB doc limit
const MAX_PHOTO_BYTES = 800 * 1024;

// ============================================================================
// HOOK RETURN TYPE
// ============================================================================

export interface UseProfileReturn {
  uiState: ProfileUiState;

  /** Retry loading after an error */
  onRetry: () => void;

  // ---------- Preferences sheet ----------
  onEditPreferencesClick: () => void;
  onSelectorSheetClose: () => void;
  onPreferencesSaved: (state: string, grade: string) => Promise<void>;

  // ---------- Name editing ----------
  onNameEditStart: () => void;
  onNameEditCancel: () => void;
  onNameSave: (newName: string) => Promise<void>;

  // ---------- Birthdate editing ----------
  onBirthdateEditStart: () => void;
  onBirthdateEditCancel: () => void;
  onBirthdateSave: (birthdate: string) => Promise<void>;

  // ---------- Photo ----------
  /** Tapping avatar opens Alert action sheet: Camera / Gallery / Remove */
  onAvatarPress: () => void;

  // ---------- Auth ----------
  onLogoutClick: () => Promise<void>;

  // ---------- Sheet options ----------
  stateOptions: Array<{ code: string; label: string }>;
  gradeOptions: Array<{ code: string; label: string }>;
}

// ============================================================================
// HOOK
// ============================================================================

export const useProfile = (): UseProfileReturn => {
  const { user, signOut } = useAuth();
  const [uiState, setUiState] = useState<ProfileUiState>(initialProfileUiState);
  const [stateOptions, setStateOptions] = useState<Array<{ code: string; label: string }>>([]);
  const [gradeOptions, setGradeOptions] = useState<Array<{ code: string; label: string }>>([]);

  // --------------------------------------------------------------------------
  // Load on mount
  // --------------------------------------------------------------------------
  useEffect(() => {
    loadProfile();
  }, []);

  // --------------------------------------------------------------------------
  // LOAD PROFILE — 5 parallel API calls
  // --------------------------------------------------------------------------
  const loadProfile = useCallback(async () => {
    setUiState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [
        statsRes,
        prefsRes,
        submissionsRes,
        userProfileRes,
        gamificationRes,      // ← new: badge + XP data
      ] = await Promise.all([
        apiService.getProgressStats(),
        apiService.getUserPreferences(),
        apiService.getUserSubmissions(5),
        apiService.getUserProfile(),
        apiService.getGamification(),  // ← new
      ]);

      if (!statsRes.data.success || !statsRes.data.data) {
        throw new Error('Failed to load progress stats');
      }
      if (!prefsRes.data.success || !prefsRes.data.data) {
        throw new Error('Failed to load preferences');
      }
      if (!submissionsRes.data.success || !submissionsRes.data.data) {
        throw new Error('Failed to load recent essays');
      }
      // userProfile and gamification are allowed to have null data — never throw for these

      const stats         = statsRes.data.data;
      const prefs         = prefsRes.data.data;
      const submissions   = (submissionsRes.data.data as any).submissions ?? [];
      const userProfile   = userProfileRes.data?.data ?? null;
      const gamification  = gamificationRes.data?.data ?? null;

      setStateOptions(prefs.supported_states ?? []);
      setGradeOptions(prefs.supported_grades ?? []);

      // ------------------------------------------------------------------
      // Badge progress — fall back to EMPTY_BADGE_PROGRESS if API fails
      // ------------------------------------------------------------------
      const badgeProgress: BadgeDefinition[] =
        gamification?.badge_progress ?? EMPTY_BADGE_PROGRESS;

      // ------------------------------------------------------------------
      // Identity — Firebase Auth
      // ------------------------------------------------------------------
      const rawDisplayName  = user?.displayName ?? null;
      const email           = user?.email ?? user?.providerData?.[0]?.email ?? '';
      const displayName     = rawDisplayName ?? displayNameFromEmail(email);
      const initials        = computeInitials(displayName);
      const joinedDate      = formatJoinedDate(user?.metadata?.creationTime);

      // ------------------------------------------------------------------
      // Firestore user profile
      // ------------------------------------------------------------------
      const birthdate         = userProfile?.birthdate ?? null;
      const firestorePhotoUrl = userProfile?.photo_url ?? null;

      // ------------------------------------------------------------------
      // Stats
      // ------------------------------------------------------------------
      const categoryStats = stats.category_stats ?? {};
      const totalEssays   = stats.total_essays_submitted ?? 0;

      const avgScore = totalEssays === 0 ? 0 : Math.round(
        (
          (categoryStats.essay_writing?.avg_score ?? 0) * (categoryStats.essay_writing?.count ?? 0) +
          (categoryStats.ela?.avg_score ?? 0)           * (categoryStats.ela?.count ?? 0) +
          (categoryStats.math?.avg_score ?? 0)          * (categoryStats.math?.count ?? 0) +
          (categoryStats.science?.avg_score ?? 0)       * (categoryStats.science?.count ?? 0)
        ) / totalEssays,
      );

      // ------------------------------------------------------------------
      // Preferences
      // ------------------------------------------------------------------
      const profilePrefs = {
        state:        prefs.state ?? 'PA',
        stateDisplay: prefs.state_display ?? prefs.state ?? 'Pennsylvania',
        grade:        prefs.grade ?? '6',
        gradeDisplay: prefs.grade_display ?? `Grade ${prefs.grade ?? '6'}`,
      };

      // ------------------------------------------------------------------
      // Recent essays
      // ------------------------------------------------------------------
      const recentEssays: RecentEssayUiItem[] = submissions.map((sub: any) => ({
        submissionId:  sub.submission_id ?? sub.id ?? '',
        categoryLabel: getEssayCategoryDisplayName(stringToEssayCategory(sub.category ?? '')),
        score:         sub.converted_score ?? sub.total_score ?? 0,
        letterGrade:   sub.grade ?? 'F',
        submittedAt:   formatSubmissionDate(sub.submitted_at ?? sub.created_at ?? ''),
        scoreColor:    gradeToScoreColor(sub.grade ?? 'F'),
      }));

      // ------------------------------------------------------------------
      // Assemble profile model
      // ------------------------------------------------------------------
      const profile: ProfileUiModel = {
        uid:             user?.uid ?? '',
        displayName,
        email,
        photoURL:        user?.photoURL ?? null,
        initials,
        joinedDate,
        stats: {
          totalEssays,
          currentStreak: stats.current_streak ?? 0,
          maxStreak:     stats.max_streak ?? 0,
          avgScore,
        },
        preferences:     profilePrefs,
        recentEssays,
        birthdate,
        firestorePhotoUrl,
      };

      setUiState(prev => ({
        ...prev,
        profile,
        badgeProgress,   // ← populate badge grid
        isLoading: false,
        error: null,
      }));

    } catch (error: any) {
      console.error('useProfile: loadProfile failed:', error);
      setUiState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message ?? 'Failed to load profile. Please try again.',
      }));
    }
  }, [user?.uid]);

  // --------------------------------------------------------------------------
  // RETRY
  // --------------------------------------------------------------------------
  const onRetry = useCallback(() => {
    loadProfile();
  }, [loadProfile]);

  // --------------------------------------------------------------------------
  // PREFERENCES SHEET
  // --------------------------------------------------------------------------
  const onEditPreferencesClick = useCallback(() => {
    setUiState(prev => ({ ...prev, isSelectorSheetOpen: true }));
  }, []);

  const onSelectorSheetClose = useCallback(() => {
    setUiState(prev => ({ ...prev, isSelectorSheetOpen: false }));
  }, []);

  const onPreferencesSaved = useCallback(async (state: string, grade: string) => {
    setUiState(prev => {
      if (!prev.profile) return prev;
      return {
        ...prev,
        isSelectorSheetOpen: false,
        profile: {
          ...prev.profile,
          preferences: {
            ...prev.profile.preferences,
            state,
            grade,
            stateDisplay: state,
            gradeDisplay: grade === 'k'
              ? 'Kindergarten'
              : grade === 'prek'
              ? 'Pre-K'
              : `Grade ${grade}`,
          },
        },
      };
    });
    try {
      await apiService.saveUserPreferences({ state, grade });
    } catch (error) {
      console.error('useProfile: failed to save preferences:', error);
    }
  }, []);

  // --------------------------------------------------------------------------
  // NAME EDITING
  // --------------------------------------------------------------------------
  const onNameEditStart = useCallback(() => {
    setUiState(prev => ({ ...prev, isEditingName: true }));
  }, []);

  const onNameEditCancel = useCallback(() => {
    setUiState(prev => ({ ...prev, isEditingName: false }));
  }, []);

  const onNameSave = useCallback(async (newName: string) => {
    const trimmed = newName.trim();

    if (!trimmed) {
      Alert.alert('Invalid Name', 'Name cannot be empty.');
      return;
    }
    if (trimmed.length > 50) {
      Alert.alert('Invalid Name', 'Name cannot exceed 50 characters.');
      return;
    }

    setUiState(prev => ({ ...prev, isSavingName: true }));

    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.updateProfile({ displayName: trimmed });
      }

      await apiService.updateUserProfile({ display_name: trimmed });

      setUiState(prev => {
        if (!prev.profile) return prev;
        return {
          ...prev,
          isEditingName: false,
          isSavingName: false,
          profile: {
            ...prev.profile,
            displayName: trimmed,
            initials: computeInitials(trimmed),
          },
        };
      });

      profileEvents.emit('nameChanged');

    } catch (error) {
      console.error('useProfile: failed to save name:', error);
      Alert.alert('Error', 'Failed to update name. Please try again.');
      setUiState(prev => ({ ...prev, isSavingName: false }));
    }
  }, []);

  // --------------------------------------------------------------------------
  // BIRTHDATE EDITING
  // --------------------------------------------------------------------------
  const onBirthdateEditStart = useCallback(() => {
    setUiState(prev => ({ ...prev, isEditingBirthdate: true }));
  }, []);

  const onBirthdateEditCancel = useCallback(() => {
    setUiState(prev => ({ ...prev, isEditingBirthdate: false }));
  }, []);

  const onBirthdateSave = useCallback(async (birthdate: string) => {
    if (!BIRTHDATE_REGEX.test(birthdate)) {
      Alert.alert('Invalid Format', 'Please enter date as MM/DD/YYYY (e.g. 08/22/1998).');
      return;
    }

    setUiState(prev => ({ ...prev, isSavingBirthdate: true }));

    try {
      await apiService.updateUserProfile({ birthdate });

      setUiState(prev => {
        if (!prev.profile) return prev;
        return {
          ...prev,
          isEditingBirthdate: false,
          isSavingBirthdate: false,
          profile: { ...prev.profile, birthdate },
        };
      });

    } catch (error) {
      console.error('useProfile: failed to save birthdate:', error);
      Alert.alert('Error', 'Failed to update birthdate. Please try again.');
      setUiState(prev => ({ ...prev, isSavingBirthdate: false }));
    }
  }, []);

  // --------------------------------------------------------------------------
  // PHOTO
  // --------------------------------------------------------------------------
  const _processAndSaveImage = useCallback(async (source: 'camera' | 'library') => {
    setUiState(prev => ({ ...prev, isSavingPhoto: true }));

    try {
      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: true,
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.6 as const,
      };

      const response: ImagePickerResponse = source === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (response.didCancel || !response.assets?.length) {
        setUiState(prev => ({ ...prev, isSavingPhoto: false }));
        return;
      }

      const asset = response.assets[0];

      if (!asset.base64 || !asset.type) {
        throw new Error('Failed to read image data');
      }

      const dataUri = `data:${asset.type};base64,${asset.base64}`;

      if (dataUri.length > MAX_PHOTO_BYTES) {
        Alert.alert('Image Too Large', 'Please choose a smaller image.');
        setUiState(prev => ({ ...prev, isSavingPhoto: false }));
        return;
      }

      await apiService.updateUserProfile({ photo_url: dataUri });

      setUiState(prev => {
        if (!prev.profile) return prev;
        return {
          ...prev,
          isSavingPhoto: false,
          profile: { ...prev.profile, firestorePhotoUrl: dataUri },
        };
      });

    } catch (error) {
      console.error('useProfile: failed to save photo:', error);
      Alert.alert('Error', 'Failed to update photo. Please try again.');
      setUiState(prev => ({ ...prev, isSavingPhoto: false }));
    }
  }, []);

  const _removePhoto = useCallback(async () => {
    setUiState(prev => ({ ...prev, isSavingPhoto: true }));
    try {
      await apiService.updateUserProfile({ photo_url: null });
      setUiState(prev => {
        if (!prev.profile) return prev;
        return {
          ...prev,
          isSavingPhoto: false,
          profile: { ...prev.profile, firestorePhotoUrl: null },
        };
      });
    } catch (error) {
      console.error('useProfile: failed to remove photo:', error);
      Alert.alert('Error', 'Failed to remove photo. Please try again.');
      setUiState(prev => ({ ...prev, isSavingPhoto: false }));
    }
  }, []);

  const onAvatarPress = useCallback(() => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo',          onPress: () => _processAndSaveImage('camera') },
        { text: 'Choose from Gallery', onPress: () => _processAndSaveImage('library') },
        { text: 'Remove Photo',        style: 'destructive', onPress: _removePhoto },
        { text: 'Cancel',              style: 'cancel' },
      ],
    );
  }, [_processAndSaveImage, _removePhoto]);

  // --------------------------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------------------------
  const onLogoutClick = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('useProfile: logout failed:', error);
    }
  }, [signOut]);

  // --------------------------------------------------------------------------
  // RETURN
  // --------------------------------------------------------------------------
  return {
    uiState,
    onRetry,
    onEditPreferencesClick,
    onSelectorSheetClose,
    onPreferencesSaved,
    onNameEditStart,
    onNameEditCancel,
    onNameSave,
    onBirthdateEditStart,
    onBirthdateEditCancel,
    onBirthdateSave,
    onAvatarPress,
    onLogoutClick,
    stateOptions,
    gradeOptions,
  };
};