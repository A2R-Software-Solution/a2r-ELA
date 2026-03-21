/**
 * Playground Screen
 * Game selection grid + hosts the active game.
 * Wired into HomeScreen's PLAYGROUND tab.
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
import useGame from '../../hooks/useGame';

// ─── Game Card Data ───────────────────────────────────────────────────────────

interface GameCard {
  id: GameId;
  title: string;
  emoji: string;
  domain: string;
  description: string;
  xpRange: string;
  badge: string;
  color: string;
  lightColor: string;
  aiPowered?: boolean;
  isWeekly?: boolean;
}

const GAME_CARDS: GameCard[] = [
  {
    id: 'bug_catcher',
    title: 'Bug Catcher',
    emoji: '🐛',
    domain: 'Conventions',
    description:
      'Find spelling, grammar & punctuation errors hiding in a paragraph.',
    xpRange: '20–50 XP',
    badge: 'Grammar Champion',
    color: '#7D55FF',
    lightColor: '#F0EBFF',
  },
  {
    id: 'jumbled_story',
    title: 'Jumbled Story',
    emoji: '📖',
    domain: 'Organization',
    description: 'Rearrange the mixed-up sentences to build the correct story.',
    xpRange: '20–50 XP',
    badge: 'Master Navigator',
    color: '#4F46E5',
    lightColor: '#EEF2FF',
  },
  {
    id: 'detail_detective',
    title: 'Detail Detective',
    emoji: '🔍',
    domain: 'Content',
    description:
      'Take a weak sentence and expand it with facts, examples, and vivid details.',
    xpRange: '10–60 XP',
    badge: 'Detail King/Queen',
    color: '#0EA5E9',
    lightColor: '#E0F2FE',
    aiPowered: true,
  },
  {
    id: 'boss_battle',
    title: 'Writing Boss Battle',
    emoji: '⚔️',
    domain: 'All Domains',
    description:
      'Write a full essay and beat your personal best score. Weekly challenge — resets every Monday.',
    xpRange: '50–250 XP',
    badge: 'Boss Slayer',
    color: '#DC2626',
    lightColor: '#FEF2F2',
    aiPowered: true,
    isWeekly: true,
  },
];

// ─── Reward Dialog (no-AI games + level up / badge unlock) ───────────────────

interface RewardDialogProps {
  visible: boolean;
  rewards: GameRewards;
  onClose: () => void;
}

const RewardDialog: React.FC<RewardDialogProps> = ({
  visible,
  rewards,
  onClose,
}) => (
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

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const PlaygroundScreen: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const insets = useSafeAreaInsets();

  const {
    isSubmitting,
    rewards,

    // No-AI games
    showRewardDialog,
    submitGameResult,
    dismissRewardDialog,

    // Detail Detective
    detailEvaluation,
    showDetailFeedback,
    submitDetailDetective,
    dismissDetailFeedback,

    // Boss Battle
    bossBattleResult,
    showBossRewardDialog,
    submitBossBattle,
    dismissBossRewardDialog,
  } = useGame();

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleGameComplete = useCallback(
    async (result: GameResult) => {
      setActiveGame(null);
      await submitGameResult(result);
    },
    [submitGameResult],
  );

  const handleExit = useCallback(() => {
    setActiveGame(null);
  }, []);

  const handleRewardClose = useCallback(() => {
    dismissRewardDialog();
  }, [dismissRewardDialog]);

  const handleDetailFeedbackClose = useCallback(() => {
    dismissDetailFeedback();
  }, [dismissDetailFeedback]);

  const handleBossRewardClose = useCallback(() => {
    dismissBossRewardDialog();
  }, [dismissBossRewardDialog]);

  // ── Active Game Renders ───────────────────────────────────────────────────

  if (activeGame === 'bug_catcher') {
    return (
      <BugCatcherGame onGameComplete={handleGameComplete} onExit={handleExit} />
    );
  }

  if (activeGame === 'jumbled_story') {
    return (
      <JumbledStoryGame
        onGameComplete={handleGameComplete}
        onExit={handleExit}
      />
    );
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
        onDismissFeedback={handleDetailFeedbackClose}
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
        onDismissReward={handleBossRewardClose}
      />
    );
  }

  // ── Game Selection Grid ───────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Playground 🎮</Text>
        <Text style={styles.headerSub}>
          Practice your ELA skills through games
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {GAME_CARDS.map(game => (
          <TouchableOpacity
            key={game.id}
            onPress={() => setActiveGame(game.id)}
            activeOpacity={0.85}
            disabled={isSubmitting}
          >
            <View
              style={[styles.gameCard, { backgroundColor: game.lightColor }]}
            >
              <View style={styles.gameCardTop}>
                <Text style={styles.gameEmoji}>{game.emoji}</Text>
                <View style={styles.chipRow}>
                  {/* Weekly badge */}
                  {game.isWeekly && (
                    <View style={styles.weeklyChip}>
                      <Text style={styles.weeklyText}>📅 Weekly</Text>
                    </View>
                  )}
                  {/* AI powered badge */}
                  {game.aiPowered && (
                    <View style={styles.aiChip}>
                      <Text style={styles.aiText}>✨ AI</Text>
                    </View>
                  )}
                  {/* Domain chip */}
                  <View
                    style={[styles.domainChip, { backgroundColor: game.color }]}
                  >
                    <Text style={styles.domainText}>{game.domain}</Text>
                  </View>
                </View>
              </View>

              <Text style={[styles.gameTitle, { color: game.color }]}>
                {game.title}
              </Text>
              <Text style={styles.gameDescription}>{game.description}</Text>

              <View style={styles.gameCardFooter}>
                <View style={styles.xpChip}>
                  <Text style={styles.xpText}>⚡ {game.xpRange}</Text>
                </View>
                <Text style={styles.badgeHint}>🏅 {game.badge}</Text>
              </View>

              <View
                style={[styles.playButton, { backgroundColor: game.color }]}
              >
                <Text style={styles.playButtonText}>
                  {game.isWeekly ? 'Accept Challenge →' : 'Play Now →'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Reward dialog for no-AI games */}
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  headerSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  grid: {
    padding: 20,
    gap: 16,
  },
  gameCard: {
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  gameCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameEmoji: { fontSize: 36 },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  domainChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  domainText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  weeklyChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
  },
  weeklyText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  aiChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
  },
  aiText: { fontSize: 11, fontWeight: '700', color: '#0369A1' },
  gameTitle: { fontSize: 22, fontWeight: '800' },
  gameDescription: { fontSize: 13, color: '#555', lineHeight: 19 },
  gameCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  xpChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  xpText: { fontSize: 12, fontWeight: '700', color: '#1A1A2E' },
  badgeHint: { fontSize: 12, color: '#666' },
  playButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  playButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardCard: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  rewardEmoji: { fontSize: 48 },
  rewardXp: { fontSize: 32, fontWeight: '800', color: '#7D55FF' },
  rewardTotal: { fontSize: 14, color: '#888' },
  levelUpBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  levelUpText: { fontSize: 14, fontWeight: '700', color: '#92400E' },
  badgesSection: {
    alignSelf: 'stretch',
    marginTop: 8,
    gap: 8,
  },
  badgesTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F7FF',
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  badgeIcon: { fontSize: 28 },
  badgeName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  badgeDesc: { fontSize: 12, color: '#666' },
  closeButton: {
    backgroundColor: '#7D55FF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginTop: 8,
  },
  closeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default PlaygroundScreen;