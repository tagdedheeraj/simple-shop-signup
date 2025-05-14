
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useFirebase from '@/hooks/useFirebase';
import { setPersistentAuthState } from '../helpers';
import { convertToCustomUser, UserData } from '@/types/user';

export const useLogin = () => {
  const { signIn, getUserByUid } = useFirebase();
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<{success: boolean; isAdmin: boolean}> => {
    try {
      setLoading(true);
      
      // Sign in with Firebase
      const firebaseUser = await signIn(email, password);
      
      // Check if user is admin
      if (firebaseUser) {
        const userData = await getUserByUid(firebaseUser.uid) as UserData;
        const userIsAdmin = userData?.role === 'admin';
        
        // Update persistent state
        setPersistentAuthState({
          isAuthenticated: true,
          isAdmin: userIsAdmin,
          uid: firebaseUser.uid
        });
        
        toast.success('Successfully logged in');
        return {
          success: true, 
          isAdmin: userIsAdmin
        };
      }
      
      return {success: true, isAdmin: false};
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide more specific error messages based on error code
      if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('User not found. Please check your email or register for an account.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many unsuccessful login attempts. Please try again later.');
      } else {
        toast.error('Login failed. Please try again.');
      }
      
      // Clear persistent state on login failure
      setPersistentAuthState({
        isAuthenticated: false,
        isAdmin: false,
        uid: null
      });
      
      return {success: false, isAdmin: false};
    } finally {
      setLoading(false);
    }
  }, [signIn, getUserByUid]);

  return {
    login,
    loading
  };
};

export default useLogin;
