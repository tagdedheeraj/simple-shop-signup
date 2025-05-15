
import React, { createContext, useContext, useEffect } from 'react';
import useAuthProvider from './useAuthProvider';
import { AuthContextType } from './types';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useAuthProvider();

  // Log auth state changes for debugging
  useEffect(() => {
    console.log("Auth state updated:", { 
      isAuthenticated: authState.isAuthenticated,
      isAdmin: authState.isAdmin,
      loading: authState.loading
    });
  }, [authState.isAuthenticated, authState.isAdmin, authState.loading]);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
