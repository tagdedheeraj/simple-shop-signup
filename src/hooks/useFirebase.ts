
import { auth, db, storage, analytics } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  query,
  where,
  updateDoc
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

    // Ensure admin user exists on application start
    ensureAdminUserExists();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Ensure admin user exists
  const ensureAdminUserExists = useCallback(async () => {
    try {
      const adminEmail = "admin@example.com";
      const adminPassword = "admin123";
      
      // Check if admin user already exists
      const methods = await fetchSignInMethodsForEmail(auth, adminEmail);
      
      if (methods.length === 0) {
        // Admin user doesn't exist, create one
        console.log("Creating admin user...");
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: "Admin User" });
          
          // Store admin user data in Firestore
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          await setDoc(userDocRef, {
            uid: userCredential.user.uid,
            email: adminEmail,
            displayName: "Admin User",
            createdAt: new Date().toISOString(),
            role: 'admin', // Set admin role
            lastLogin: new Date().toISOString()
          });
          
          console.log("Admin user created successfully");
        }
      } else {
        // Admin user exists, ensure they have admin role in Firestore
        const usersQuery = query(collection(db, 'users'), where('email', '==', adminEmail));
        const usersSnapshot = await getDocs(usersQuery);
        
        if (usersSnapshot.empty) {
          // User exists in auth but not in Firestore, add to Firestore
          const usersRef = collection(db, 'users');
          const userQuery = query(usersRef, where('email', '==', adminEmail));
          const userSnapshot = await getDocs(userQuery);
          
          if (userSnapshot.empty) {
            // Find the user in auth
            const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
              .catch(() => null);
            
            if (userCredential) {
              // Add user to Firestore with admin role
              const userDocRef = doc(db, 'users', userCredential.user.uid);
              await setDoc(userDocRef, {
                uid: userCredential.user.uid,
                email: adminEmail,
                displayName: "Admin User",
                createdAt: new Date().toISOString(),
                role: 'admin', // Set admin role
                lastLogin: new Date().toISOString()
              });
              
              // Sign out after creating
              await signOut(auth);
              
              console.log("Admin user data added to Firestore");
            }
          }
        } else {
          // User exists in Firestore, ensure they have admin role
          const userDoc = usersSnapshot.docs[0];
          if (userDoc.data().role !== 'admin') {
            await setDoc(doc(db, 'users', userDoc.id), {
              role: 'admin'
            }, { merge: true });
            
            console.log("Updated user to admin role");
          }
        }
      }
    } catch (error) {
      console.error("Error ensuring admin user exists:", error);
    }
  }, []);

  // Firebase Authentication methods
  const createUser = useCallback(async (email: string, password: string, displayName?: string, role: string = 'user') => {
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
          role: role, // Set role from parameter
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

  // New method to update user role
  const updateUserRole = useCallback(async (uid: string, role: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        role: role
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
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
    updateUserRole, // New method
    currentUser,
    loading
  };
};

export default useFirebase;
