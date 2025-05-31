
import { PersistentAuthState, AUTH_STATE_KEY } from './types';
import { db } from '@/services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Helper function to get persistent auth state from Firebase
export const getPersistentAuthState = async (uid?: string): Promise<PersistentAuthState> => {
  try {
    if (uid) {
      // Try to get from Firebase first
      const authDoc = await getDoc(doc(db, 'auth-states', uid));
      if (authDoc.exists()) {
        return authDoc.data() as PersistentAuthState;
      }
    }
    
    // Fallback to localStorage
    const storedState = localStorage.getItem(AUTH_STATE_KEY);
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    console.error('Error reading auth state:', error);
  }
  return { isAuthenticated: false, isAdmin: false, uid: null };
};

// Helper function to set persistent auth state in both Firebase and localStorage
export const setPersistentAuthState = async (state: PersistentAuthState) => {
  try {
    // Save to Firebase if user is authenticated
    if (state.uid) {
      await setDoc(doc(db, 'auth-states', state.uid), state);
    }
    
    // Also save to localStorage as fallback
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error storing auth state:', error);
    // Fallback to localStorage only
    try {
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
    } catch (localError) {
      console.error('Error storing auth state to localStorage:', localError);
    }
  }
};
