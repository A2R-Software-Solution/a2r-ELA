import { styles, PRIMARY, GREEN, ORANGE, GOLD } from './FeedbackDialog.styles';
/**
 * FeedbackDialog Component
 * ✅ Redesigned with new color system
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Animated } from 'react-native';
import { RubricScores, GameSuggestion } from '../../../models/EssayModels';
import { NewlyUnlockedBadge } from '../../../models/GamificationModels';

// ============================================================================
// CONSTANTS
// ============================================================================


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

            <View style={styles.viewHeight} />
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

  useEffect(() => {
    let active = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (callback: () => void, delay: number) => {
      timers.push(setTimeout(() => { if (active) callback(); }, delay));
    };
  const showBadge = (index: number) => {
    if (!active || index >= badges.length) return;
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
      schedule(() => {
        Animated.timing(opacityAnim, {
          toValue: 0, duration: POPUP_FADE_OUT_MS, useNativeDriver: true,
        }).start(() => {
          setIsVisible(false);
          if (index + 1 < badges.length) {
            schedule(() => showBadge(index + 1), 300);
          }
        });
      }, POPUP_VISIBLE_MS);
    });
  };

    schedule(() => showBadge(0), 600);
    return () => {
      active = false;
      timers.forEach(clearTimeout);
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [badges, scaleAnim, opacityAnim]);

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

export default FeedbackDialog;
