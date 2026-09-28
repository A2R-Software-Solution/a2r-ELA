import { styles } from './ProfileSettingsSection.styles';
/**
 * ProfileSettingsSection
 * Bottom settings area of the profile screen.
 *
 * Renders:
 *   - Section header "Settings"
 *   - Grade row — label left, tappable grade pill right
 *   - State row — label left, tappable state pill right
 *   - Divider
 *   - Logout button
 *   - Delete Account button                                          ← NEW
 *
 * Pure presentational component — no logic, no API calls.
 * All actions are passed in as props and handled by useProfile.ts.
 *
 * ✅ UPDATED: Dark C-palette theme (glassy purple surface, light-on-dark text)
 *
 * References:
 *   - StateSelectorSheet.tsx   (already built — opened by onGradeEditClick / onStateEditClick)
 *   - HomeScreen.tsx           (logout button style — #7D55FF, borderRadius 12)
 *   - ProfileUiModel.ts        (ProfilePreferencesUiModel type)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProfilePreferencesUiModel } from '../../../models/ui/ProfileUiModel';

// ============================================================================
// PROPS
// ============================================================================

interface ProfileSettingsSectionProps {
  preferences: ProfilePreferencesUiModel;

  /** Opens StateSelectorSheet — handles both state and grade together */
  onEditPreferencesClick: () => void;

  /** Signs out the current user */
  onLogoutClick: () => void;

  /** Permanently deletes the account — shows confirmation Alert before proceeding */
  onDeleteAccountClick: () => void; // ← NEW
}

// ============================================================================
// COMPONENT
// ============================================================================

const ProfileSettingsSection: React.FC<ProfileSettingsSectionProps> = ({
  preferences,
  onEditPreferencesClick,
  onLogoutClick,
  onDeleteAccountClick, // ← NEW
}) => {
  return (
    <View style={styles.container}>

      {/* Section header */}
      <Text style={styles.sectionTitle}>Settings</Text>

      {/* Settings card */}
      <View style={styles.card}>

        {/* Grade row */}
        <SettingsRow
          label="Grade"
          valueDisplay={preferences.gradeDisplay}
          onPress={onEditPreferencesClick}
        />

        <RowDivider />

        {/* State row */}
        <SettingsRow
          label="State"
          valueDisplay={preferences.stateDisplay}
          onPress={onEditPreferencesClick}
        />

      </View>

      {/* Logout button — matches HomeScreen.tsx logout style exactly */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogoutClick}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Delete Account button — red, destructive action */}
      <TouchableOpacity                                          
        style={styles.deleteButton}
        onPress={onDeleteAccountClick}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

    </View>
  );
};

// ============================================================================
// SETTINGS ROW SUB-COMPONENT
// A single label + tappable pill row.
// Tapping opens the relevant selector sheet (handled by parent via onPress).
// ============================================================================

interface SettingsRowProps {
  label: string;
  valueDisplay: string;
  onPress: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  valueDisplay,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.row}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {/* Label */}
    <Text style={styles.rowLabel}>{label}</Text>

    {/* Value pill + chevron */}
    <View style={styles.rowRight}>
      <View style={styles.valuePill}>
        <Text style={styles.valuePillText}>{valueDisplay}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </View>
  </TouchableOpacity>
);

// ============================================================================
// ROW DIVIDER SUB-COMPONENT
// Thin horizontal line between settings rows inside the card.
// ============================================================================

const RowDivider: React.FC = () => <View style={styles.rowDivider} />;

 // ← brightened for visibility on dark bg
 // ← NEW (was RED_LIGHT solid)

export default ProfileSettingsSection;
