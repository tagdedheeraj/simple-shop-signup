
import { Product } from '@/types/product';
import { delay } from './utils';
import { products } from './data';
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

// Base product retrieval functions
export const getProducts = async (): Promise<Product[]> => {
  try {
    return await getFirestoreProducts();
  } catch (error) {
    console.error('Error getting products from Firestore, falling back to local data:', error);
    await delay(800); // Simulate network delay
    return products; // Fallback to imported data
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    return await getFirestoreProductById(id);
  } catch (error) {
    console.error('Error getting product by ID from Firestore, falling back to local data:', error);
    await delay(500); // Simulate network delay
    return products.find(product => product.id === id); // Fallback to imported data
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    return await getFirestoreProductsByCategory(category);
  } catch (error) {
    console.error('Error getting products by category from Firestore, falling back to local data:', error);
    await delay(800); // Simulate network delay
    return products.filter(product => product.category === category); // Fallback to imported data
  }
};
