import { auth, signOut } from "../firebase";
import axios from "axios";
import API_URL from "../api";

/**
 * Centrally clears all local storage authentication details and signs the user out of Firebase.
 * Also tells the backend to mark the user's session as inactive.
 */
export const logoutUser = async () => {
  // Tell the backend to mark session as inactive
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post(`${API_URL}/user/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    // Don't block logout if backend call fails
    console.error("Error calling backend logout:", error);
  }

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
