// src/utils/Auth.js
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebaseConfig";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("registeredUser", JSON.stringify({ 
      uid: user.uid, 
      name: user.displayName, 
      email: user.email 
    }));
    window.location.reload();
    return { success: true, user };
  } catch (err) {
    console.error("Google login error:", err);
    return { success: false, error: err };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("registeredUser");
    window.location.reload();
    return { success: true };
  } catch (err) {
    console.error("Sign out error:", err);
    return { success: false, error: err };
  }
};

