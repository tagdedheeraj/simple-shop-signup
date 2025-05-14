
import { User as FirebaseUser } from 'firebase/auth';
import { CustomUser, UserData } from '@/types/user';

// Create a persistent key for local storage
export const AUTH_STATE_KEY = 'lakshmikrupa_auth_state';

export interface AuthContextType {
  user: CustomUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{success: boolean; isAdmin: boolean}>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<any>) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  loading: boolean;
  isAdmin: boolean;
}

export interface PersistentAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  uid: string | null;
}
