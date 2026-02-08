/**
 * Feedback Dialog Component
 * Displays detailed essay evaluation results
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { RubricScores } from '../../../models/EssayModels';

interface FeedbackDialogProps {
  visible: boolean;
  totalScore: number;
  grade: string;
  rubricScores: RubricScores | null;
  personalizedFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
  onDismiss: () => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  visible,
  totalScore,
  grade,
  rubricScores,
  personalizedFeedback,
  strengths,
  areasForImprovement,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Essay Evaluation Results</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Score Card */}
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Overall Score</Text>
              <Text style={styles.scoreValue}>{totalScore}/100</Text>
              <Text style={styles.gradeText}>Grade: {grade}</Text>
            </View>

            {/* Rubric Scores */}
            {rubricScores && (
              <>
                <Text style={styles.sectionTitle}>Detailed Scores</Text>
                <RubricScoreItem label="Content & Ideas" score={rubricScores.content_and_ideas} />
                <RubricScoreItem label="Organization & Structure" score={rubricScores.organization_and_structure} />
                <RubricScoreItem label="Language & Vocabulary" score={rubricScores.language_and_vocabulary} />
                <RubricScoreItem label="Grammar & Mechanics" score={rubricScores.grammar_and_mechanics} />
                <RubricScoreItem label="Coherence & Clarity" score={rubricScores.coherence_and_clarity} />
              </>
            )}

            {/* Personalized Feedback */}
            <Text style={styles.sectionTitle}>Personalized Feedback</Text>
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackText}>{personalizedFeedback}</Text>
            </View>

            {/* Strengths */}
            {strengths.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, styles.strengthsTitle]}>
                  ✨ Strengths
                </Text>
                {strengths.map((strength, index) => (
                  <View key={index} style={styles.strengthCard}>
                    <Text style={styles.listItemText}>• {strength}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Areas for Improvement */}
            {areasForImprovement.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, styles.improvementTitle]}>
                  💡 Areas for Improvement
                </Text>
                {areasForImprovement.map((area, index) => (
                  <View key={index} style={styles.improvementCard}>
                    <Text style={styles.listItemText}>• {area}</Text>
                  </View>
                ))}
              </>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer Button */}
          <TouchableOpacity style={styles.closeFooterButton} onPress={onDismiss}>
            <Text style={styles.closeFooterButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface RubricScoreItemProps {
  label: string;
  score: number;
}

const RubricScoreItem: React.FC<RubricScoreItemProps> = ({ label, score }) => {
  const progress = score / 20;

  return (
    <View style={styles.rubricItem}>
      <Text style={styles.rubricLabel}>{label}</Text>
      <View style={styles.rubricRight}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.rubricScore}>{score}/20</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  content: {
    padding: 16,
  },
  scoreCard: {
    backgroundColor: '#E8D5FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7D55FF',
  },
  gradeText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  strengthsTitle: {
    color: '#7D55FF',
  },
  improvementTitle: {
    color: '#FF6B6B',
  },
  rubricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rubricLabel: {
    fontSize: 14,
    flex: 1,
  },
  rubricRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarContainer: {
    width: 60,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7D55FF',
  },
  rubricScore: {
    fontSize: 14,
    fontWeight: '600',
    width: 45,
    textAlign: 'right',
  },
  feedbackCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
  },
  strengthCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  improvementCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeFooterButton: {
    backgroundColor: '#7D55FF',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  closeFooterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeedbackDialog;