import toast from 'react-hot-toast';

// ── Friendly messages for common HTTP errors ──────────────
const ERROR_MESSAGES = {
  400: 'Invalid request — check your input',
  401: 'Session expired — please log in again',
  403: 'Access denied',
  404: 'Resource not found',
  409: 'Already exists',
  422: 'Validation failed',
  429: 'Too many requests — slow down',
  500: 'Server error — try again in a moment',
  503: 'Service unavailable — server may be starting up',
};

export const handleApiError = (err, customMessage) => {
  // Use server-provided message first
  const serverMessage = err.response?.data?.message;

  // Then custom message, then generic based on status, then fallback
  const message =
    serverMessage ||
    customMessage ||
    ERROR_MESSAGES[err.response?.status] ||
    'Something went wrong';

  toast.error(message);
  console.error('API Error:', err.response?.status, message);
};

// ── Wrap async calls with consistent error handling ────────
export const withErrorHandling = async (fn, customMessage) => {
  try {
    return await fn();
  } catch (err) {
    handleApiError(err, customMessage);
    throw err;   // re-throw so callers can still catch if needed
  }
};