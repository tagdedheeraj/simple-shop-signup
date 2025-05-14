
import { useState, useEffect, useCallback } from 'react';
import useFirebase from '@/hooks/useFirebase';
import { CustomUser, convertToCustomUser, UserData } from '@/types/user';
import { setPersistentAuthState } from '../helpers';

export const useAuthState = () => {
  const { currentUser, getUserByUid, loading: firebaseLoading } = useFirebase();
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDataFetched, setUserDataFetched] = useState(false);

  // Improved auth state handling
  useEffect(() => {
    const checkUserRole = async () => {
      if (currentUser) {
        try {
          console.log("Checking user role for:", currentUser.uid);
          
          // Cache check - if we already have the same user, don't refetch
          if (user && user.uid === currentUser.uid && userDataFetched) {
            console.log("User data already fetched, skipping");
            setLoading(false);
            return;
          }
          
          const userData = await getUserByUid(currentUser.uid) as UserData;
          console.log("User data from Firestore:", userData);
          
          const customUser = convertToCustomUser(currentUser, userData);
          setUser(customUser);
          
          // Check if role is admin and set state
          const userIsAdmin = userData?.role === 'admin';
          console.log("Is admin?", userIsAdmin);
          setIsAdmin(userIsAdmin);
          
          // Update persistent state
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: userIsAdmin,
            uid: currentUser.uid
          });
          
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
          setLoading(false);
        }
      } else {
        console.log("No current user");
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

  return {
    user,
    isAdmin,
    loading: loading || firebaseLoading,
    setUser
  };
};

export default useAuthState;
