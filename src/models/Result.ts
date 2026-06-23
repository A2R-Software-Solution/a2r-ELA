/**
 * A generic class that holds a value with its loading status.
 * React Native/TypeScript equivalent of Kotlin sealed class Result
 */

export type Result<T> =
  | { type: 'success'; data: T }
  | { type: 'error'; exception: Error; message: string }
  | { type: 'loading' };

/**
 * Helper functions to create Result instances
 */
export const Result = {
  success: <T>(data: T): Result<T> => ({
    type: 'success',
    data,
  }),

  error: (exception: Error, message?: string): Result<never> => ({
    type: 'error',
    exception,
    message: message || exception.message || 'Unknown error',
  }),

  loading: (): Result<never> => ({
    type: 'loading',
  }),

  /**
   * Type guards for checking Result type
   */
  isSuccess: <T>(result: Result<T>): result is { type: 'success'; data: T } => {
    return result.type === 'success';
  },

  isError: <T>(result: Result<T>): result is { type: 'error'; exception: Error; message: string } => {
    return result.type === 'error';
  },

  isLoading: <T>(result: Result<T>): result is { type: 'loading' } => {
    return result.type === 'loading';
  },
};

/**
 * Helper function to handle Result states (chainable)
 */
export const onSuccess = <T>(result: Result<T>, action: (data: T) => void): Result<T> => {
  if (Result.isSuccess(result)) {
    action(result.data);
  }
  return result;
};

export const onError = <T>(result: Result<T>, action: (exception: Error, message: string) => void): Result<T> => {
  if (Result.isError(result)) {
    action(result.exception, result.message);
  }
  return result;
};

export const onLoading = <T>(result: Result<T>, action: () => void): Result<T> => {
  if (Result.isLoading(result)) {
    action();
  }
  return result;
};

/**
 * Utility to convert Result to string (for debugging)
 */
export const resultToString = <T>(result: Result<T>): string => {
  switch (result.type) {
    case 'success':
      return `Success[data=${JSON.stringify(result.data)}]`;
    case 'error':
      return `Error[exception=${result.exception.message}]`;
    case 'loading':
      return 'Loading';
  }
};