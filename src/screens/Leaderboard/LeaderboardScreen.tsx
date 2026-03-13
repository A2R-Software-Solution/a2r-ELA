/**
 * Leaderboard Screen
 * Displays the top 10 leaderboard filtered by Grade or State.
 * Assembled from TabSelector, TopThreeCard, and LeaderboardRow components.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
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
// CONSTANTS
// --------------------------------------------------------------------------

const PURPLE = '#6C63FF';

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
      <ActivityIndicator size="large" color={PURPLE} />
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
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          colors={[PURPLE]}
          tintColor={PURPLE}
        />
      }
    >
      {/* Stats bar — total users + current user rank */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalUsers}</Text>
          <Text style={styles.statLabel}>Total Writers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {currentUserRank ? `#${currentUserRank}` : '—'}
          </Text>
          <Text style={styles.statLabel}>Your Rank</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{filterLabel}</Text>
          <Text style={styles.statLabel}>
            {activeTab === 'grade' ? 'Grade' : 'State'}
          </Text>
        </View>
      </View>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <TopThreeCard entries={topThree} />
      )}

      {/* Divider */}
      <View style={styles.listDivider} />

      {/* Ranks 4+ list */}
      {restEntries.length > 0 && (
        <View style={styles.listContainer}>
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
          <Text style={styles.headerSubtitle}>Top 10% writers</Text>
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
  );
};

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex:            1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 16,
    paddingVertical:   12,
    backgroundColor:   '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: '#F4F3FF',
    justifyContent:  'center',
    alignItems:      'center',
    marginRight:     12,
  },
  backIcon: {
    fontSize:   18,
    color:      PURPLE,
    fontWeight: '700',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize:   20,
    fontWeight: '700',
    color:      PURPLE,
  },
  headerSubtitle: {
    fontSize:  12,
    color:     '#9E9E9E',
    marginTop: 1,
  },
  trophyIcon: {
    fontSize: 28,
  },

  // Stats bar
  statsBar: {
    flexDirection:    'row',
    marginHorizontal: 16,
    marginVertical:   8,
    backgroundColor:  '#F4F3FF',
    borderRadius:     12,
    paddingVertical:  12,
  },
  statItem: {
    flex:       1,
    alignItems: 'center',
  },
  statValue: {
    fontSize:   15,
    fontWeight: '700',
    color:      PURPLE,
  },
  statLabel: {
    fontSize:  11,
    color:     '#9E9E9E',
    marginTop: 2,
  },
  statDivider: {
    width:           1,
    marginVertical:  4,
    backgroundColor: '#DDD8FF',
  },

  // List
  listDivider: {
    height:           1,
    backgroundColor:  '#F5F5F5',
    marginHorizontal: 16,
    marginTop:        16,
    marginBottom:     8,
  },
  listContainer: {
    paddingTop: 4,
  },

  // Centered states
  centeredContainer: {
    flex:              1,
    justifyContent:    'center',
    alignItems:        'center',
    paddingHorizontal: 32,
    paddingTop:        60,
  },
  loadingText: {
    marginTop: 12,
    fontSize:  14,
    color:     '#9E9E9E',
  },
  errorEmoji: {
    fontSize:     48,
    marginBottom: 12,
  },
  errorText: {
    fontSize:     14,
    color:        '#757575',
    textAlign:    'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize:     18,
    fontWeight:   '700',
    color:        '#424242',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize:  13,
    color:     '#9E9E9E',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor:   PURPLE,
    paddingHorizontal: 24,
    paddingVertical:   10,
    borderRadius:      10,
  },
  retryText: {
    color:      '#FFFFFF',
    fontWeight: '700',
    fontSize:   14,
  },

  // Bottom padding
  bottomPadding: {
    height: 32,
  },
});

export default LeaderboardScreen;