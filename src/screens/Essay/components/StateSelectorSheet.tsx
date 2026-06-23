/**
 * StateSelectorSheet.tsx
 * Bottom sheet component for selecting state and grade
 * Uses React Native Modal for reliability across platforms
 */

import React, { useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [selectedState, setSelectedState] = React.useState(currentState);
  const [selectedGrade, setSelectedGrade] = React.useState(currentGrade);

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
  }, [isVisible, slideAnim]);

  const handleSave = useCallback(() => {
    onSave(selectedState, selectedGrade);
  }, [selectedState, selectedGrade, onSave]);

  const hasChanged = useMemo(
    () => selectedState !== currentState || selectedGrade !== currentGrade,
    [selectedState, selectedGrade, currentState, currentGrade],
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
              Choose your state and grade for personalized rubrics
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
              {/* State Selection */}
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

              {/* Info Note */}
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  📝 Your essays will be evaluated using the{' '}
                  <Text style={styles.infoBold}>
                    {selectedState} standards for{' '}
                    {gradeOptions.find(g => g.code === selectedGrade)?.label || selectedGrade}
                  </Text>
                </Text>
              </View>
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

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  gradeButton: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  gradeButtonSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  gradeTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});