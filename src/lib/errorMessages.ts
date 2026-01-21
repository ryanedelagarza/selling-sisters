/**
 * Kid-friendly error messages for various error states.
 * These messages are designed to be helpful and non-technical.
 */
export const ERROR_MESSAGES = {
  network: "Oops! We're having trouble connecting. Please check your internet and try again.",
  notFound: "We couldn't find that. It might have been removed or sold out!",
  validation: "Something doesn't look right. Please check your info and try again.",
  server: "Something went wrong on our end. Please try again in a moment.",
  upload: "We couldn't upload your photo. Please try a different image or try again.",
  timeout: "This is taking too long. Please try again.",
  unknown: "Something unexpected happened. Please try again.",
};

/**
 * Get an error message based on error type or HTTP status code.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return ERROR_MESSAGES.network;
    }
    // Check for timeout
    if (error.message.includes('timeout')) {
      return ERROR_MESSAGES.timeout;
    }
  }

  // Check for HTTP error responses
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: number }).status;
    if (status === 404) return ERROR_MESSAGES.notFound;
    if (status === 400 || status === 422) return ERROR_MESSAGES.validation;
    if (status >= 500) return ERROR_MESSAGES.server;
  }

  return ERROR_MESSAGES.unknown;
}

/**
 * Illustration emoji mapping for different empty/error states.
 */
export const ILLUSTRATIONS: Record<string, string> = {
  empty: '🎨',
  notFound: '🔍',
  error: '😅',
  noProducts: '📦',
  comingSoon: '🚧',
  offline: '📡',
  success: '🎉',
  loading: '⏳',
};
