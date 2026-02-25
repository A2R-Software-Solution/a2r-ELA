/**
 * ProfileHeader
 * Top section of the profile screen.
 *
 * Renders:
 *   - Tappable avatar (photo → initials fallback) with camera badge
 *   - Inline name editor (tap pencil → TextInput + confirm/cancel)
 *   - Email row
 *   - Birthdate row (tap to add/edit inline)
 *   - Joined date
 *   - Grade + State pills
 *
 * Pure presentational — all logic lives in useProfile.ts.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { ProfileUiModel, formatBirthdate, resolveAvatarUri } from '../../../models/ui/ProfileUiModel';

// ============================================================================
// COLORS
// ============================================================================

const PURPLE       = '#7D55FF';
const LIGHT_PURPLE = '#F0EBFF';
const GRAY_TEXT    = '#6B7280';
const DARK_TEXT    = '#111827';
const MID_TEXT     = '#374151';
const BORDER_COLOR = '#E5E7EB';
const GREEN        = '#22C55E';
const RED          = '#EF4444';

// ============================================================================
// PROPS
// ============================================================================

interface ProfileHeaderProps {
  profile: ProfileUiModel;

  // Edit state flags
  isEditingName:      boolean;
  isSavingName:       boolean;
  isEditingBirthdate: boolean;
  isSavingBirthdate:  boolean;
  isSavingPhoto:      boolean;

  // Handlers
  onAvatarPress:         () => void;
  onNameEditStart:       () => void;
  onNameEditCancel:      () => void;
  onNameSave:            (name: string) => void;
  onBirthdateEditStart:  () => void;
  onBirthdateEditCancel: () => void;
  onBirthdateSave:       (birthdate: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isEditingName,
  isSavingName,
  isEditingBirthdate,
  isSavingBirthdate,
  isSavingPhoto,
  onAvatarPress,
  onNameEditStart,
  onNameEditCancel,
  onNameSave,
  onBirthdateEditStart,
  onBirthdateEditCancel,
  onBirthdateSave,
}) => {
  // Local text state for the inline editors
  const [nameInput,      setNameInput]      = useState(profile.displayName);
  const [birthdateInput, setBirthdateInput] = useState(profile.birthdate ?? '');

  const nameInputRef      = useRef<TextInput>(null);
  const birthdateInputRef = useRef<TextInput>(null);

  // Resolve which photo URI to show
  const avatarUri = resolveAvatarUri(profile.firestorePhotoUrl, profile.photoURL);

  // Formatted birthdate for display (null → show "Add birthdate" prompt)
  const birthdateDisplay = formatBirthdate(profile.birthdate);

  // Focus input when editing starts
  React.useEffect(() => {
    if (isEditingName) {
      setNameInput(profile.displayName);
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isEditingName]);

  React.useEffect(() => {
    if (isEditingBirthdate) {
      setBirthdateInput(profile.birthdate ?? '');
      setTimeout(() => birthdateInputRef.current?.focus(), 50);
    }
  }, [isEditingBirthdate]);

  return (
    <View style={styles.container}>

      {/* ------------------------------------------------------------------ */}
      {/* AVATAR                                                              */}
      {/* ------------------------------------------------------------------ */}
      <TouchableOpacity
        style={styles.avatarWrapper}
        onPress={onAvatarPress}
        activeOpacity={0.85}
        disabled={isSavingPhoto}
      >
        {/* Photo or initials */}
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarInitials}>
            <Text style={styles.initialsText}>{profile.initials}</Text>
          </View>
        )}

        {/* Saving overlay */}
        {isSavingPhoto && (
          <View style={styles.avatarOverlay}>
            <ActivityIndicator size="small" color="#FFFFFF" />
          </View>
        )}

        {/* Camera badge — bottom right */}
        {!isSavingPhoto && (
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeIcon}>📷</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ------------------------------------------------------------------ */}
      {/* NAME ROW                                                            */}
      {/* ------------------------------------------------------------------ */}
      {isEditingName ? (
        <View style={styles.inlineEditRow}>
          <TextInput
            ref={nameInputRef}
            style={styles.inlineInput}
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Your name"
            placeholderTextColor={GRAY_TEXT}
            maxLength={50}
            returnKeyType="done"
            onSubmitEditing={() => onNameSave(nameInput)}
            editable={!isSavingName}
          />
          <View style={styles.inlineActions}>
            {isSavingName ? (
              <ActivityIndicator size="small" color={PURPLE} />
            ) : (
              <>
                {/* Confirm */}
                <TouchableOpacity
                  style={[styles.inlineActionBtn, styles.confirmBtn]}
                  onPress={() => onNameSave(nameInput)}
                >
                  <Text style={styles.confirmBtnText}>✓</Text>
                </TouchableOpacity>

                {/* Cancel */}
                <TouchableOpacity
                  style={[styles.inlineActionBtn, styles.cancelBtn]}
                  onPress={onNameEditCancel}
                >
                  <Text style={styles.cancelBtnText}>✕</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.nameRow}
          onPress={onNameEditStart}
          activeOpacity={0.7}
        >
          <Text style={styles.displayName}>{profile.displayName}</Text>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* EMAIL                                                               */}
      {/* ------------------------------------------------------------------ */}
      {!!profile.email && (
        <Text style={styles.email}>{profile.email}</Text>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* BIRTHDATE ROW                                                       */}
      {/* ------------------------------------------------------------------ */}
      {isEditingBirthdate ? (
        <View style={styles.inlineEditRow}>
          <TextInput
            ref={birthdateInputRef}
            style={styles.inlineInput}
            value={birthdateInput}
            onChangeText={setBirthdateInput}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={GRAY_TEXT}
            keyboardType="numeric"
            maxLength={10}
            returnKeyType="done"
            onSubmitEditing={() => onBirthdateSave(birthdateInput)}
            editable={!isSavingBirthdate}
          />
          <View style={styles.inlineActions}>
            {isSavingBirthdate ? (
              <ActivityIndicator size="small" color={PURPLE} />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.inlineActionBtn, styles.confirmBtn]}
                  onPress={() => onBirthdateSave(birthdateInput)}
                >
                  <Text style={styles.confirmBtnText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.inlineActionBtn, styles.cancelBtn]}
                  onPress={onBirthdateEditCancel}
                >
                  <Text style={styles.cancelBtnText}>✕</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ) : birthdateDisplay ? (
        // Birthdate set — show it with edit affordance
        <TouchableOpacity
          style={styles.birthdateRow}
          onPress={onBirthdateEditStart}
          activeOpacity={0.7}
        >
          <Text style={styles.birthdateIcon}>🎂</Text>
          <Text style={styles.birthdateText}>{birthdateDisplay}</Text>
          <Text style={styles.editIconSmall}>✏️</Text>
        </TouchableOpacity>
      ) : (
        // No birthdate yet — show prompt
        <TouchableOpacity
          style={styles.addBirthdateRow}
          onPress={onBirthdateEditStart}
          activeOpacity={0.7}
        >
          <Text style={styles.addBirthdateText}>+ Add birthdate</Text>
        </TouchableOpacity>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* JOINED DATE                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Text style={styles.joinedDate}>Joined {profile.joinedDate}</Text>

      {/* ------------------------------------------------------------------ */}
      {/* GRADE + STATE PILLS                                                 */}
      {/* ------------------------------------------------------------------ */}
      <View style={styles.pillRow}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{profile.preferences.gradeDisplay}</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{profile.preferences.stateDisplay}</Text>
        </View>
      </View>

    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },

  // ---------- Avatar ----------
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarInitials: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 48,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cameraBadgeIcon: {
    fontSize: 14,
  },

  // ---------- Name ----------
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '700',
    color: DARK_TEXT,
  },
  editIcon: {
    fontSize: 14,
  },

  // ---------- Inline editor ----------
  inlineEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  inlineInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: DARK_TEXT,
    borderBottomWidth: 2,
    borderBottomColor: PURPLE,
    paddingVertical: 4,
    paddingHorizontal: 2,
    minWidth: 160,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  inlineActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtn: {
    backgroundColor: GREEN,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: RED,
  },
  cancelBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // ---------- Email ----------
  email: {
    fontSize: 14,
    color: GRAY_TEXT,
    marginBottom: 8,
  },

  // ---------- Birthdate ----------
  birthdateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  birthdateIcon: {
    fontSize: 14,
  },
  birthdateText: {
    fontSize: 14,
    color: MID_TEXT,
  },
  editIconSmall: {
    fontSize: 11,
  },
  addBirthdateRow: {
    marginBottom: 8,
  },
  addBirthdateText: {
    fontSize: 14,
    color: PURPLE,
    fontWeight: '500',
  },

  // ---------- Joined ----------
  joinedDate: {
    fontSize: 12,
    color: GRAY_TEXT,
    marginBottom: 12,
  },

  // ---------- Pills ----------
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    backgroundColor: LIGHT_PURPLE,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },
});

export default ProfileHeader;