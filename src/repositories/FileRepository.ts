/**
 * FileRepository
 * Handles file upload and PDF text extraction operations
 */

import { apiService } from '../api/apiService';
import { PdfTextExtractor } from '../utils/PdfTextExtractor';
import {
  FileInfo,
  FileType,
  FileUploadStatus,
  FileValidationResult,
  FILE_UPLOAD_CONFIG,
  FILE_ERROR_MESSAGES,
} from '../models/FileModels';
import { Result } from '../models/Result';

/**
 * Response from PDF text extraction API
 */
interface PdfExtractionResponse {
  success: boolean;
  text: string;
  wordCount: number;
  error?: string;
}

export class FileRepository {
  /**
   * Validate a file before upload
   */
  static validateFile(
    file: { name: string; size: number; type: string },
    currentFilesCount: number,
  ): FileValidationResult {
    // Check file count
    if (currentFilesCount >= FILE_UPLOAD_CONFIG.MAX_FILES_COUNT) {
      return {
        isValid: false,
        error: FILE_ERROR_MESSAGES.MAX_FILES_EXCEEDED,
      };
    }

    // Check file type
    if (
      file.type !== FileType.PDF &&
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
      return {
        isValid: false,
        error: FILE_ERROR_MESSAGES.INVALID_FILE_TYPE,
      };
    }

    // Check file size
    if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: FILE_ERROR_MESSAGES.FILE_TOO_LARGE,
      };
    }

    return { isValid: true };
  }

  /**
   * Upload PDF and extract text
   * This sends the PDF to backend for text extraction
   */
  static async uploadAndExtractPdf(
    fileUri: string,
    fileName: string,
  ): Promise<Result<PdfExtractionResponse>> {
    try {
      // Validate PDF locally first
      const validation = await PdfTextExtractor.validatePdf(
        fileUri,
        FILE_UPLOAD_CONFIG.MAX_FILE_SIZE,
      );

      if (!validation.isValid) {
        return Result.error(
          new Error(validation.error || 'Invalid PDF file'),
          validation.error || 'Invalid PDF file',
        );
      }

      // Read PDF as base64
      const base64Data = await PdfTextExtractor.readAsBase64(fileUri);

      // Send to backend for text extraction
      const response = await apiService.extractPdfText({
        fileName,
        fileData: base64Data,
      });

      if (!response.success || !response.text) {
        return Result.error(
          new Error(response.error || FILE_ERROR_MESSAGES.EXTRACTION_FAILED),
          response.error || FILE_ERROR_MESSAGES.EXTRACTION_FAILED,
        );
      }

      // Check if text was found
      if (response.text.trim().length === 0) {
        return Result.error(
          new Error(FILE_ERROR_MESSAGES.NO_TEXT_FOUND),
          FILE_ERROR_MESSAGES.NO_TEXT_FOUND,
        );
      }

      // Clean the extracted text
      const cleanedText = PdfTextExtractor.cleanText(response.text);
      const wordCount = PdfTextExtractor.countWords(cleanedText);

      return Result.success({
        success: true,
        text: cleanedText,
        wordCount,
      });
    } catch (error) {
      console.error('Error uploading and extracting PDF:', error);
      return Result.error(
        error instanceof Error ? error : new Error('Unknown error'),
        error instanceof Error
          ? error.message
          : FILE_ERROR_MESSAGES.EXTRACTION_FAILED,
      );
    }
  }

  /**
   * Create a FileInfo object from document picker response
   */
  static createFileInfo(
    id: string,
    file: {
      name: string;
      size: number;
      type: string;
      uri: string;
    },
  ): FileInfo {
    return {
      id,
      name: file.name,
      type: FileType.PDF,
      size: file.size,
      uri: file.uri,
      uploadStatus: FileUploadStatus.PENDING,
      uploadProgress: 0,
    };
  }

  /**
   * Update file status
   */
  static updateFileStatus(
    file: FileInfo,
    status: FileUploadStatus,
    error?: string,
    extractedText?: string,
  ): FileInfo {
    return {
      ...file,
      uploadStatus: status,
      errorMessage: error,
      extractedText,
      uploadedAt:
        status === FileUploadStatus.SUCCESS ? new Date() : file.uploadedAt,
    };
  }

  /**
   * Check if file extraction was successful
   */
  static isExtractionSuccessful(file: FileInfo): boolean {
    return (
      file.uploadStatus === FileUploadStatus.SUCCESS &&
      !!file.extractedText &&
      file.extractedText.trim().length > 0
    );
  }

  /**
   * Get total word count from all uploaded files
   */
  static getTotalWordCount(files: FileInfo[]): number {
    return files.reduce((total, file) => {
      if (file.extractedText) {
        return total + PdfTextExtractor.countWords(file.extractedText);
      }
      return total;
    }, 0);
  }

  /**
   * Combine extracted text from multiple files
   */
  static combineExtractedText(files: FileInfo[]): string {
    return files
      .filter(file => this.isExtractionSuccessful(file))
      .map(file => file.extractedText)
      .join('\n\n---\n\n'); // Separate files with delimiter
  }
}
