
import { useCallback } from 'react';
import { toast } from 'sonner';
import useFirebase from '@/hooks/useFirebase';
import useAuthState from './hooks/useAuthState';
import useLogin from './hooks/useLogin';
import useRegister from './hooks/useRegister';
import useProfile from './hooks/useProfile';
import { setPersistentAuthState } from './helpers';

export const useAuthProvider = () => {
  const { logOut } = useFirebase();
  const { login } = useLogin();
  const { register } = useRegister();
  const { user, isAdmin, loading, setUser } = useAuthState();
  const { updateProfile, updatePassword } = useProfile(user);
  
  const logout = useCallback(() => {
    console.log("Logging out user");
    logOut();
    setUser(null);
    
    // Clear persistent state on logout
    setPersistentAuthState({
      isAuthenticated: false,
      isAdmin: false,
      uid: null
    });
    
    toast.success('Logged out successfully');
  }, [logOut, setUser]);

  return {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    loading,
    isAdmin
  };
};

export default useAuthProvider;
