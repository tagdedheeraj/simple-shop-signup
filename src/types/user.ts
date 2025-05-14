
import { User as FirebaseUser } from 'firebase/auth';

export interface CustomUser extends Omit<FirebaseUser, 'photoURL'> {
  name?: string;
  phone?: string;
  photoUrl?: string;
  role?: string;
}

// Define the user data interface that comes from Firestore
export interface UserData {
  id?: string;
  uid?: string;
  email?: string;
  displayName?: string;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
  photoUrl?: string;
  phone?: string;
}

// Helper function to convert Firebase user to CustomUser
export const convertToCustomUser = (firebaseUser: FirebaseUser | null, userData?: UserData | any): CustomUser | null => {
  if (!firebaseUser) return null;
  
  return {
    ...firebaseUser,
    name: userData?.displayName || firebaseUser.displayName || '',
    phone: userData?.phone || '',
    photoUrl: userData?.photoUrl || firebaseUser.photoURL || '',
    role: userData?.role || 'user',
  };
};
