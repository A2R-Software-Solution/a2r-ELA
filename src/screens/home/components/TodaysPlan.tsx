import { styles } from './TodaysPlan.styles';
/**
 * Today's Plan Component — REDESIGNED
 * Dark glassmorphism cards, refined to match C palette bg
 * (red-orange bottom-left · emerald bottom-right · deep purple top)
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
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
  const [errorMessage, setErrorMessage] = useState('Could not load word. Tap to retry.');

  useEffect(() => { fetchVocab(); }, []);

  const fetchVocab = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await apiService.getDailyVocab();
      if (response.data?.data) setVocab(response.data.data);
      else setError(true);
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      setErrorMessage(status === 401
        ? 'Please sign in again to load your word.'
        : status === 429
          ? 'Word service is busy. Please retry shortly.'
          : status === undefined
            ? 'Could not connect. Check your connection and tap to retry.'
            : 'Word is temporarily unavailable. Tap to retry.');
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
            colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.04)']}
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
            <Text style={styles.errorText}>{errorMessage}</Text>
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
            colors={['rgba(165,230,235,0.20)', 'rgba(255,255,255,0.06)']}
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
            colors={['rgba(40,103,119,0.85)', 'rgba(40,103,119,0.55)']}
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

export default TodaysPlan;
