import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types/product';

interface User {
  id: string;
  email: string;
  name: string;
  favorites?: string[]; // IDs of favorite products
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
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

  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Get all users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) return false;
      
      // Update user data in the "database"
      const updatedUser = { ...users[userIndex], ...data };
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user session
      const userToSave = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        favorites: updatedUser.favorites || []
      };
      
      setUser(userToSave);
      localStorage.setItem('user', JSON.stringify(userToSave));
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update profile');
      return false;
    }
  };

  const toggleFavorite = (productId: string) => {
    if (!user) return;
    
    const favorites = user.favorites || [];
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    updateUserProfile({ favorites: newFavorites });
    
    if (newFavorites.includes(productId)) {
      toast.success('Added to favorites');
    } else {
      toast.success('Removed from favorites');
    }
  };
  
  const isFavorite = (productId: string): boolean => {
    if (!user || !user.favorites) return false;
    return user.favorites.includes(productId);
  };

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
          name: foundUser.name
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
        password // In a real app, this would be hashed
      };
      
      // Save to "database" (localStorage)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log the user in
      const userToSave = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
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
      loading,
      updateUserProfile,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </AuthContext.Provider>
  );
};
