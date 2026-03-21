/**
 * EssayWritingPad Component (Old Interface - Backward Compatible)
 * Simple text area wrapper - kept for backward compatibility
 *
 * This is a simplified version that matches your existing component interface.
 * The new file upload UI is in the parent EssayEditorScreen.
 */

import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';

interface EssayWritingPadProps {
  text: string;
  onTextChange: (text: string) => void;
  minWords: number;
  maxWords: number;
  wordCount: number;
}

const EssayWritingPad: React.FC<EssayWritingPadProps> = ({
  text,
  onTextChange,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={onTextChange}
        placeholder="Start typing your essay here..."
        placeholderTextColor="#999999"
        multiline
        textAlignVertical="top"
        scrollEnabled
        autoCorrect
        spellCheck
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
});

export default EssayWritingPad;
