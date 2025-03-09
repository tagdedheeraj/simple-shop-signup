
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Omit<User, 'id' | 'name'>>) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  loading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate a login delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you would validate against a backend
      // This is just a mock implementation using local storage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (foundUser) {
        const userToSave = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          phone: foundUser.phone || '',
          photoUrl: foundUser.photoUrl || ''
        };
        
        setUser(userToSave);
        localStorage.setItem('user', JSON.stringify(userToSave));
        toast.success('Successfully logged in');
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate a registration delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        toast.error('User with this email already exists');
        return false;
      }
      
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password, // In a real app, this would be hashed
        phone: '',
        photoUrl: ''
      };
      
      // Save to "database" (localStorage)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log the user in
      const userToSave = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        photoUrl: newUser.photoUrl
      };
      
      setUser(userToSave);
      localStorage.setItem('user', JSON.stringify(userToSave));
      
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      toast.error('Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Omit<User, 'id' | 'name'>>): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        toast.error('User not authenticated');
        return false;
      }
      
      // Update user in "database" (localStorage)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) {
        toast.error('User not found');
        return false;
      }
      
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...data
      };
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user in state and localStorage
      const updatedUser = {
        ...user,
        ...data
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
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
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        toast.error('User not authenticated');
        return false;
      }
      
      // Verify current password
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => 
        u.id === user.id && u.password === currentPassword
      );
      
      if (userIndex === -1) {
        toast.error('Current password is incorrect');
        return false;
      }
      
      // Update password
      users[userIndex].password = newPassword;
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
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
    setUser(null);
    localStorage.removeItem('user');
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
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
