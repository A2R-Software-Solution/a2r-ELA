import { styles, PURPLE, TEXT_MUTED } from './ProfileHeader.styles';
/**
 * ProfileHeader
 * Top section of the profile screen.
 *
 * ✅ FIXED: Replaced hardcoded paddingTop: 32 with useSafeAreaInsets()
 *           so the avatar doesn't hide behind the dynamic island / notch
 * ✅ UPDATED: Dark C-palette theme (near-black base, glassy purple surfaces)
 */

import React, { useState, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ProfileUiModel,
  formatBirthdate,
  resolveAvatarUri,
} from '../../../models/ui/ProfileUiModel';

// ============================================================================
// COLORS — C palette (dark theme)
// ============================================================================


// ============================================================================
// PROPS
// ============================================================================

interface ProfileHeaderProps {
  profile: ProfileUiModel;
  isEditingName: boolean;
  isSavingName: boolean;
  isEditingBirthdate: boolean;
  isSavingBirthdate: boolean;
  isSavingPhoto: boolean;
  onAvatarPress: () => void;
  onNameEditStart: () => void;
  onNameEditCancel: () => void;
  onNameSave: (name: string) => void;
  onBirthdateEditStart: () => void;
  onBirthdateEditCancel: () => void;
  onBirthdateSave: (birthdate: string) => void;
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
  const [nameInput, setNameInput] = useState(profile.displayName);
  const [birthdateInput, setBirthdateInput] = useState(profile.birthdate ?? '');

  const nameInputRef = useRef<TextInput>(null);
  const birthdateInputRef = useRef<TextInput>(null);

  // ✅ FIX: Get top inset to push content below dynamic island / notch
  const insets = useSafeAreaInsets();

  const avatarUri = resolveAvatarUri(
    profile.firestorePhotoUrl,
    profile.photoURL,
  );
  const birthdateDisplay = formatBirthdate(profile.birthdate);

  React.useEffect(() => {
    if (isEditingName) {
      setNameInput(profile.displayName);
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isEditingName, profile.displayName]);

  React.useEffect(() => {
    if (isEditingBirthdate) {
      setBirthdateInput(profile.birthdate ?? '');
      setTimeout(() => birthdateInputRef.current?.focus(), 50);
    }
  }, [isEditingBirthdate, profile.birthdate]);

  return (
    // ✅ FIX: paddingTop uses insets.top + 16 so avatar clears dynamic island on all iPhones
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* AVATAR */}
      <TouchableOpacity
        style={styles.avatarWrapper}
        onPress={onAvatarPress}
        activeOpacity={0.85}
        disabled={isSavingPhoto}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarInitials}>
            <Text style={styles.initialsText}>{profile.initials}</Text>
          </View>
        )}

        {isSavingPhoto && (
          <View style={styles.avatarOverlay}>
            <ActivityIndicator size="small" color="#FFFFFF" />
          </View>
        )}

        {!isSavingPhoto && (
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeIcon}>📷</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* NAME ROW */}
      {isEditingName ? (
        <View style={styles.inlineEditRow}>
          <TextInput
            ref={nameInputRef}
            style={styles.inlineInput}
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Your name"
            placeholderTextColor={TEXT_MUTED}
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
                <TouchableOpacity
                  style={[styles.inlineActionBtn, styles.confirmBtn]}
                  onPress={() => onNameSave(nameInput)}
                >
                  <Text style={styles.confirmBtnText}>✓</Text>
                </TouchableOpacity>
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

      {/* EMAIL */}
      {!!profile.email && <Text style={styles.email}>{profile.email}</Text>}

      {/* BIRTHDATE ROW */}
      {isEditingBirthdate ? (
        <View style={styles.inlineEditRow}>
          <TextInput
            ref={birthdateInputRef}
            style={styles.inlineInput}
            value={birthdateInput}
            onChangeText={setBirthdateInput}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={TEXT_MUTED}
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
        <TouchableOpacity
          style={styles.addBirthdateRow}
          onPress={onBirthdateEditStart}
          activeOpacity={0.7}
        >
          <Text style={styles.addBirthdateText}>+ Add birthdate</Text>
        </TouchableOpacity>
      )}

      {/* JOINED DATE */}
      <Text style={styles.joinedDate}>Joined {profile.joinedDate}</Text>

      {/* GRADE + STATE PILLS */}
      <View style={styles.pillRow}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {profile.preferences.gradeDisplay}
          </Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {profile.preferences.stateDisplay}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
