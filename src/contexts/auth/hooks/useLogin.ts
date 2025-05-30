
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useFirebase from '@/hooks/useFirebase';
import { setPersistentAuthState } from '../helpers';
import { UserData } from '@/types/user';

export const useLogin = () => {
  const { signIn, getUserByUid } = useFirebase();
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<{success: boolean; isAdmin: boolean}> => {
    try {
      setLoading(true);
      console.log("=== STARTING LOGIN PROCESS ===");
      
      // Sign in with Firebase
      const firebaseUser = await signIn(email, password);
      console.log("Firebase sign in successful:", firebaseUser?.uid);
      
      if (firebaseUser) {
        console.log("Fetching user data from Firestore...");
        
        // Retry mechanism for getting user data
        let userData: UserData | null = null;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (!userData && attempts < maxAttempts) {
          try {
            userData = await getUserByUid(firebaseUser.uid) as UserData;
            if (userData) {
              console.log("User data fetched successfully:", userData);
              break;
            }
          } catch (error) {
            console.log(`Attempt ${attempts + 1} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          attempts++;
        }
        
        const userIsAdmin = userData?.role === 'admin';
        console.log("=== USER ROLE CHECK ===", { 
          role: userData?.role, 
          isAdmin: userIsAdmin,
          userData: userData 
        });
        
        // Update persistent state immediately
        setPersistentAuthState({
          isAuthenticated: true,
          isAdmin: userIsAdmin,
          uid: firebaseUser.uid
        });
        
        console.log("Persistent auth state updated:", {
          isAuthenticated: true,
          isAdmin: userIsAdmin,
          uid: firebaseUser.uid
        });
        
        // Wait for state to be properly set
        await new Promise(resolve => setTimeout(resolve, 300));
        
        toast.success('Successfully logged in');
        console.log("=== LOGIN COMPLETED ===", { success: true, isAdmin: userIsAdmin });
        
        return {
          success: true, 
          isAdmin: userIsAdmin
        };
      }
      
      console.log("No Firebase user returned");
      return {success: false, isAdmin: false};
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
