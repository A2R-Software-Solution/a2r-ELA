import ScreenBackground from '../../components/ScreenBackground';
import { styles } from './DetailDetectiveGame.styles';
/**
 * Detail Detective Game (Game 2)
 * Domain: Content
 * Mechanic: Take a weak sentence and expand it with facts, details, and examples.
 * AI: Groq rates the improvement in real-time (1-5 score)
 * XP: 10-60 based on score
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
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
              <View style={styles.viewFlex}>
                <Text style={styles.feedbackSectionLabel}>What you did well</Text>
                <Text style={styles.feedbackSectionText}>{evaluation.what_they_did_well}</Text>
              </View>
            </View>
          ) : null}

          {/* How to improve */}
          {evaluation.how_to_improve ? (
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackSectionIcon}>💡</Text>
              <View style={styles.viewFlex2}>
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
  const canSubmit = improvedText.trim().length > 0 && improvedText.trim().length <= 1000 && !isSubmitting;

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
          <Text style={styles.wordCountLow} accessibilityLiveRegion="polite">
            {improvedText.trim().length > 1000
              ? 'Improved sentence cannot exceed 1000 characters.'
              : `${improvedText.trim().length}/1000 characters`}
          </Text>
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

        <View style={styles.viewHeight} />

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

export default DetailDetectiveGame;
