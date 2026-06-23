/**
 * Today's Plan Component
 * Card 1 — Word of the Day (fetched from Groq via backend)
 * Card 2 — Play Recommended Game
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { apiService } from '../../../api/apiService';

// ============================================================================
// TYPES
// ============================================================================

interface VocabWord {
  word: string;
  part_of_speech: string;
  meaning: string;
  example: string;
}

interface TodaysPlanProps {
  onPlayGameClick?: () => void;
  recommendedGame?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

const TodaysPlan: React.FC<TodaysPlanProps> = ({
  onPlayGameClick = () => {},
  recommendedGame = 'Stay on Topic!',
}) => {
  const [vocab, setVocab]       = useState<VocabWord | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [hasError, setError]    = useState(false);

  useEffect(() => {
    fetchVocab();
  }, []);

  const fetchVocab = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await apiService.getDailyVocab();
      if (response.data?.data) {
        setVocab(response.data.data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Section Header */}
      <Text style={styles.sectionTitle}>Today's Plan</Text>

      {/* ── Card 1: Word of the Day ──────────────────────────────────────── */}
      <View style={styles.vocabCard}>

        {/* Label pill */}
        <View style={styles.vocabLabelRow}>
          <View style={styles.vocabPill}>
            <Text style={styles.vocabPillText}>📚 Word of the Day</Text>
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#6C4DFF" />
            <Text style={styles.loadingText}>Fetching today's word...</Text>
          </View>
        ) : hasError ? (
          <TouchableOpacity onPress={fetchVocab} activeOpacity={0.7}>
            <Text style={styles.errorText}>
              Could not load word. Tap to retry.
            </Text>
          </TouchableOpacity>
        ) : vocab ? (
          <View style={styles.vocabContent}>

            {/* Word + POS */}
            <View style={styles.wordRow}>
              <Text style={styles.wordText}>{vocab.word}</Text>
              <View style={styles.posPill}>
                <Text style={styles.posText}>{vocab.part_of_speech}</Text>
              </View>
            </View>

            {/* Meaning */}
            <Text style={styles.meaningText}>{vocab.meaning}</Text>

            {/* Example */}
            <View style={styles.exampleBox}>
              <Text style={styles.exampleLabel}>Example: </Text>
              <Text style={styles.exampleText}>{vocab.example}</Text>
            </View>

          </View>
        ) : null}

      </View>

      {/* ── Card 2: Play Recommended Game ───────────────────────────────── */}
      <View style={styles.gameCard}>

        <View style={styles.gameCardLeft}>
          <View style={styles.gameIconBubble}>
            <Text style={styles.gameIcon}>🎯</Text>
          </View>
          <View style={styles.gameCardText}>
            <Text style={styles.gameCardTitle}>Play Recommended Game</Text>
            <Text style={styles.gameCardSubtitle}>{recommendedGame}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={onPlayGameClick}
          activeOpacity={0.8}
        >
          <Text style={styles.playBtnText}>Play Now</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  // ── Vocab Card ────────────────────────────────────────────────────────────
  vocabCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  vocabLabelRow: {
    marginBottom: 10,
  },
  vocabPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  vocabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C4DFF',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  loadingText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    paddingVertical: 6,
  },
  vocabContent: {
    gap: 8,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  posPill: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  posText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
  meaningText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  exampleBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#EDE9FF',
    borderRadius: 10,
    padding: 10,
    marginTop: 2,
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  exampleText: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
    flex: 1,
  },

  // ── Game Card ─────────────────────────────────────────────────────────────
  gameCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  gameCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gameIcon: {
    fontSize: 22,
  },
  gameCardText: {
    flex: 1,
  },
  gameCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  gameCardSubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  playBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  playBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default TodaysPlan;