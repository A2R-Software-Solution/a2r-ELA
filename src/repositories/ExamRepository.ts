/**
 * Exam Repository
 * Handles all Exam Prep / PSSA practice related API calls and data operations.
 * Mirrors the pattern used in EssayRepository.ts.
 */

import apiService from '../api/apiService';
import { Result } from '../models/Result';
import {
  PssaDomain,
  PssaDifficulty,
  PssaQuestionsResponse,
  PssaWritingEvaluationResponse,
} from '../api/apiService';

class ExamRepository {

  // --------------------------------------------------------------------------
  // PSSA PRACTICE — QUESTION GENERATION
  // --------------------------------------------------------------------------

  /**
   * Generate fresh PSSA-style practice questions for the given grade + domain.
   */
  async generatePssaQuestions(
    grade: string,
    domain: PssaDomain,
    difficulty: PssaDifficulty,
    count: number,
  ): Promise<Result<PssaQuestionsResponse>> {
    try {
      const request = {
        grade,
        domain,
        difficulty,
        count,
      };

      const response = await apiService.generatePssaQuestions(request);

      if (response.status >= 200 && response.status < 300) {
        const body = response.data;
        if (body.success && body.data) {
          return Result.success(body.data);
        } else {
          return Result.error(
            new Error(body.error || 'Failed to generate questions'),
            body.error || 'Unknown error'
          );
        }
      } else {
        return Result.error(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          `Server error: ${response.statusText}`
        );
      }
    } catch (error: any) {
      return Result.error(error, error.message || 'Network error occurred');
    }
  }

  // --------------------------------------------------------------------------
  // PSSA PRACTICE — WRITING EVALUATION
  // --------------------------------------------------------------------------

  /**
   * Evaluate a student's short answer / writing response for a PSSA question.
   */
  async evaluatePssaWriting(
    question: string,
    studentAnswer: string,
    difficulty: PssaDifficulty,
    grade: string,
  ): Promise<Result<PssaWritingEvaluationResponse>> {
    try {
      const request = {
        question,
        student_answer: studentAnswer,
        difficulty,
        grade,
      };

      const response = await apiService.evaluatePssaWriting(request);

      if (response.status >= 200 && response.status < 300) {
        const body = response.data;
        if (body.success && body.data) {
          return Result.success(body.data);
        } else {
          return Result.error(
            new Error(body.error || 'Failed to evaluate writing'),
            body.error || 'Unknown error'
          );
        }
      } else {
        return Result.error(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          `Server error: ${response.statusText}`
        );
      }
    } catch (error: any) {
      return Result.error(error, error.message || 'Network error occurred');
    }
  }
}

// Export singleton instance
export default new ExamRepository();