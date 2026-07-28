/**
 * Leaderboard Screen
 * Displays the top 10 leaderboard filtered by Grade or State.
 * Assembled from TabSelector, TopThreeCard, and LeaderboardRow components.
 *
 * ✅ UPDATED: Restyled to match HomeScreen's dark gradient theme
 *    (Red-Orange + Emerald + Deep Purple radial blooms over near-black base)
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
// CONSTANTS — matched to HomeScreen palette
// --------------------------------------------------------------------------

const PURPLE = '#7C5CFC';        // primary accent (matches HomeScreen retry button / icons)
const PURPLE_SOFT = '#A78BFA';   // secondary accent (matches HomeScreen placeholder text)
const BASE_BG = '#07050E';       // deepest base — near black with purple tint

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
      <View style={styles.bgBase} />
      <View style={styles.bgOrangeRed} />
      <View style={styles.bgEmerald} />
      <View style={styles.bgPurple} />

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

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  // ── Root + background layers ─────────────────────────────────────────
  root: {
    flex: 1,
  },
  safeArea: {
    flex:            1,
    backgroundColor: 'transparent',
  },

  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BASE_BG,
  },
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

  // Header
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 16,
    paddingVertical:   12,
    backgroundColor:   'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: 'rgba(124,92,252,0.18)',
    justifyContent:  'center',
    alignItems:      'center',
    marginRight:     12,
  },
  backIcon: {
    fontSize:   18,
    color:      PURPLE_SOFT,
    fontWeight: '700',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize:   20,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
  headerSubtitle: {
    fontSize:  12,
    color:     'rgba(255,255,255,0.55)',
    marginTop: 1,
  },
  trophyIcon: {
    fontSize: 28,
  },

  // Hero Card
  heroCard: {
    marginHorizontal: 16,
    marginTop:        8,
    padding:          18,
    borderRadius:     20,
    backgroundColor:  'rgba(124,92,252,0.22)',
    borderWidth:      1,
    borderColor:      'rgba(167,139,250,0.3)',
  },
  heroHeader: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize:   20,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
  heroSubtitle: {
    color:     'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  heroStatsRow: {
    flexDirection: 'row',
  },
  heroStat: {
    flex:       1,
    alignItems: 'center',
  },
  heroValue: {
    color:      '#FFFFFF',
    fontWeight: '700',
    fontSize:   16,
  },
  heroLabel: {
    color:     'rgba(255,255,255,0.6)',
    fontSize:  11,
    marginTop: 4,
  },
  heroDivider: {
    width:           1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  // Podium
  podiumContainer: {
    marginTop:    20,
    marginBottom: 12,
  },

  // List
  listDivider: {
    height:           1,
    backgroundColor:  'rgba(255,255,255,0.08)',
    marginHorizontal: 16,
    marginTop:        16,
    marginBottom:     8,
  },
  listContainer: {
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize:         18,
    fontWeight:       '700',
    color:            '#FFFFFF',
    marginHorizontal: 16,
    marginBottom:     8,
  },

  // Scroll content
  scrollContent: {
    backgroundColor: 'transparent',
  },

  // Centered states
  centeredContainer: {
    flex:              1,
    justifyContent:    'center',
    alignItems:        'center',
    paddingHorizontal: 32,
    paddingTop:        60,
    backgroundColor:   'transparent',
  },
  loadingText: {
    marginTop: 12,
    fontSize:  14,
    color:     'rgba(255,255,255,0.55)',
  },
  errorEmoji: {
    fontSize:     48,
    marginBottom: 12,
  },
  errorText: {
    fontSize:     14,
    color:        'rgba(255,255,255,0.55)',
    textAlign:    'center',
    marginBottom: 16,
    lineHeight:   20,
  },
  emptyText: {
    fontSize:     18,
    fontWeight:   '700',
    color:        '#FFFFFF',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize:  13,
    color:     'rgba(255,255,255,0.55)',
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