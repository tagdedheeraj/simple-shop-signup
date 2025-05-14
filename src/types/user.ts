
import { User as FirebaseUser } from 'firebase/auth';

export interface CustomUser extends Omit<FirebaseUser, 'photoURL'> {
  name?: string;
  phone?: string;
  photoUrl?: string;
  role?: string;
}

// Helper function to convert Firebase user to CustomUser
export const convertToCustomUser = (firebaseUser: FirebaseUser | null, userData?: any): CustomUser | null => {
  if (!firebaseUser) return null;
  
  return {
    ...firebaseUser,
    name: userData?.displayName || firebaseUser.displayName || '',
    phone: userData?.phone || '',
    photoUrl: userData?.photoUrl || firebaseUser.photoURL || '',
    role: userData?.role || 'user',
  };
};
