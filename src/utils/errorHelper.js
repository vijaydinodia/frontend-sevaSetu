/**
 * Parses any incoming error (Axios, Firebase, or general Javascript error)
 * and returns an industry-standard, user-friendly error message.
 * Also prints technical logs to console for debugging.
 */
export const getFriendlyErrorMessage = (error) => {
  if (!error) return "An unknown error occurred. Please try again.";

  // Print raw error to console for developers
  console.error("Parsed Auth/API Error:", error);

  // If the error itself is already a string
  if (typeof error === 'string') return error;

  // 1. Handle Axios / Network / Backend responses
  if (error.response) {
    const data = error.response.data;
    if (data && typeof data === 'object') {
      if (data.message) return data.message;
      if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
    }
    
    // Status code fallbacks
    const status = error.response.status;
    if (status === 400) return "Invalid input details. Please verify your entries.";
    if (status === 401) return "Incorrect email address or password. Please verify and try again.";
    if (status === 403) return "You do not have permission to access this resource.";
    if (status === 404) return "Requested page or service was not found on the server.";
    if (status === 429) return "Too many attempts. Please wait a moment and try again.";
    if (status >= 500) return "Our server encountered an issue. Please try again in a few minutes.";
  } else if (error.request) {
    // Axios request sent but no response received (Server down / Offline)
    return "Cannot reach the server. Please check your internet connection and try again.";
  }

  // 2. Handle Firebase authentication errors (code or message matching)
  const errorCode = error.code || (error.message && typeof error.message === 'string' && error.message.includes('auth/') ? error.message : null);

  if (errorCode && typeof errorCode === 'string') {
    if (errorCode.includes('auth/popup-closed-by-user')) {
      return "Google sign-in popup was closed before completion. Please try again.";
    }
    if (errorCode.includes('auth/popup-blocked')) {
      return "Sign-in popup was blocked by your browser. Please enable popups and try again.";
    }
    if (errorCode.includes('auth/invalid-credential') || errorCode.includes('auth/wrong-password') || errorCode.includes('auth/user-not-found')) {
      return "Incorrect email address or password. Please try again.";
    }
    if (errorCode.includes('auth/email-already-in-use')) {
      return "An account with this email address already exists. Try logging in instead.";
    }
    if (errorCode.includes('auth/weak-password')) {
      return "Password is too weak. Please use at least 6 characters with mixed characters.";
    }
    if (errorCode.includes('auth/too-many-requests')) {
      return "Too many failed attempts. This account is temporarily disabled. Please reset your password or try again later.";
    }
    if (errorCode.includes('auth/network-request-failed')) {
      return "Network connection issue. Please check your internet and try again.";
    }
    if (errorCode.includes('auth/operation-not-allowed')) {
      return "Google sign-in or registration is currently disabled. Please contact support.";
    }
    if (errorCode.includes('auth/user-disabled')) {
      return "This user account has been disabled. Please contact SevaSetu support.";
    }
    if (errorCode.includes('auth/invalid-email')) {
      return "The email address entered is not valid. Please verify and try again.";
    }
  }

  // 3. General Fallback
  let msg = error.message || "An unexpected error occurred. Please try again.";
  if (msg.startsWith("Firebase: ")) {
    msg = msg.replace("Firebase: ", "").trim();
  }
  return msg;
};
