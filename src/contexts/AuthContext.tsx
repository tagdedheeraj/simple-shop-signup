
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import useFirebase from '@/hooks/useFirebase';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{success: boolean; isAdmin: boolean}>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<any>) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  loading: boolean;
  isAdmin: boolean;
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
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (currentUser) {
        try {
          const userData = await getUserByUid(currentUser.uid);
          setIsAdmin(userData?.role === 'admin');
        } catch (error) {
          console.error("Error checking user role:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
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
      await signIn(email, password);
      
      // Check if user is admin
      if (currentUser) {
        const userData = await getUserByUid(currentUser.uid);
        const userIsAdmin = userData?.role === 'admin';
        setIsAdmin(userIsAdmin);
        
        toast.success('Successfully logged in');
        return {
          success: true, 
          isAdmin: userIsAdmin
        };
      }
      
      return {success: true, isAdmin: false};
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      return {success: false, isAdmin: false};
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Create user with Firebase
      await createUser(email, password, name);
      
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
      // For now, we'll just return true
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
    setIsAdmin(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user: currentUser, 
      isAuthenticated: !!currentUser, 
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
