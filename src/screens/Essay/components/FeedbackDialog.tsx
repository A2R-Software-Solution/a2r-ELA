/**
 * Feedback Dialog Component
 * Displays detailed essay evaluation results with badge unlock popup
 * and Practice Suggestions section.
 *
 * Changes from Phase 2:
 *   - gameSuggestion prop added — shows Practice Suggestions section
 *   - onPlayNow prop added — wired to [Play Now] button
 *   - GameSuggestion imported from EssayModels
 *   - All existing props, badge popup, rubric scores unchanged
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { RubricScores } from '../../../models/EssayModels';
import { GameSuggestion } from '../../../models/EssayModels';
import { NewlyUnlockedBadge } from '../../../models/GamificationModels';

// ============================================================================
// CONSTANTS
// ============================================================================

const PURPLE        = '#7D55FF';
const LIGHT_PURPLE  = '#F0EBFF';
const GOLD          = '#F59E0B';
const LIGHT_GOLD    = '#FFFBEB';
const GREEN         = '#10B981';
const LIGHT_GREEN   = '#ECFDF5';
const WHITE         = '#FFFFFF';
const DARK_TEXT     = '#111827';
const GRAY_TEXT     = '#6B7280';

const POPUP_VISIBLE_MS  = 2800;
const POPUP_FADE_OUT_MS = 200;

// ============================================================================
// PROPS
// ============================================================================

interface FeedbackDialogProps {
  visible:              boolean;
  totalScore:           number;
  grade:                string;
  rubricScores:         RubricScores | null;
  personalizedFeedback: string;
  strengths:            string[];
  areasForImprovement:  string[];
  newBadges?:           NewlyUnlockedBadge[];
  gameSuggestion?:      GameSuggestion | null;   // ← new
  onPlayNow?:           () => void;              // ← new
  onDismiss:            () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  visible,
  totalScore,
  grade,
  rubricScores,
  personalizedFeedback,
  strengths,
  areasForImprovement,
  newBadges = [],
  gameSuggestion = null,
  onPlayNow,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>

          {/* ---------------------------------------------------------------- */}
          {/* Header                                                           */}
          {/* ---------------------------------------------------------------- */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Essay Evaluation Results</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* ---------------------------------------------------------------- */}
          {/* Scrollable content                                               */}
          {/* ---------------------------------------------------------------- */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

            {/* Score Card — unchanged */}
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Overall Score</Text>
              <Text style={styles.scoreValue}>{totalScore}/100</Text>
              <Text style={styles.gradeText}>Grade: {grade}</Text>
            </View>

            {/* Rubric Scores — unchanged */}
            {rubricScores && (
              <>
                <Text style={styles.sectionTitle}>Detailed Scores</Text>
                <RubricScoreItem label="Focus"        score={rubricScores.focus} />
                <RubricScoreItem label="Content"      score={rubricScores.content} />
                <RubricScoreItem label="Organization" score={rubricScores.organization} />
                <RubricScoreItem label="Style"        score={rubricScores.style} />
                <RubricScoreItem label="Conventions"  score={rubricScores.conventions} />
              </>
            )}

            {/* Personalized Feedback — unchanged */}
            <Text style={styles.sectionTitle}>Personalized Feedback</Text>
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackText}>{personalizedFeedback}</Text>
            </View>

            {/* Strengths — unchanged */}
            {strengths.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, styles.strengthsTitle]}>
                  ✨ Strengths
                </Text>
                {strengths.map((strength, index) => (
                  <View key={index} style={styles.strengthCard}>
                    <Text style={styles.listItemText}>• {strength}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Areas for Improvement — unchanged */}
            {areasForImprovement.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, styles.improvementTitle]}>
                  💡 Areas for Improvement
                </Text>
                {areasForImprovement.map((area, index) => (
                  <View key={index} style={styles.improvementCard}>
                    <Text style={styles.listItemText}>• {area}</Text>
                  </View>
                ))}
              </>
            )}

            {/* ── Practice Suggestions ── new in Phase 3 ────────────────── */}
            {gameSuggestion && (
              <PracticeSuggestion
                suggestion={gameSuggestion}
                onPlayNow={onPlayNow}
              />
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* ---------------------------------------------------------------- */}
          {/* Footer                                                           */}
          {/* ---------------------------------------------------------------- */}
          <TouchableOpacity style={styles.closeFooterButton} onPress={onDismiss}>
            <Text style={styles.closeFooterButtonText}>Close</Text>
          </TouchableOpacity>

        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Badge unlock popup — unchanged from Phase 2                        */}
        {/* ------------------------------------------------------------------ */}
        {newBadges.length > 0 && visible && (
          <BadgeUnlockPopup badges={newBadges} />
        )}

      </View>
    </Modal>
  );
};

// ============================================================================
// PRACTICE SUGGESTION CARD  ← new in Phase 3
// Shown at the bottom of the scroll when gameSuggestion is non-null.
// Green color scheme to visually separate it from the score/feedback sections.
// ============================================================================

interface PracticeSuggestionProps {
  suggestion: GameSuggestion;
  onPlayNow?: () => void;
}

const PracticeSuggestion: React.FC<PracticeSuggestionProps> = ({
  suggestion,
  onPlayNow,
}) => {
  return (
    <View style={styles.suggestionWrapper}>

      {/* Section header */}
      <Text style={[styles.sectionTitle, styles.suggestionTitle]}>
        🎮 Practice Suggestions
      </Text>

      {/* Card */}
      <View style={styles.suggestionCard}>

        {/* Domain + score row */}
        <View style={styles.suggestionTopRow}>
          <View style={styles.domainPill}>
            <Text style={styles.domainPillText}>
              {suggestion.domain_label}
            </Text>
          </View>
          <View style={styles.scorePill}>
            <Text style={styles.scorePillText}>
              {suggestion.score}/4
            </Text>
          </View>
        </View>

        {/* Game name */}
        <Text style={styles.suggestionGameName}>
          {suggestion.game_name}
        </Text>

        {/* Reason */}
        <Text style={styles.suggestionReason}>
          {suggestion.reason}
        </Text>

        {/* Play Now button */}
        <TouchableOpacity
          style={styles.playNowButton}
          onPress={onPlayNow}
          activeOpacity={0.85}
        >
          <Text style={styles.playNowIcon}>▶</Text>
          <Text style={styles.playNowText}>Play Now</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

// ============================================================================
// BADGE UNLOCK POPUP — unchanged from Phase 2
// ============================================================================

interface BadgeUnlockPopupProps {
  badges: NewlyUnlockedBadge[];
}

const BadgeUnlockPopup: React.FC<BadgeUnlockPopupProps> = ({ badges }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible,    setIsVisible]    = useState(false);

  const scaleAnim   = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const showBadge = (index: number) => {
    if (index >= badges.length) return;

    scaleAnim.setValue(0);
    opacityAnim.setValue(0);
    setCurrentIndex(index);
    setIsVisible(true);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, tension: 60, friction: 7, useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, duration: 250, useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0, duration: POPUP_FADE_OUT_MS, useNativeDriver: true,
        }).start(() => {
          setIsVisible(false);
          if (index + 1 < badges.length) {
            setTimeout(() => showBadge(index + 1), 300);
          }
        });
      }, POPUP_VISIBLE_MS);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => showBadge(0), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const badge = badges[currentIndex];

  return (
    <Animated.View
      style={[
        styles.popupContainer,
        { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.popupGlow}>
        <View style={styles.popupIconCircle}>
          <Text style={styles.popupIcon}>{badge.icon}</Text>
        </View>
        <Text style={styles.popupEyebrow}>🎉 Badge Unlocked!</Text>
        <Text style={styles.popupBadgeName}>{badge.name}</Text>
        <Text style={styles.popupDescription}>{badge.description}</Text>
        {badges.length > 1 && (
          <View style={styles.dotRow}>
            {badges.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ============================================================================
// RUBRIC SCORE ITEM — unchanged
// ============================================================================

interface RubricScoreItemProps {
  label: string;
  score: number;
}

const RubricScoreItem: React.FC<RubricScoreItemProps> = ({ label, score }) => {
  const progress = score / 20;
  return (
    <View style={styles.rubricItem}>
      <Text style={styles.rubricLabel}>{label}</Text>
      <View style={styles.rubricRight}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.rubricScore}>{score}/20</Text>
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({

  // ── Modal shell ────────────────────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 32, height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: { fontSize: 24, color: '#666666' },
  divider:         { height: 1, backgroundColor: '#EEEEEE' },

  // ── Content ────────────────────────────────────────────────────────────────
  content:      { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  strengthsTitle:   { color: PURPLE },
  improvementTitle: { color: '#FF6B6B' },
  suggestionTitle:  { color: GREEN },

  scoreCard: {
    backgroundColor: '#E8D5FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  scoreValue: { fontSize: 48, fontWeight: 'bold', color: PURPLE },
  gradeText:  { fontSize: 20, fontWeight: '600', marginTop: 4 },

  rubricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rubricLabel: { fontSize: 14, flex: 1 },
  rubricRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBarContainer: {
    width: 60, height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: PURPLE },
  rubricScore:     { fontSize: 14, fontWeight: '600', width: 45, textAlign: 'right' },

  feedbackCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  feedbackText: { fontSize: 14, lineHeight: 20 },

  strengthCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  improvementCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  listItemText: { fontSize: 14, lineHeight: 20 },

  closeFooterButton: {
    backgroundColor: PURPLE,
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  closeFooterButtonText: { color: WHITE, fontSize: 16, fontWeight: '600' },

  // ── Practice Suggestion card ── new in Phase 3 ────────────────────────────
  suggestionWrapper: {
    marginTop: 4,
  },
  suggestionCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: GREEN,
  },
  suggestionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  domainPill: {
    backgroundColor: GREEN,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  domainPillText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
  scorePill: {
    backgroundColor: WHITE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GREEN,
  },
  scorePillText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '700',
  },
  suggestionGameName: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 6,
  },
  suggestionReason: {
    fontSize: 13,
    color: GRAY_TEXT,
    lineHeight: 19,
    marginBottom: 14,
  },
  playNowButton: {
    backgroundColor: GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  playNowIcon: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },
  playNowText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Badge unlock popup — unchanged from Phase 2 ───────────────────────────
  popupContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '20%',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  popupGlow: {
    backgroundColor: WHITE,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: GOLD,
    minWidth: 240,
    maxWidth: 280,
  },
  popupIconCircle: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: LIGHT_GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: GOLD,
  },
  popupIcon:        { fontSize: 40 },
  popupEyebrow:     { fontSize: 13, fontWeight: '700', color: GOLD, letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' },
  popupBadgeName:   { fontSize: 20, fontWeight: '800', color: DARK_TEXT, textAlign: 'center', marginBottom: 6 },
  popupDescription: { fontSize: 13, color: GRAY_TEXT, textAlign: 'center', lineHeight: 18 },
  dotRow:     { flexDirection: 'row', gap: 6, marginTop: 14 },
  dot:        { width: 7, height: 7, borderRadius: 4 },
  dotActive:  { backgroundColor: GOLD },
  dotInactive:{ backgroundColor: '#E5E7EB' },
});

export default FeedbackDialog;