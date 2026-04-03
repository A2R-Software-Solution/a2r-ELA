import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
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
  }, []);

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
            <Text style={[styles.statValue, { color: '#a855f7' }]}>
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
          style={{ flex: 1 }}
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

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d0d1a' },

  // ── Intro ──
  introContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  introIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  introIcon: { fontSize: 44 },
  introTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: -0.5,
  },
  introSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  introDivider: {
    width: 48,
    height: 3,
    backgroundColor: '#a855f7',
    borderRadius: 2,
    marginVertical: 20,
  },
  introDescription: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  introHighlight: { color: '#a855f7', fontWeight: '700' },
  introRules: {
    width: '100%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 18,
    gap: 14,
    marginBottom: 28,
  },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ruleEmoji: { fontSize: 20, width: 28 },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    fontWeight: '500',
  },
  startButton: {
    width: '100%',
    backgroundColor: '#a855f7',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  backLink: { marginTop: 16, padding: 8 },
  backLinkText: { color: '#64748b', fontSize: 14, fontWeight: '600' },

  // ── Game Header ──
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  topicLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  topicName: {
    fontSize: 17,
    color: '#f1f5f9',
    fontWeight: '800',
    marginTop: 2,
  },
  counterBadge: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2d2d4e',
  },
  counterText: { fontSize: 15, fontWeight: '800', color: '#a855f7' },

  // ── Progress bar ──
  progressBarBg: {
    height: 4,
    backgroundColor: '#1a1a2e',
    marginHorizontal: 18,
    borderRadius: 2,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#a855f7',
    borderRadius: 2,
  },

  // ── Game content ──
  gameContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    gap: 16,
  },

  // ── Instruction ──
  instructionBanner: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#a855f7',
  },
  instructionText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  underlineDemo: {
    color: '#a855f7',
    textDecorationLine: 'underline',
    fontWeight: '700',
  },

  // ── Sentence card ──
  sentenceCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#2d2d4e',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    gap: 14,
  },
  sentenceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a855f7',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sentenceText: {
    fontSize: 19,
    lineHeight: 32,
    color: '#e2e8f0',
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  sentenceTextPart: {
    color: '#e2e8f0',
    fontSize: 19,
    fontWeight: '500',
  },
  swapWord: {
    fontSize: 19,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  swapWordEmpty:  { color: '#a855f7', textDecorationColor: '#a855f7' },
  swapWordFilled: { color: '#22c55e', textDecorationColor: '#22c55e' },

  // ── Swap chips ──
  swapStatusRow: { gap: 10 },
  swapChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2d2d4e',
    gap: 10,
  },
  swapChipFilled: { borderColor: '#22c55e44', backgroundColor: '#14532d22' },
  swapChipOld: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  swapChipOldDone: { color: '#475569' },
  swapChipArrow: { fontSize: 14, color: '#475569', fontWeight: '700' },
  swapChipNew: { flex: 1, fontSize: 14, fontWeight: '700', color: '#22c55e' },
  swapChipNewEmpty: { color: '#a855f7', fontStyle: 'italic', fontWeight: '500' },

  hintText: { fontSize: 12, color: '#475569', textAlign: 'center', fontWeight: '600' },

  // ── Bottom row ──
  bottomRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 10,
  },
  skipBtn: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d2d4e',
  },
  skipBtnText: { color: '#64748b', fontSize: 14, fontWeight: '700' },
  nextBtn: {
    flex: 1,
    backgroundColor: '#a855f7',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  nextBtnDisabled: { backgroundColor: '#1a1a2e', shadowOpacity: 0, elevation: 0 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  // ── Word Bank Panel (inline, replaces Modal) ──
  wordBankPanel: {
    flex: 1,
    backgroundColor: '#13131f',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
    gap: 16,
    borderTopWidth: 1,
    borderColor: '#2d2d4e',
    marginTop: 8,
  },
  wordBankHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#2d2d4e',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#f1f5f9', textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', fontWeight: '500' },
  modalBoring: {
    color: '#64748b',
    fontStyle: 'italic',
    textDecorationLine: 'line-through',
  },
  wordBankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  wordChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2d2d4e',
    minWidth: 100,
    alignItems: 'center',
  },
  wordChipSelected: { backgroundColor: '#3b0764', borderColor: '#a855f7' },
  wordChipText: { fontSize: 15, color: '#94a3b8', fontWeight: '600' },
  wordChipTextSelected: { color: '#e9d5ff', fontWeight: '800' },
  confirmBtn: {
    backgroundColor: '#a855f7',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  confirmBtnDisabled: { backgroundColor: '#1a1a2e' },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  cancelLink: { alignItems: 'center', padding: 6 },
  cancelLinkText: { color: '#475569', fontSize: 14, fontWeight: '600' },

  // ── Result ──
  resultOverlay: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#0d0d1a',
  },
  resultCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d2d4e',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  resultEmoji: { fontSize: 56, marginBottom: 8 },
  resultGrade: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginBottom: 20 },
  resultStats: { width: '100%', gap: 10, marginBottom: 20 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#0d0d1a',
    borderRadius: 10,
  },
  statLabel: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  statValue: { fontSize: 15, color: '#f1f5f9', fontWeight: '800' },
  statValueXP: { fontSize: 17, color: '#a855f7', fontWeight: '900' },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#a855f722',
    borderWidth: 1,
    borderColor: '#a855f766',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  badgeEmoji: { fontSize: 22 },
  badgeText: { fontSize: 14, color: '#a855f7', fontWeight: '800' },
  resultButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  replayBtn: {
    flex: 1,
    backgroundColor: '#a855f7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  replayBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  exitBtn: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d2d4e',
  },
  exitBtnText: { color: '#94a3b8', fontSize: 15, fontWeight: '700' },
});

export default WordSwapGame;