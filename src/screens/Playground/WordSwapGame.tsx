import ScreenBackground from '../../components/ScreenBackground';
import { styles } from './WordSwapGame.styles';
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { GameResult } from '../../models/GameModels';

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
interface SwapWord {
  id: string;
  boring: string;
  options: string[];
  best: string;
}

interface Challenge {
  id: string;
  sentence: string; // uses {SWAP_id} placeholders
  swaps: SwapWord[];
}

interface WordSwapGameProps {
  onGameComplete?: (result: GameResult) => void;
  onExit?: () => void;
}

// ─────────────────────────────────────────
// CHALLENGES
// ─────────────────────────────────────────
const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    sentence: 'The {SWAP_w1} dog ran {SWAP_w2} across the yard.',
    swaps: [
      { id: 'w1', boring: 'big',     options: ['massive','large','huge','enormous'],         best: 'enormous'   },
      { id: 'w2', boring: 'quickly', options: ['swiftly','fast','hastily','bolted'],          best: 'bolted'     },
    ],
  },
  {
    id: 'c2',
    sentence: 'She {SWAP_w1} at the {SWAP_w2} sunset from the hilltop.',
    swaps: [
      { id: 'w1', boring: 'looked', options: ['gazed','stared','glanced','watched'],          best: 'gazed'          },
      { id: 'w2', boring: 'nice',   options: ['breathtaking','pretty','beautiful','vivid'],   best: 'breathtaking'   },
    ],
  },
  {
    id: 'c3',
    sentence: 'The {SWAP_w1} wind made the old house {SWAP_w2} all night.',
    swaps: [
      { id: 'w1', boring: 'strong',     options: ['howling','fierce','powerful','gusty'],         best: 'howling'  },
      { id: 'w2', boring: 'make noise', options: ['groan','rattle','creak','shudder'],            best: 'shudder'  },
    ],
  },
  {
    id: 'c4',
    sentence: 'The chef {SWAP_w1} the vegetables and made a {SWAP_w2} dish.',
    swaps: [
      { id: 'w1', boring: 'cut',  options: ['diced','chopped','sliced','minced'],                 best: 'minced'      },
      { id: 'w2', boring: 'good', options: ['delectable','tasty','delicious','savory'],            best: 'delectable'  },
    ],
  },
  {
    id: 'c5',
    sentence: 'The {SWAP_w1} child {SWAP_w2} through the pile of autumn leaves.',
    swaps: [
      { id: 'w1', boring: 'happy', options: ['gleeful','cheerful','joyful','excited'],             best: 'gleeful'   },
      { id: 'w2', boring: 'ran',   options: ['dashed','leaped','sprinted','bounded'],              best: 'bounded'   },
    ],
  },
  {
    id: 'c6',
    sentence: 'Thunder {SWAP_w1} across the sky as {SWAP_w2} rain began to fall.',
    swaps: [
      { id: 'w1', boring: 'moved', options: ['rumbled','rolled','echoed','crashed'],               best: 'rumbled'     },
      { id: 'w2', boring: 'heavy', options: ['torrential','thick','pouring','relentless'],         best: 'torrential'  },
    ],
  },
  {
    id: 'c7',
    sentence: 'The old map {SWAP_w1} a {SWAP_w2} treasure buried beneath the tree.',
    swaps: [
      { id: 'w1', boring: 'showed', options: ['revealed','marked','hinted','uncovered'],           best: 'revealed'  },
      { id: 'w2', boring: 'lot of', options: ['trove of','pile of','cache of','heap of'],          best: 'trove of'  },
    ],
  },
  {
    id: 'c8',
    sentence: 'The scientist made a {SWAP_w1} discovery that {SWAP_w2} the world.',
    swaps: [
      { id: 'w1', boring: 'big',     options: ['groundbreaking','remarkable','major','significant'], best: 'groundbreaking' },
      { id: 'w2', boring: 'changed', options: ['revolutionized','transformed','altered','reshaped'], best: 'revolutionized' },
    ],
  },
];

// ─────────────────────────────────────────
// XP CALCULATION
// ─────────────────────────────────────────
const calculateXP = (bestPicks: number, totalSwaps: number): number => {
  const ratio = bestPicks / totalSwaps;
  return Math.max(10, Math.min(40, Math.round(ratio * 40)));
};

// ─────────────────────────────────────────
// PARSE SENTENCE INTO SEGMENTS
// ─────────────────────────────────────────
type Segment =
  | { type: 'text'; value: string }
  | { type: 'swap'; swapId: string; boring: string };

const parseSegments = (sentence: string, swaps: SwapWord[]): Segment[] => {
  const segments: Segment[] = [];
  let remaining = sentence;
  while (remaining.length > 0) {
    const nextMatch = remaining.match(/\{SWAP_(\w+)\}/);
    if (!nextMatch || nextMatch.index === undefined) {
      segments.push({ type: 'text', value: remaining });
      break;
    }
    if (nextMatch.index > 0) {
      segments.push({ type: 'text', value: remaining.slice(0, nextMatch.index) });
    }
    const swapId = nextMatch[1];
    const swap = swaps.find(s => s.id === swapId);
    segments.push({ type: 'swap', swapId, boring: swap?.boring ?? swapId });
    remaining = remaining.slice(nextMatch.index + nextMatch[0].length);
  }
  return segments;
};

// ─────────────────────────────────────────
// RESULT SCREEN
// ─────────────────────────────────────────
interface ResultScreenProps {
  result: GameResult;
  onReplay: () => void;
  onExit: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onReplay, onExit }) => {
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
    if (accuracy >= 90) return { label: 'WORD WIZARD!',    emoji: '🧙', color: '#a855f7' };
    if (accuracy >= 70) return { label: 'GREAT STYLE!',    emoji: '✨', color: '#f59e0b' };
    if (accuracy >= 50) return { label: 'GOOD EFFORT',     emoji: '👍', color: '#3b82f6' };
    return               { label: 'KEEP PRACTICING', emoji: '💪', color: '#64748b' };
  };

  const grade = getGrade();

  return (
    <ScrollView
      contentContainerStyle={styles.resultOverlay}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.resultCard, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.resultEmoji}>{grade.emoji}</Text>
        <Text style={[styles.resultGrade, { color: grade.color }]}>{grade.label}</Text>

        <View style={styles.resultStats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>XP Earned</Text>
            <Text style={styles.statValueXP}>+{xpEarned} XP</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Best Word Picks</Text>
            <Text style={[styles.statValue, styles.textColor]}>
              ⭐ {result.correctRemovals ?? 0}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Accuracy</Text>
            <Text style={styles.statValue}>{accuracy}%</Text>
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
// WORD BANK PANEL  (inline — no Modal)
// ✅ FIX: Replaced <Modal> with inline View to avoid
//         "Property 'err' doesn't exist" native crash
// ─────────────────────────────────────────
interface WordBankPanelProps {
  swap: SwapWord;
  selectedWord: string | null;
  onSelect: (word: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const WordBankPanel: React.FC<WordBankPanelProps> = ({
  swap,
  selectedWord,
  onSelect,
  onConfirm,
  onCancel,
}) => (
  <View style={styles.wordBankPanel}>
    <View style={styles.wordBankHandle} />
    <Text style={styles.modalTitle}>Choose a better word</Text>
    <Text style={styles.modalSubtitle}>
      Replace{' '}
      <Text style={styles.modalBoring}>"{swap.boring}"</Text>
      {' '}with:
    </Text>

    <View style={styles.wordBankGrid}>
      {swap.options.map(word => {
        const isSelected = selectedWord === word;
        return (
          <TouchableOpacity
            key={word}
            style={[styles.wordChip, isSelected && styles.wordChipSelected]}
            onPress={() => onSelect(word)}
            activeOpacity={0.75}
          >
            <Text style={[styles.wordChipText, isSelected && styles.wordChipTextSelected]}>
              {word}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    <TouchableOpacity
      style={[styles.confirmBtn, !selectedWord && styles.confirmBtnDisabled]}
      onPress={onConfirm}
      disabled={!selectedWord}
      activeOpacity={0.85}
    >
      <Text style={styles.confirmBtnText}>Confirm ✓</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={onCancel} style={styles.cancelLink}>
      <Text style={styles.cancelLinkText}>Cancel</Text>
    </TouchableOpacity>
  </View>
);

// ─────────────────────────────────────────
// MAIN GAME COMPONENT
// ─────────────────────────────────────────
const WordSwapGame: React.FC<WordSwapGameProps> = ({ onGameComplete, onExit }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [challengeIndex, setChallengeIndex] = useState(0);

  // selections[challengeIdx][swapId] = chosen word
  const [selections, setSelections]     = useState<Record<number, Record<string, string>>>({});
  const selectionsRef                   = useRef<Record<number, Record<string, string>>>({});

  // word bank panel state
  const [panelVisible, setPanelVisible]       = useState(false);
  const [activeSwap, setActiveSwap]           = useState<SwapWord | null>(null);
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [tempSelection, setTempSelection]     = useState<string | null>(null);

  const [result, setResult] = useState<GameResult | null>(null);
  const feedbackAnim = useRef(new Animated.Value(1)).current;

  const challenge        = CHALLENGES[challengeIndex];
  const segments         = parseSegments(challenge.sentence, challenge.swaps);
  const currentSelections = selections[challengeIndex] ?? {};
  const allFilled        = challenge.swaps.every(s => !!currentSelections[s.id]);

  // ── Init ──
  const initGame = useCallback(() => {
    setChallengeIndex(0);
    setSelections({});
    selectionsRef.current = {};
    setResult(null);
    setPanelVisible(false);
    setActiveSwap(null);
    setTempSelection(null);
  }, []);

  const startGame = () => {
    initGame();
    setGameState('playing');
  };

  // ── Open word bank ──
  const openWordBank = (swap: SwapWord, cIdx: number) => {
    setActiveSwap(swap);
    setActiveChallengeIdx(cIdx);
    setTempSelection(selections[cIdx]?.[swap.id] ?? null);
    setPanelVisible(true);
  };

  // ── Confirm selection ──
  const confirmSelection = () => {
    if (!activeSwap || !tempSelection) return;

    // ✅ Update both state AND ref so finishGame always has fresh data
    const updated = {
      ...selectionsRef.current,
      [activeChallengeIdx]: {
        ...(selectionsRef.current[activeChallengeIdx] ?? {}),
        [activeSwap.id]: tempSelection,
      },
    };
    selectionsRef.current = updated;
    setSelections(updated);
    setPanelVisible(false);
    setTempSelection(null);

    Animated.sequence([
      Animated.timing(feedbackAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(feedbackAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  // ── Skip current challenge ──
  const handleSkip = () => {
    setPanelVisible(false);
    const nextIdx = challengeIndex + 1;
    if (nextIdx >= CHALLENGES.length) {
      finishGame();
    } else {
      setChallengeIndex(nextIdx);
    }
  };

  // ── Next challenge or finish ──
  const handleNext = () => {
    const nextIdx = challengeIndex + 1;
    if (nextIdx >= CHALLENGES.length) {
      finishGame();
    } else {
      setChallengeIndex(nextIdx);
    }
  };

  // ── Finish ──
  // ✅ FIX: Uses selectionsRef.current (always fresh) instead of
  //         selections state (stale closure inside useCallback)
  const finishGame = useCallback(() => {
    let bestPicks  = 0;
    let totalSwaps = 0;

    CHALLENGES.forEach((ch, cIdx) => {
      ch.swaps.forEach(sw => {
        totalSwaps++;
        const chosen = selectionsRef.current[cIdx]?.[sw.id];
        if (chosen === sw.best) bestPicks++;
      });
    });

    const accuracy = Math.round((bestPicks / totalSwaps) * 100);
    const xpEarned = calculateXP(bestPicks, totalSwaps);
    const badge    = accuracy >= 90 ? 'Word Wizard' : null;

    const gameResult: GameResult = {
      gameId:          'word_swap',
      score:           accuracy,
      accuracy,
      badge,
      correctRemovals: bestPicks,
      wrongRemovals:   totalSwaps - bestPicks,
      missedRemovals:  0,
      xpEarned,
    };

    setResult(gameResult);
    onGameComplete?.(gameResult);
    setGameState('result');
  }, [onGameComplete]);

  // ─────────────────────────────────────────
  // INTRO SCREEN
  // ─────────────────────────────────────────
  if (gameState === 'intro') {
    return (
      <SafeAreaView style={styles.safeArea}>
      <ScreenBackground />
        <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />
        <View style={styles.introContainer}>
          <View style={styles.introIconWrap}>
            <Text style={styles.introIcon}>✍️</Text>
          </View>
          <Text style={styles.introTitle}>Word Swap!</Text>
          <Text style={styles.introSubtitle}>Game 4 · Style</Text>
          <View style={styles.introDivider} />
          <Text style={styles.introDescription}>
            Boring sentences are waiting for{'\n'}
            <Text style={styles.introHighlight}>your vivid vocabulary!</Text>
          </Text>
          <View style={styles.introRules}>
            {[
              { emoji: '👆', text: 'Tap the underlined word to open the word bank' },
              { emoji: '💡', text: 'Pick the most exciting, vivid replacement' },
              { emoji: '⏭️', text: 'Not sure? Tap Skip to move to the next sentence' },
              { emoji: '⭐', text: 'Best picks earn more XP — up to 40 XP total' },
            ].map((rule, i) => (
              <View key={i} style={styles.ruleRow}>
                <Text style={styles.ruleEmoji}>{rule.emoji}</Text>
                <Text style={styles.ruleText}>{rule.text}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.85}>
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
        <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />
        <ResultScreen
          result={result}
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
      <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />

      {/* ── Header ── */}
      <View style={styles.gameHeader}>
        <View>
          <Text style={styles.topicLabel}>Word Swap Challenge</Text>
          <Text style={styles.topicName}>✍️ Style your sentence</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{challengeIndex + 1}/{CHALLENGES.length}</Text>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${(challengeIndex / CHALLENGES.length) * 100}%` as any },
          ]}
        />
      </View>

      {/* ── Main content OR Word Bank Panel ── */}
      {panelVisible && activeSwap ? (
        // ✅ Inline panel replaces Modal — no native crash
        <WordBankPanel
          swap={activeSwap}
          selectedWord={tempSelection}
          onSelect={setTempSelection}
          onConfirm={confirmSelection}
          onCancel={() => { setPanelVisible(false); setTempSelection(null); }}
        />
      ) : (
        <ScrollView
          style={styles.scrollViewFlex}
          contentContainerStyle={styles.gameContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Instruction ── */}
          <View style={styles.instructionBanner}>
            <Text style={styles.instructionText}>
              Tap the{' '}
              <Text style={styles.underlineDemo}>underlined</Text>
              {' '}words to swap them
            </Text>
          </View>

          {/* ── Sentence card ── */}
          <Animated.View
            style={[styles.sentenceCard, { transform: [{ scale: feedbackAnim }] }]}
          >
            <Text style={styles.sentenceLabel}>MAKE IT VIVID</Text>
            <Text style={styles.sentenceText}>
              {segments.map((seg, i) => {
                if (seg.type === 'text') {
                  return (
                    <Text key={i} style={styles.sentenceTextPart}>
                      {seg.value}
                    </Text>
                  );
                }
                const swap   = challenge.swaps.find(s => s.id === seg.swapId)!;
                const chosen = currentSelections[seg.swapId];
                return (
                  <Text
                    key={i}
                    onPress={() => openWordBank(swap, challengeIndex)}
                    style={[styles.swapWord, chosen ? styles.swapWordFilled : styles.swapWordEmpty]}
                  >
                    {chosen ?? seg.boring}
                  </Text>
                );
              })}
            </Text>
          </Animated.View>

          {/* ── Swap slot status chips ── */}
          <View style={styles.swapStatusRow}>
            {challenge.swaps.map(sw => {
              const chosen = currentSelections[sw.id];
              return (
                <TouchableOpacity
                  key={sw.id}
                  style={[styles.swapChip, chosen && styles.swapChipFilled]}
                  onPress={() => openWordBank(sw, challengeIndex)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.swapChipOld, chosen && styles.swapChipOldDone]}>
                    {sw.boring}
                  </Text>
                  <Text style={styles.swapChipArrow}>→</Text>
                  <Text style={[styles.swapChipNew, !chosen && styles.swapChipNewEmpty]}>
                    {chosen ?? 'tap to pick'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {!allFilled && (
            <Text style={styles.hintText}>
              {challenge.swaps.filter(s => !currentSelections[s.id]).length} word
              {challenge.swaps.filter(s => !currentSelections[s.id]).length > 1 ? 's' : ''} left to swap
            </Text>
          )}
        </ScrollView>
      )}

      {/* ── Bottom buttons (hidden when word bank panel is open) ── */}
      {!panelVisible && (
        <View style={styles.bottomRow}>
          {/* Skip button — always visible */}
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.skipBtnText}>Skip ⏭</Text>
          </TouchableOpacity>

          {/* Next / See Results — only active when all filled */}
          <TouchableOpacity
            style={[styles.nextBtn, !allFilled && styles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!allFilled}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>
              {challengeIndex + 1 < CHALLENGES.length ? 'Next →' : 'See Results'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WordSwapGame;
