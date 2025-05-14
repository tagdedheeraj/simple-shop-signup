
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDocs,
  query,
  where,
  setDoc
} from 'firebase/firestore';
import { useCallback } from 'react';
import { auth, db } from '@/services/firebase';

export const useAdmin = () => {
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

  return {
    ensureAdminUserExists
  };
};

export default useAdmin;
