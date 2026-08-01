/**
 * DailyVocab Component
 * Fetches a new vocab word from Groq via backend every time app opens
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    padding: 16,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  labelPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C4DFF',
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    paddingVertical: 8,
  },
  vocabContent: {
    gap: 8,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  word: {
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
  meaning: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  exampleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    backgroundColor: '#EDE9FF',
    borderRadius: 10,
    padding: 10,
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
});

export default DailyVocab;