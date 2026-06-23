/**
 * EssayWritingPad Component
 * Clean text editor with styled placeholder and proper typography
 */

import React, { useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';

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
  minWords,
  maxWords,
  wordCount,
}) => {
  const inputRef = useRef<TextInput>(null);

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleContainerPress}
      activeOpacity={1}
    >
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        value={text}
        onChangeText={onTextChange}
        placeholder={`Start writing your essay here...\n\nTip: Aim for at least ${minWords} words for a complete submission.`}
        placeholderTextColor="#CBD5E1"
        multiline
        textAlignVertical="top"
        scrollEnabled={false}
        autoCorrect
        spellCheck
        autoCapitalize="sentences"
        selectionColor="#6C4DFF"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: '#0F172A',
    minHeight: 300,
    ...Platform.select({
      ios: {
        fontFamily: 'Georgia',
      },
      android: {
        fontFamily: 'serif',
      },
    }),
  },
});

export default EssayWritingPad;