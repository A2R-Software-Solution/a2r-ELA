import { styles } from './DailyVocab.styles';
/**
 * DailyVocab Component
 * Fetches a new vocab word from Groq via backend every time app opens
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { apiService } from '../../../api/apiService';

interface VocabWord {
  word: string;
  part_of_speech: string;
  meaning: string;
  example: string;
}

const DailyVocab: React.FC = () => {
  const [vocab, setVocab] = useState<VocabWord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchVocab();
  }, []);

  const fetchVocab = async () => {
    try {
      setIsLoading(true);
      setError(false);
      const response = await apiService.getDailyVocab();
      if (response.data?.data) {
        setVocab(response.data.data);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.labelPill}>
          <Text style={styles.labelText}>📚 Word of the Day</Text>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color="#6C4DFF" size="small" />
          <Text style={styles.loadingText}>Fetching today's word...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Could not load word. Try again later.</Text>
      ) : vocab ? (
        <View style={styles.vocabContent}>

          {/* Word + part of speech */}
          <View style={styles.wordRow}>
            <Text style={styles.word}>{vocab.word}</Text>
            <View style={styles.posPill}>
              <Text style={styles.posText}>{vocab.part_of_speech}</Text>
            </View>
          </View>

          {/* Meaning */}
          <Text style={styles.meaning}>{vocab.meaning}</Text>

          {/* Example */}
          <View style={styles.exampleWrap}>
            <Text style={styles.exampleLabel}>Example: </Text>
            <Text style={styles.exampleText}>{vocab.example}</Text>
          </View>

        </View>
      ) : null}

    </View>
  );
};

export default DailyVocab;
