import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    console.log('👥 Loaded users from storage:', storedUsers.length);
  }, []);

  const saveUserToStorage = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if user already exists
      const existingUserIndex = users.findIndex(u => u.uid === userData.uid);
      
      if (existingUserIndex > -1) {
        // Update existing user
        users[existingUserIndex] = {
          ...users[existingUserIndex],
          lastLogin: new Date().toISOString(),
          loginCount: (users[existingUserIndex].loginCount || 1) + 1
        };
      } else {
        // Add new user
        const newUser = {
          id: userData.uid,
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName || userData.email.split('@')[0],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          loginCount: 1,
          role: 'user', // default role
          isActive: true
        };
        users.push(newUser);
      }
      
      localStorage.setItem('users', JSON.stringify(users));
      console.log('💾 User saved to storage:', userData.email);
    } catch (error) {
      console.error('❌ Error saving user to storage:', error);
    }
  };

  const signup = async (email, password, displayName = '') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user to localStorage
      saveUserToStorage({
        ...user,
        displayName: displayName || email.split('@')[0]
      });
      
      return userCredential;
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save/update user in localStorage
      saveUserToStorage(user);
      
      return userCredential;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('🚪 User logged out');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        console.log('✅ User authenticated:', user.email);
        // Update user login info
        saveUserToStorage(user);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}