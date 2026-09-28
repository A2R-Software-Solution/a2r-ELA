import ScreenBackground from '../../components/ScreenBackground';
import { styles } from './BugCatcherGame.styles';
/**
 * Bug Catcher Game (Game 5)
 * Domain: Conventions
 * Mechanic: Tap the words that contain spelling, grammar, or punctuation errors.
 * Lives: 3 — miss a bug or tap a correct word = lose a life
 * XP: 20-50
 */

import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { BugCatcherLevel, GameResult } from '../../models/GameModels';

// ─── Pre-seeded Levels ────────────────────────────────────────────────────────

const LEVELS: BugCatcherLevel[] = [
  {
    id: 'level_1',
    paragraph: '',
    words: [
      'The', 'dog', 'runned', 'quickly', 'threw', 'the', 'park', 'yesterday,',
      'and', 'it', 'were', 'very', 'exited', 'to', 'see', 'it\'s', 'owner.',
    ],
    errors: [
      { id: 'e1', wordIndex: 2,  word: 'runned',    fix: 'ran',       type: 'grammar'     },
      { id: 'e2', wordIndex: 4,  word: 'threw',     fix: 'through',   type: 'spelling'    },
      { id: 'e3', wordIndex: 10, word: 'were',      fix: 'was',       type: 'grammar'     },
      { id: 'e4', wordIndex: 12, word: 'exited',    fix: 'excited',   type: 'spelling'    },
      { id: 'e5', wordIndex: 15, word: 'it\'s',     fix: 'its',       type: 'punctuation' },
    ],
  },
  {
    id: 'level_2',
    paragraph: '',
    words: [
      'She', 'dont', 'know', 'witch', 'book', 'to', 'chose', 'from',
      'the', 'libary', 'shelfs,', 'so', 'she', 'asked', 'the', 'libarian', 'for', 'help.',
    ],
    errors: [
      { id: 'e1', wordIndex: 1,  word: 'dont',      fix: "don't",     type: 'punctuation' },
      { id: 'e2', wordIndex: 3,  word: 'witch',     fix: 'which',     type: 'spelling'    },
      { id: 'e3', wordIndex: 6,  word: 'chose',     fix: 'choose',    type: 'grammar'     },
      { id: 'e4', wordIndex: 9,  word: 'libary',    fix: 'library',   type: 'spelling'    },
      { id: 'e5', wordIndex: 10, word: 'shelfs,',   fix: 'shelves,',  type: 'grammar'     },
      { id: 'e6', wordIndex: 15, word: 'libarian',  fix: 'librarian', type: 'spelling'    },
    ],
  },
  {
    id: 'level_3',
    paragraph: '',
    words: [
      'Yesterday,', 'me', 'and', 'my', 'frend', 'went', 'to',
      'the', 'store', 'to', 'bye', 'some', 'supplys', 'for',
      'are', 'science', 'project.', 'We', 'buyed', 'everything', 'we', 'needed.',
    ],
    errors: [
      { id: 'e1', wordIndex: 1,  word: 'me',        fix: 'My friend and I', type: 'grammar'  },
      { id: 'e2', wordIndex: 4,  word: 'frend',     fix: 'friend',          type: 'spelling' },
      { id: 'e3', wordIndex: 10, word: 'bye',       fix: 'buy',             type: 'spelling' },
      { id: 'e4', wordIndex: 12, word: 'supplys',   fix: 'supplies',        type: 'grammar'  },
      { id: 'e5', wordIndex: 14, word: 'are',       fix: 'our',             type: 'spelling' },
      { id: 'e6', wordIndex: 18, word: 'buyed',     fix: 'bought',          type: 'grammar'  },
    ],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type WordState = 'default' | 'caught' | 'wrong' | 'missed';

interface BugCatcherGameProps {
  onGameComplete: (result: GameResult) => void;
  onExit:         () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const BugCatcherGame: React.FC<BugCatcherGameProps> = ({ onGameComplete, onExit }) => {
  const levelIndex   = useRef(0);
  const level        = LEVELS[levelIndex.current];

  const [wordStates, setWordStates]       = useState<WordState[]>(
    Array(level.words.length).fill('default')
  );
  const [lives, setLives]                 = useState(3);
  const [caughtCount, setCaughtCount]     = useState(0);
  const [gameOver, setGameOver]           = useState(false);
  const [gameWon, setGameWon]             = useState(false);
  const [feedbackWord, setFeedbackWord]   = useState<string | null>(null);
  const shakeAnim                         = useRef(new Animated.Value(0)).current;

  const totalBugs = level.errors.length;

  // ── Shake animation for wrong tap ────────────────────────────────────────
  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  // ── Handle word tap ───────────────────────────────────────────────────────
  const handleWordTap = useCallback((wordIndex: number) => {
    const errorIndices = new Set(level.errors.map(e => e.wordIndex));
    if (gameOver || gameWon) return;
    if (wordStates[wordIndex] !== 'default') return;

    const isBug = errorIndices.has(wordIndex);

    if (isBug) {
      // Correct — caught a bug
      const newCaught = caughtCount + 1;
      setWordStates(prev => {
        const next = [...prev];
        next[wordIndex] = 'caught';
        return next;
      });
      setCaughtCount(newCaught);
      setFeedbackWord('🐛 Bug caught!');
      setTimeout(() => setFeedbackWord(null), 800);

      if (newCaught === totalBugs) {
        // All bugs caught — win
        setGameWon(true);
        const score = Math.round((newCaught / totalBugs) * 100);
        setTimeout(() => {
          onGameComplete({
            gameId:         'bug_catcher',
            score,
            livesRemaining: lives,
          });
        }, 800);
      }
    } else {
      // Wrong tap — lose a life
      const newLives = lives - 1;
      setWordStates(prev => {
        const next = [...prev];
        next[wordIndex] = 'wrong';
        return next;
      });
      setLives(newLives);
      triggerShake();
      setFeedbackWord('❌ Not a bug!');
      setTimeout(() => setFeedbackWord(null), 800);

      // Reset wrong tap highlight after delay
      setTimeout(() => {
        setWordStates(prev => {
          const next = [...prev];
          if (next[wordIndex] === 'wrong') next[wordIndex] = 'default';
          return next;
        });
      }, 600);

      if (newLives <= 0) {
        // Mark remaining bugs as missed
        setWordStates(prev => {
          const next = [...prev];
          level.errors.forEach(err => {
            if (next[err.wordIndex] !== 'caught') next[err.wordIndex] = 'missed';
          });
          return next;
        });
        setGameOver(true);
        const score = Math.round((caughtCount / totalBugs) * 100);
        setTimeout(() => {
          onGameComplete({
            gameId:         'bug_catcher',
            score,
            livesRemaining: 0,
          });
        }, 1200);
      }
    }
  }, [gameOver, gameWon, wordStates, caughtCount, lives, totalBugs, level.errors, onGameComplete, triggerShake]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScreenBackground />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bug Catcher 🐛</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Lives */}
      <View style={styles.livesRow}>
        <Text style={styles.livesLabel}>Lives: </Text>
        {[1, 2, 3].map(i => (
          <Text key={i} style={styles.heart}>{i <= lives ? '❤️' : '🖤'}</Text>
        ))}
        <Text style={styles.progressText}>
          {caughtCount}/{totalBugs} bugs
        </Text>
      </View>

      {/* Instruction */}
      <Text style={styles.instruction}>
        Tap every word that has a spelling, grammar, or punctuation error.
      </Text>

      {/* Feedback toast */}
      {feedbackWord && (
        <View style={styles.feedbackToast}>
          <Text style={styles.feedbackToastText}>{feedbackWord}</Text>
        </View>
      )}

      {/* Paragraph */}
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <ScrollView contentContainerStyle={styles.paragraphContainer}>
          <View style={styles.wordsWrap}>
            {level.words.map((word, index) => {
              const state = wordStates[index];
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleWordTap(index)}
                  activeOpacity={0.7}
                  disabled={state !== 'default'}
                >
                  <View style={[styles.wordChip, styles[`word_${state}`]]}>
                    <Text style={[styles.wordText, styles[`wordText_${state}`]]}>
                      {word}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Game over banner */}
      {gameOver && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>No lives left! 😢</Text>
          <Text style={styles.bannerSub}>
            Caught {caughtCount} of {totalBugs} bugs
          </Text>
        </View>
      )}

      {gameWon && (
        <View style={[styles.banner, styles.bannerWin]}>
          <Text style={styles.bannerText}>All bugs caught! 🎉</Text>
        </View>
      )}

    </View>
  );
};

export default BugCatcherGame;
