import ScreenBackground from '../../components/ScreenBackground';
import { colors } from '../../theme/colors';
/**
 * TestInstructionsScreen
 * Shows test rules and configuration before starting
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
import { DIFFICULTY_CONFIG } from './types/CreateTestUiState';

// ============================================================================
// PROPS
// ============================================================================

interface TestConfig {
  difficulty:    string;
  mcq:           number;
  comprehension: number;
  writing:       number;
  total:         number;
  estimatedTime: string;
  xpReward:      number;
}

interface TestInstructionsScreenProps {
  config:        TestConfig;
  onBackClick:   () => void;
  onBeginTest:   () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIMARY   = colors.primary;
const WHITE     = '#FFFFFF';
const BG = colors.background;
const TEXT_DARK = colors.text;
const TEXT_MID  = colors.muted;
const TEXT_GRAY = colors.subtle;
const BORDER    = colors.border;
const GREEN     = '#22C55E';

const RULES = [
  { icon: '⏱️', text: 'Timer is enabled for the full test duration.' },
  { icon: '✅', text: 'Your answers are auto-saved as you progress.' },
  { icon: '🚫', text: 'No negative marking — attempt all questions.' },
  { icon: '📖', text: 'Read each passage carefully before answering.' },
  { icon: '✏️', text: 'Written responses are graded by AI.' },
  { icon: '🏆', text: 'XP is awarded on test completion.' },
];

// ============================================================================
// SCREEN
// ============================================================================

const TestInstructionsScreen: React.FC<TestInstructionsScreenProps> = ({
  config,
  onBackClick,
  onBeginTest,
}) => {
  const insets       = useSafeAreaInsets();
  const diffConfig   = DIFFICULTY_CONFIG[config.difficulty as keyof typeof DIFFICULTY_CONFIG];

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
        <Text style={styles.headerTitle}>Test Instructions</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>📋</Text>
          <Text style={styles.heroTitle}>Custom Practice Test</Text>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: diffConfig?.bgColor ?? colors.surface },
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: diffConfig?.color ?? PRIMARY },
            ]}>
              {diffConfig?.emoji} {diffConfig?.label} · {diffConfig?.subtitle}
            </Text>
          </View>
        </View>

        {/* ── Test Overview ──────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Test Overview</Text>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <StatBox
              icon="📝"
              value={config.mcq.toString()}
              label="MCQ"
              color={PRIMARY}
            />
            <StatBox
              icon="📖"
              value={config.comprehension.toString()}
              label="Reading"
              color="#3B82F6"
            />
            <StatBox
              icon="✏️"
              value={config.writing.toString()}
              label="Writing"
              color={GREEN}
            />
            <StatBox
              icon="🔢"
              value={config.total.toString()}
              label="Total"
              color={colors.text}
            />
          </View>

          <View style={styles.divider} />

          {/* Time + XP row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <View>
                <Text style={styles.metaValue}>{config.estimatedTime}</Text>
                <Text style={styles.metaLabel}>Estimated Time</Text>
              </View>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⭐</Text>
              <View>
                <Text style={[styles.metaValue, { color: PRIMARY }]}>
                  +{config.xpReward} XP
                </Text>
                <Text style={styles.metaLabel}>Potential Reward</Text>
              </View>
            </View>
          </View>

        </View>

        {/* ── Sections ───────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sections Included</Text>

          {config.mcq > 0 && (
            <SectionRow
              icon="📝"
              color={PRIMARY}
              title="Multiple Choice Questions"
              count={config.mcq}
              description="Select the best answer from 4 options."
            />
          )}
          {config.comprehension > 0 && (
            <SectionRow
              icon="📖"
              color="#3B82F6"
              title="Reading Comprehension"
              count={config.comprehension}
              description="Read passages and answer questions."
            />
          )}
          {config.writing > 0 && (
            <SectionRow
              icon="✏️"
              color={GREEN}
              title="Prompt Writing"
              count={config.writing}
              description="Write short or extended responses."
            />
          )}
        </View>

        {/* ── Rules ──────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rules & Guidelines</Text>
          {RULES.map((rule, i) => (
            <View key={i} style={styles.ruleRow}>
              <Text style={styles.ruleIcon}>{rule.icon}</Text>
              <Text style={styles.ruleText}>{rule.text}</Text>
            </View>
          ))}
        </View>

        {/* Bottom spacer */}
        <View style={{ height: Math.max(insets.bottom + 100, 120) }} />

      </ScrollView>

      {/* ── Begin Test Button ──────────────────────────────────────────────── */}
      <View style={[
        styles.footer,
        { paddingBottom: Math.max(insets.bottom, 16) },
      ]}>
        <TouchableOpacity
          style={styles.beginBtn}
          onPress={onBeginTest}
          activeOpacity={0.85}
        >
          <Text style={styles.beginBtnText}>Begin Test 🚀</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

// ============================================================================
// STAT BOX
// ============================================================================

interface StatBoxProps {
  icon:  string;
  value: string;
  label: string;
  color: string;
}

const StatBox: React.FC<StatBoxProps> = ({ icon, value, label, color }) => (
  <View style={statStyles.box}>
    <Text style={statStyles.icon}>{icon}</Text>
    <Text style={[statStyles.value, { color }]}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
  </View>
);

const statStyles = StyleSheet.create({
  box: {
    flex:           1,
    alignItems:     'center',
    padding:        12,
    backgroundColor: colors.surface,
    borderRadius:   12,
    marginHorizontal: 3,
  },
  icon: {
    fontSize:     18,
    marginBottom: 4,
  },
  value: {
    fontSize:   18,
    fontWeight: '800',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color:    colors.subtle,
  },
});

// ============================================================================
// SECTION ROW
// ============================================================================

interface SectionRowProps {
  icon:        string;
  color:       string;
  title:       string;
  count:       number;
  description: string;
}

const SectionRow: React.FC<SectionRowProps> = ({
  icon,
  color,
  title,
  count,
  description,
}) => (
  <View style={sectionStyles.row}>
    <View style={[sectionStyles.iconBubble, { backgroundColor: `${color}18` }]}>
      <Text style={sectionStyles.icon}>{icon}</Text>
    </View>
    <View style={sectionStyles.info}>
      <View style={sectionStyles.titleRow}>
        <Text style={sectionStyles.title}>{title}</Text>
        <View style={[sectionStyles.countBadge, { backgroundColor: `${color}18` }]}>
          <Text style={[sectionStyles.count, { color }]}>{count}Q</Text>
        </View>
      </View>
      <Text style={sectionStyles.description}>{description}</Text>
    </View>
  </View>
);

const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    paddingVertical: 10,
    gap:           12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceRaised,
  },
  iconBubble: {
    width:          44,
    height:         44,
    borderRadius:   12,
    justifyContent: 'center',
    alignItems:     'center',
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  titleRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   3,
  },
  title: {
    fontSize:   14,
    fontWeight: '700',
    color:      colors.text,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      20,
  },
  count: {
    fontSize:   12,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    color:    colors.subtle,
  },
});

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
  headerTitle: {
    flex:       1,
    textAlign:  'center',
    fontSize:   17,
    fontWeight: '700',
    color:      TEXT_DARK,
  },
  headerSpacer: { width: 36 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop:        16,
  },

  // Hero card
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius:      20,
    padding:           24,
    alignItems:        'center',
    marginBottom:      14,
    borderWidth:       1,
    borderColor:       BORDER,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.05,
    shadowRadius:      8,
    elevation:         2,
  },
  heroEmoji: {
    fontSize:     48,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize:     20,
    fontWeight:   '800',
    color:        TEXT_DARK,
    marginBottom: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 16,
    paddingVertical:   6,
    borderRadius:      20,
  },
  difficultyText: {
    fontSize:   14,
    fontWeight: '700',
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius:    16,
    padding:         16,
    marginBottom:    14,
    borderWidth:     1,
    borderColor:     BORDER,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.05,
    shadowRadius:    8,
    elevation:       2,
  },
  cardTitle: {
    fontSize:     15,
    fontWeight:   '700',
    color:        TEXT_DARK,
    marginBottom: 14,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    gap:           6,
    marginBottom:  14,
  },

  // Divider
  divider: {
    height:          1,
    backgroundColor: BORDER,
    marginVertical:  12,
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  metaItem: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  metaIcon: { fontSize: 24 },
  metaValue: {
    fontSize:   15,
    fontWeight: '800',
    color:      TEXT_DARK,
  },
  metaLabel: {
    fontSize:  11,
    color:     TEXT_GRAY,
    marginTop: 2,
  },
  metaDivider: {
    width:           1,
    height:          40,
    backgroundColor: BORDER,
    marginHorizontal: 8,
  },

  // Rules
  ruleRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceRaised,
  },
  ruleIcon: { fontSize: 16, marginTop: 1 },
  ruleText: {
    flex:       1,
    fontSize:   14,
    color:      TEXT_MID,
    lineHeight: 20,
  },

  // Footer
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth:    1,
    borderTopColor:    BORDER,
    paddingHorizontal: 16,
    paddingTop:        14,
  },
  beginBtn: {
    backgroundColor: PRIMARY,
    borderRadius:    16,
    paddingVertical: 16,
    alignItems:      'center',
    shadowColor:     PRIMARY,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.3,
    shadowRadius:    8,
    elevation:       4,
  },
  beginBtnText: {
    color:      WHITE,
    fontSize:   17,
    fontWeight: '800',
  },
});

export default TestInstructionsScreen;