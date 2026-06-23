/**
 * PdfTextExtractor Utility
 * Extracts text content from PDF files
 */

import RNFS from 'react-native-fs';

/**
 * Result of PDF text extraction
 */
export interface PdfExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
  wordCount?: number;
}

/**
 * Extract text from a PDF filex
 * Note: This is a basic implementation. For production, consider using:
 * - react-native-pdf for more robust PDF handling
 * - Backend API for server-side extraction
 */
export class PdfTextExtractor {
  /**
   * Extract text from PDF file
   * @param fileUri - Local file URI of the PDF
   * @returns Promise with extraction result
   */
  static async extractText(fileUri: string): Promise<PdfExtractionResult> {
    try {
      // Read file as base64
      await RNFS.readFile(fileUri, 'base64');

      // For now, we'll send this to backend for extraction
      // Since native PDF text extraction in React Native is complex
      // and requires heavy libraries, it's better to handle server-side

      // This is a placeholder - we'll implement the actual API call
      // in the repository layer
      return {
        success: true,
        text: '', // Will be filled by backend
        wordCount: 0,
      };
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return {
        success: false,
        error: 'Failed to read PDF file',
      };
    }
  }

  /**
   * Validate PDF file before extraction
   * @param fileUri - Local file URI
   * @param maxSizeBytes - Maximum file size in bytes
   * @returns Promise with validation result
   */
  static async validatePdf(
    fileUri: string,
    maxSizeBytes: number = 100 * 1024,
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      // Check if file exists
      const exists = await RNFS.exists(fileUri);
      if (!exists) {
        return { isValid: false, error: 'File does not exist' };
      }

      // Check file size
      const stat = await RNFS.stat(fileUri);
      if (stat.size > maxSizeBytes) {
        return {
          isValid: false,
          error: `File size (${(stat.size / 1024).toFixed(
            1,
          )} KB) exceeds limit (${(maxSizeBytes / 1024).toFixed(0)} KB)`,
        };
      }

      return { isValid: true };
    } catch (error) {
      console.error('Error validating PDF:', error);
      return { isValid: false, error: 'Failed to validate file' };
    }
  }

  /**
   * Read PDF file as base64 for backend processing
   * @param fileUri - Local file URI
   * @returns Promise with base64 string
   */
  static async readAsBase64(fileUri: string): Promise<string> {
    try {
      const base64Data = await RNFS.readFile(fileUri, 'base64');
      return base64Data;
    } catch (error) {
      console.error('Error reading PDF as base64:', error);
      throw new Error('Failed to read PDF file');
    }
  }

  /**
   * Count words in extracted text
   * @param text - Extracted text
   * @returns Word count
   */
  static countWords(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }

    // Remove extra whitespace and split by spaces
    const words = text.trim().split(/\s+/);
    return words.length;
  }

  /**
   * Clean extracted text (remove excessive whitespace, etc.)
   * @param text - Raw extracted text
   * @returns Cleaned text
   */
  static cleanText(text: string): string {
    if (!text) return '';

    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/[ \t]+/g, ' ') // Remove excessive spaces
      .trim();
  }
}
