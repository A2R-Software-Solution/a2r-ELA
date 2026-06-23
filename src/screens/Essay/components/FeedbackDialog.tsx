/**
 * FeedbackDialog Component
 * ✅ Redesigned with new color system
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
import { RubricScores, GameSuggestion } from '../../../models/EssayModels';
import { NewlyUnlockedBadge } from '../../../models/GamificationModels';

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIMARY       = '#6C4DFF';
const PRIMARY_LIGHT = '#EDE9FF';
const GREEN         = '#22C55E';
const GREEN_LIGHT   = '#F0FDF4';
const ORANGE        = '#F97316';
const GOLD          = '#F59E0B';
const GOLD_LIGHT    = '#FFFBEB';
const WHITE         = '#FFFFFF';
const TEXT_DARK     = '#0F172A';
const TEXT_MID      = '#475569';
const TEXT_GRAY     = '#94A3B8';
const BG            = '#F8FAFC';
const BORDER        = '#E2E8F0';

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
  gameSuggestion?:      GameSuggestion | null;
  onPlayNow?:           () => void;
  onDismiss:            () => void;
}

// ============================================================================
// MAIN COMPONENT
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

  // Grade color
  const gradeColor = () => {
    switch (grade?.charAt(0).toUpperCase()) {
      case 'A': return GREEN;
      case 'B': return '#84CC16';
      case 'C': return GOLD;
      case 'D': return ORANGE;
      default:  return '#EF4444';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Your Results</Text>
              <Text style={styles.headerSub}>Essay Evaluation</Text>
            </View>
            <TouchableOpacity
              onPress={onDismiss}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* ── Score Hero ─────────────────────────────────────────────────── */}
          <View style={styles.scoreHero}>
            <View style={[styles.gradeBadge, { borderColor: gradeColor() }]}>
              <Text style={[styles.gradeLetter, { color: gradeColor() }]}>
                {grade}
              </Text>
            </View>
            <Text style={styles.scoreNumber}>{totalScore}</Text>
            <Text style={styles.scoreOutOf}>/100</Text>
          </View>

          {/* ── Scrollable Content ─────────────────────────────────────────── */}
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

            {/* Domain Scores */}
            {rubricScores && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Domain Scores</Text>
                  <Text style={styles.sectionBadge}>out of 20</Text>
                </View>
                {[
                  { label: 'Focus',        score: rubricScores.focus },
                  { label: 'Content',      score: rubricScores.content },
                  { label: 'Organization', score: rubricScores.organization },
                  { label: 'Style',        score: rubricScores.style },
                  { label: 'Conventions',  score: rubricScores.conventions },
                ].map(item => (
                  <DomainScoreRow
                    key={item.label}
                    label={item.label}
                    score={item.score}
                  />
                ))}
              </View>
            )}

            {/* Personalized Feedback */}
            {personalizedFeedback ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Feedback</Text>
                <View style={styles.feedbackCard}>
                  <Text style={styles.feedbackText}>{personalizedFeedback}</Text>
                </View>
              </View>
            ) : null}

            {/* Strengths */}
            {strengths.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: GREEN }]}>
                  ✨ Strengths
                </Text>
                {strengths.map((s, i) => (
                  <View key={i} style={styles.strengthRow}>
                    <View style={styles.strengthDot} />
                    <Text style={styles.bulletText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Areas for Improvement */}
            {areasForImprovement.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: ORANGE }]}>
                  💡 Improve Your Skills
                </Text>
                <Text style={styles.improveSub}>
                  Based on your scores, we recommend:
                </Text>
                {areasForImprovement.map((a, i) => (
                  <View key={i} style={styles.improveRow}>
                    <View style={styles.improveDot} />
                    <Text style={styles.bulletText}>{a}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Practice Suggestion */}
            {gameSuggestion && (
              <PracticeSuggestion
                suggestion={gameSuggestion}
                onPlayNow={onPlayNow}
              />
            )}

            <View style={{ height: 16 }} />
          </ScrollView>

          {/* ── Footer Buttons ─────────────────────────────────────────────── */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerSecondaryBtn}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <Text style={styles.footerSecondaryText}>View Full Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerPrimaryBtn}
              onPress={onDismiss}
              activeOpacity={0.8}
            >
              <Text style={styles.footerPrimaryText}>Continue</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Badge popup */}
        {newBadges.length > 0 && visible && (
          <BadgeUnlockPopup badges={newBadges} />
        )}

      </View>
    </Modal>
  );
};

// ============================================================================
// DOMAIN SCORE ROW
// ============================================================================

interface DomainScoreRowProps {
  label: string;
  score: number;
}

const DomainScoreRow: React.FC<DomainScoreRowProps> = ({ label, score }) => {
  const percent = (score / 20) * 100;

  const barColor = () => {
    if (percent >= 75) return GREEN;
    if (percent >= 50) return GOLD;
    return '#EF4444';
  };

  return (
    <View style={styles.domainRow}>
      <Text style={styles.domainLabel}>{label}</Text>
      <View style={styles.domainRight}>
        <View style={styles.domainBarBg}>
          <View
            style={[
              styles.domainBarFill,
              { width: `${percent}%`, backgroundColor: barColor() },
            ]}
          />
        </View>
        <Text style={styles.domainScore}>{score / 5}/4</Text>
      </View>
    </View>
  );
};

// ============================================================================
// PRACTICE SUGGESTION
// ============================================================================

interface PracticeSuggestionProps {
  suggestion: GameSuggestion;
  onPlayNow?: () => void;
}

const PracticeSuggestion: React.FC<PracticeSuggestionProps> = ({
  suggestion,
  onPlayNow,
}) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: PRIMARY }]}>
      🎮 Practice Suggestions
    </Text>
    <View style={styles.suggestionCard}>

      <View style={styles.suggestionTopRow}>
        <View style={styles.domainPill}>
          <Text style={styles.domainPillText}>{suggestion.domain_label}</Text>
        </View>
        <Text style={styles.suggestionXp}>+50 XP</Text>
      </View>

      <Text style={styles.suggestionGame}>{suggestion.game_name}</Text>
      <Text style={styles.suggestionReason}>{suggestion.reason}</Text>

      <TouchableOpacity
        style={styles.playBtn}
        onPress={onPlayNow}
        activeOpacity={0.85}
      >
        <Text style={styles.playBtnText}>Play Now</Text>
      </TouchableOpacity>

    </View>
  </View>
);

// ============================================================================
// BADGE UNLOCK POPUP
// ============================================================================

interface BadgeUnlockPopupProps {
  badges: NewlyUnlockedBadge[];
}

const BadgeUnlockPopup: React.FC<BadgeUnlockPopupProps> = ({ badges }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible]       = useState(false);
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
      <View style={styles.popupCard}>
        <View style={styles.popupIconCircle}>
          <Text style={styles.popupIcon}>{badge.icon}</Text>
        </View>
        <Text style={styles.popupEyebrow}>🎉 Badge Unlocked!</Text>
        <Text style={styles.popupName}>{badge.name}</Text>
        <Text style={styles.popupDesc}>{badge.description}</Text>
        {badges.length > 1 && (
          <View style={styles.dotRow}>
            {badges.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    overflow: 'hidden',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  headerSub: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: TEXT_MID,
    fontWeight: '600',
  },

  // Score hero
  scoreHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
    backgroundColor: BG,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 8,
  },
  gradeBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  gradeLetter: {
    fontSize: 24,
    fontWeight: '800',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  scoreOutOf: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT_GRAY,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },

  // Section
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 10,
  },
  sectionBadge: {
    fontSize: 12,
    color: TEXT_GRAY,
    fontWeight: '500',
  },

  // Domain row
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  domainLabel: {
    fontSize: 14,
    color: TEXT_MID,
    fontWeight: '500',
    width: 90,
  },
  domainRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  domainBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  domainBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  domainScore: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_DARK,
    width: 28,
    textAlign: 'right',
  },

  // Feedback card
  feedbackCard: {
    backgroundColor: BG,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  feedbackText: {
    fontSize: 14,
    color: TEXT_MID,
    lineHeight: 22,
  },

  // Strengths
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
    marginTop: 6,
  },

  // Improve
  improveSub: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginBottom: 10,
    marginTop: -6,
  },
  improveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  improveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_MID,
    lineHeight: 21,
  },

  // Suggestion card
  suggestionCard: {
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  suggestionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  domainPill: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  domainPillText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
  suggestionXp: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY,
  },
  suggestionGame: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  suggestionReason: {
    fontSize: 13,
    color: TEXT_MID,
    lineHeight: 19,
    marginBottom: 14,
  },
  playBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  playBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerSecondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  footerSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
  },
  footerPrimaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: PRIMARY,
  },
  footerPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: WHITE,
  },

  // Badge popup
  popupContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '15%',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  popupCard: {
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GOLD_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: GOLD,
  },
  popupIcon:    { fontSize: 40 },
  popupEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  popupName: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 6,
  },
  popupDesc: {
    fontSize: 13,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 18,
  },
  dotRow:      { flexDirection: 'row', gap: 6, marginTop: 14 },
  dot:         { width: 7, height: 7, borderRadius: 4 },
  dotActive:   { backgroundColor: GOLD },
  dotInactive: { backgroundColor: '#E5E7EB' },
});

export default FeedbackDialog;