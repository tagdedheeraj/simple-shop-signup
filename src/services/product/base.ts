
import { Product } from '@/types/product';
import { delay } from './utils';
import { 
  getFirestoreProducts, 
  getFirestoreProductById, 
  getFirestoreProductsByCategory, 
  initializeFirestoreProducts 
} from '../firebase/products';

// Initialize products on first load (if needed)
export const initializeProducts = async (options?: { forceRefresh?: boolean }): Promise<void> => {
  try {
    const forceRefresh = options?.forceRefresh === true;
    await initializeFirestoreProducts(forceRefresh);
  } catch (error) {
    console.error('Error initializing products:', error);
    throw error;
  }
};

// Base product retrieval functions - always use Firebase directly
export const getProducts = async (): Promise<Product[]> => {
  try {
    return await getFirestoreProducts();
  } catch (error) {
    console.error('Error getting products from Firestore:', error);
    throw error; // No fallback to local data anymore
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    return await getFirestoreProductById(id);
  } catch (error) {
    console.error('Error getting product by ID from Firestore:', error);
    throw error; // No fallback to local data anymore
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    return await getFirestoreProductsByCategory(category);
  } catch (error) {
    console.error('Error getting products by category from Firestore:', error);
    throw error; // No fallback to local data anymore
  }
};
