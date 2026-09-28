import ScreenBackground from '../../components/ScreenBackground';
import { styles } from './StayOnTopicGame.styles';
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import {  GameResult } from '../../models/GameModels';

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
interface Sentence {
  id: string;
  text: string;
  isOffTopic: boolean;
}

interface ContentSet {
  topic: string;
  topicEmoji: string;
  sentences: Sentence[];
}
interface StayOnTopicGameProps {
  onGameComplete?: (result: GameResult) => void | Promise<void>;
  onExit?: () => void;
}

// ─────────────────────────────────────────
// CONTENT SETS
// ─────────────────────────────────────────
const CONTENT_SETS: ContentSet[] = [
  {
    topic: 'Photosynthesis',
    topicEmoji: '🌿',
    sentences: [
      { id: 's1', text: 'Plants use sunlight to convert carbon dioxide and water into glucose.', isOffTopic: false },
      { id: 's2', text: 'Chlorophyll is the green pigment that captures light energy in plant cells.', isOffTopic: false },
      { id: 's3', text: 'The Great Wall of China stretches over 13,000 miles across northern China.', isOffTopic: true },
      { id: 's4', text: 'Oxygen is released as a byproduct during the light-dependent reactions.', isOffTopic: false },
      { id: 's5', text: 'Most dogs have an excellent sense of smell, far better than humans.', isOffTopic: true },
      { id: 's6', text: 'Plants store excess glucose as starch in their leaves and stems.', isOffTopic: false },
      { id: 's7', text: 'The stomata on leaves allow gas exchange between the plant and atmosphere.', isOffTopic: false },
      { id: 's8', text: 'Basketball was invented by Dr. James Naismith in 1891 in Massachusetts.', isOffTopic: true },
    ],
  },
  {
    topic: 'The Solar System',
    topicEmoji: '🪐',
    sentences: [
      { id: 's1', text: 'The Solar System consists of eight planets orbiting our star, the Sun.', isOffTopic: false },
      { id: 's2', text: 'Jupiter is the largest planet and has a storm called the Great Red Spot.', isOffTopic: false },
      { id: 's3', text: 'Mount Everest is the highest mountain on Earth at 8,849 meters above sea level.', isOffTopic: true },
      { id: 's4', text: "Saturn's beautiful rings are made of ice particles and rocky debris.", isOffTopic: false },
      { id: 's5', text: 'Shakespeare wrote 37 plays and 154 sonnets during his lifetime.', isOffTopic: true },
      { id: 's6', text: 'Mars is called the Red Planet because of iron oxide on its surface.', isOffTopic: false },
      { id: 's7', text: 'The asteroid belt lies between the orbits of Mars and Jupiter.', isOffTopic: false },
      { id: 's8', text: 'Coffee was first discovered in Ethiopia and is now grown worldwide.', isOffTopic: true },
    ],
  },
  {
    topic: 'The Water Cycle',
    topicEmoji: '💧',
    sentences: [
      { id: 's1', text: 'The water cycle describes the continuous movement of water on Earth.', isOffTopic: false },
      { id: 's2', text: 'Evaporation occurs when sunlight heats water in oceans, lakes, and rivers.', isOffTopic: false },
      { id: 's3', text: "The Eiffel Tower in Paris was built in 1889 for a World's Fair.", isOffTopic: true },
      { id: 's4', text: 'Water vapor rises, cools, and condenses to form clouds in the atmosphere.', isOffTopic: false },
      { id: 's5', text: 'Precipitation falls back to Earth as rain, snow, sleet, or hail.', isOffTopic: false },
      { id: 's6', text: 'Penicillin was discovered by Alexander Fleming in 1928 by accident.', isOffTopic: true },
      { id: 's7', text: 'Groundwater recharges aquifers when precipitation seeps through the soil.', isOffTopic: false },
      { id: 's8', text: 'Transpiration is the process where plants release water vapor through leaves.', isOffTopic: false },
    ],
  },
  {
    topic: 'Ancient Egypt',
    topicEmoji: '🏛️',
    sentences: [
      { id: 's1', text: 'Ancient Egypt flourished along the banks of the Nile River for 3,000 years.', isOffTopic: false },
      { id: 's2', text: 'The Great Pyramid of Giza is the only surviving wonder of the ancient world.', isOffTopic: false },
      { id: 's3', text: 'Pandas are native to central China and eat mostly bamboo shoots.', isOffTopic: true },
      { id: 's4', text: 'Hieroglyphics was the writing system used by ancient Egyptians on monuments.', isOffTopic: false },
      { id: 's5', text: "The Amazon rainforest produces 20% of the world's oxygen supply.", isOffTopic: true },
      { id: 's6', text: 'Pharaohs were considered gods on Earth and ruled with absolute power.', isOffTopic: false },
      { id: 's7', text: 'Mummification preserved bodies so the soul could return after death.', isOffTopic: false },
      { id: 's8', text: 'Wi-Fi technology was invented in Australia in the late 1990s.', isOffTopic: true },
    ],
  },
  {
    topic: 'Human Digestion',
    topicEmoji: '🫀',
    sentences: [
      { id: 's1', text: 'Digestion begins in the mouth where teeth and saliva break down food.', isOffTopic: false },
      { id: 's2', text: 'The stomach uses acids and enzymes to further break down swallowed food.', isOffTopic: false },
      { id: 's3', text: 'The Sahara Desert is the largest hot desert in the world.', isOffTopic: true },
      { id: 's4', text: 'Most nutrient absorption happens in the small intestine over several hours.', isOffTopic: false },
      { id: 's5', text: 'The large intestine absorbs water and prepares waste for elimination.', isOffTopic: false },
      { id: 's6', text: 'The Titanic sank in April 1912 after hitting an iceberg in the Atlantic.', isOffTopic: true },
      { id: 's7', text: 'Bile produced by the liver helps emulsify fats in the small intestine.', isOffTopic: false },
      { id: 's8', text: 'Volleyball was invented in 1895 by William Morgan in Massachusetts.', isOffTopic: true },
    ],
  },
];

// ─────────────────────────────────────────
// XP CALCULATION  (no time factor anymore)
// ─────────────────────────────────────────
const calculateXP = (correct: number, wrong: number, total: number): number => {
  const accuracy = Math.max(0, correct - wrong) / total;
  return Math.max(5, Math.min(50, Math.round(accuracy * 50)));
};

// ─────────────────────────────────────────
// PROGRESS DOTS
// ─────────────────────────────────────────
interface ProgressDotsProps {
  total: number;
  current: number;
  answers: (boolean | null)[];
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current, answers }) => (
  <View style={styles.dotsRow}>
    {Array.from({ length: total }).map((_, i) => {
      const answered = answers[i];
      let bg = '#334155'; // unanswered
      if (answered === true)  bg = '#22c55e'; // correct
      if (answered === false) bg = '#ef4444'; // wrong
      const isCurrent = i === current && answered === null;
      return (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: bg },
            isCurrent && styles.dotActive,
          ]}
        />
      );
    })}
  </View>
);

// ─────────────────────────────────────────
// RESULT SCREEN
// ─────────────────────────────────────────
interface ResultScreenProps {
  result: GameResult;
  topic: string;
  topicEmoji: string;
  onReplay: () => void;
  onExit: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  topic,
  topicEmoji,
  onReplay,
  onExit,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const accuracy = result.accuracy ?? 0;
  const xpEarned = result.xpEarned ?? result.score;

  const getGrade = () => {
    if (accuracy >= 90) return { label: 'PERFECT!',        emoji: '🏆', color: '#f59e0b' };
    if (accuracy >= 70) return { label: 'GREAT!',          emoji: '🎯', color: '#22c55e' };
    if (accuracy >= 50) return { label: 'GOOD TRY',        emoji: '👍', color: '#3b82f6' };
    return               { label: 'KEEP PRACTICING', emoji: '💪', color: '#8b5cf6' };
  };

  const grade = getGrade();

  return (
    <ScrollView
      contentContainerStyle={styles.resultOverlay}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[styles.resultCard, { transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.resultEmoji}>{grade.emoji}</Text>
        <Text style={[styles.resultGrade, { color: grade.color }]}>
          {grade.label}
        </Text>
        <Text style={styles.resultTopic}>{topicEmoji} {topic}</Text>

        <View style={styles.resultStats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>XP Earned</Text>
            <Text style={styles.statValueXP}>+{xpEarned} XP</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Accuracy</Text>
            <Text style={styles.statValue}>{accuracy}%</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Correct</Text>
            <Text style={[styles.statValue, styles.textColor]}>
              ✓ {result.correctRemovals ?? 0}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Wrong</Text>
            <Text style={[styles.statValue, styles.textColor2]}>
              ✗ {result.wrongRemovals ?? 0}
            </Text>
          </View>
        </View>

        {result.badge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeEmoji}>🏅</Text>
            <Text style={styles.badgeText}>Badge Unlocked: {result.badge}</Text>
          </View>
        )}

        <View style={styles.resultButtons}>
          <TouchableOpacity style={styles.replayBtn} onPress={onReplay}>
            <Text style={styles.replayBtnText}>▶ Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
            <Text style={styles.exitBtnText}>✕ Exit</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

// ─────────────────────────────────────────
// MAIN GAME COMPONENT
// ─────────────────────────────────────────
const StayOnTopicGame: React.FC<StayOnTopicGameProps> = ({
  onGameComplete,
  onExit,

}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);       // which sentence we're on
  const [answers, setAnswers] = useState<(boolean | null)[]>([]); // null = unanswered
  const [selected, setSelected] = useState<'on' | 'off' | null>(null); // what user tapped
  const [result, setResult] = useState<GameResult | null>(null);
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  const currentSet = CONTENT_SETS[currentSetIndex];
  const sentences = currentSet?.sentences ?? [];
  const currentSentence = sentences[currentIndex];
  const isAnswered = selected !== null;
  const isCorrect =
  isAnswered && currentSentence
    ? answers[currentIndex] === true
    : null;

const feedbackColor = !isAnswered
  ? '#334155'
  : isCorrect
  ? '#22c55e' // green
  : '#ef4444'; // red

const feedbackLabel = !isAnswered
  ? ''
  : isCorrect
  ? 'Correct!'
  : 'Wrong!';

const feedbackHint = !isAnswered
  ? ''
  : isCorrect
  ? 'Nice job — this fits the topic.'
  : 'Oops — this does not match the topic.';

  // ── Init ──
  const initGame = useCallback(() => {
    const idx = Math.floor(Math.random() * CONTENT_SETS.length);
    setCurrentSetIndex(idx);
    setCurrentIndex(0);
    setAnswers(new Array(CONTENT_SETS[idx].sentences.length).fill(null));
    setSelected(null);
    setResult(null);
    feedbackAnim.setValue(0);
  }, [feedbackAnim]);

 const startGame = () => {
  console.log("START GAME CLICKED");
  initGame();

  setTimeout(() => {
    setGameState('playing');
  }, 100);
};

  // ── Animate feedback card ──
  const animateFeedback = () => {
    feedbackAnim.setValue(0);
    Animated.spring(feedbackAnim, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  // ── User taps "On Topic" or "Off Topic" ──
 const handleAnswer = (userSaysOffTopic: boolean) => {
  if (isAnswered || !currentSentence) return;

  const isCorrect = userSaysOffTopic === currentSentence.isOffTopic;
    const choice = userSaysOffTopic ? 'off' : 'on';

    setSelected(choice);
    setAnswers(prev => {
      const updated = [...prev];
      updated[currentIndex] = isCorrect;
      return updated;
    });
    animateFeedback();
  };

  // ── Move to next sentence or finish ──
  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= sentences.length) {
      finishGame();
    } else {
      setCurrentIndex(nextIndex);
      setSelected(null);
      feedbackAnim.setValue(0);
    }
  };

  // ── Finish and calculate result ──
 const finishGame = useCallback(() => {
  const correct = answers.filter(a => a === true).length;
  const wrong   = answers.filter(a => a === false).length;
  const total   = answers.length;

  const accuracy = Math.round((correct / total) * 100);
  const xpEarned = calculateXP(correct, wrong, total);
  const badge = accuracy === 100 ? 'Sharp Shooter' : null;

  const gameResult: GameResult = {
    gameId: 'stay_on_topic',
    score: accuracy,
    accuracy,
    badge,
    correctRemovals: correct,
    wrongRemovals: wrong,
    missedRemovals: 0,
    xpEarned,
  };

  setResult(gameResult);
  onGameComplete?.(gameResult);
  setGameState('result');

}, [answers, onGameComplete]);

  // ─────────────────────────────────────────
  // INTRO SCREEN
  // ─────────────────────────────────────────
  if (gameState === 'intro') {
    return (
      <SafeAreaView style={styles.safeArea}>
      <ScreenBackground />
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.introContainer}>
          <View style={styles.introIconWrap}>
            <Text style={styles.introIcon}>🎯</Text>
          </View>

          <Text style={styles.introTitle}>Stay on Topic!</Text>
          <Text style={styles.introSubtitle}>Game 3 · Focus</Text>
          <View style={styles.introDivider} />

          <Text style={styles.introDescription}>
            Each sentence belongs to a topic.{'\n'}
            <Text style={styles.introHighlight}>Decide if it belongs or not!</Text>
          </Text>

          <View style={styles.introRules}>
            {[
              { emoji: '👆', text: 'Tap "On Topic" if the sentence fits the topic' },
              { emoji: '🚫', text: 'Tap "Off Topic" if the sentence does not fit' },
              { emoji: '✅', text: 'Green = correct, Red = wrong — then move to next' },
              { emoji: '⭐', text: 'Earn up to 50 XP + Sharp Shooter badge' },
            ].map((rule, i) => (
              <View key={i} style={styles.ruleRow}>
                <Text style={styles.ruleEmoji}>{rule.emoji}</Text>
                <Text style={styles.ruleText}>{rule.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={startGame}
            activeOpacity={0.85}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>

          {onExit && (
            <TouchableOpacity onPress={onExit} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Back to Games</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────
  // RESULT SCREEN
  // ─────────────────────────────────────────
  if (gameState === 'result' && result) {
    return (
      <SafeAreaView style={styles.safeArea}>
      <ScreenBackground />
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ResultScreen
          result={result}
          topic={currentSet.topic}
          topicEmoji={currentSet.topicEmoji}
          onReplay={startGame}
          onExit={onExit ?? (() => setGameState('intro'))}
        />
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────
  // GAME SCREEN
  // ─────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenBackground />
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* ── Header ── */}
      <View style={styles.gameHeader}>
        <View>
          <Text style={styles.topicLabel}>Topic</Text>
          <Text style={styles.topicName}>
            {currentSet.topicEmoji} {currentSet.topic}
          </Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{sentences.length}
          </Text>
        </View>
      </View>

      {/* ── Progress dots ── */}
      <ProgressDots
        total={sentences.length}
        current={currentIndex}
        answers={answers}
      />


      {/* ── Sentence card ── */}
      <View style={styles.sentenceWrapper}>
        <Text style={styles.questionLabel}>Does this sentence belong?</Text>

        <Animated.View
          style={[
            styles.sentenceCard,
            isAnswered && {
              borderColor: feedbackColor,
              borderWidth: 2,
            },
            {
              transform: [
                {
                  scale: feedbackAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.02, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.sentenceText}>{currentSentence?.text}</Text>
        </Animated.View>

        {/* ── Feedback banner (shown after answer) ── */}
        {isAnswered && (
          <Animated.View
            style={[
              styles.feedbackBanner,
              { backgroundColor: feedbackColor + '22', borderColor: feedbackColor },
              {
                opacity: feedbackAnim,
                transform: [
                  {
                    translateY: feedbackAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.feedbackLabel, { color: feedbackColor }]}>
              {feedbackLabel}
            </Text>
            <Text style={[styles.feedbackHint, { color: feedbackColor }]}>
              {feedbackHint}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* ── Answer buttons ── */}
      {!isAnswered ? (
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={styles.onTopicBtn}
            onPress={() => handleAnswer(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.onTopicBtnText}>✓ On Topic</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.offTopicBtn}
            onPress={() => handleAnswer(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.offTopicBtnText}>✕ Off Topic</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ── Next button (shown after answer) ── */
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {currentIndex + 1 < sentences.length ? 'Next →' : 'See Results'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default StayOnTopicGame;
