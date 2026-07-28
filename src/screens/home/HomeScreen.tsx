/**
 * Home Screen
 * ✅ Updated with new UI components
 * ✅ ExamPrepScreen wired to EXAM_PREP tab
 * ✅ Continue → CreateCustomTest
 * ✅ FIXED: Bottom navigation overlap, scroll padding, layout issues
 * ✅ UPDATED: Background color to C — Red-Orange + Emerald + Deep Purple
 */

import React, { useEffect } from 'react';
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
import FeatureGrid from './components/FeatureGrid';
import TodaysPlan from './components/TodaysPlan';
import RecentActivity from './components/RecentActivity';
import BottomNavigationBar from './components/BottomNavigationBar';
import StateSelectorSheet from './../Essay/components/StateSelectorSheet';
import ProfileHeader from './components/ProfileHeader';
import StatsRow from './components/StatsRow';
import BadgeCollection from './components/BadgeCollection';
import RecentEssaysList from './components/RecentEssaysList';
import ProfileSettingsSection from './components/ProfileSettingsSection';
import { tabEvents } from '../../utils/tabEvents';
import { FeatureUiModel } from '../../models/ui/FeatureUiModel';
import { CategoryUiModel } from '../../models/ui/CategoryUiModel';
import { CourseUiModel } from '../../models/ui/CourseUiModel';
import PlaygroundScreen from '../Playground/PlaygroundScreen';
import { RecentEssayUiItem } from '../../models/ui/ProfileUiModel';
import ExamPrepScreen from '../ExamPrep/ExamPrepScreen';

// ============================================================================
// PROPS
// ============================================================================

interface HomeScreenProps {
  onLogoutClick?:             () => void;
  onDeleteAccountClick?:      () => void;
  onCourseClick?:             (course: CourseUiModel) => void;
  onFeatureClick?:            (feature: FeatureUiModel) => void;
  onCategoryClick?:           (category: CategoryUiModel) => void;
  onSeeAllCategories?:        () => void;
  onEssayWritingClick?:       () => void;
  onSeeAllEssaysClick?:       () => void;
  onCreateCustomTestClick?:   () => void;
}

// ============================================================================
// HOME SCREEN
// ============================================================================

const HomeScreen: React.FC<HomeScreenProps> = ({
  onLogoutClick            = () => {},
  onDeleteAccountClick     = () => {},
  onCourseClick            = () => {},
  onFeatureClick           = () => {},
  onCategoryClick          = () => {},
  onSeeAllCategories       = () => {},
  onEssayWritingClick      = () => {},
  onSeeAllEssaysClick      = () => {},
  onCreateCustomTestClick  = () => {},
}) => {
  const { uiState, onTabSelected, onCategorySelected, onFeaturePress } = useHome();

  const profile = useProfile({
    onLogoutSuccess:        onLogoutClick,
    onDeleteAccountSuccess: onDeleteAccountClick,
  });

  useEffect(() => {
    const handleSwitchTab = (tab: string) => {
      switch (tab) {
        case 'PLAYGROUND': onTabSelected(HomeTab.PLAYGROUND); break;
        case 'HOME':       onTabSelected(HomeTab.HOME);       break;
        case 'INBOX':      onTabSelected(HomeTab.INBOX);      break;
        case 'PROFILE':    onTabSelected(HomeTab.PROFILE);    break;
        case 'EXAM_PREP':  onTabSelected(HomeTab.EXAM_PREP);  break;
        default: break;
      }
    };

    tabEvents.on('switchTab', handleSwitchTab);
    return () => tabEvents.off('switchTab', handleSwitchTab);
  }, [onTabSelected]);

  const handleFeatureClick = (feature: FeatureUiModel) => {
    onFeaturePress(feature.id, {
      navigate: (screen: string) => {
        if (screen === 'Leaderboard') {
          onFeatureClick(feature);
        } else if (screen === 'EssayWriting') {
          onEssayWritingClick();
        }
      },
    });
  };

  const handleCategoryClick = (category: CategoryUiModel) => {
    onCategorySelected(category);
    onCategoryClick(category);
  };

  return (
    <View style={styles.container}>

      {/* ── Background color layers (C palette) ── */}
      <View style={styles.bgBase} />
      <View style={styles.bgOrangeRed} />
      <View style={styles.bgEmerald} />
      <View style={styles.bgPurple} />

      <View style={styles.content}>

        {uiState.selectedTab === HomeTab.HOME && (
          <HomeContent
            username={uiState.username}
            features={uiState.features}
            recentEssays={uiState.recentEssays}
            onFeatureClick={handleFeatureClick}
            onPlayGameClick={() => onTabSelected(HomeTab.PLAYGROUND)}
            xp={uiState.xp}
            level={uiState.level}
            levelName={uiState.levelName}
            isLoadingXp={uiState.isLoadingXp}
          />
        )}

        {uiState.selectedTab === HomeTab.PLAYGROUND && (
          <PlaygroundContent />
        )}

        {uiState.selectedTab === HomeTab.INBOX && (
          <InboxContent />
        )}

        {uiState.selectedTab === HomeTab.EXAM_PREP && (
          <ExamPrepContent
            onNavigateToCreateTest={onCreateCustomTestClick}
            onBackClick={() => onTabSelected(HomeTab.HOME)}
          />
        )}

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
// HOME TAB CONTENT
// ============================================================================

interface HomeContentProps {
  username:         string;
  features:         FeatureUiModel[];
  recentEssays:     RecentEssayUiItem[];
  onFeatureClick:   (feature: FeatureUiModel) => void;
  onPlayGameClick?: () => void;
  xp:               number;
  level:            number;
  levelName:        string;
  isLoadingXp:      boolean;
}

const HomeContent: React.FC<HomeContentProps> = ({
  username,
  features,
  recentEssays,
  onFeatureClick,
  onPlayGameClick,
  xp,
  level,
  levelName,
  isLoadingXp,
}) => (
  <ScrollView
    style={styles.scrollView}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.scrollContent}
    scrollEventThrottle={16}
  >
    <HomeHeader username={username} />
    <StreakCard
      xp={xp}
      level={level}
      levelName={levelName}
      isLoadingXp={isLoadingXp}
    />
    <TodaysPlan onPlayGameClick={onPlayGameClick} />
    <FeatureGrid
      features={features}
      onFeatureClick={onFeatureClick}
    />
    <RecentActivity essays={recentEssays} />
  </ScrollView>
);

// ============================================================================
// EXAM PREP CONTENT
// ============================================================================

interface ExamPrepContentProps {
  onNavigateToCreateTest: () => void;
  onBackClick:            () => void;
}

const ExamPrepContent: React.FC<ExamPrepContentProps> = ({
  onNavigateToCreateTest,
  onBackClick,
}) => (
  <ExamPrepScreen
    onStartPractice={onNavigateToCreateTest}
    onBackClick={onBackClick}
  />
);

// ============================================================================
// PLACEHOLDER TABS
// ============================================================================

const PlaygroundContent: React.FC = () => <PlaygroundScreen />;

const InboxContent: React.FC = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Coming Soon</Text>
  </View>
);

// ============================================================================
// PROFILE SCREEN
// ============================================================================

interface ProfileScreenProps {
  profileHook:         ReturnType<typeof useProfile>;
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
    onDeleteAccountClick,
    stateOptions,
    gradeOptions,
  } = profileHook;

  if (uiState.isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#7C5CFC" />
      </View>
    );
  }

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
        scrollEventThrottle={16}
      >
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
        <BadgeCollection badges={uiState.badgeProgress} />
        <RecentEssaysList
          essays={profile.recentEssays}
          onSeeAllClick={onSeeAllEssaysClick}
        />
        <ProfileSettingsSection
          preferences={profile.preferences}
          onEditPreferencesClick={onEditPreferencesClick}
          onLogoutClick={onLogoutClick}
          onDeleteAccountClick={onDeleteAccountClick}
        />
      </ScrollView>

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

  // ── Root container ──────────────────────────────────────────────────────
  container: {
    flex:            1,
    backgroundColor: '#07050E', // deepest base — near black with purple tint
  },

  // ── Background layers (C palette: red-orange + emerald + deep purple) ───
  //
  //  We stack 3 absolute Views on top of the base black,
  //  each simulating one radial color zone:
  //
  //   bgOrangeRed  → bottom-left  (red-orange)
  //   bgEmerald    → bottom-right (emerald green)
  //   bgPurple     → top-center  (deep purple)
  //
  //  Opacity kept at 0.55–0.65 so they feel atmospheric, not neon.

  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#07050E',
  },

  // Red-orange bloom — bottom-left corner
  bgOrangeRed: {
    position:        'absolute',
    bottom:          -120,
    left:            -80,
    width:           320,
    height:          320,
    borderRadius:    160,
    backgroundColor: '#D93A00',
    opacity:         0.38,
  },

  // Emerald bloom — bottom-right corner
  bgEmerald: {
    position:        'absolute',
    bottom:          -100,
    right:           -60,
    width:           280,
    height:          280,
    borderRadius:    140,
    backgroundColor: '#005C25',
    opacity:         0.42,
  },

  // Deep purple bloom — top center
  bgPurple: {
    position:        'absolute',
    top:             -100,
    left:            '25%',
    width:           300,
    height:          300,
    borderRadius:    150,
    backgroundColor: '#4A007A',
    opacity:         0.45,
  },

  // ── Layout ──────────────────────────────────────────────────────────────
  content: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    backgroundColor:   'transparent', // ← was '#12102A', now transparent so bg layers show through
    paddingBottom:     100,
    flexGrow:          1,
  },

  profileScrollContent: {
    backgroundColor: 'transparent', // ← was '#12102A'
    paddingBottom:   100,
    flexGrow:        1,
  },

  // ── Placeholder / error states ───────────────────────────────────────────
  placeholderContainer: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: 'transparent', // ← was '#12102A'
  },

  placeholderText: {
    fontSize: 18,
    color:    '#A78BFA',
  },

  centeredContainer: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         24,
    backgroundColor: 'transparent', // ← was '#12102A'
  },

  errorText: {
    fontSize:     15,
    color:        'rgba(255,255,255,0.55)',
    textAlign:    'center',
    marginBottom: 20,
    lineHeight:   22,
  },

  retryButton: {
    backgroundColor:   '#7C5CFC',
    paddingHorizontal: 32,
    paddingVertical:   12,
    borderRadius:      12,
  },

  retryText: {
    color:      '#FFFFFF',
    fontSize:   15,
    fontWeight: '600',
  },
});

export default HomeScreen;