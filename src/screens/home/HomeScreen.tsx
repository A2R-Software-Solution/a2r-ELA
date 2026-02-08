/**
 * Home Screen
 * Main home screen with tabs and content sections
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useHome } from './hooks/useHome';
import { HomeTab } from './types/HomeUiState';
import HomeHeader from './components/HomeHeader';
import StreakCard from './components/StreakCard';
import CategorySection from './components/CategorySection';
import FeatureGrid from './components/FeatureGrid';
import RecentCourses from './components/RecentCourses';
import BottomNavigationBar from './components/BottomNavigationBar';
import { CourseUiModel } from '../../models/ui/CourseUiModel';
import { FeatureUiModel } from '../../models/ui/FeatureUiModel';
import { CategoryUiModel } from '../../models/ui/CategoryUiModel';

interface HomeScreenProps {
  onLogoutClick?: () => void;
  onCourseClick?: (course: CourseUiModel) => void;
  onFeatureClick?: (feature: FeatureUiModel) => void;
  onCategoryClick?: (category: CategoryUiModel) => void;
  onSeeAllCategories?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onEssayWritingClick?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onLogoutClick = () => {},
  onCourseClick = () => {},
  onFeatureClick = () => {},
  onCategoryClick = () => {},
  onSeeAllCategories = () => {},
  onNotificationClick = () => {},
  onProfileClick = () => {},
  onEssayWritingClick = () => {},
}) => {
  const { uiState, onTabSelected, onCategorySelected } = useHome();

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
      {/* Main Content */}
      <View style={styles.content}>
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
          />
        )}

        {uiState.selectedTab === HomeTab.PLAYGROUND && <PlaygroundContent />}
        {uiState.selectedTab === HomeTab.INBOX && <InboxContent />}
        {uiState.selectedTab === HomeTab.PROFILE && (
          <ProfileContent onLogoutClick={onLogoutClick} />
        )}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigationBar
        selectedTab={uiState.selectedTab}
        onTabSelected={onTabSelected}
      />
    </View>
  );
};

// Home Tab Content
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
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader
        username={username}
        onProfileClick={onProfileClick}
        onNotificationClick={onNotificationClick}
      />

      <StreakCard
        currentStreak={streak.currentStreak}
        totalDays={streak.totalDays}
      />

      <CategorySection
        categories={categories}
        onCategoryClick={onCategoryClick}
        onSeeAllClick={onSeeAllCategories}
      />

      <FeatureGrid
        features={features}
        onFeatureClick={onFeatureClick}
      />

      <RecentCourses
        courses={recentCourses}
        onCourseClick={onCourseClick}
      />

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

// Playground Tab Content
const PlaygroundContent: React.FC = () => {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Playground Screen</Text>
    </View>
  );
};

// Inbox Tab Content
const InboxContent: React.FC = () => {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Inbox Screen</Text>
    </View>
  );
};

// Profile Tab Content
interface ProfileContentProps {
  onLogoutClick: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ onLogoutClick }) => {
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileTitle}>Profile</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogoutClick}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#7D55FF',
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;