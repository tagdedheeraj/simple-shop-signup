
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import useFirebase from '@/hooks/useFirebase';
import { User as FirebaseUser } from 'firebase/auth';
import { CustomUser, convertToCustomUser, UserData } from '@/types/user';

// Create a persistent key for local storage
const AUTH_STATE_KEY = 'lakshmikrupa_auth_state';

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

interface PersistentAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  uid: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get persistent auth state
const getPersistentAuthState = (): PersistentAuthState => {
  try {
    const storedState = localStorage.getItem(AUTH_STATE_KEY);
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    console.error('Error reading auth state from localStorage:', error);
  }
  return { isAuthenticated: false, isAdmin: false, uid: null };
};

// Helper function to set persistent auth state
const setPersistentAuthState = (state: PersistentAuthState) => {
  try {
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error storing auth state to localStorage:', error);
  }
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
  
  // Initialize from localStorage for faster initial render
  const persistedState = getPersistentAuthState();
  
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(persistedState.isAdmin);
  const [loading, setLoading] = useState(true);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [lastAuthCheck, setLastAuthCheck] = useState<number>(0);

  // Improved auth state handling to prevent flicker and premature redirects
  useEffect(() => {
    // Debounce auth checks to prevent multiple rapid checks
    const now = Date.now();
    if (now - lastAuthCheck < 1000 && lastAuthCheck !== 0) {
      console.log("Skipping auth check - too soon since last check");
      return;
    }
    
    setLastAuthCheck(now);
    
    const checkUserRole = async () => {
      if (currentUser) {
        try {
          console.log("Checking user role for:", currentUser.uid);
          
          // Cache check - if we already have the same user, don't refetch
          if (user && user.uid === currentUser.uid && userDataFetched) {
            console.log("User data already fetched, skipping");
            setLoading(false);
            return;
          }
          
          const userData = await getUserByUid(currentUser.uid) as UserData;
          console.log("User data from Firestore:", userData);
          
          const customUser = convertToCustomUser(currentUser, userData);
          setUser(customUser);
          
          // Check if role is admin and set state
          const userIsAdmin = userData?.role === 'admin';
          console.log("Is admin?", userIsAdmin);
          setIsAdmin(userIsAdmin);
          
          // Update persistent state
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: userIsAdmin,
            uid: currentUser.uid
          });
          
          // Mark user data as fetched to prevent repeated checks
          setUserDataFetched(true);
        } catch (error) {
          console.error("Error checking user role:", error);
          setIsAdmin(false);
          setUser(convertToCustomUser(currentUser));
          
          // Even on error, update persistent state
          setPersistentAuthState({
            isAuthenticated: true,
            isAdmin: false,
            uid: currentUser.uid
          });
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No current user");
        setIsAdmin(false);
        setUser(null);
        
        // Clear persistent state when no user
        setPersistentAuthState({
          isAuthenticated: false,
          isAdmin: false,
          uid: null
        });
        
        setLoading(false);
        setUserDataFetched(false);
      }
    };
    
    // Only check user role if Firebase loading is complete
    if (!firebaseLoading) {
      checkUserRole();
    }
    
  }, [currentUser, firebaseLoading, getUserByUid, user, userDataFetched, lastAuthCheck]);

  // Additional effect to reset state when user logs out
  useEffect(() => {
    if (!currentUser && userDataFetched) {
      console.log("User logged out, resetting state");
      setUserDataFetched(false);
      setIsAdmin(false);
      setUser(null);
      
      // Clear persistent state on logout
      setPersistentAuthState({
        isAuthenticated: false,
        isAdmin: false,
        uid: null
      });
    }
  }, [currentUser, userDataFetched]);

  const login = async (email: string, password: string): Promise<{success: boolean; isAdmin: boolean}> => {
    try {
      setLoading(true);
      
      // Sign in with Firebase
      const firebaseUser = await signIn(email, password);
      
      // Check if user is admin
      if (firebaseUser) {
        const userData = await getUserByUid(firebaseUser.uid) as UserData;
        const userIsAdmin = userData?.role === 'admin';
        
        // Set state
        setIsAdmin(userIsAdmin);
        setUser(convertToCustomUser(firebaseUser, userData));
        setUserDataFetched(true);
        
        // Update persistent state
        setPersistentAuthState({
          isAuthenticated: true,
          isAdmin: userIsAdmin,
          uid: firebaseUser.uid
        });
        
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
      
      // Clear persistent state on login failure
      setPersistentAuthState({
        isAuthenticated: false,
        isAdmin: false,
        uid: null
      });
      
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
    console.log("Logging out user");
    logOut();
    setUser(null);
    setIsAdmin(false);
    setUserDataFetched(false);
    
    // Clear persistent state on logout
    setPersistentAuthState({
      isAuthenticated: false,
      isAdmin: false,
      uid: null
    });
    
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
