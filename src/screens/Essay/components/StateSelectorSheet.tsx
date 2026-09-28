import { getSheetLayout, styles } from './StateSelectorSheet.styles';

/**
 * StateSelectorSheet.tsx
 * Bottom sheet component for selecting state and grade
 * Uses React Native Modal for reliability across platforms
 *
 * Grade-only mode: pass an empty stateOptions array to hide the State
 * section entirely and show only the Grade grid (used by ExamPrep's
 * PSSA grade selector, which has no concept of "state").
 */

import React, { useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Animated, useWindowDimensions, TouchableWithoutFeedback } from 'react-native';

interface StateSelectorSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (state: string, grade: string) => void;
  currentState: string;
  currentGrade: string;
  stateOptions: Array<{ code: string; label: string }>;
  gradeOptions: Array<{ code: string; label: string }>;
  isLoading?: boolean;
}

export const StateSelectorSheet: React.FC<StateSelectorSheetProps> = ({
  isVisible,
  onClose,
  onSave,
  currentState,
  currentGrade,
  stateOptions,
  gradeOptions,
  isLoading = false,
}) => {
  const { width, height: SCREEN_HEIGHT } = useWindowDimensions();
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [selectedState, setSelectedState] = React.useState(currentState);
  const [selectedGrade, setSelectedGrade] = React.useState(currentGrade);

  // Grade-only mode — no state section rendered, no state comparison needed
  const isGradeOnly = stateOptions.length === 0;

  // Sync with props when they change
  useEffect(() => {
    setSelectedState(currentState);
    setSelectedGrade(currentGrade);
  }, [currentState, currentGrade]);

  // Animate in/out
  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim, SCREEN_HEIGHT]);

  const handleSave = useCallback(() => {
    onSave(selectedState, selectedGrade);
  }, [selectedState, selectedGrade, onSave]);

  const hasChanged = useMemo(
    () =>
      isGradeOnly
        ? selectedGrade !== currentGrade
        : selectedState !== currentState || selectedGrade !== currentGrade,
    [selectedState, selectedGrade, currentState, currentGrade, isGradeOnly],
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          getSheetLayout(width),
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle indicator */}
        <View style={styles.handleContainer}>
          <View style={styles.handleIndicator} />
        </View>

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Your Grade Level</Text>
            <Text style={styles.subtitle}>
              {isGradeOnly
                ? 'Choose your grade for grade-appropriate practice questions'
                : 'Choose your state and grade for personalized rubrics'}
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.loadingText}>Loading preferences...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* State Selection — hidden entirely in grade-only mode */}
              {!isGradeOnly && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>State</Text>
                  <View style={styles.optionsGrid}>
                    {stateOptions.map(option => (
                      <TouchableOpacity
                        key={option.code}
                        style={[
                          styles.optionButton,
                          selectedState === option.code && styles.optionButtonSelected,
                        ]}
                        onPress={() => setSelectedState(option.code)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selectedState === option.code && styles.optionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Grade Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Grade</Text>
                <View style={styles.optionsGrid}>
                  {gradeOptions.map(option => (
                    <TouchableOpacity
                      key={option.code}
                      style={[
                        styles.gradeButton,
                        selectedGrade === option.code && styles.gradeButtonSelected,
                      ]}
                      onPress={() => setSelectedGrade(option.code)}
                    >
                      <Text
                        style={[
                          styles.gradeText,
                          selectedGrade === option.code && styles.gradeTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Info Note — only makes sense when we have a state + rubric context */}
              {!isGradeOnly && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    📝 Your essays will be evaluated using the{' '}
                    <Text style={styles.infoBold}>
                      {selectedState} standards for{' '}
                      {gradeOptions.find(g => g.code === selectedGrade)?.label || selectedGrade}
                    </Text>
                  </Text>
                </View>
              )}
            </ScrollView>
          )}

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !hasChanged && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!hasChanged}
            >
              <Text style={styles.saveButtonText}>
                {hasChanged ? 'Save Changes' : 'No Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default StateSelectorSheet;
