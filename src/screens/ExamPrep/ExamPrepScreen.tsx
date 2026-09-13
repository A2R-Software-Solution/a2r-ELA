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
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
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

const BASE_BG      = '#07050E'; // deepest base — near black with purple tint
const PRIMARY      = '#7C5CFC'; // violet accent (matches Home retry button)
const WHITE        = '#FFFFFF';
const TEXT_LIGHT   = '#FFFFFF';
const TEXT_MUTED   = 'rgba(255,255,255,0.6)';
const TEXT_SUBTLE  = 'rgba(255,255,255,0.35)';
const CARD_BG       = 'rgba(255,255,255,0.05)';
const CARD_BORDER   = 'rgba(124,92,252,0.35)';

// ============================================================================
// SCREEN
// ============================================================================

const ExamPrepScreen: React.FC<ExamPrepScreenProps> = ({
  onBackClick,
  onStartPractice,
  onViewProgress,
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
        <View style={styles.bgBase} />
        <View style={styles.bgOrangeRed} />
        <View style={styles.bgEmerald} />
        <View style={styles.bgPurple} />

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
      <View style={styles.bgBase} />
      <View style={styles.bgOrangeRed} />
      <View style={styles.bgEmerald} />
      <View style={styles.bgPurple} />

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

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({

  // ── Root wrapper ────────────────────────────────────────────────────────
  wrapper: {
    flex:            1,
    backgroundColor: BASE_BG,
  },

  // ── Background layers (C palette: red-orange + emerald + deep purple) ───
  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BASE_BG,
  },

  // Red-orange bloom — bottom-left corner
  bgOrangeRed: {
    position:        'absolute',
    bottom:          -120,
    left:            -80,
    width:           320,
    height:          320,
    borderRadius:    160,
    backgroundColor: '#D93A00',
    opacity:         0.38,
  },

  // Emerald bloom — bottom-right corner
  bgEmerald: {
    position:        'absolute',
    bottom:          -100,
    right:           -60,
    width:           280,
    height:          280,
    borderRadius:    140,
    backgroundColor: '#005C25',
    opacity:         0.42,
  },

  // Deep purple bloom — top center
  bgPurple: {
    position:        'absolute',
    top:             -100,
    left:            '25%',
    width:           300,
    height:          300,
    borderRadius:    150,
    backgroundColor: '#4A007A',
    opacity:         0.45,
  },

  // ── Header ─────────────────────────────────────────────────────────────
  header: {
    backgroundColor: 'rgba(7, 5, 14, 0.75)', // dark tinted, lets bg show slightly
    paddingBottom:   0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTopRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 16,
    paddingTop:        8,
    paddingBottom:     8,
  },
  backBtn: {
    width:           32,
    height:          32,
    borderRadius:    8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  backBtnText: {
    fontSize:   16,
    color:      WHITE,
    fontWeight: '600',
  },
  headerTitle: {
    flex:       1,
    textAlign:  'center',
    fontSize:   17,
    fontWeight: '700',
    color:      WHITE,
  },
  headerSpacer: {
    width: 32,
  },

  // ── Tabs ───────────────────────────────────────────────────────────────
  tabRow: {
    flexDirection:     'row',
    justifyContent:    'center',
    paddingHorizontal: 16,
    gap:               8,
  },
  tab: {
    flex:              1,
    alignItems:        'center',
    paddingVertical:   14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    maxWidth:          200,
  },
  tabActive: {
    borderBottomColor: PRIMARY,
  },
  tabText: {
    fontSize:   15,
    fontWeight: '600',
    color:      TEXT_MUTED,
  },
  tabTextActive: {
    color:      WHITE,
    fontWeight: '800',
    fontSize:   16,
  },

  // ── Scroll ─────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop:    8,
    paddingBottom: 20,
  },

  // ── Screen intro ───────────────────────────────────────────────────────
  screenIntro: {
    fontSize:          18,
    fontWeight:         '700',
    color:              TEXT_LIGHT,
    marginHorizontal:   16,
    marginTop:          20,
    marginBottom:       16,
  },

  // ── Grade / Domain selector cards ─────────────────────────────────────
  selectorCard: {
    marginHorizontal:  16,
    marginBottom:       16,
    padding:            16,
    borderRadius:        16,
    backgroundColor:     CARD_BG,
    borderWidth:         1,
    borderColor:         CARD_BORDER,
  },
  selectorLabel: {
    fontSize:    13,
    fontWeight:  '700',
    color:       TEXT_MUTED,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Grade button
  gradeButton: {
    flexDirection:      'row',
    alignItems:          'center',
    justifyContent:      'space-between',
    paddingVertical:     12,
    paddingHorizontal:   14,
    borderRadius:        12,
    backgroundColor:     'rgba(124,92,252,0.15)',
    borderWidth:         1,
    borderColor:         PRIMARY,
  },
  gradeButtonText: {
    fontSize:   15,
    fontWeight: '700',
    color:      WHITE,
  },
  gradeButtonChevron: {
    fontSize: 14,
    color:    TEXT_MUTED,
  },

  // Domain chips
  chipRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           8,
  },
  chip: {
    paddingVertical:   9,
    paddingHorizontal: 14,
    borderRadius:      20,
    backgroundColor:   'rgba(255,255,255,0.06)',
    borderWidth:       1,
    borderColor:       'rgba(255,255,255,0.15)',
  },
  chipActive: {
    backgroundColor: PRIMARY,
    borderColor:     PRIMARY,
  },
  chipText: {
    fontSize:   13,
    fontWeight: '600',
    color:      TEXT_MUTED,
  },
  chipTextActive: {
    color:      WHITE,
    fontWeight: '700',
  },

  // ── Error ──────────────────────────────────────────────────────────────
  errorInline: {
    marginHorizontal: 16,
    marginBottom:     12,
    fontSize:         13,
    color:            '#FF6B6B',
  },

  // ── Action row ─────────────────────────────────────────────────────────
  actionRow: {
    flexDirection:    'row',
    gap:              12,
    marginHorizontal: 16,
    marginTop:        8,
  },

  // ── Centered states ────────────────────────────────────────────────────
  centered: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
    padding:        32,
  },
  loadingText: {
    marginTop: 12,
    fontSize:  14,
    color:     TEXT_MUTED,
  },
});

export default ExamPrepScreen;
