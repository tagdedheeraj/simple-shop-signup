
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useFirebase from '@/hooks/useFirebase';
import { convertToCustomUser } from '@/types/user';

export const useRegister = () => {
  const { createUser, getUserByUid } = useFirebase();
  const [loading, setLoading] = useState(false);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Create user with Firebase
      const newUser = await createUser(email, password, name);
      if (newUser) {
        const userData = await getUserByUid(newUser.uid);
        // Return the user data to the caller
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
  }, [createUser, getUserByUid]);

  return {
    register,
    loading
  };
};

export default useRegister;
