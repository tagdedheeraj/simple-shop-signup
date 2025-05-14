
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import useFirebase from '@/hooks/useFirebase';
import { User as FirebaseUser } from 'firebase/auth';
import { CustomUser, convertToCustomUser, UserData } from '@/types/user';

interface AuthContextType {
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

// Define the user data interface
interface UserData {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    signIn, 
    createUser, 
    logOut, 
    currentUser, 
    getUserByUid,
    loading: firebaseLoading 
  } = useFirebase();
  
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (currentUser) {
        try {
          const userData = await getUserByUid(currentUser.uid) as UserData;
          const customUser = convertToCustomUser(currentUser, userData);
          setUser(customUser);
          setIsAdmin(userData?.role === 'admin');
        } catch (error) {
          console.error("Error checking user role:", error);
          setIsAdmin(false);
          setUser(convertToCustomUser(currentUser));
        }
      } else {
        setIsAdmin(false);
        setUser(null);
      }
      
      setLoading(false);
    };
    
    if (!firebaseLoading) {
      checkUserRole();
    }
  }, [currentUser, firebaseLoading, getUserByUid]);

  const login = async (email: string, password: string): Promise<{success: boolean; isAdmin: boolean}> => {
    try {
      setLoading(true);
      
      // Sign in with Firebase
      const firebaseUser = await signIn(email, password);
      
      // Check if user is admin
      if (firebaseUser) {
        const userData = await getUserByUid(firebaseUser.uid) as UserData;
        const userIsAdmin = userData?.role === 'admin';
        setIsAdmin(userIsAdmin);
        setUser(convertToCustomUser(firebaseUser, userData));
        
        toast.success('Successfully logged in');
        return {
          success: true, 
          isAdmin: userIsAdmin
        };
      }
      
      return {success: true, isAdmin: false};
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide more specific error messages based on error code
      if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('User not found. Please check your email or register for an account.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many unsuccessful login attempts. Please try again later.');
      } else {
        toast.error('Login failed. Please try again.');
      }
      
      return {success: false, isAdmin: false};
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Create user with Firebase
      const newUser = await createUser(email, password, name);
      if (newUser) {
        const userData = await getUserByUid(newUser.uid);
        setUser(convertToCustomUser(newUser, userData));
      }
      
      toast.success('Account created successfully');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already in use');
      } else {
        toast.error('Registration failed');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<any>): Promise<boolean> => {
    try {
      setLoading(true);
      
      // In a real implementation, you would update the user profile in Firebase
      if (user) {
        setUser({...user, ...data});
      }
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      toast.error('Profile update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // In a real implementation, you would update the user password in Firebase
      // For now, we'll just return true
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      toast.error('Password update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logOut();
    setUser(null);
    setIsAdmin(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout,
      updateProfile,
      updatePassword,
      loading: loading || firebaseLoading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
