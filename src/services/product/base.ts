
import { Product } from '@/types/product';
import { delay } from './utils';
import { 
  getFirestoreProducts, 
  getFirestoreProductById 
} from '../firebase/products';

// Base product retrieval functions
export const getProducts = async (): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  return getFirestoreProducts();
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(500); // Simulate network delay
  return getFirestoreProductById(id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  const products = await getFirestoreProducts();
  return products.filter(product => product.category === category);
};
