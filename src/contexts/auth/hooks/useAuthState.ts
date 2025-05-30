
import { useState, useEffect, useCallback } from 'react';
import useFirebase from '@/hooks/useFirebase';
import { CustomUser, convertToCustomUser, UserData } from '@/types/user';
import { setPersistentAuthState, getPersistentAuthState } from '../helpers';

export const useAuthState = () => {
  const { currentUser, getUserByUid, loading: firebaseLoading } = useFirebase();
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize from persistent state only once
  useEffect(() => {
    if (!authInitialized) {
      const persistentState = getPersistentAuthState();
      console.log("=== INITIALIZING FROM PERSISTENT STATE ===", persistentState);
      
      if (persistentState.isAuthenticated && persistentState.isAdmin !== undefined) {
        setIsAdmin(persistentState.isAdmin);
        console.log("Set admin status from persistent state:", persistentState.isAdmin);
      }
      setAuthInitialized(true);
    }
  }, [authInitialized]);

  // Main auth state handler
  useEffect(() => {
    const checkUserRole = async () => {
      console.log("=== AUTH STATE CHECK ===", { 
        currentUserUid: currentUser?.uid, 
        firebaseLoading,
        authInitialized
      });
      
      if (!authInitialized) {
        console.log("Auth not initialized yet, waiting...");
        return;
      }
      
      if (currentUser) {
        try {
          console.log("Fetching user data from Firestore...");
          
          // Get user data with retry logic
          let userData: UserData | null = null;
          let attempts = 0;
          const maxAttempts = 3;
          
          while (!userData && attempts < maxAttempts) {
            try {
              userData = await getUserByUid(currentUser.uid) as UserData;
              if (userData) {
                console.log("=== USER DATA FETCHED ===", userData);
                break;
              }
            } catch (error) {
              console.log(`Firestore fetch attempt ${attempts + 1} failed:`, error);
            }
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
          
          const customUser = convertToCustomUser(currentUser, userData);
          setUser(customUser);
          
          // Set admin status
          const userIsAdmin = userData?.role === 'admin';
          console.log("=== SETTING ADMIN STATUS ===", { 
            role: userData?.role, 
            isAdmin: userIsAdmin 
          });
          
          setIsAdmin(userIsAdmin);
          
          // Update persistent state
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: userIsAdmin,
            uid: currentUser.uid
          });
          
          console.log("=== AUTH STATE UPDATED ===", {
            isAuthenticated: true,
            isAdmin: userIsAdmin,
            uid: currentUser.uid
          });
          
        } catch (error) {
          console.error("Error in auth state check:", error);
          // Set defaults on error
          setIsAdmin(false);
          setUser(convertToCustomUser(currentUser));
          
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: false,
            uid: currentUser.uid
          });
        } finally {
          setLoading(false);
        }
      } else {
        console.log("=== NO CURRENT USER, CLEARING STATE ===");
        setIsAdmin(false);
        setUser(null);
        
        setPersistentAuthState({
          isAuthenticated: false,
          isAdmin: false,
          uid: null
        });
        
        setLoading(false);
      }
    };
    
    // Only check if Firebase is not loading and auth is initialized
    if (!firebaseLoading && authInitialized) {
      checkUserRole();
    }
    
  }, [currentUser, firebaseLoading, getUserByUid, authInitialized]);

  console.log("=== AUTH STATE HOOK RETURNING ===", { 
    userUid: user?.uid, 
    isAdmin, 
    loading: loading || firebaseLoading || !authInitialized
  });

  return {
    user,
    isAdmin,
    loading: loading || firebaseLoading || !authInitialized,
    setUser
  };
};

export default useAuthState;
