/**
 * Jumbled Story Game (Game 3)
 * Domain: Organization
 * Mechanic: Sentences are shuffled — drag them into the correct order.
 * Timer: Yes — speed bonus if completed under 30 seconds
 * XP: 20-50
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import { JumbledStoryLevel, GameResult } from '../../models/GameModels';

// ─── Pre-seeded Levels ────────────────────────────────────────────────────────

const LEVELS: JumbledStoryLevel[] = [
  {
    id:    'story_1',
    title: 'A Rainy Day',
    sentences: [
      { id: 's1', text: 'The next morning, the sun came out and everything looked fresh and clean.', correctIndex: 5 },
      { id: 's2', text: 'Maria looked out her window and saw dark clouds gathering in the sky.',        correctIndex: 0 },
      { id: 's3', text: 'She grabbed her umbrella and raincoat before heading outside.',               correctIndex: 2 },
      { id: 's4', text: 'Soon, heavy rain began to pour down on the streets.',                        correctIndex: 3 },
      { id: 's5', text: 'She decided to go for a walk despite the gloomy weather.',                   correctIndex: 1 },
      { id: 's6', text: 'Maria ran to a nearby shelter and waited for the rain to stop.',             correctIndex: 4 },
    ],
  },
  {
    id:    'story_2',
    title: 'The Science Fair',
    sentences: [
      { id: 's1', text: 'He spent two weeks building a model volcano for his experiment.',            correctIndex: 1 },
      { id: 's2', text: 'When the volcano erupted with foam, the crowd cheered loudly.',              correctIndex: 3 },
      { id: 's3', text: 'Jake decided to enter the school science fair this year.',                   correctIndex: 0 },
      { id: 's4', text: 'Jake won first place and felt very proud of his hard work.',                 correctIndex: 5 },
      { id: 's5', text: 'On the day of the fair, Jake set up his display nervously.',                 correctIndex: 2 },
      { id: 's6', text: 'The judges asked him many questions about his project.',                     correctIndex: 4 },
    ],
  },
  {
    id:    'story_3',
    title: 'Lost and Found',
    sentences: [
      { id: 's1', text: 'She retraced her steps all the way back to the school cafeteria.',           correctIndex: 2 },
      { id: 's2', text: 'A kind janitor had found it and placed it on the lost and found shelf.',     correctIndex: 4 },
      { id: 's3', text: 'After school, Emma realized her backpack was missing.',                      correctIndex: 0 },
      { id: 's4', text: 'Emma thanked him and promised to be more careful next time.',                correctIndex: 5 },
      { id: 's5', text: 'She asked her teacher if anyone had turned it in, but nobody had.',          correctIndex: 1 },
      { id: 's6', text: 'To her relief, the backpack was sitting right there.',                       correctIndex: 3 },
    ],
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

const shuffleLevel = (level: JumbledStoryLevel) => {
  const shuffled = [...level.sentences].sort(() => Math.random() - 0.5);
  return shuffled;
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface JumbledStoryGameProps {
  onGameComplete: (result: GameResult) => void;
  onExit:         () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const JumbledStoryGame: React.FC<JumbledStoryGameProps> = ({ onGameComplete, onExit }) => {
  const levelIndex  = useRef(Math.floor(Math.random() * LEVELS.length));
  const level       = LEVELS[levelIndex.current];

  const [sentences, setSentences]     = useState(shuffleLevel(level));
  const [selected, setSelected]       = useState<string | null>(null);
  const [submitted, setSubmitted]     = useState(false);
  const [score, setScore]             = useState<number | null>(null);
  const [elapsed, setElapsed]         = useState(0);
  const timerRef                      = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime                     = useRef(Date.now());

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ── Select and swap sentences ─────────────────────────────────────────────
  const handleSentencePress = useCallback((id: string) => {
    if (submitted) return;

    if (selected === null) {
      // First tap — select
      setSelected(id);
    } else if (selected === id) {
      // Tap same — deselect
      setSelected(null);
    } else {
      // Second tap — swap the two
      setSentences(prev => {
        const next  = [...prev];
        const indexA = next.findIndex(s => s.id === selected);
        const indexB = next.findIndex(s => s.id === id);
        [next[indexA], next[indexB]] = [next[indexB], next[indexA]];
        return next;
      });
      setSelected(null);
    }
  }, [selected, submitted]);

  // ── Submit answer ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (submitted) return;
    stopTimer();

    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);

    // Score: count how many sentences are in the correct position
    let correct = 0;
    sentences.forEach((sentence, index) => {
      if (sentence.correctIndex === index) correct++;
    });

    const finalScore = Math.round((correct / sentences.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    setTimeout(() => {
      onGameComplete({
        gameId:    'jumbled_story',
        score:     finalScore,
        timeTaken,
      });
    }, 1500);
  }, [submitted, sentences, onGameComplete]);

  // ── Timer color ───────────────────────────────────────────────────────────
  const timerColor = elapsed <= 20 ? '#22C55E' : elapsed <= 40 ? '#F59E0B' : '#EF4444';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Jumbled Story 📖</Text>
        <View style={[styles.timerBadge, { borderColor: timerColor }]}>
          <Text style={[styles.timerText, { color: timerColor }]}>
            {elapsed}s
          </Text>
        </View>
      </View>

      {/* Story title */}
      <Text style={styles.storyTitle}>{level.title}</Text>

      {/* Instruction */}
      <Text style={styles.instruction}>
        Tap a sentence to select it, then tap another to swap. Put them in the right order!
      </Text>

      {/* Sentences */}
      <ScrollView
        contentContainerStyle={styles.sentencesContainer}
        showsVerticalScrollIndicator={false}
      >
        {sentences.map((sentence, index) => {
          const isSelected = selected === sentence.id;
          const isCorrect  = submitted && sentence.correctIndex === index;
          const isWrong    = submitted && sentence.correctIndex !== index;

          return (
            <TouchableOpacity
              key={sentence.id}
              onPress={() => handleSentencePress(sentence.id)}
              activeOpacity={0.8}
              disabled={submitted}
            >
              <View style={[
                styles.sentenceCard,
                isSelected && styles.sentenceSelected,
                isCorrect  && styles.sentenceCorrect,
                isWrong    && styles.sentenceWrong,
              ]}>
                <View style={[
                  styles.indexBadge,
                  isSelected && styles.indexBadgeSelected,
                  isCorrect  && styles.indexBadgeCorrect,
                  isWrong    && styles.indexBadgeWrong,
                ]}>
                  <Text style={styles.indexText}>{index + 1}</Text>
                </View>
                <Text style={[
                  styles.sentenceText,
                  isSelected && styles.sentenceTextSelected,
                ]}>
                  {sentence.text}
                </Text>
                {isSelected && <Text style={styles.selectedIcon}>↕️</Text>}
                {isCorrect  && <Text style={styles.resultIcon}>✅</Text>}
                {isWrong    && <Text style={styles.resultIcon}>❌</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Submit button */}
      {!submitted && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Check My Order ✓</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Result banner */}
      {submitted && score !== null && (
        <View style={[styles.resultBanner, score >= 80 ? styles.resultBannerWin : styles.resultBannerLose]}>
          <Text style={styles.resultBannerText}>
            {score === 100 ? '🎉 Perfect order!' : score >= 80 ? '⭐ Great job!' : '📖 Keep practising!'}
          </Text>
          <Text style={styles.resultBannerScore}>{score}/100</Text>
        </View>
      )}

    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    paddingTop: 48,
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  exitButton: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center', justifyContent: 'center',
  },
  exitText:    { fontSize: 16, color: '#4F46E5' },
  title:       { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  timerBadge: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText:   { fontSize: 14, fontWeight: '700' },
  storyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  instruction: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 12,
    lineHeight: 17,
  },
  sentencesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 10,
  },
  sentenceCard: {
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
    gap: 10,
  },
  sentenceSelected: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  sentenceCorrect:  { borderColor: '#22C55E', backgroundColor: '#DCFCE7' },
  sentenceWrong:    { borderColor: '#EF4444', backgroundColor: '#FEE2E2' },
  indexBadge: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E7FF',
    alignItems: 'center', justifyContent: 'center',
  },
  indexBadgeSelected: { backgroundColor: '#4F46E5' },
  indexBadgeCorrect:  { backgroundColor: '#22C55E' },
  indexBadgeWrong:    { backgroundColor: '#EF4444' },
  indexText:    { fontSize: 13, fontWeight: '700', color: '#FFF' },
  sentenceText: { flex: 1, fontSize: 14, color: '#1A1A2E', lineHeight: 20 },
  sentenceTextSelected: { color: '#4F46E5', fontWeight: '600' },
  selectedIcon: { fontSize: 16 },
  resultIcon:   { fontSize: 16 },
  footer: {
    position:   'absolute',
    bottom:     24,
    left:       20,
    right:      20,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  resultBanner: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultBannerWin:      { backgroundColor: '#DCFCE7' },
  resultBannerLose:     { backgroundColor: '#FEE2E2' },
  resultBannerText:     { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  resultBannerScore:    { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
});

export default JumbledStoryGame;