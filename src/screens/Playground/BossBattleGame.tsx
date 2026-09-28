import ScreenBackground from '../../components/ScreenBackground';
import { styles } from './BossBattleGame.styles';
/**
 * Writing Boss Battle Game (Game 6)
 * Domain: All 5 PSSA Domains
 * Mechanic: Write a full essay and beat your personal best score.
 * Frequency: Weekly challenge — resets every Monday
 * AI: OpenRouter (reuses existing essay evaluator)
 * XP: +250 for beating personal best, +50 base otherwise
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { BossBattleResult, GameRewards } from '../../models/GameModels';

// ─── Domain Score Row ─────────────────────────────────────────────────────────

const DOMAIN_EMOJIS: Record<string, string> = {
  focus:        '🎯',
  content:      '📝',
  organization: '🗂️',
  style:        '✨',
  conventions:  '📖',
};

interface DomainRowProps {
  domain: string;
  raw:    number;
}

const DomainRow: React.FC<DomainRowProps> = ({ domain, raw }) => {
  const label = domain.charAt(0).toUpperCase() + domain.slice(1);
  const color =
    raw >= 4 ? '#16A34A' :
    raw === 3 ? '#0EA5E9' :
    raw === 2 ? '#F59E0B' : '#DC2626';

  return (
    <View style={styles.domainRow}>
      <Text style={styles.domainEmoji}>{DOMAIN_EMOJIS[domain] ?? '📌'}</Text>
      <Text style={styles.domainLabel}>{label}</Text>
      <View style={styles.domainBarTrack}>
        <View style={[styles.domainBarFill, { width: `${(raw / 4) * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.domainScore, { color }]}>{raw}/4</Text>
    </View>
  );
};

// ─── Result Modal ─────────────────────────────────────────────────────────────

interface ResultModalProps {
  visible:          boolean;
  bossBattleResult: BossBattleResult;
  evaluation:       any;
  rewards:          GameRewards | null;
  onClose:          () => void;
  onExit:           () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  bossBattleResult,
  evaluation,
  rewards,
  onClose,
  onExit,
}) => {
  const { converted_score, personal_best, beat_personal_best, improvement } = bossBattleResult;
  const rawScores: Record<string, number> = evaluation?.raw_scores ?? {};

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <ScrollView
          style={styles.resultScrollView}
          contentContainerStyle={styles.resultCard}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero section */}
          <View style={[
            styles.resultHero,
            { backgroundColor: beat_personal_best ? '#065F46' : '#1E3A5F' },
          ]}>
            <Text style={styles.resultHeroEmoji}>
              {beat_personal_best ? '🏆' : '⚔️'}
            </Text>
            <Text style={styles.resultHeroTitle}>
              {beat_personal_best ? 'Personal Best Beaten!' : 'Boss Battle Complete'}
            </Text>
            <Text style={styles.resultHeroScore}>{converted_score}/100</Text>
            {beat_personal_best && (
              <View style={styles.improvementChip}>
                <Text style={styles.improvementText}>
                  +{improvement} pts above your best!
                </Text>
              </View>
            )}
          </View>

          {/* Personal best comparison */}
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonBox}>
              <Text style={styles.comparisonLabel}>THIS ATTEMPT</Text>
              <Text style={[
                styles.comparisonScore,
                { color: beat_personal_best ? '#16A34A' : '#0EA5E9' },
              ]}>
                {converted_score}
              </Text>
            </View>
            <Text style={styles.comparisonVs}>VS</Text>
            <View style={styles.comparisonBox}>
              <Text style={styles.comparisonLabel}>PERSONAL BEST</Text>
              <Text style={[styles.comparisonScore, styles.textColor]}>
                {personal_best}
              </Text>
            </View>
          </View>

          {/* Domain scores */}
          {Object.keys(rawScores).length > 0 && (
            <View style={styles.domainsSection}>
              <Text style={styles.sectionTitle}>Domain Breakdown</Text>
              {['focus', 'content', 'organization', 'style', 'conventions'].map(domain => (
                <DomainRow
                  key={domain}
                  domain={domain}
                  raw={rawScores[domain] ?? 1}
                />
              ))}
            </View>
          )}

          {/* Strengths */}
          {evaluation?.strengths?.length > 0 && (
            <View style={styles.feedbackSection}>
              <Text style={styles.sectionTitle}>✅ Strengths</Text>
              {evaluation.strengths.map((s: string, i: number) => (
                <Text key={i} style={styles.feedbackBullet}>• {s}</Text>
              ))}
            </View>
          )}

          {/* Areas to improve */}
          {evaluation?.areas_for_improvement?.length > 0 && (
            <View style={styles.feedbackSection}>
              <Text style={styles.sectionTitle}>💡 Areas to Improve</Text>
              {evaluation.areas_for_improvement.map((a: string, i: number) => (
                <Text key={i} style={styles.feedbackBullet}>• {a}</Text>
              ))}
            </View>
          )}

          {/* Personalized feedback */}
          {evaluation?.personalized_feedback && (
            <View style={styles.personalFeedbackCard}>
              <Text style={styles.personalFeedbackText}>
                "{evaluation.personalized_feedback}"
              </Text>
            </View>
          )}

          {/* XP & rewards */}
          <View style={styles.xpSection}>
            <Text style={styles.xpEarnedLabel}>⚡ XP Earned</Text>
            <Text style={styles.xpEarnedAmount}>+{rewards?.xp_earned ?? 0}</Text>
            {beat_personal_best && (
              <Text style={styles.xpBonusNote}>
                Includes +200 XP personal best bonus!
              </Text>
            )}
          </View>

          {rewards?.level_up && (
            <View style={styles.levelUpBanner}>
              <Text style={styles.levelUpText}>
                🚀 Level Up! → {rewards.level_name}
              </Text>
            </View>
          )}

          {rewards && rewards.newly_unlocked_badges.length > 0 && (
            <View style={styles.badgeBanner}>
              {rewards.newly_unlocked_badges.map(b => (
                <Text key={b.id} style={styles.badgeBannerText}>
                  {b.icon} {b.name} unlocked!
                </Text>
              ))}
            </View>
          )}

          {/* Actions */}
          <TouchableOpacity style={styles.tryAgainButton} onPress={onClose}>
            <Text style={styles.tryAgainText}>Try Again ↺</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exitResultButton} onPress={onExit}>
            <Text style={styles.exitResultText}>Back to Playground</Text>
          </TouchableOpacity>

          <View style={styles.viewHeight} />
        </ScrollView>
      </View>
    </Modal>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface BossBattleGameProps {
  onExit:            () => void;
  isSubmitting:      boolean;
  bossBattleResult:  BossBattleResult | null;
  showRewardDialog:  boolean;
  rewards:           GameRewards | null;
  onSubmit:          (essayText: string, state: string, grade: string) => Promise<any>;
  onDismissReward:   () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const BossBattleGame: React.FC<BossBattleGameProps> = ({
  onExit,
  isSubmitting,
  bossBattleResult,
  showRewardDialog,
  rewards,
  onSubmit,
  onDismissReward,
}) => {
  const [essayText, setEssayText]       = useState('');
  const [evaluation, setEvaluation]     = useState<any>(null);

  const wordCount   = essayText.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit   = wordCount >= 50 && !isSubmitting;
  const isUnderMin  = essayText.trim().length > 0 && wordCount < 50;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    const result = await onSubmit(essayText.trim(), 'PA', '6');
    if (result?.evaluation) {
      setEvaluation(result.evaluation);
    }
  }, [canSubmit, essayText, onSubmit]);

  const handleTryAgain = useCallback(() => {
    setEssayText('');
    setEvaluation(null);
    onDismissReward();
  }, [onDismissReward]);

  const handleExitFromResult = useCallback(() => {
    onDismissReward();
    onExit();
  }, [onDismissReward, onExit]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenBackground />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onExit} style={styles.exitButton}>
            <Text style={styles.exitText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Boss Battle ⚔️</Text>
          <View style={styles.weeklyChip}>
            <Text style={styles.weeklyText}>📅 Weekly</Text>
          </View>
        </View>

        {/* Challenge card */}
        <View style={styles.challengeCard}>
          <Text style={styles.challengeTitle}>🏆 Weekly Writing Challenge</Text>
          <Text style={styles.challengeDesc}>
            Write your best essay on any topic. Your score will be compared
            against your personal best across all 5 PSSA Writing Domains.
          </Text>
          <View style={styles.challengeStatsRow}>
            <View style={styles.challengeStat}>
              <Text style={styles.challengeStatValue}>50+</Text>
              <Text style={styles.challengeStatLabel}>Min. words</Text>
            </View>
            <View style={styles.challengeStatDivider} />
            <View style={styles.challengeStat}>
              <Text style={styles.challengeStatValue}>5</Text>
              <Text style={styles.challengeStatLabel}>Domains scored</Text>
            </View>
            <View style={styles.challengeStatDivider} />
            <View style={styles.challengeStat}>
              <Text style={styles.challengeStatValue}>+250</Text>
              <Text style={styles.challengeStatLabel}>Bonus XP</Text>
            </View>
          </View>
        </View>

        {/* Domain chips */}
        <View style={styles.domainChipsRow}>
          {['Focus', 'Content', 'Organization', 'Style', 'Conventions'].map(d => (
            <View key={d} style={styles.domainChip}>
              <Text style={styles.domainChipText}>{d}</Text>
            </View>
          ))}
        </View>

        {/* Essay input */}
        <View style={styles.essayCard}>
          <Text style={styles.essayLabel}>YOUR ESSAY</Text>
          <TextInput
            style={styles.essayInput}
            value={essayText}
            onChangeText={setEssayText}
            placeholder="Start writing your essay here. Introduce your topic, develop your ideas with details and examples, and wrap up with a strong conclusion..."
            placeholderTextColor="#AAA"
            multiline
            textAlignVertical="top"
            editable={!isSubmitting}
          />

          {/* Word count bar */}
          <View style={styles.wordCountSection}>
            <View style={styles.wordCountBar}>
              <View style={[
                styles.wordCountFill,
                {
                  width: `${Math.min((wordCount / 50) * 100, 100)}%`,
                  backgroundColor: canSubmit ? '#16A34A' : '#DC2626',
                },
              ]} />
            </View>
            <Text style={[
              styles.wordCountText,
              canSubmit ? styles.wordCountGood : styles.wordCountLow,
            ]}>
              {wordCount} / 50 words minimum
              {canSubmit ? ' ✓ Ready!' : ''}
            </Text>
          </View>

          {isUnderMin && (
            <Text style={styles.underMinWarning}>
              Keep writing! You need at least 50 words to submit.
            </Text>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Writing Tips</Text>
          <Text style={styles.tipItem}>• Start with a clear main idea (Focus)</Text>
          <Text style={styles.tipItem}>• Support it with specific details (Content)</Text>
          <Text style={styles.tipItem}>• Use a beginning, middle, and end (Organization)</Text>
          <Text style={styles.tipItem}>• Choose interesting words (Style)</Text>
          <Text style={styles.tipItem}>• Check spelling and punctuation (Conventions)</Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <View style={styles.submittingRow}>
              <ActivityIndicator color="#FFF" size="small" />
              <Text style={styles.submitButtonText}>  AI is evaluating your essay...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>⚔️ Submit to Boss Battle</Text>
          )}
        </TouchableOpacity>

        {isSubmitting && (
          <Text style={styles.submittingNote}>
            This may take up to 30 seconds. Hang tight!
          </Text>
        )}

        <View style={styles.viewHeight2} />
      </ScrollView>

      {/* Result Modal */}
      {showRewardDialog && bossBattleResult && (
        <ResultModal
          visible={showRewardDialog}
          bossBattleResult={bossBattleResult}
          evaluation={evaluation}
          rewards={rewards}
          onClose={handleTryAgain}
          onExit={handleExitFromResult}
        />
      )}

    </KeyboardAvoidingView>
  );
};

export default BossBattleGame;
