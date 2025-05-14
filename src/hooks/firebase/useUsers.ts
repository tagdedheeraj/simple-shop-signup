
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  query,
  where,
  updateDoc
} from 'firebase/firestore';
import { useCallback } from 'react';
import { db } from '@/services/firebase';

export const useUsers = () => {
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

  // Method to update user role
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
    getAllUsers,
    getUserByUid,
    updateUserRole
  };
};

export default useUsers;
