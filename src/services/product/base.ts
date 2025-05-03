
import { Product } from '@/types/product';
import { products } from './data';
import { delay } from './utils';

// Base product retrieval functions
export const getProducts = async (): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  return [...products];
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(500); // Simulate network delay
  return products.find(product => product.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  return products.filter(product => product.category === category);
};
