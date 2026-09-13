import ScreenBackground from '../../components/ScreenBackground';
import { colors } from '../../theme/colors';
/**
 * CreateCustomTestScreen
 * Allows students to configure a custom practice test
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreateTest } from './hooks/useCreateTest';
import DifficultyCard         from './components/DifficultyCard';
import QuestionSlider         from './components/QuestionSlider';
import RadarChart             from './components/RadarChart';
import QuickPresetCard        from './components/QuickPresetCard';
import StickyBottomCard       from './components/StickyBottomCard';
import TestConfirmationSheet  from './components/TestConfirmationSheet';
import {
  Difficulty,
  DIFFICULTY_CONFIG,
  QUICK_PRESETS,
} from './types/CreateTestUiState';

// ============================================================================
// PROPS
// ============================================================================

interface CreateCustomTestScreenProps {
  onBackClick:          () => void;
  onNavigateToInstructions: (config: {
    difficulty:    string;
    mcq:           number;
    comprehension: number;
    writing:       number;
    total:         number;
    estimatedTime: string;
    xpReward:      number;
  }) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIMARY    = colors.primary;
const BG = colors.background;
const TEXT_DARK  = colors.text;
const TEXT_MID   = colors.muted;
const TEXT_GRAY  = colors.subtle;
const BORDER     = colors.border;

// ============================================================================
// SCREEN
// ============================================================================

const CreateCustomTestScreen: React.FC<CreateCustomTestScreenProps> = ({
  onBackClick,
  onNavigateToInstructions,
}) => {
  const insets = useSafeAreaInsets();

  const {
    uiState,
    estimatedTimeLabel,
    onDifficultyChange,
    onMcqChange,
    onComprehensionChange,
    onWritingChange,
    onPresetSelect,
    onStartTestPress,
    onConfirmSheetClose,
    onConfirmStart,
  } = useCreateTest(onNavigateToInstructions);

  const difficultyConfig = DIFFICULTY_CONFIG[uiState.selectedDifficulty];

  return (
    <View style={styles.wrapper}>
      <ScreenBackground />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBackClick}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Create Custom Test</Text>
          <Text style={styles.headerSub}>
            Build a practice test that fits your goals.
          </Text>
        </View>

        {/* XP Reward pill */}
        <View style={styles.xpPill}>
          <Text style={styles.xpPillIcon}>🏆</Text>
          <View>
            <Text style={styles.xpPillLabel}>XP Reward</Text>
            <Text style={styles.xpPillValue}>+{uiState.xpReward} XP</Text>
          </View>
        </View>
      </View>

      {/* ── Scrollable Content ─────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── 1. Difficulty ──────────────────────────────────────────────── */}
        <Text style={styles.sectionNumber}>1. CHOOSE DIFFICULTY</Text>

        <View style={styles.difficultyRow}>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <DifficultyCard
              key={d}
              difficulty={d}
              isSelected={uiState.selectedDifficulty === d}
              onPress={onDifficultyChange}
            />
          ))}
        </View>

        {/* Difficulty description banner */}
        <View style={styles.difficultyBanner}>
          <Text style={styles.difficultyBannerIcon}>✦</Text>
          <Text style={styles.difficultyBannerText}>
            {difficultyConfig.description}
          </Text>
        </View>

        {/* ── 2. Question Distribution ───────────────────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionNumber}>2. QUESTION DISTRIBUTION</Text>
          <View style={styles.totalPill}>
            <Text style={styles.totalPillText}>
              Total Questions: {uiState.totalQuestions}
            </Text>
          </View>
        </View>

        <View style={styles.slidersCard}>
          <QuestionSlider
            label="MCQ Questions"
            emoji="📝"
            value={uiState.mcqCount}
            color={PRIMARY}
            onChange={onMcqChange}
          />
          <View style={styles.sliderDivider} />
          <QuestionSlider
            label="Reading Comprehension"
            emoji="📖"
            value={uiState.comprehensionCount}
            color="#3B82F6"
            onChange={onComprehensionChange}
          />
          <View style={styles.sliderDivider} />
          <QuestionSlider
            label="Prompt Writing"
            emoji="✏️"
            value={uiState.writingCount}
            color="#22C55E"
            onChange={onWritingChange}
          />

          {/* Radar Chart */}
          <RadarChart
            mcq={uiState.mcqCount}
            comprehension={uiState.comprehensionCount}
            writing={uiState.writingCount}
          />
        </View>

        {/* ── 3. Quick Presets ───────────────────────────────────────────── */}
        <Text style={styles.sectionNumber}>3. QUICK PRESETS</Text>

        <View style={styles.presetsGrid}>
          {QUICK_PRESETS.map(preset => (
            <View key={preset.id} style={styles.presetItem}>
              <QuickPresetCard
                preset={preset}
                onPress={onPresetSelect}
              />
            </View>
          ))}
        </View>

        {/* Bottom spacer for sticky card */}
        <View style={{ height: 140 }} />

      </ScrollView>

      {/* ── Sticky Bottom Card ─────────────────────────────────────────────── */}
      <StickyBottomCard
        totalQuestions={uiState.totalQuestions}
        estimatedTime={estimatedTimeLabel}
        xpReward={uiState.xpReward}
        onStartTest={onStartTestPress}
        disabled={uiState.totalQuestions === 0}
      />

      {/* ── Confirmation Sheet ─────────────────────────────────────────────── */}
      <TestConfirmationSheet
        visible={uiState.showConfirmSheet}
        difficulty={uiState.selectedDifficulty}
        mcq={uiState.mcqCount}
        comprehension={uiState.comprehensionCount}
        writing={uiState.writingCount}
        totalQuestions={uiState.totalQuestions}
        estimatedTime={estimatedTimeLabel}
        xpReward={uiState.xpReward}
        onConfirm={onConfirmStart}
        onEdit={onConfirmSheetClose}
        onClose={onConfirmSheetClose}
      />

    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  wrapper: {
    flex:            1,
    backgroundColor: BG,
  },

  // Header
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 16,
    paddingBottom:     12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap:               10,
  },
  backBtn: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: colors.surfaceRaised,
    justifyContent:  'center',
    alignItems:      'center',
  },
  backBtnText: {
    fontSize:   18,
    color:      TEXT_DARK,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize:   17,
    fontWeight: '800',
    color:      TEXT_DARK,
  },
  headerSub: {
    fontSize:  12,
    color:     TEXT_GRAY,
    marginTop: 2,
  },
  xpPill: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   colors.warningSurface,
    borderRadius:      12,
    paddingHorizontal: 10,
    paddingVertical:   6,
    borderWidth:       1,
    borderColor:       '#FEF3C7',
    gap:               6,
  },
  xpPillIcon: {
    fontSize: 18,
  },
  xpPillLabel: {
    fontSize:  10,
    color:     '#FCD34D',
  },
  xpPillValue: {
    fontSize:   13,
    fontWeight: '800',
    color:      '#FBBF24',
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop:        20,
  },

  // Section headers
  sectionNumber: {
    fontSize:     11,
    fontWeight:   '800',
    color:        TEXT_GRAY,
    letterSpacing: 1,
    marginBottom:  12,
  },
  sectionHeaderRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   12,
    marginTop:      20,
  },
  totalPill: {
    backgroundColor:   colors.surfaceRaised,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
  },
  totalPillText: {
    fontSize:   12,
    fontWeight: '700',
    color:      PRIMARY,
  },

  // Difficulty
  difficultyRow: {
    flexDirection: 'row',
    gap:           10,
    marginBottom:  12,
  },
  difficultyBanner: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   colors.surfaceRaised,
    borderRadius:      12,
    paddingHorizontal: 14,
    paddingVertical:   10,
    gap:               8,
    marginBottom:      20,
  },
  difficultyBannerIcon: {
    fontSize:  14,
    color:     PRIMARY,
  },
  difficultyBannerText: {
    flex:       1,
    fontSize:   13,
    color:      TEXT_MID,
    lineHeight: 18,
  },

  // Sliders card
  slidersCard: {
    backgroundColor: colors.surface,
    borderRadius:    16,
    padding:         16,
    borderWidth:     1,
    borderColor:     BORDER,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.05,
    shadowRadius:    8,
    elevation:       2,
  },
  sliderDivider: {
    height:          1,
    backgroundColor: colors.surfaceRaised,
    marginVertical:  8,
  },

  // Presets grid
  presetsGrid: {
    gap: 10,
  },
  presetItem: {
    width: '100%',
  },
});

export default CreateCustomTestScreen;