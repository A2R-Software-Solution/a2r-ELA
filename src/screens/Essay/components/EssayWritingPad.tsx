/**
 * Essay Writing Pad Component
 * Text input area for writing essays
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface EssayWritingPadProps {
  text: string;
  onTextChange: (text: string) => void;
  minWords?: number;
  maxWords?: number;
  wordCount: number;
}

const EssayWritingPad: React.FC<EssayWritingPadProps> = ({
  text,
  onTextChange,
  minWords = 150,
  maxWords = 500,
  wordCount,
}) => {
  const isBelowMin = wordCount > 0 && wordCount < minWords;
  const isAboveMax = wordCount > maxWords;
  const isValid = wordCount >= minWords && wordCount <= maxWords;

  const helperText = isBelowMin
    ? `Minimum ${minWords} words required`
    : isAboveMax
    ? `Maximum ${maxWords} words allowed`
    : null;

  const counterColor = isBelowMin || isAboveMax
    ? '#FF0000'
    : isValid
    ? '#7D55FF'
    : '#999999';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={onTextChange}
          placeholder="Start writing your essay here..."
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          multiline
          textAlignVertical="top"
        />
      </View>

      {helperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      <View style={styles.footer}>
        <Text style={[styles.wordCount, { color: counterColor }]}>
          {wordCount} / {maxWords} words
        </Text>
        <Text style={styles.charCount}>
          Characters: {text.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    minHeight: 180,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 8,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  wordCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  charCount: {
    fontSize: 12,
    color: '#999999',
  },
});

export default EssayWritingPad;