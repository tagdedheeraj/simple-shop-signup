
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { db } from '@/services/firebase';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth/AuthContext';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  
  // Load cart from Firebase only when user changes
  useEffect(() => {
    if (user) {
      loadCartFromFirebase();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadCartFromFirebase = async () => {
    if (!user) return;
    
    try {
      console.log('🛒 Loading cart from Firebase for user:', user.uid);
      const cartQuery = query(
        collection(db, 'carts'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(cartQuery);
      const cartItems = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          product: data.product as Product,
          quantity: data.quantity
        } as CartItem;
      });
      setItems(cartItems);
      console.log('✅ Cart loaded from Firebase:', cartItems.length, 'items');
    } catch (error) {
      console.error('Error loading cart from Firebase:', error);
      setItems([]);
    }
  };

  const saveToFirebase = async (cartItem: CartItem, action: 'add' | 'remove' | 'update') => {
    if (!user) return;

    try {
      const cartItemId = `${user.uid}_${cartItem.product.id}`;
      
      if (action === 'remove') {
        await deleteDoc(doc(db, 'carts', cartItemId));
      } else {
        await setDoc(doc(db, 'carts', cartItemId), {
          userId: user.uid,
          productId: cartItem.product.id,
          product: cartItem.product,
          quantity: cartItem.quantity,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving to Firebase cart:', error);
    }
  };

  const addToCart = async (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + quantity };
        saveToFirebase(updatedItem, 'update');
        toast.success(`Updated quantity of ${product.name} in cart`);
        return prevItems.map(item => 
          item.product.id === product.id ? updatedItem : item
        );
      } else {
        const newItem = { product, quantity };
        saveToFirebase(newItem, 'add');
        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = async (productId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.product.id === productId);
      if (itemToRemove) {
        saveToFirebase(itemToRemove, 'remove');
        toast.success(`Removed ${itemToRemove.product.name} from cart`);
      }
      return prevItems.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.product.id === productId) {
          const updatedItem = { ...item, quantity };
          saveToFirebase(updatedItem, 'update');
          return updatedItem;
        }
        return item;
      })
    );
  };

  const clearCart = async () => {
    if (user) {
      try {
        // Remove all cart items for this user from Firebase
        const cartQuery = query(
          collection(db, 'carts'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(cartQuery);
        
        for (const docRef of snapshot.docs) {
          await deleteDoc(docRef.ref);
        }
      } catch (error) {
        console.error('Error clearing cart from Firebase:', error);
      }
    }
    
    setItems([]);
    toast.success('Cart cleared');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
