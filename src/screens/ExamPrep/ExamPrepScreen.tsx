import ScreenBackground from '../../components/ScreenBackground';
import { styles, PRIMARY } from './ExamPrepScreen.styles';
/**
 * ExamPrepScreen
 * ✅ Redesigned with new UI matching design system
 * ✅ Camera notch/dynamic island filled with dark header color
 * ✅ Tabs centered with bigger text
 * ✅ Background matched to HomeScreen C palette (Red-Orange + Emerald + Deep Purple)
 * ✅ UPDATED: "Your Progress" hardcoded list + 54% progress ring removed.
 *    Replaced with a real Grade + Domain selector that drives backend
 *    PSSA question generation via useExamPrep / ExamRepository.
 */

import React from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExamActionButton   from './components/ExamActionButton';
import useExamPrep        from './hooks/useExamPrep';
import { ExamTab }        from './types/ExamPrepUiState';
import { StateSelectorSheet } from '../Essay/components/StateSelectorSheet';
import { PreloadedSessionData } from '../Practice/types/PracticeSessionUiState';

// ============================================================================
// PROPS
// ============================================================================

interface ExamPrepScreenProps {
  onBackClick?:      () => void;
  onStartPractice?:  (data: PreloadedSessionData) => void;
  onViewProgress?:   () => void;
}

// ============================================================================
// CONSTANTS — C palette (matches HomeScreen exactly)
// ============================================================================

 // deepest base — near black with purple tint
 // violet accent (matches Home retry button)


// ============================================================================
// SCREEN
// ============================================================================

const ExamPrepScreen: React.FC<ExamPrepScreenProps> = ({
  onBackClick,
  onStartPractice,
}) => {
  const {
    state,
    onTabChange,
    onRefresh,
    onGradeChange,
    onDomainChange,
    onOpenGradeSheet,
    onCloseGradeSheet,
    onContinue,
  } = useExamPrep();
  const insets = useSafeAreaInsets();

  const {
    tabs,
    activeTabId,
    examTitle,
    selectedGrade,
    gradeOptions,
    isGradeSheetVisible,
    selectedDomain,
    domainOptions,
    difficulty,
    isGenerating,
    isLoading,
    errorMessage,
  } = state;

  const selectedGradeLabel =
    gradeOptions.find(g => g.code === selectedGrade)?.label ?? `Grade ${selectedGrade}`;

  const handleContinue = async () => {
    const result = await onContinue();
    if (result.type === 'success') {
      onStartPractice?.({
        grade:      selectedGrade,
        domain:     selectedDomain,
        difficulty,
        response:   result.data,
      });
    }
    // Errors surface via state.errorMessage below the selector — no need to alert here.
  };

  const handleGradeSave = (_state: string, grade: string) => {
    onGradeChange(grade);
    onCloseGradeSheet();
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        {/* Background layers */}
        <ScreenBackground />

        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Loading exam prep...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>

      {/* ── Background color layers (C palette) ── */}
      <ScreenBackground />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top }]}>

        {/* Top row */}
        <View style={styles.headerTopRow}>
          {onBackClick ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBackClick}
              activeOpacity={0.7}
            >
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}

          <Text style={styles.headerTitle}>Exam Preparation</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          {tabs.map((tab: ExamTab) => {
            const isActive = tab.id === activeTabId;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </View>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[PRIMARY]}
            tintColor={PRIMARY}
          />
        }
      >

        {activeTabId !== 'pssa_ela' ? (
          <View style={styles.selectorCard}>
            <Text style={styles.screenIntro}>Coming Soon</Text>
            <Text style={styles.loadingText}>More exams are on the way. Start with PSSA ELA practice today.</Text>
            <ExamActionButton label="Practice PSSA ELA" onPress={() => onTabChange('pssa_ela')} />
          </View>
        ) : (
          <>
        <Text style={styles.screenIntro}>{examTitle}</Text>

        {/* ── Grade selector ── */}
        <View style={styles.selectorCard}>
          <Text style={styles.selectorLabel}>Grade</Text>
          <TouchableOpacity
            style={styles.gradeButton}
            onPress={onOpenGradeSheet}
            activeOpacity={0.7}
          >
            <Text style={styles.gradeButtonText}>{selectedGradeLabel}</Text>
            <Text style={styles.gradeButtonChevron}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* ── Domain selector ── */}
        <View style={styles.selectorCard}>
          <Text style={styles.selectorLabel}>Domain</Text>
          <View style={styles.chipRow}>
            {domainOptions.map(option => {
              const isActive = option.code === selectedDomain;
              return (
                <TouchableOpacity
                  key={option.code}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => onDomainChange(option.code)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Error message ── */}
        {errorMessage && (
          <Text style={styles.errorInline}>{errorMessage}</Text>
        )}

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <ExamActionButton
            label={isGenerating ? 'Generating...' : 'Continue'}
            onPress={handleContinue}
            variant="primary"
            icon={isGenerating ? undefined : '→'}
            disabled={isGenerating}
            isLoading={isGenerating}
          />
        </View>

        </>
        )}
        <View style={{ height: Math.max(insets.bottom + 16, 32) }} />
      </ScrollView>

      {/* ── Grade selector sheet (grade-only mode) ── */}
      <StateSelectorSheet
        isVisible={isGradeSheetVisible}
        onClose={onCloseGradeSheet}
        onSave={handleGradeSave}
        currentState=""
        currentGrade={selectedGrade}
        stateOptions={[]}
        gradeOptions={gradeOptions}
      />

    </View>
  );
};

export default ExamPrepScreen;
