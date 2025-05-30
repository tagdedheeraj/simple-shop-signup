
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
    console.log("Initializing from persistent state:", persistentState);
    
    if (persistentState.isAuthenticated && persistentState.isAdmin) {
      setIsAdmin(persistentState.isAdmin);
      console.log("Set admin status from persistent state:", persistentState.isAdmin);
    }
  }, []);

  // Improved auth state handling
  useEffect(() => {
    const checkUserRole = async () => {
      console.log("Checking user role, currentUser:", currentUser?.uid, "firebaseLoading:", firebaseLoading);
      
      if (currentUser) {
        try {
          console.log("Checking user role for:", currentUser.uid);
          
          // Cache check - if we already have the same user, don't refetch
          if (user && user.uid === currentUser.uid && userDataFetched) {
            console.log("User data already fetched, skipping");
            setLoading(false);
            return;
          }
          
          console.log("Fetching user data from Firestore...");
          const userData = await getUserByUid(currentUser.uid) as UserData;
          console.log("User data from Firestore:", userData);
          
          const customUser = convertToCustomUser(currentUser, userData);
          setUser(customUser);
          
          // Check if role is admin and set state
          const userIsAdmin = userData?.role === 'admin';
          console.log("Setting admin status:", userIsAdmin);
          setIsAdmin(userIsAdmin);
          
          // Update persistent state
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: userIsAdmin,
            uid: currentUser.uid
          });
          
          console.log("Updated persistent state with admin status:", userIsAdmin);
          
          // Mark user data as fetched to prevent repeated checks
          setUserDataFetched(true);
        } catch (error) {
          console.error("Error checking user role:", error);
          setIsAdmin(false);
          setUser(convertToCustomUser(currentUser));
          
          // Even on error, update persistent state
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: false,
            uid: currentUser.uid
          });
        } finally {
          console.log("Setting loading to false");
          setLoading(false);
        }
      } else {
        console.log("No current user, clearing state");
        setIsAdmin(false);
        setUser(null);
        
        // Clear persistent state when no user
        setPersistentAuthState({
          isAuthenticated: false,
          isAdmin: false,
          uid: null
        });
        
        setLoading(false);
        setUserDataFetched(false);
      }
    };
    
    // Only check user role if Firebase loading is complete
    if (!firebaseLoading) {
      checkUserRole();
    }
    
  }, [currentUser, firebaseLoading, getUserByUid, user, userDataFetched]);

  // Additional effect to reset state when user logs out
  useEffect(() => {
    if (!currentUser && userDataFetched) {
      console.log("User logged out, resetting state");
      setUserDataFetched(false);
      setIsAdmin(false);
      setUser(null);
      
      // Clear persistent state on logout
      setPersistentAuthState({
        isAuthenticated: false,
        isAdmin: false,
        uid: null
      });
    }
  }, [currentUser, userDataFetched]);

  console.log("Auth state hook returning:", { 
    user: user?.uid, 
    isAdmin, 
    loading: loading || firebaseLoading 
  });

  return {
    user,
    isAdmin,
    loading: loading || firebaseLoading,
    setUser
  };
};

export default useAuthState;
