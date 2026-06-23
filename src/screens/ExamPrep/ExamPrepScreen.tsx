/**
 * ExamPrepScreen
 * ✅ Redesigned with new UI matching design system
 * ✅ Camera notch/dynamic island filled with dark header color
 * ✅ Tabs centered with bigger text
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
import ExamProgressCard  from './components/ExamProgressCard';
import ExamSectionRow    from './components/ExamSectionRow';
import ExamActionButton  from './components/ExamActionButton';
import useExamPrep       from './hooks/useExamPrep';
import { ExamTab }       from './types/ExamPrepUiState';

// ============================================================================
// PROPS
// ============================================================================

interface ExamPrepScreenProps {
  onBackClick?:      () => void;
  onStartPractice?:  () => void;
  onViewProgress?:   () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIMARY      = '#6C4DFF';
const PRIMARY_DARK = '#1E1B4B';
const WHITE        = '#FFFFFF';
const PAGE_BG      = '#F8FAFC';
const TEXT_DARK    = '#0F172A';
const TEXT_MID     = '#475569';

// ============================================================================
// SCREEN
// ============================================================================

const ExamPrepScreen: React.FC<ExamPrepScreenProps> = ({
  onBackClick,
  onStartPractice,
  onViewProgress,
}) => {
  const { state, onTabChange, onRefresh } = useExamPrep();
  const insets = useSafeAreaInsets();

  const {
    tabs,
    activeTabId,
    examTitle,
    overallPercent,
    sections,
    isLoading,
    errorMessage,
  } = state;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading && sections.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Loading exam prep...</Text>
        </View>
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (errorMessage) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.centered}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const completedCount = sections.filter(s => s.status === 'complete').length;

  return (
    // wrapper fills camera notch with dark color
    <View style={styles.wrapper}>
    <View style={styles.container}>

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

          {/* Tab switcher — centered */}
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

          {/* Progress Card */}
          <ExamProgressCard
            examTitle={examTitle}
            overallPercent={overallPercent}
          />

          {/* Section header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <Text style={styles.sectionCount}>
              {completedCount} / {sections.length} done
            </Text>
          </View>

          {/* Section rows */}
          {sections.map(section => (
            <ExamSectionRow
              key={section.id}
              section={section}
            />
          ))}

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <ExamActionButton
              label="View Progress"
              onPress={onViewProgress ?? (() => {})}
              variant="secondary"
              icon="📊"
            />
            <ExamActionButton
              label="Continue"
              onPress={onStartPractice ?? (() => {})}
              variant="primary"
              icon="→"
            />
          </View>

          <View style={{ height: Math.max(insets.bottom + 16, 32) }} />
        </ScrollView>

      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({

  // Outer wrapper — fills camera notch with dark color
  wrapper: {
    flex:            1,
    backgroundColor: PRIMARY_DARK,
  },

  // Inner container — page background
  container: {
    flex:            1,
    backgroundColor: PAGE_BG,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: PRIMARY_DARK,
    paddingBottom:   0,
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
    backgroundColor: 'rgba(255,255,255,0.15)',
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

  // ── Tabs ───────────────────────────────────────────────────────────────────
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
    borderBottomColor: WHITE,
  },
  tabText: {
    fontSize:   15,
    fontWeight: '600',
    color:      'rgba(255,255,255,0.6)',
  },
  tabTextActive: {
    color:      WHITE,
    fontWeight: '800',
    fontSize:   16,
  },

  // ── Scroll ─────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },

  // ── Section header ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    marginHorizontal:  16,
    marginTop:         20,
    marginBottom:      8,
  },
  sectionTitle: {
    fontSize:   16,
    fontWeight: '700',
    color:      TEXT_DARK,
  },
  sectionCount: {
    fontSize:   13,
    fontWeight: '500',
    color:      TEXT_MID,
  },

  // ── Action row ─────────────────────────────────────────────────────────────
  actionRow: {
    flexDirection:    'row',
    gap:              12,
    marginHorizontal: 16,
    marginTop:        20,
  },

  // ── Centered states ────────────────────────────────────────────────────────
  centered: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         32,
    backgroundColor: PAGE_BG,
  },
  loadingText: {
    marginTop: 12,
    fontSize:  14,
    color:     TEXT_MID,
  },
  errorEmoji: {
    fontSize:     48,
    marginBottom: 12,
  },
  errorText: {
    fontSize:     14,
    color:        TEXT_MID,
    textAlign:    'center',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor:   PRIMARY,
    paddingHorizontal: 32,
    paddingVertical:   12,
    borderRadius:      12,
  },
  retryBtnText: {
    color:      WHITE,
    fontSize:   15,
    fontWeight: '700',
  },
});

export default ExamPrepScreen;