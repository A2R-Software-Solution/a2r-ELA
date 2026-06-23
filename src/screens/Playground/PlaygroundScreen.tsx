/**
 * Playground Screen
 * ✅ Redesigned with new UI matching design system
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameId, GameResult, GameRewards } from '../../models/GameModels';
import BugCatcherGame from './BugCatcherGame';
import JumbledStoryGame from './JumbledStoryGame';
import DetailDetectiveGame from './DetailDetectiveGame';
import BossBattleGame from './BossBattleGame';
import StayOnTopicGame from './StayOnTopicGame';
import WordSwapGame from './WordSwapGame';
import useGame from '../../hooks/useGame';

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIMARY       = '#6C4DFF';
const PRIMARY_LIGHT = '#EDE9FF';
const WHITE         = '#FFFFFF';
const BG            = '#F8FAFC';
const TEXT_DARK     = '#0F172A';
const TEXT_MID      = '#475569';
const TEXT_GRAY     = '#94A3B8';
const BORDER        = '#E2E8F0';
const GREEN         = '#22C55E';
const ORANGE        = '#F97316';

// ============================================================================
// GAME DATA
// ============================================================================

interface GameCard {
  id:          GameId;
  title:       string;
  emoji:       string;
  domain:      string;
  description: string;
  xpRange:     string;
  bestXp:      number;
  color:       string;
  lightColor:  string;
  aiPowered?:  boolean;
  isWeekly?:   boolean;
}

const GAME_CARDS: GameCard[] = [
  {
    id:          'stay_on_topic',
    title:       'Stay on Topic!',
    emoji:       '🎯',
    domain:      'Focus',
    description: 'Identify sentences that belong to the topic.',
    xpRange:     '20–50 XP',
    bestXp:      850,
    color:       '#3B82F6',
    lightColor:  '#EFF6FF',
  },
  {
    id:          'jumbled_story',
    title:       'Jumbled Story',
    emoji:       '📖',
    domain:      'Organization',
    description: 'Rearrange mixed-up sentences into the correct order.',
    xpRange:     '20–50 XP',
    bestXp:      720,
    color:       '#8A6CFF',
    lightColor:  '#EDE9FF',
  },
  {
    id:          'word_swap',
    title:       'Word Swap',
    emoji:       '✨',
    domain:      'Style',
    description: 'Replace boring words with exciting vocabulary.',
    xpRange:     '20–40 XP',
    bestXp:      680,
    color:       '#F59E0B',
    lightColor:  '#FFFBEB',
  },
  {
    id:          'bug_catcher',
    title:       'Bug Catcher',
    emoji:       '🐛',
    domain:      'Conventions',
    description: 'Find spelling, grammar & punctuation errors.',
    xpRange:     '20–50 XP',
    bestXp:      910,
    color:       '#22C55E',
    lightColor:  '#F0FDF4',
  },
  {
    id:          'detail_detective',
    title:       'Detail Detective',
    emoji:       '🔍',
    domain:      'Content',
    description: 'Expand weak sentences with vivid details.',
    xpRange:     '10–60 XP',
    bestXp:      540,
    color:       '#0EA5E9',
    lightColor:  '#F0F9FF',
    aiPowered:   true,
  },
  {
    id:          'boss_battle',
    title:       'Boss Battle',
    emoji:       '⚔️',
    domain:      'All Skills',
    description: 'Write a full essay and beat your personal best.',
    xpRange:     '50–250 XP',
    bestXp:      1250,
    color:       '#EF4444',
    lightColor:  '#FEF2F2',
    aiPowered:   true,
    isWeekly:    true,
  },
];

// ============================================================================
// REWARD DIALOG
// ============================================================================

interface RewardDialogProps {
  visible: boolean;
  rewards: GameRewards;
  onClose: () => void;
}

const RewardDialog: React.FC<RewardDialogProps> = ({ visible, rewards, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.rewardCard}>

        <Text style={styles.rewardEmoji}>⚡</Text>
        <Text style={styles.rewardXp}>+{rewards.xp_earned} XP</Text>
        <Text style={styles.rewardTotal}>Total: {rewards.total_xp} XP</Text>

        {rewards.level_up && (
          <View style={styles.levelUpBadge}>
            <Text style={styles.levelUpText}>
              🚀 Level Up! → {rewards.level_name}
            </Text>
          </View>
        )}

        {rewards.newly_unlocked_badges.length > 0 && (
          <View style={styles.badgesSection}>
            <Text style={styles.badgesTitle}>Badge Unlocked!</Text>
            {rewards.newly_unlocked_badges.map(badge => (
              <View key={badge.id} style={styles.badgeRow}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDesc}>{badge.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.rewardCloseBtn} onPress={onClose}>
          <Text style={styles.rewardCloseBtnText}>Continue</Text>
        </TouchableOpacity>

      </View>
    </View>
  </Modal>
);

// ============================================================================
// MAIN SCREEN
// ============================================================================

const PlaygroundScreen: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const insets = useSafeAreaInsets();

  const {
    isSubmitting,
    rewards,
    showRewardDialog,
    submitGameResult,
    dismissRewardDialog,
    detailEvaluation,
    showDetailFeedback,
    submitDetailDetective,
    dismissDetailFeedback,
    bossBattleResult,
    showBossRewardDialog,
    submitBossBattle,
    dismissBossRewardDialog,
  } = useGame();

  const handleGameComplete = useCallback(
    async (result: GameResult) => {
      await submitGameResult(result);
      setActiveGame(null);
    },
    [submitGameResult],
  );

  const handleExit        = useCallback(() => setActiveGame(null), []);
  const handleRewardClose = useCallback(() => dismissRewardDialog(), [dismissRewardDialog]);
  const handleDetailClose = useCallback(() => dismissDetailFeedback(), [dismissDetailFeedback]);
  const handleBossClose   = useCallback(() => dismissBossRewardDialog(), [dismissBossRewardDialog]);

  // ── Active game screens ───────────────────────────────────────────────────

  if (activeGame === 'bug_catcher') {
    return <BugCatcherGame onGameComplete={handleGameComplete} onExit={handleExit} />;
  }
  if (activeGame === 'jumbled_story') {
    return <JumbledStoryGame onGameComplete={handleGameComplete} onExit={handleExit} />;
  }
  if (activeGame === 'detail_detective') {
    return (
      <DetailDetectiveGame
        onExit={handleExit}
        isSubmitting={isSubmitting}
        evaluation={detailEvaluation}
        showFeedback={showDetailFeedback}
        rewards={rewards}
        onSubmit={submitDetailDetective}
        onDismissFeedback={handleDetailClose}
      />
    );
  }
  if (activeGame === 'boss_battle') {
    return (
      <BossBattleGame
        onExit={handleExit}
        isSubmitting={isSubmitting}
        bossBattleResult={bossBattleResult}
        showRewardDialog={showBossRewardDialog}
        rewards={rewards}
        onSubmit={submitBossBattle}
        onDismissReward={handleBossClose}
      />
    );
  }
  if (activeGame === 'stay_on_topic') {
    return <StayOnTopicGame onGameComplete={handleGameComplete} onExit={handleExit} />;
  }
  if (activeGame === 'word_swap') {
    return <WordSwapGame onGameComplete={handleGameComplete} onExit={handleExit} />;
  }

  // ── Hub screen ────────────────────────────────────────────────────────────

  const recommended = GAME_CARDS[0]; // Stay on Topic as default recommended

  return (
    <View style={styles.container}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.headerTitle}>Games</Text>
          <Text style={styles.headerSub}>Practice your ELA skills</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 7 Day Streak</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ── Recommended for You ──────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <Text style={styles.sectionSub}>Based on your recent essay</Text>

          <View style={[styles.recommendedCard, { backgroundColor: recommended.lightColor }]}>
            <View style={styles.recommendedLeft}>
              <Text style={styles.recommendedEmoji}>{recommended.emoji}</Text>
              <View style={styles.recommendedInfo}>
                <Text style={[styles.recommendedTitle, { color: recommended.color }]}>
                  {recommended.title}
                </Text>
                <Text style={styles.recommendedDomain}>{recommended.domain}</Text>
                {/* Star rating */}
                <View style={styles.starRow}>
                  {[1,2,3,4,5].map(i => (
                    <Text key={i} style={styles.star}>
                      {i <= 3 ? '⭐' : '☆'}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.recommendedRight}>
              <Text style={styles.recommendedXp}>+50 XP</Text>
              <TouchableOpacity
                style={[styles.playNowBtn, { backgroundColor: recommended.color }]}
                onPress={() => setActiveGame(recommended.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.playNowBtnText}>Play Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── All Games ────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Games</Text>

          <View style={styles.gameList}>
            {GAME_CARDS.map((game, index) => (
              <GameListRow
                key={game.id}
                game={game}
                isLast={index === GAME_CARDS.length - 1}
                onPress={() => setActiveGame(game.id)}
                disabled={isSubmitting}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Reward dialogs */}
      {showRewardDialog && rewards && (
        <RewardDialog
          visible={showRewardDialog}
          rewards={rewards}
          onClose={handleRewardClose}
        />
      )}

    </View>
  );
};

// ============================================================================
// GAME LIST ROW
// ============================================================================

interface GameListRowProps {
  game:     GameCard;
  isLast:   boolean;
  onPress:  () => void;
  disabled: boolean;
}

const GameListRow: React.FC<GameListRowProps> = ({
  game,
  isLast,
  onPress,
  disabled,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    disabled={disabled}
  >
    <View style={[styles.gameRow, !isLast && styles.gameRowBorder]}>

      {/* Icon bubble */}
      <View style={[styles.gameIconBubble, { backgroundColor: game.lightColor }]}>
        <Text style={styles.gameEmoji}>{game.emoji}</Text>
      </View>

      {/* Info */}
      <View style={styles.gameInfo}>
        <View style={styles.gameInfoTop}>
          <Text style={styles.gameTitle}>{game.title}</Text>
          <View style={styles.gameTagRow}>
            {game.aiPowered && (
              <View style={styles.aiTag}>
                <Text style={styles.aiTagText}>AI</Text>
              </View>
            )}
            {game.isWeekly && (
              <View style={styles.weeklyTag}>
                <Text style={styles.weeklyTagText}>Weekly</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={[styles.gameDomain, { color: game.color }]}>
          {game.domain}
        </Text>
      </View>

      {/* Best XP + chevron */}
      <View style={styles.gameRight}>
        <Text style={styles.gameBestXp}>Best: {game.bestXp} XP</Text>
        <Text style={styles.gameChevron}>›</Text>
      </View>

    </View>
  </TouchableOpacity>
);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerTitle: {
    fontSize:   24,
    fontWeight: '800',
    color:      TEXT_DARK,
  },
  headerSub: {
    fontSize:  13,
    color:     TEXT_GRAY,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      20,
    borderWidth:       1,
    borderColor:       '#FED7AA',
  },
  streakText: {
    fontSize:   13,
    fontWeight: '700',
    color:      ORANGE,
  },

  // Scroll
  scrollContent: {
    paddingTop: 16,
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom:      20,
  },
  sectionTitle: {
    fontSize:     18,
    fontWeight:   '700',
    color:        TEXT_DARK,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize:     13,
    color:        TEXT_GRAY,
    marginBottom: 12,
  },

  // Recommended card
  recommendedCard: {
    borderRadius: 20,
    padding:      16,
    flexDirection: 'row',
    alignItems:   'center',
    justifyContent: 'space-between',
  },
  recommendedLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    flex:          1,
    gap:           12,
  },
  recommendedEmoji: {
    fontSize: 40,
  },
  recommendedInfo: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize:   17,
    fontWeight: '800',
    marginBottom: 2,
  },
  recommendedDomain: {
    fontSize:     12,
    color:        TEXT_MID,
    marginBottom: 6,
  },
  starRow: {
    flexDirection: 'row',
    gap:           2,
  },
  star: {
    fontSize: 12,
  },
  recommendedRight: {
    alignItems: 'flex-end',
    gap:        8,
  },
  recommendedXp: {
    fontSize:   13,
    fontWeight: '700',
    color:      PRIMARY,
  },
  playNowBtn: {
    paddingHorizontal: 16,
    paddingVertical:    8,
    borderRadius:      12,
  },
  playNowBtnText: {
    color:      WHITE,
    fontSize:   13,
    fontWeight: '700',
  },

  // Game list
  gameList: {
    backgroundColor: WHITE,
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     BORDER,
    overflow:        'hidden',
  },
  gameRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical:   14,
    paddingHorizontal: 16,
    gap:            12,
  },
  gameRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  // Icon bubble
  gameIconBubble: {
    width:         48,
    height:        48,
    borderRadius:  14,
    justifyContent: 'center',
    alignItems:    'center',
  },
  gameEmoji: {
    fontSize: 24,
  },

  // Game info
  gameInfo: {
    flex: 1,
  },
  gameInfoTop: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
    marginBottom:  3,
  },
  gameTitle: {
    fontSize:   15,
    fontWeight: '700',
    color:      TEXT_DARK,
  },
  gameTagRow: {
    flexDirection: 'row',
    gap:           4,
  },
  aiTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  aiTagText: {
    fontSize:   10,
    fontWeight: '700',
    color:      '#0369A1',
  },
  weeklyTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  weeklyTagText: {
    fontSize:   10,
    fontWeight: '700',
    color:      '#92400E',
  },
  gameDomain: {
    fontSize:   12,
    fontWeight: '600',
  },

  // Game right
  gameRight: {
    alignItems: 'flex-end',
    gap:        4,
  },
  gameBestXp: {
    fontSize:   12,
    fontWeight: '600',
    color:      TEXT_GRAY,
  },
  gameChevron: {
    fontSize: 20,
    color:    TEXT_GRAY,
  },

  // Modal
  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  rewardCard: {
    width:           '85%',
    backgroundColor: WHITE,
    borderRadius:    24,
    padding:         28,
    alignItems:      'center',
    gap:             8,
  },
  rewardEmoji: { fontSize: 48 },
  rewardXp: {
    fontSize:   32,
    fontWeight: '800',
    color:      PRIMARY,
  },
  rewardTotal: {
    fontSize: 14,
    color:    TEXT_GRAY,
  },
  levelUpBadge: {
    backgroundColor:  '#FEF3C7',
    borderRadius:     12,
    paddingHorizontal: 16,
    paddingVertical:   8,
    marginTop:        4,
  },
  levelUpText: {
    fontSize:   14,
    fontWeight: '700',
    color:      '#92400E',
  },
  badgesSection: {
    alignSelf:  'stretch',
    marginTop:  8,
    gap:        8,
  },
  badgesTitle: {
    fontSize:   14,
    fontWeight: '700',
    color:      TEXT_DARK,
  },
  badgeRow: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#F9F7FF',
    borderRadius:    12,
    padding:         10,
    gap:             10,
  },
  badgeIcon: { fontSize: 28 },
  badgeName: {
    fontSize:   14,
    fontWeight: '700',
    color:      TEXT_DARK,
  },
  badgeDesc: {
    fontSize: 12,
    color:    TEXT_GRAY,
  },
  rewardCloseBtn: {
    backgroundColor:   PRIMARY,
    borderRadius:      14,
    paddingVertical:   14,
    paddingHorizontal: 48,
    marginTop:         8,
  },
  rewardCloseBtnText: {
    color:      WHITE,
    fontSize:   16,
    fontWeight: '700',
  },
});

export default PlaygroundScreen;