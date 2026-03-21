/**
 * File Models
 * Type definitions for file upload and management
 */

// This file contains:

// FileType enum: Only PDF support as requested
// FileUploadStatus enum: Tracks upload lifecycle (pending → uploading → extracting → success/failed)
// FileInfo interface: Complete file metadata including extracted text
// FileValidationResult: For validation responses
// FILE_UPLOAD_CONFIG: Constants (100KB max, 2 files max, PDF only)
// FILE_ERROR_MESSAGES: User-friendly error messages

/**
 * Supported file types for upload
 */
export enum FileType {
  PDF = 'application/pdf',
}

/**
 * File upload status
 */
export enum FileUploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  EXTRACTING = 'extracting',
  SUCCESS = 'success',
  FAILED = 'failed',
}

/**
 * Information about an uploaded file
 */
export interface FileInfo {
  id: string;
  name: string;
  type: FileType;
  size: number; // in bytes
  uri: string; // local file URI
  extractedText?: string; // text extracted from PDF
  uploadStatus: FileUploadStatus;
  uploadProgress: number; // 0-100
  errorMessage?: string;
  uploadedAt?: Date;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * File upload configuration
 */
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024, // 100KB in bytes
  MAX_FILES_COUNT: 2,
  ALLOWED_TYPES: [FileType.PDF],
  ALLOWED_EXTENSIONS: ['.pdf'],
} as const;

/**
 * File error messages
 */
export const FILE_ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size exceeds ${
    FILE_UPLOAD_CONFIG.MAX_FILE_SIZE / 1024
  }KB limit`,
  INVALID_FILE_TYPE: 'Only PDF files are supported',
  MAX_FILES_EXCEEDED: `Maximum ${FILE_UPLOAD_CONFIG.MAX_FILES_COUNT} files allowed`,
  EXTRACTION_FAILED: 'Failed to extract text from PDF',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  NO_TEXT_FOUND: 'No text found in the PDF file',
} as const;
