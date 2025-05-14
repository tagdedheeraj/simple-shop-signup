
import { auth, db, storage, analytics } from '../services/firebase';
import { useCallback, useEffect } from 'react';
import useAuth from './firebase/useAuth';
import useUsers from './firebase/useUsers';
import useAdmin from './firebase/useAdmin';

export const useFirebase = () => {
  const authHook = useAuth();
  const usersHook = useUsers();
  const adminHook = useAdmin();

  // Set up admin user on initialization
  useEffect(() => {
    // Ensure admin user exists on application start
    adminHook.ensureAdminUserExists();
  }, [adminHook.ensureAdminUserExists]);

  return {
    // Firebase services
    auth,
    db,
    storage,
    analytics,
    
    // Auth methods
    createUser: authHook.createUser,
    signIn: authHook.signIn,
    logOut: authHook.logOut,
    getCurrentUser: authHook.getCurrentUser,
    currentUser: authHook.currentUser,
    loading: authHook.loading,
    
    // User methods
    getAllUsers: usersHook.getAllUsers,
    getUserByUid: usersHook.getUserByUid,
    updateUserRole: usersHook.updateUserRole,
  };
};

export default useFirebase;
