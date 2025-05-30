
import { useState, useEffect, useCallback } from 'react';
import useFirebase from '@/hooks/useFirebase';
import { CustomUser, convertToCustomUser, UserData } from '@/types/user';
import { setPersistentAuthState, getPersistentAuthState } from '../helpers';

export const useAuthState = () => {
  const { currentUser, getUserByUid, loading: firebaseLoading } = useFirebase();
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDataFetched, setUserDataFetched] = useState(false);

  // Initialize from persistent state
  useEffect(() => {
    const persistentState = getPersistentAuthState();
    console.log("=== INITIALIZING FROM PERSISTENT STATE ===", persistentState);
    
    if (persistentState.isAuthenticated && persistentState.isAdmin !== undefined) {
      setIsAdmin(persistentState.isAdmin);
      console.log("Set admin status from persistent state:", persistentState.isAdmin);
    }
  }, []);

  // Main auth state handler
  useEffect(() => {
    const checkUserRole = async () => {
      console.log("=== AUTH STATE CHECK ===", { 
        currentUserUid: currentUser?.uid, 
        firebaseLoading,
        userDataFetched
      });
      
      if (currentUser) {
        try {
          // Skip if we already have data for this user
          if (user && user.uid === currentUser.uid && userDataFetched) {
            console.log("User data already fetched for this user, skipping");
            setLoading(false);
            return;
          }
          
          console.log("Fetching fresh user data from Firestore...");
          
          // Multiple attempts to get user data
          let userData: UserData | null = null;
          let attempts = 0;
          const maxAttempts = 5;
          
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
              await new Promise(resolve => setTimeout(resolve, 200 * attempts));
            }
          }
          
          const customUser = convertToCustomUser(currentUser, userData);
          setUser(customUser);
          
          // Set admin status
          const userIsAdmin = userData?.role === 'admin';
          console.log("=== SETTING ADMIN STATUS ===", { 
            role: userData?.role, 
            isAdmin: userIsAdmin,
            userData: userData 
          });
          
          setIsAdmin(userIsAdmin);
          
          // Update persistent state with definitive values
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: userIsAdmin,
            uid: currentUser.uid
          });
          
          console.log("=== PERSISTENT STATE UPDATED ===", {
            isAuthenticated: true,
            isAdmin: userIsAdmin,
            uid: currentUser.uid
          });
          
          setUserDataFetched(true);
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
        setUserDataFetched(false);
        
        setPersistentAuthState({
          isAuthenticated: false,
          isAdmin: false,
          uid: null
        });
        
        setLoading(false);
      }
    };
    
    // Only check if Firebase is not loading
    if (!firebaseLoading) {
      checkUserRole();
    }
    
  }, [currentUser, firebaseLoading, getUserByUid]);

  // Reset state on logout
  useEffect(() => {
    if (!currentUser && userDataFetched) {
      console.log("=== USER LOGGED OUT, RESETTING STATE ===");
      setUserDataFetched(false);
      setIsAdmin(false);
      setUser(null);
      
      setPersistentAuthState({
        isAuthenticated: false,
        isAdmin: false,
        uid: null
      });
    }
  }, [currentUser, userDataFetched]);

  console.log("=== AUTH STATE HOOK RETURNING ===", { 
    userUid: user?.uid, 
    isAdmin, 
    loading: loading || firebaseLoading,
    userDataFetched
  });

  return {
    user,
    isAdmin,
    loading: loading || firebaseLoading,
    setUser
  };
};

export default useAuthState;
