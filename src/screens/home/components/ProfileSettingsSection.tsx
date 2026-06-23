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
 * References:
 *   - StateSelectorSheet.tsx   (already built — opened by onGradeEditClick / onStateEditClick)
 *   - HomeScreen.tsx           (logout button style — #7D55FF, borderRadius 12)
 *   - ProfileUiModel.ts        (ProfilePreferencesUiModel type)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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

// ============================================================================
// STYLES
// ============================================================================

const PURPLE       = '#7D55FF';
const PURPLE_LIGHT = '#F0EBFF';
const RED          = '#DC2626'; // ← NEW
const RED_LIGHT    = '#FEF2F2'; // ← NEW

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
  },

  // ---------- Section title ----------
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  // ---------- Settings card ----------
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EBFF',
    // Shadow — iOS
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow — Android
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },

  // ---------- Settings row ----------
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A2E',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valuePill: {
    backgroundColor: PURPLE_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  valuePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
    lineHeight: 22,
  },

  // ---------- Row divider ----------
  rowDivider: {
    height: 1,
    backgroundColor: '#F9F7FF',
    marginHorizontal: 16,
  },

  // ---------- Logout button ----------
  logoutButton: {
    backgroundColor: PURPLE,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12, // ← spacing between logout and delete
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ---------- Delete Account button ----------              ← NEW
  deleteButton: {
    backgroundColor: RED_LIGHT,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: RED,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: RED,
  },
});

export default ProfileSettingsSection;