/**
 * Today's Plan Component — REDESIGNED
 * Dark glassmorphism cards, refined to match C palette bg
 * (red-orange bottom-left · emerald bottom-right · deep purple top)
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { apiService } from '../../../api/apiService';

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

const TodaysPlan: React.FC<TodaysPlanProps> = ({
  onPlayGameClick = () => {},
  recommendedGame = 'Stay on Topic!',
}) => {
  const [vocab, setVocab]       = useState<VocabWord | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [hasError, setError]    = useState(false);

  useEffect(() => { fetchVocab(); }, []);

  const fetchVocab = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await apiService.getDailyVocab();
      if (response.data?.data) setVocab(response.data.data);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Section Header */}
      <View style={styles.sectionRow}>
        <View style={styles.sectionDot} />
        <Text style={styles.sectionTitle}>Today's Plan</Text>
      </View>

      {/* ── Card 1: Word of the Day ─────────────────────────────── */}
      <View style={styles.vocabCard}>
        {/* Accent bar — warm purple to match top-bg purple zone */}
        <View style={styles.cardAccentBar} />

        {/* Label pill */}
        <View style={styles.vocabLabelRow}>
          <LinearGradient
            colors={['rgba(74,0,122,0.55)', 'rgba(109,0,160,0.30)']}
            style={styles.vocabPill}
          >
            <Text style={styles.vocabPillText}>📚  Word of the Day</Text>
          </LinearGradient>
        </View>

        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#9B4DCA" />
            <Text style={styles.loadingText}>Fetching today's word...</Text>
          </View>
        ) : hasError ? (
          <TouchableOpacity onPress={fetchVocab} activeOpacity={0.7}>
            <Text style={styles.errorText}>Could not load word. Tap to retry.</Text>
          </TouchableOpacity>
        ) : vocab ? (
          <View style={styles.vocabContent}>
            <View style={styles.wordRow}>
              <Text style={styles.wordText}>{vocab.word}</Text>
              <View style={styles.posPill}>
                <Text style={styles.posText}>{vocab.part_of_speech}</Text>
              </View>
            </View>
            <Text style={styles.meaningText}>{vocab.meaning}</Text>
            <View style={styles.exampleBox}>
              <Text style={styles.exampleLabel}>Example: </Text>
              <Text style={styles.exampleText}>{vocab.example}</Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* ── Card 2: Play Recommended Game ───────────────────────── */}
      <View style={styles.gameCard}>
        <View style={styles.gameCardLeft}>
          <LinearGradient
            colors={['#00873A', '#005C25']}
            style={styles.gameIconBubble}
          >
            <Text style={styles.gameIcon}>🎯</Text>
          </LinearGradient>
          <View style={styles.gameCardText}>
            <Text style={styles.gameCardTitle}>Play Recommended Game</Text>
            <Text style={styles.gameCardSubtitle}>{recommendedGame}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.playBtnWrap}
          onPress={onPlayGameClick}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00A845', '#005C25']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playBtn}
          >
            <Text style={styles.playBtnText}>Play Now  ▶</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop:         20,
    marginBottom:      4,
  },

  // Section header
  sectionRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  14,
    gap:           8,
  },
  sectionDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: '#C084FC',   // ← warm purple dot, ties to bg purple zone
  },
  sectionTitle: {
    fontSize:      18,
    fontWeight:    '700',
    color:         '#F5F0FF',
    letterSpacing: 0.2,
  },

  // ── Vocab Card ──────────────────────────────────────────────────
  vocabCard: {
    backgroundColor: 'rgba(74,0,122,0.18)',   // ← tinted with bg purple, not plain white
    borderRadius:    18,
    borderWidth:     1,
    borderColor:     'rgba(180,80,255,0.28)', // ← purple border matching top bg
    padding:         16,
    marginBottom:    12,
    overflow:        'hidden',
    shadowColor:     '#4A007A',
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.35,
    shadowRadius:    14,
    elevation:       6,
  },
  cardAccentBar: {
    position:             'absolute',
    top:                  0,
    left:                 0,
    right:                0,
    height:               3,
    backgroundColor:      '#7B00CC',          // ← richer purple accent bar
    borderTopLeftRadius:  18,
    borderTopRightRadius: 18,
  },
  vocabLabelRow: {
    marginBottom: 12,
    marginTop:    6,
  },
  vocabPill: {
    alignSelf:         'flex-start',
    paddingHorizontal: 12,
    paddingVertical:   5,
    borderRadius:      20,
    borderWidth:       1,
    borderColor:       'rgba(180,80,255,0.35)',
  },
  vocabPillText: {
    fontSize:   12,
    fontWeight: '600',
    color:      '#DDB6FF',                    // ← light purple text on pill
  },
  loadingRow: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             8,
    paddingVertical: 6,
  },
  loadingText: {
    fontSize: 13,
    color:    'rgba(255,255,255,0.45)',
  },
  errorText: {
    fontSize:        13,
    color:           '#F87171',
    paddingVertical: 6,
  },
  vocabContent: {
    gap: 8,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  wordText: {
    fontSize:      24,
    fontWeight:    '800',
    color:         '#F5F0FF',
    letterSpacing: -0.3,
  },
  posPill: {
    backgroundColor: 'rgba(217,58,0,0.18)',   // ← orange tint pill, ties to bottom-left bg
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      10,
    borderWidth:       1,
    borderColor:       'rgba(217,58,0,0.35)',
  },
  posText: {
    fontSize:   11,
    fontWeight: '600',
    color:      '#FCA97A',                    // ← warm orange text on pill
  },
  meaningText: {
    fontSize:   14,
    color:      'rgba(255,255,255,0.72)',
    lineHeight: 21,
  },
  exampleBox: {
    flexDirection:   'row',
    flexWrap:        'wrap',
    backgroundColor: 'rgba(74,0,122,0.22)',   // ← purple tint example box
    borderRadius:    12,
    padding:         12,
    marginTop:       4,
    borderWidth:     1,
    borderColor:     'rgba(180,80,255,0.22)',
  },
  exampleLabel: {
    fontSize:   13,
    fontWeight: '700',
    color:      '#C084FC',                    // ← purple label
  },
  exampleText: {
    fontSize:  13,
    color:     'rgba(255,255,255,0.65)',
    fontStyle: 'italic',
    flex:      1,
  },

  // ── Game Card ───────────────────────────────────────────────────
  gameCard: {
    backgroundColor: 'rgba(0,92,37,0.22)',    // ← tinted with bg emerald, not plain white
    borderRadius:    18,
    borderWidth:     1,
    borderColor:     'rgba(0,168,69,0.30)',   // ← emerald border matching bottom-right bg
    padding:         16,
    marginBottom:    10,
    shadowColor:     '#005C25',
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.40,
    shadowRadius:    14,
    elevation:       6,
  },
  gameCardLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  14,
  },
  gameIconBubble: {
    width:          48,
    height:         48,
    borderRadius:   14,
    justifyContent: 'center',
    alignItems:     'center',
    marginRight:    12,
    shadowColor:    '#00A845',
    shadowOffset:   { width: 0, height: 3 },
    shadowOpacity:  0.45,
    shadowRadius:   8,
    elevation:      5,
  },
  gameIcon: {
    fontSize: 22,
  },
  gameCardText: {
    flex: 1,
  },
  gameCardTitle: {
    fontSize:     15,
    fontWeight:   '700',
    color:        '#F0FFF4',                  // ← very light green-white title
    marginBottom: 3,
  },
  gameCardSubtitle: {
    fontSize:   12,
    color:      'rgba(255,255,255,0.50)',
    lineHeight: 17,
  },
  playBtnWrap: {
    borderRadius:  13,
    overflow:      'hidden',
    shadowColor:   '#00A845',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius:  10,
    elevation:     5,
  },
  playBtn: {
    paddingVertical: 12,
    borderRadius:    13,
    alignItems:      'center',
  },
  playBtnText: {
    fontSize:      14,
    fontWeight:    '700',
    color:         '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default TodaysPlan;