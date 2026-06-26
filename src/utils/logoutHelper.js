import { auth, signOut } from "../firebase";

/**
 * Centrally clears all local storage authentication details and signs the user out of Firebase.
 */
export const logoutUser = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("firebaseToken");
  localStorage.removeItem("firebaseUser");
  try {
    if (auth) {
      await signOut(auth);
    }
  } catch (error) {
    console.error("Error signing out of Firebase:", error);
  }
};
