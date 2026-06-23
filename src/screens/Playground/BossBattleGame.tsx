/**
 * Writing Boss Battle Game (Game 6)
 * Domain: All 5 PSSA Domains
 * Mechanic: Write a full essay and beat your personal best score.
 * Frequency: Weekly challenge — resets every Monday
 * AI: OpenRouter (reuses existing essay evaluator)
 * XP: +250 for beating personal best, +50 base otherwise
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
              <Text style={[styles.comparisonScore, { color: '#7D55FF' }]}>
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

          <View style={{ height: 20 }} />
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

        <View style={{ height: 60 }} />
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  scrollContent: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  exitButton: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center', justifyContent: 'center',
  },
  exitText:  { fontSize: 16, color: '#DC2626' },
  title:     { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  weeklyChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  weeklyText: { fontSize: 12, fontWeight: '700', color: '#92400E' },

  // Challenge card
  challengeCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  challengeTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  challengeDesc:  { fontSize: 13, color: '#CBD5E1', lineHeight: 19, marginBottom: 16 },
  challengeStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  challengeStat: { alignItems: 'center' },
  challengeStatValue: { fontSize: 22, fontWeight: '800', color: '#DC2626' },
  challengeStatLabel: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  challengeStatDivider: { width: 1, height: 36, backgroundColor: '#334155' },

  // Domain chips
  domainChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  domainChip: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  domainChipText: { fontSize: 12, fontWeight: '600', color: '#DC2626' },

  // Essay input
  essayCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  essayLabel: { fontSize: 10, fontWeight: '800', color: '#DC2626', marginBottom: 10, letterSpacing: 1 },
  essayInput: {
    fontSize: 15,
    color: '#1A1A2E',
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  wordCountSection: { marginTop: 12, gap: 6 },
  wordCountBar: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  wordCountFill: { height: 6, borderRadius: 3 },
  wordCountText:  { fontSize: 12, fontWeight: '600' },
  wordCountGood:  { color: '#16A34A' },
  wordCountLow:   { color: '#9CA3AF' },
  underMinWarning: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 6,
    fontStyle: 'italic',
  },

  // Tips
  tipsCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: '#9A3412', marginBottom: 10 },
  tipItem:   { fontSize: 13, color: '#7C2D12', lineHeight: 22 },

  // Submit
  submitButton: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#FCA5A5' },
  submitButtonText:     { color: '#FFF', fontSize: 16, fontWeight: '700' },
  submittingRow:        { flexDirection: 'row', alignItems: 'center' },
  submittingNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 10,
    fontStyle: 'italic',
  },

  // Result modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  resultScrollView: {
    maxHeight: '95%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  resultCard: {
    padding: 24,
    gap: 16,
  },

  // Hero
  resultHero: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  resultHeroEmoji: { fontSize: 48 },
  resultHeroTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  resultHeroScore: { fontSize: 48, fontWeight: '900', color: '#FFF' },
  improvementChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  improvementText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  // Comparison
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
  },
  comparisonBox:   { alignItems: 'center' },
  comparisonLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 1 },
  comparisonScore: { fontSize: 36, fontWeight: '900' },
  comparisonVs:    { fontSize: 16, fontWeight: '800', color: '#CBD5E1' },

  // Domain breakdown
  domainsSection: { gap: 10 },
  sectionTitle:   { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  domainEmoji: { fontSize: 16, width: 24 },
  domainLabel: { fontSize: 13, fontWeight: '600', color: '#444', width: 90 },
  domainBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  domainBarFill: { height: 8, borderRadius: 4 },
  domainScore:   { fontSize: 13, fontWeight: '700', width: 28, textAlign: 'right' },

  // Feedback sections
  feedbackSection: { gap: 6 },
  feedbackBullet:  { fontSize: 13, color: '#444', lineHeight: 20, paddingLeft: 4 },

  // Personal feedback quote
  personalFeedbackCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  personalFeedbackText: {
    fontSize: 14,
    color: '#1E3A5F',
    lineHeight: 21,
    fontStyle: 'italic',
  },

  // XP
  xpSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  xpEarnedLabel:  { fontSize: 13, fontWeight: '600', color: '#92400E' },
  xpEarnedAmount: { fontSize: 36, fontWeight: '900', color: '#DC2626' },
  xpBonusNote:    { fontSize: 12, color: '#92400E', fontStyle: 'italic' },

  // Level up / badge
  levelUpBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  levelUpText: { fontSize: 14, fontWeight: '700', color: '#92400E' },
  badgeBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  badgeBannerText: { fontSize: 14, fontWeight: '700', color: '#16A34A' },

  // Actions
  tryAgainButton: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tryAgainText:    { color: '#FFF', fontSize: 16, fontWeight: '700' },
  exitResultButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  exitResultText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
});

export default BossBattleGame;