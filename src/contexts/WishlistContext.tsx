
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { db } from '@/services/firebase';
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth/AuthContext';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { user } = useAuth();
  
  // Load wishlist from Firebase when user changes
  useEffect(() => {
    if (user) {
      loadWishlistFromFirebase();
    } else {
      // If no user, load from localStorage as fallback
      loadWishlistFromLocalStorage();
    }
  }, [user]);

  const loadWishlistFromFirebase = async () => {
    if (!user) return;
    
    try {
      const wishlistQuery = query(
        collection(db, 'wishlists'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(wishlistQuery);
      const wishlistItems = snapshot.docs.map(doc => doc.data().product as Product);
      setItems(wishlistItems);
    } catch (error) {
      console.error('Error loading wishlist from Firebase:', error);
      // Fallback to localStorage
      loadWishlistFromLocalStorage();
    }
  };

  const loadWishlistFromLocalStorage = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage', e);
      }
    }
  };

  const saveToFirebase = async (product: Product, action: 'add' | 'remove') => {
    if (!user) return;

    try {
      const wishlistItemId = `${user.uid}_${product.id}`;
      
      if (action === 'add') {
        await setDoc(doc(db, 'wishlists', wishlistItemId), {
          userId: user.uid,
          productId: product.id,
          product: product,
          createdAt: new Date().toISOString()
        });
      } else {
        await deleteDoc(doc(db, 'wishlists', wishlistItemId));
      }
    } catch (error) {
      console.error('Error saving to Firebase wishlist:', error);
      // Continue with localStorage as fallback
    }
  };
  
  // Save wishlist to localStorage whenever it changes (fallback)
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = async (product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        toast.info(`${product.name} is already in your wishlist`);
        return prevItems;
      } else {
        toast.success(`Added ${product.name} to wishlist`);
        saveToFirebase(product, 'add');
        return [...prevItems, product];
      }
    });
  };

  const removeFromWishlist = async (productId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from wishlist`);
        saveToFirebase(itemToRemove, 'remove');
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = async () => {
    if (user) {
      try {
        // Remove all wishlist items for this user from Firebase
        const wishlistQuery = query(
          collection(db, 'wishlists'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(wishlistQuery);
        
        for (const docRef of snapshot.docs) {
          await deleteDoc(docRef.ref);
        }
      } catch (error) {
        console.error('Error clearing wishlist from Firebase:', error);
      }
    }
    
    setItems([]);
    toast.success('Wishlist cleared');
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      totalItems
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
