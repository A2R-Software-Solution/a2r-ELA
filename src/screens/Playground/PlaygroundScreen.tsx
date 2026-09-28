import ScreenBackground from '../../components/ScreenBackground';
import { styles } from './PlaygroundScreen.styles';
/**
 * Playground Screen
 * ✅ Redesigned with new UI matching design system
 * ✅ UPDATED: Background matched to HomeScreen C palette (Red-Orange + Emerald + Deep Purple)
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
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
// CONSTANTS — C palette (matches HomeScreen exactly)
// ============================================================================

 // deepest base — near black with purple tint
 // violet accent

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
  bgColor:     string; // dark-friendly tinted bubble bg
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
    color:       '#60A5FA',
    bgColor:     'rgba(59,130,246,0.15)',
  },
  {
    id:          'jumbled_story',
    title:       'Jumbled Story',
    emoji:       '📖',
    domain:      'Organization',
    description: 'Rearrange mixed-up sentences into the correct order.',
    xpRange:     '20–50 XP',
    bestXp:      720,
    color:       '#A78BFA',
    bgColor:     'rgba(138,108,255,0.15)',
  },
  {
    id:          'word_swap',
    title:       'Word Swap',
    emoji:       '✨',
    domain:      'Style',
    description: 'Replace boring words with exciting vocabulary.',
    xpRange:     '20–40 XP',
    bestXp:      680,
    color:       '#FCD34D',
    bgColor:     'rgba(245,158,11,0.15)',
  },
  {
    id:          'bug_catcher',
    title:       'Bug Catcher',
    emoji:       '🐛',
    domain:      'Conventions',
    description: 'Find spelling, grammar & punctuation errors.',
    xpRange:     '20–50 XP',
    bestXp:      910,
    color:       '#4ADE80',
    bgColor:     'rgba(34,197,94,0.15)',
  },
  {
    id:          'detail_detective',
    title:       'Detail Detective',
    emoji:       '🔍',
    domain:      'Content',
    description: 'Expand weak sentences with vivid details.',
    xpRange:     '10–60 XP',
    bestXp:      540,
    color:       '#38BDF8',
    bgColor:     'rgba(14,165,233,0.15)',
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
    color:       '#F87171',
    bgColor:     'rgba(239,68,68,0.15)',
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

  const recommended = GAME_CARDS[0];

  return (
    <View style={styles.wrapper}>

      {/* ── Background color layers (C palette) ── */}
      <ScreenBackground />

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

          <View style={[styles.recommendedCard, { backgroundColor: recommended.bgColor }]}>
            <View style={styles.recommendedLeft}>
              <Text style={styles.recommendedEmoji}>{recommended.emoji}</Text>
              <View style={styles.recommendedInfo}>
                <Text style={[styles.recommendedTitle, { color: recommended.color }]}>
                  {recommended.title}
                </Text>
                <Text style={styles.recommendedDomain}>{recommended.domain}</Text>
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

        <View style={styles.viewHeight} />
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
      <View style={[styles.gameIconBubble, { backgroundColor: game.bgColor }]}>
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

export default PlaygroundScreen;
