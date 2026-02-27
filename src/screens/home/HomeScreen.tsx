/**
 * Home Screen
 * Main home screen with tabs and content sections.
 *
 * Changes from original:
 *   - ProfileContent replaced with fully assembled ProfileScreen
 *   - useProfile hook wired in
 *   - StateSelectorSheet integrated for grade/state editing
 *   - ProfileHeader receives name/birthdate/photo edit props
 *   - All other tabs (HOME, PLAYGROUND, INBOX) completely unchanged
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useHome } from './hooks/useHome';
import { useProfile } from './hooks/useProfile';
import { HomeTab } from './types/HomeUiState';
import HomeHeader from './components/HomeHeader';
import StreakCard from './components/StreakCard';
import CategorySection from './components/CategorySection';
import FeatureGrid from './components/FeatureGrid';
import RecentCourses from './components/RecentCourses';
import BottomNavigationBar from './components/BottomNavigationBar';
import StateSelectorSheet from './../Essay/components/StateSelectorSheet';
import ProfileHeader from './components/ProfileHeader';
import StatsRow from './components/StatsRow';
import RecentEssaysList from './components/RecentEssaysList';
import ProfileSettingsSection from './components/ProfileSettingsSection';
import { CourseUiModel } from '../../models/ui/CourseUiModel';
import { FeatureUiModel } from '../../models/ui/FeatureUiModel';
import { CategoryUiModel } from '../../models/ui/CategoryUiModel';

// ============================================================================
// HOME SCREEN PROPS — unchanged
// ============================================================================

interface HomeScreenProps {
  onLogoutClick?: () => void;
  onCourseClick?: (course: CourseUiModel) => void;
  onFeatureClick?: (feature: FeatureUiModel) => void;
  onCategoryClick?: (category: CategoryUiModel) => void;
  onSeeAllCategories?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onEssayWritingClick?: () => void;
  onSeeAllEssaysClick?: () => void;
}

// ============================================================================
// HOME SCREEN
// ============================================================================

const HomeScreen: React.FC<HomeScreenProps> = ({
  onLogoutClick = () => {},
  onCourseClick = () => {},
  onFeatureClick = () => {},
  onCategoryClick = () => {},
  onSeeAllCategories = () => {},
  onNotificationClick = () => {},
  onProfileClick = () => {},
  onEssayWritingClick = () => {},
  onSeeAllEssaysClick = () => {},
}) => {
  const { uiState, onTabSelected, onCategorySelected } = useHome();

  // Profile hook — initialized here so state persists across tab switches
  const profile = useProfile();

  const handleFeatureClick = (feature: FeatureUiModel) => {
    if (feature.title === 'Essay Writing') {
      onEssayWritingClick();
    } else {
      onFeatureClick(feature);
    }
  };

  const handleCategoryClick = (category: CategoryUiModel) => {
    onCategorySelected(category);
    onCategoryClick(category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* HOME TAB — unchanged */}
        {uiState.selectedTab === HomeTab.HOME && (
          <HomeContent
            username={uiState.username}
            streak={uiState.streak}
            categories={uiState.categories}
            features={uiState.features}
            recentCourses={uiState.recentCourses}
            onCourseClick={onCourseClick}
            onFeatureClick={handleFeatureClick}
            onCategoryClick={handleCategoryClick}
            onSeeAllCategories={onSeeAllCategories}
            onNotificationClick={onNotificationClick}
            onProfileClick={onProfileClick}
            xp={uiState.xp}                      
            level={uiState.level}                 
            levelName={uiState.levelName}         
            isLoadingXp={uiState.isLoadingXp}     
          />
        )}

        {/* PLAYGROUND TAB — unchanged */}
        {uiState.selectedTab === HomeTab.PLAYGROUND && <PlaygroundContent />}

        {/* INBOX TAB — unchanged */}
        {uiState.selectedTab === HomeTab.INBOX && <InboxContent />}

        {/* PROFILE TAB */}
        {uiState.selectedTab === HomeTab.PROFILE && (
          <ProfileScreen
            profileHook={profile}
            onSeeAllEssaysClick={onSeeAllEssaysClick}
          />
        )}

      </View>

      <BottomNavigationBar
        selectedTab={uiState.selectedTab}
        onTabSelected={onTabSelected}
      />
    </View>
  );
};

// ============================================================================
// HOME TAB CONTENT — unchanged
// ============================================================================

interface HomeContentProps {
  username: string;
  streak: { currentStreak: number; totalDays: number };
  categories: CategoryUiModel[];
  features: FeatureUiModel[];
  recentCourses: CourseUiModel[];
  onCourseClick: (course: CourseUiModel) => void;
  onFeatureClick: (feature: FeatureUiModel) => void;
  onCategoryClick: (category: CategoryUiModel) => void;
  onSeeAllCategories: () => void;
  onNotificationClick: () => void;
  onProfileClick: () => void;
  // Gamification props
  xp: number;
  level: number;
  levelName: string;
  isLoadingXp: boolean;
}

const HomeContent: React.FC<HomeContentProps> = ({
  username,
  streak,
  categories,
  features,
  recentCourses,
  onCourseClick,
  onFeatureClick,
  onCategoryClick,
  onSeeAllCategories,
  onNotificationClick,
  onProfileClick,
  xp,
  level,
  levelName,
  isLoadingXp
}) => (
  <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
    <HomeHeader
      username={username}
      onProfileClick={onProfileClick}
      onNotificationClick={onNotificationClick}
    />
    <StreakCard
      xp={xp}
      level={level}
      levelName={levelName}
      isLoadingXp={isLoadingXp}
    />
    <CategorySection
      categories={categories}
      onCategoryClick={onCategoryClick}
      onSeeAllClick={onSeeAllCategories}
    />
    <FeatureGrid features={features} onFeatureClick={onFeatureClick} />
    <RecentCourses courses={recentCourses} onCourseClick={onCourseClick} />
    <View style={{ height: 80 }} />
  </ScrollView>
);

// ============================================================================
// PLACEHOLDER TABS — unchanged
// ============================================================================

const PlaygroundContent: React.FC = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Playground Screen</Text>
  </View>
);

const InboxContent: React.FC = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Inbox Screen</Text>
  </View>
);

// ============================================================================
// PROFILE SCREEN
// ============================================================================

interface ProfileScreenProps {
  profileHook: ReturnType<typeof useProfile>;
  onSeeAllEssaysClick: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profileHook,
  onSeeAllEssaysClick,
}) => {
  const {
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
  } = profileHook;

  // ---------- Loading ----------
  if (uiState.isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#7D55FF" />
      </View>
    );
  }

  // ---------- Error ----------
  if (uiState.error || !uiState.profile) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>
          {uiState.error ?? 'Something went wrong'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { profile } = uiState;

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.profileScrollContent}
      >
        {/* Avatar + name + email + birthdate + joined + pills */}
        <ProfileHeader
          profile={profile}
          isEditingName={uiState.isEditingName}
          isSavingName={uiState.isSavingName}
          isEditingBirthdate={uiState.isEditingBirthdate}
          isSavingBirthdate={uiState.isSavingBirthdate}
          isSavingPhoto={uiState.isSavingPhoto}
          onAvatarPress={onAvatarPress}
          onNameEditStart={onNameEditStart}
          onNameEditCancel={onNameEditCancel}
          onNameSave={onNameSave}
          onBirthdateEditStart={onBirthdateEditStart}
          onBirthdateEditCancel={onBirthdateEditCancel}
          onBirthdateSave={onBirthdateSave}
        />

        <StatsRow stats={profile.stats} />

        <RecentEssaysList
          essays={profile.recentEssays}
          onSeeAllClick={onSeeAllEssaysClick}
        />

        <ProfileSettingsSection
          preferences={profile.preferences}
          onEditPreferencesClick={onEditPreferencesClick}
          onLogoutClick={onLogoutClick}
        />

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* State + grade selector sheet */}
      <StateSelectorSheet
        isVisible={uiState.isSelectorSheetOpen}
        onClose={onSelectorSheetClose}
        onSave={onPreferencesSaved}
        currentState={profile.preferences.state}
        currentGrade={profile.preferences.grade}
        stateOptions={stateOptions}
        gradeOptions={gradeOptions}
      />
    </>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666666',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#7D55FF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  profileScrollContent: {
    backgroundColor: '#F9F7FF',
  },
});

export default HomeScreen;