/**
 * Detail Detective Game (Game 2)
 * Domain: Content
 * Mechanic: Take a weak sentence and expand it with facts, details, and examples.
 * AI: Groq rates the improvement in real-time (1-5 score)
 * XP: 10-60 based on score
 */

import React, { useState, useCallback, useRef } from 'react';
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
import { DetailDetectiveEvaluation, GameRewards } from '../../models/GameModels';

// ─── Pre-seeded Sentences ─────────────────────────────────────────────────────

interface DetectiveSentence {
  id:           string;
  weakSentence: string;
  hint:         string;
  topic:        string;
}

const SENTENCES: DetectiveSentence[] = [
  {
    id:           's1',
    weakSentence: 'Pizza is good.',
    hint:         'Think about what makes pizza special — flavors, ingredients, where it comes from.',
    topic:        '🍕 Food',
  },
  {
    id:           's2',
    weakSentence: 'Dogs are nice animals.',
    hint:         'What do dogs do? How do they help people? What makes them special?',
    topic:        '🐶 Animals',
  },
  {
    id:           's3',
    weakSentence: 'School is important.',
    hint:         'Why is school important? What do you learn? How does it help your future?',
    topic:        '📚 Education',
  },
  {
    id:           's4',
    weakSentence: 'The weather was bad.',
    hint:         'What kind of bad weather? What happened because of it? How did it feel?',
    topic:        '⛈️ Weather',
  },
  {
    id:           's5',
    weakSentence: 'Sports are fun.',
    hint:         'Which sport? What makes it exciting? How does it benefit you?',
    topic:        '⚽ Sports',
  },
  {
    id:           's6',
    weakSentence: 'Technology has changed things.',
    hint:         'What specific technology? How has it changed daily life or communication?',
    topic:        '💻 Technology',
  },
];

// ─── Score Stars ──────────────────────────────────────────────────────────────

const ScoreStars: React.FC<{ score: number; maxScore: number }> = ({ score, maxScore }) => (
  <View style={styles.starsRow}>
    {Array.from({ length: maxScore }).map((_, i) => (
      <Text key={i} style={styles.star}>
        {i < score ? '⭐' : '☆'}
      </Text>
    ))}
  </View>
);

// ─── Feedback Card ────────────────────────────────────────────────────────────

interface FeedbackCardProps {
  evaluation:  DetailDetectiveEvaluation;
  rewards:     GameRewards | null;
  onNext:      () => void;
  onExit:      () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  evaluation,
  rewards,
  onNext,
  onExit,
}) => {
  const scoreColor =
    evaluation.score >= 4 ? '#16A34A' :
    evaluation.score === 3 ? '#0EA5E9' :
    '#F59E0B';

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.feedbackCard}>

          {/* Score */}
          <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
            <Text style={styles.scoreBadgeText}>
              {evaluation.score}/{evaluation.max_score}
            </Text>
          </View>
          <ScoreStars score={evaluation.score} maxScore={evaluation.max_score} />

          {/* Main feedback */}
          <Text style={styles.feedbackMain}>{evaluation.feedback}</Text>

          {/* What they did well */}
          {evaluation.what_they_did_well ? (
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackSectionIcon}>✅</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.feedbackSectionLabel}>What you did well</Text>
                <Text style={styles.feedbackSectionText}>{evaluation.what_they_did_well}</Text>
              </View>
            </View>
          ) : null}

          {/* How to improve */}
          {evaluation.how_to_improve ? (
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackSectionIcon}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.feedbackSectionLabel}>Try next time</Text>
                <Text style={styles.feedbackSectionText}>{evaluation.how_to_improve}</Text>
              </View>
            </View>
          ) : null}

          {/* XP earned */}
          <View style={styles.xpEarnedRow}>
            <Text style={styles.xpEarnedText}>⚡ +{evaluation.xp_earned} XP earned!</Text>
          </View>

          {/* Level up / badge */}
          {rewards?.level_up && (
            <View style={styles.levelUpBanner}>
              <Text style={styles.levelUpText}>🚀 Level Up! → {rewards.level_name}</Text>
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
          <View style={styles.feedbackActions}>
            <TouchableOpacity style={styles.nextButton} onPress={onNext}>
              <Text style={styles.nextButtonText}>Try Another →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitFeedbackButton} onPress={onExit}>
              <Text style={styles.exitFeedbackText}>Back to Playground</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface DetailDetectiveGameProps {
  onExit:            () => void;
  isSubmitting:      boolean;
  evaluation:        DetailDetectiveEvaluation | null;
  showFeedback:      boolean;
  rewards:           GameRewards | null;
  onSubmit:          (original: string, improved: string) => Promise<any>;
  onDismissFeedback: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DetailDetectiveGame: React.FC<DetailDetectiveGameProps> = ({
  onExit,
  isSubmitting,
  evaluation,
  showFeedback,
  rewards,
  onSubmit,
  onDismissFeedback,
}) => {
  const [sentenceIndex, setSentenceIndex] = useState(
    () => Math.floor(Math.random() * SENTENCES.length)
  );
  const [improvedText, setImprovedText]   = useState('');
  const [showHint, setShowHint]           = useState(false);
  const [roundCount, setRoundCount]       = useState(1);

  const current = SENTENCES[sentenceIndex];
  const wordCount = improvedText.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = improvedText.trim().length > 0 && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    await onSubmit(current.weakSentence, improvedText.trim());
  }, [canSubmit, current, improvedText, onSubmit]);

  const handleNext = useCallback(() => {
    // Pick a different random sentence
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * SENTENCES.length);
    } while (nextIndex === sentenceIndex && SENTENCES.length > 1);

    setSentenceIndex(nextIndex);
    setImprovedText('');
    setShowHint(false);
    setRoundCount(prev => prev + 1);
    onDismissFeedback();
  }, [sentenceIndex, onDismissFeedback]);

  const handleExitFromFeedback = useCallback(() => {
    onDismissFeedback();
    onExit();
  }, [onDismissFeedback, onExit]);

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
          <Text style={styles.title}>Detail Detective 🔍</Text>
          <View style={styles.roundBadge}>
            <Text style={styles.roundText}>#{roundCount}</Text>
          </View>
        </View>

        {/* Topic chip */}
        <View style={styles.topicRow}>
          <View style={styles.topicChip}>
            <Text style={styles.topicText}>{current.topic}</Text>
          </View>
          <Text style={styles.domainLabel}>Content Domain</Text>
        </View>

        {/* Instruction */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionLabel}>YOUR MISSION</Text>
          <Text style={styles.instructionText}>
            This sentence is too weak and vague. Expand it with{' '}
            <Text style={styles.instructionBold}>specific details, facts, and examples</Text>{' '}
            to make it powerful and interesting.
          </Text>
        </View>

        {/* Weak sentence */}
        <View style={styles.weakSentenceCard}>
          <Text style={styles.weakSentenceLabel}>WEAK SENTENCE</Text>
          <Text style={styles.weakSentenceText}>"{current.weakSentence}"</Text>
        </View>

        {/* Hint toggle */}
        <TouchableOpacity
          style={styles.hintToggle}
          onPress={() => setShowHint(prev => !prev)}
        >
          <Text style={styles.hintToggleText}>
            {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
          </Text>
        </TouchableOpacity>

        {showHint && (
          <View style={styles.hintCard}>
            <Text style={styles.hintText}>{current.hint}</Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>YOUR IMPROVED SENTENCE</Text>
          <TextInput
            style={styles.textInput}
            value={improvedText}
            onChangeText={setImprovedText}
            placeholder="Write a better, more detailed version here..."
            placeholderTextColor="#AAA"
            multiline
            textAlignVertical="top"
            editable={!isSubmitting}
          />
          <View style={styles.wordCountRow}>
            <Text style={[
              styles.wordCount,
              wordCount >= 10 ? styles.wordCountGood : styles.wordCountLow,
            ]}>
              {wordCount} words {wordCount >= 10 ? '✓' : '(aim for 10+)'}
            </Text>
          </View>
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
              <Text style={styles.submitButtonText}>  AI is rating...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Submit for AI Rating →</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />

      </ScrollView>

      {/* Feedback Modal */}
      {showFeedback && evaluation && (
        <FeedbackCard
          evaluation={evaluation}
          rewards={rewards}
          onNext={handleNext}
          onExit={handleExitFromFeedback}
        />
      )}

    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  scrollContent: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  exitButton: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center', justifyContent: 'center',
  },
  exitText:   { fontSize: 16, color: '#0EA5E9' },
  title:      { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  roundBadge: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roundText: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  // Topic
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  topicChip: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  topicText:   { fontSize: 14, fontWeight: '600', color: '#1E40AF' },
  domainLabel: { fontSize: 12, color: '#0EA5E9', fontWeight: '600' },

  // Instruction card
  instructionCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  instructionLabel: { fontSize: 10, fontWeight: '800', color: '#0EA5E9', marginBottom: 6, letterSpacing: 1 },
  instructionText:  { fontSize: 14, color: '#1E3A5F', lineHeight: 20 },
  instructionBold:  { fontWeight: '700' },

  // Weak sentence
  weakSentenceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderStyle: 'dashed',
  },
  weakSentenceLabel: { fontSize: 10, fontWeight: '800', color: '#DC2626', marginBottom: 8, letterSpacing: 1 },
  weakSentenceText:  { fontSize: 18, color: '#666', fontStyle: 'italic', lineHeight: 26 },

  // Hint
  hintToggle: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FEF9C3',
    borderRadius: 20,
  },
  hintToggleText: { fontSize: 13, fontWeight: '600', color: '#854D0E' },
  hintCard: {
    backgroundColor: '#FEFCE8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#EAB308',
  },
  hintText: { fontSize: 13, color: '#713F12', lineHeight: 19 },

  // Input
  inputCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#0EA5E9', marginBottom: 10, letterSpacing: 1 },
  textInput: {
    fontSize: 15,
    color: '#1A1A2E',
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  wordCountRow: { marginTop: 8, alignItems: 'flex-end' },
  wordCount:    { fontSize: 12, fontWeight: '600' },
  wordCountGood: { color: '#16A34A' },
  wordCountLow:  { color: '#9CA3AF' },

  // Submit
  submitButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#BAE6FD' },
  submitButtonText:     { color: '#FFF', fontSize: 16, fontWeight: '700' },
  submittingRow:        { flexDirection: 'row', alignItems: 'center' },

  // Feedback modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  feedbackCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    gap: 12,
    maxHeight: '90%',
  },
  scoreBadge: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
  },
  scoreBadgeText: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  star: { fontSize: 24 },
  feedbackMain: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 22,
  },
  feedbackSection: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  feedbackSectionIcon:  { fontSize: 18 },
  feedbackSectionLabel: { fontSize: 11, fontWeight: '700', color: '#888', marginBottom: 2 },
  feedbackSectionText:  { fontSize: 13, color: '#444', lineHeight: 18 },
  xpEarnedRow: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  xpEarnedText: { fontSize: 18, fontWeight: '800', color: '#0EA5E9' },
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
  feedbackActions: { gap: 10, marginTop: 4 },
  nextButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  exitFeedbackButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  exitFeedbackText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
});

export default DetailDetectiveGame;