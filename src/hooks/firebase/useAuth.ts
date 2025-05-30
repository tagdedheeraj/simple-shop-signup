import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { doc, setDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { auth, db } from '@/services/firebase';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set persistence to local on initialization
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if auth is available
        if (!auth) {
          console.error("Firebase auth is not initialized");
          setLoading(false);
          return;
        }

        // Set persistence to LOCAL to keep user logged in
        await setPersistence(auth, browserLocalPersistence);
        console.log("Firebase persistence set to LOCAL");
      } catch (error) {
        console.error("Error setting auth persistence:", error);
      }

      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("Firebase auth state changed:", user ? `User ${user.uid}` : "No user");
        setCurrentUser(user);
        setLoading(false);
      });

      // Cleanup subscription
      return () => unsubscribe();
    };

    initializeAuth();
  }, []);

  const createUser = useCallback(async (email: string, password: string, displayName?: string, role: string = 'user') => {
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile if display name is provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        // Store additional user data in Firestore
        if (db) {
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          await setDoc(userDocRef, {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: displayName,
            createdAt: new Date().toISOString(),
            role: role, // Set role from parameter
            lastLogin: new Date().toISOString()
          });
        }
      }
      
      return userCredential.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized");
      }

      console.log("Attempting Firebase signIn");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase signIn successful");
      
      // Update last login time in Firestore
      try {
        if (db) {
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          await setDoc(userDocRef, {
            lastLogin: new Date().toISOString()
          }, { merge: true });
          console.log("Updated last login time in Firestore");
        }
      } catch (firestoreError) {
        console.error("Error updating login time in Firestore:", firestoreError);
        // Continue even if Firestore update fails
      }
      
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }, []);

  const logOut = useCallback(async () => {
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized");
      }

      console.log("Attempting Firebase signOut");
      await signOut(auth);
      console.log("Firebase signOut successful");
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const getCurrentUser = useCallback((): User | null => {
    return auth?.currentUser || currentUser;
  }, [currentUser]);

  return {
    createUser,
    signIn,
    logOut,
    getCurrentUser,
    currentUser,
    loading
  };
};

export default useAuth;
