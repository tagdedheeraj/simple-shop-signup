
import { useState, useEffect, useCallback } from 'react';
import useFirebase from '@/hooks/useFirebase';
import { CustomUser, convertToCustomUser, UserData } from '@/types/user';
import { setPersistentAuthState, getPersistentAuthState } from '../helpers';

export const useAuthState = () => {
  const { currentUser, getUserByUid, loading: firebaseLoading } = useFirebase();
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("=== AUTH STATE HOOK ===", { 
    currentUserUid: currentUser?.uid, 
    firebaseLoading,
    userState: user?.uid,
    isAdmin
  });

  useEffect(() => {
    const handleAuthStateChange = async () => {
      console.log("=== HANDLING AUTH STATE CHANGE ===", { 
        currentUserUid: currentUser?.uid, 
        firebaseLoading
      });
      
      if (firebaseLoading) {
        console.log("Firebase still loading, waiting...");
        return;
      }
      
      if (currentUser) {
        try {
          console.log("User found, fetching data from Firestore...");
          
          // Get user data from Firestore
          const userData = await getUserByUid(currentUser.uid) as UserData;
          console.log("=== FIRESTORE USER DATA ===", userData);
          
          const customUser = convertToCustomUser(currentUser, userData);
          setUser(customUser);
          
          // Check admin status
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
          console.error("Error fetching user data:", error);
          // Set defaults on error
          const customUser = convertToCustomUser(currentUser);
          setUser(customUser);
          setIsAdmin(false);
          
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: false,
            uid: currentUser.uid
          });
        }
      } else {
        console.log("=== NO USER, CLEARING STATE ===");
        setUser(null);
        setIsAdmin(false);
        
        setPersistentAuthState({
          isAuthenticated: false,
          isAdmin: false,
          uid: null
        });
      }
      
      setLoading(false);
    };
    
    handleAuthStateChange();
  }, [currentUser, firebaseLoading, getUserByUid]);

  console.log("=== AUTH STATE HOOK RETURNING ===", { 
    userUid: user?.uid, 
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
