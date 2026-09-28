import { styles } from './EssayWritingPad.styles';
/**
 * EssayWritingPad Component
 * Clean text editor with styled placeholder and proper typography
 */

import React, { useRef } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';

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

export default EssayWritingPad;
