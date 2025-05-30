
import { useState, useEffect } from 'react';
import useFirebase from '@/hooks/useFirebase';
import { CustomUser, convertToCustomUser, UserData } from '@/types/user';
import { setPersistentAuthState } from '../helpers';

export const useAuthState = () => {
  const { currentUser, getUserByUid, loading: firebaseLoading } = useFirebase();
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("=== AUTH STATE HOOK ===", { 
    currentUserUid: currentUser?.uid, 
    firebaseLoading,
    userState: user?.uid,
    isAdmin,
    loading
  });

  useEffect(() => {
    const handleAuthStateChange = async () => {
      console.log("=== HANDLING AUTH STATE CHANGE ===", { 
        currentUserUid: currentUser?.uid, 
        firebaseLoading
      });
      
      // Wait for Firebase to finish loading
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
          
          // Convert to custom user
          const customUser = convertToCustomUser(currentUser, userData);
          setUser(customUser);
          
          // Check admin status - specifically check for admin@example.com
          const userIsAdmin = userData?.role === 'admin' || currentUser.email === 'admin@example.com';
          console.log("=== SETTING ADMIN STATUS ===", { 
            role: userData?.role, 
            email: currentUser.email,
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
            uid: currentUser.uid,
            email: currentUser.email
          });
          
        } catch (error) {
          console.error("Error fetching user data:", error);
          
          // For admin@example.com, set admin even if Firestore fails
          const userIsAdmin = currentUser.email === 'admin@example.com';
          const customUser = convertToCustomUser(currentUser, { role: userIsAdmin ? 'admin' : 'user' });
          
          setUser(customUser);
          setIsAdmin(userIsAdmin);
          
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: userIsAdmin,
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

  return {
    user,
    isAdmin,
    loading: loading || firebaseLoading,
    setUser
  };
};

export default useAuthState;
