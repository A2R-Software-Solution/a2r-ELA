import { styles, PRIMARY } from './CreateCustomTestScreen.styles';
import ScreenBackground from '../../components/ScreenBackground';
/**
 * CreateCustomTestScreen
 * Allows students to configure a custom practice test
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
        <View style={styles.viewHeight} />

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

export default CreateCustomTestScreen;
