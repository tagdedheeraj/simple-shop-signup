
import { db } from './index';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Product } from '@/types/product';
import { products as initialProducts } from '../product/data';
import { toast } from 'sonner';

// Firebase collection name for products
const PRODUCTS_COLLECTION = 'products';

// Initialize Firestore products collection with data if empty
export const initializeFirestoreProducts = async () => {
  try {
    // Check if products collection exists and has documents
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    if (productsSnapshot.empty) {
      console.log('Initializing Firestore products collection with default data');
      
      // Batch operation would be better but for simplicity we'll use Promise.all
      await Promise.all(
        initialProducts.map(async (product) => {
          await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
        })
      );
      
      console.log('Firestore products initialized successfully');
    } else {
      console.log('Firestore products collection already exists, skipping initialization');
    }
  } catch (error) {
    console.error('Error initializing Firestore products:', error);
    toast.error('Failed to initialize product data from Firebase');
  }
};

// Get all products from Firestore
export const getFirestoreProducts = async (): Promise<Product[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return productsSnapshot.docs.map(doc => doc.data() as Product);
  } catch (error) {
    console.error('Error getting products from Firestore:', error);
    toast.error('Failed to fetch products from Firebase');
    return [];
  }
};

// Get a single product by ID from Firestore
export const getFirestoreProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const productDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
    if (productDoc.exists()) {
      return productDoc.data() as Product;
    }
    return undefined;
  } catch (error) {
    console.error('Error getting product by ID from Firestore:', error);
    toast.error('Failed to fetch product details from Firebase');
    return undefined;
  }
};

// Update or add a product to Firestore
export const saveFirestoreProduct = async (product: Product): Promise<boolean> => {
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
    return true;
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
    toast.error('Failed to save product to Firebase');
    return false;
  }
};

// Delete a product from Firestore
export const deleteFirestoreProduct = async (productId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    return true;
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    toast.error('Failed to delete product from Firebase');
    return false;
  }
};

// Refresh product data (re-initialize from source data)
export const refreshFirestoreProducts = async (): Promise<boolean> => {
  try {
    // Delete all existing products
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    // Delete all existing products
    await Promise.all(
      productsSnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      })
    );
    
    // Re-initialize with fresh data
    await Promise.all(
      initialProducts.map(async (product) => {
        await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
      })
    );
    
    return true;
  } catch (error) {
    console.error('Error refreshing Firestore products:', error);
    toast.error('Failed to refresh product data in Firebase');
    return false;
  }
};
