import ScreenBackground from '../../components/ScreenBackground';
import { styles, PURPLE_SOFT, BASE_BG } from './LeaderboardScreen.styles';
/**
 * Leaderboard Screen
 * Displays the top 10 leaderboard filtered by Grade or State.
 * Assembled from TabSelector, TopThreeCard, and LeaderboardRow components.
 *
 * ✅ UPDATED: Restyled to match HomeScreen's dark gradient theme
 *    (Red-Orange + Emerald + Deep Purple radial blooms over near-black base)
 */

import React from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import TabSelector from './components/TabSelector';
import TopThreeCard from './components/TopThreeCard';
import LeaderboardRow from './components/LeaderboardRow';
import useLeaderboard from './hooks/useLeaderboard';

// --------------------------------------------------------------------------
// PROPS
// --------------------------------------------------------------------------

interface LeaderboardScreenProps {
  onBackClick: () => void;
}

// --------------------------------------------------------------------------
// CONSTANTS — matched to HomeScreen palette
// --------------------------------------------------------------------------

        // primary accent (matches HomeScreen retry button / icons)
   // secondary accent (matches HomeScreen placeholder text)
       // deepest base — near black with purple tint

// --------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  onBackClick,
}) => {
  const {
    activeTab,
    isLoading,
    errorMessage,
    entries,
    currentUserRank,
    filterLabel,
    totalUsers,
    onTabChange,
    onRefresh,
  } = useLeaderboard();

  // Entries for top 3 podium
  const topThree = entries.filter(e => e.rank <= 3);

  // Entries for the list below (rank 4+)
  // Also includes current user if they are outside top 10 (rank appended by backend)
  const restEntries = entries.filter(e => e.rank > 3);

  // --------------------------------------------------------------------------
  // RENDER — LOADING
  // --------------------------------------------------------------------------

  const renderLoading = () => (
    <View style={styles.centeredContainer}>
      <ActivityIndicator size="large" color={PURPLE_SOFT} />
      <Text style={styles.loadingText}>Loading leaderboard...</Text>
    </View>
  );

  // --------------------------------------------------------------------------
  // RENDER — ERROR
  // --------------------------------------------------------------------------

  const renderError = () => (
    <View style={styles.centeredContainer}>
      <Text style={styles.errorEmoji}>😕</Text>
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // --------------------------------------------------------------------------
  // RENDER — EMPTY
  // --------------------------------------------------------------------------

  const renderEmpty = () => (
    <View style={styles.centeredContainer}>
      <Text style={styles.errorEmoji}>🏆</Text>
      <Text style={styles.emptyText}>No one here yet!</Text>
      <Text style={styles.emptySubText}>
        Be the first to submit an essay and claim the top spot.
      </Text>
    </View>
  );

  // --------------------------------------------------------------------------
  // RENDER — MAIN CONTENT
  // --------------------------------------------------------------------------

  const renderContent = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          colors={[PURPLE_SOFT]}
          tintColor={PURPLE_SOFT}
        />
      }
    >
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>🏆 Leaderboard</Text>
          <Text style={styles.heroSubtitle}>
            Compete with top writers
          </Text>
        </View>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroValue}>
              {currentUserRank ? `#${currentUserRank}` : '--'}
            </Text>
            <Text style={styles.heroLabel}>Your Rank</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroStat}>
            <Text style={styles.heroValue}>
              {totalUsers}
            </Text>
            <Text style={styles.heroLabel}>Writers</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroStat}>
            <Text style={styles.heroValue}>
              {filterLabel}
            </Text>
            <Text style={styles.heroLabel}>
              {activeTab === 'grade' ? 'Grade' : 'State'}
            </Text>
          </View>
        </View>
      </View>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <View style={styles.podiumContainer}>
          <TopThreeCard entries={topThree} />
        </View>
      )}

      {/* Divider */}
      <View style={styles.listDivider} />

      {/* Ranks 4+ list */}
      {restEntries.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            Top Writers
          </Text>
          {restEntries.map(entry => (
            <LeaderboardRow key={`${entry.rank}-${entry.display_name}`} entry={entry} />
          ))}
        </View>
      )}

      {/* Bottom padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );

  // --------------------------------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------------------------------

  return (
    <View style={styles.root}>
      {/* ── Background color layers (matches HomeScreen C palette) ── */}
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={BASE_BG} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackClick}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <Text style={styles.headerSubtitle}>
              Climb the ranks and earn XP
            </Text>
          </View>
          <Text style={styles.trophyIcon}>🏆</Text>
        </View>

        {/* Tab Selector */}
        <TabSelector
          activeTab={activeTab}
          onTabChange={onTabChange}
          gradeLabel={
            activeTab === 'grade' && filterLabel
              ? filterLabel
              : 'My Grade'
          }
          stateLabel={
            activeTab === 'state' && filterLabel
              ? filterLabel
              : 'My State'
          }
        />

        {/* Body */}
        {isLoading && entries.length === 0
          ? renderLoading()
          : errorMessage
          ? renderError()
          : entries.length === 0
          ? renderEmpty()
          : renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default LeaderboardScreen;
