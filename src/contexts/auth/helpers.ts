
import { PersistentAuthState, AUTH_STATE_KEY } from './types';

// Helper function to get persistent auth state
export const getPersistentAuthState = (): PersistentAuthState => {
  try {
    const storedState = localStorage.getItem(AUTH_STATE_KEY);
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    console.error('Error reading auth state from localStorage:', error);
  }
  return { isAuthenticated: false, isAdmin: false, uid: null };
};

// Helper function to set persistent auth state
export const setPersistentAuthState = (state: PersistentAuthState) => {
  try {
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error storing auth state to localStorage:', error);
  }
};
