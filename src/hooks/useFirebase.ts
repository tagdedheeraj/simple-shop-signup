import { auth, db, storage, analytics } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

export const useFirebase = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set persistence to local on initialization
  useEffect(() => {
    // Set persistence to LOCAL to keep user logged in
    setPersistence(auth, browserLocalPersistence).catch(error => {
      console.error("Error setting auth persistence:", error);
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Firebase Authentication methods
  const createUser = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile if display name is provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        // Store additional user data in Firestore
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: displayName,
          createdAt: new Date().toISOString(),
          role: 'user', // Default role
          lastLogin: new Date().toISOString()
        });
      }
      
      return userCredential.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        lastLogin: new Date().toISOString()
      }, { merge: true });
      
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }, []);

  const logOut = useCallback(async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const getCurrentUser = useCallback((): User | null => {
    return auth.currentUser || currentUser;
  }, [currentUser]);

  // Firestore user operations
  const getAllUsers = useCallback(async () => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
      
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }, []);

  const getUserByUid = useCallback(async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }, []);

  return {
    auth,
    db,
    storage,
    analytics,
    createUser,
    signIn,
    logOut,
    getCurrentUser,
    getAllUsers,
    getUserByUid,
    currentUser,
    loading
  };
};

export default useFirebase;
