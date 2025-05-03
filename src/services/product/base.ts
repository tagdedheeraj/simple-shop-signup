
import { Product } from '@/types/product';
import { delay } from './utils';

// Get products from localStorage or fallback to imported data
const getStoredProducts = (): Product[] => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  // Fallback to imported data if localStorage is empty
  const { products } = require('./data');
  return products;
};

// Base product retrieval functions
export const getProducts = async (): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  return getStoredProducts();
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(500); // Simulate network delay
  const products = getStoredProducts();
  return products.find(product => product.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  const products = getStoredProducts();
  return products.filter(product => product.category === category);
};
