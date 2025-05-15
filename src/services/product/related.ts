
import { Product } from '@/types/product';
import { delay } from './utils';
import { getProducts } from './base';
import { getDeletedProductIds } from '../firebase/products';

// Filter out deleted products from any product list
const filterDeletedProducts = async (products: Product[]): Promise<Product[]> => {
  const deletedIds = await getDeletedProductIds();
  return products.filter(product => !deletedIds.includes(product.id));
};

// Get related products based on category
export const getRelatedProducts = async (productId: string, category: string): Promise<Product[]> => {
  await delay(500);
  const allProducts = await getProducts();
  
  // Filter products by category and exclude the current product
  const relatedProducts = allProducts
    .filter(product => product.category === category && product.id !== productId)
    .slice(0, 4); // Limit to 4 related products
  
  return relatedProducts; // getProducts already filters deleted products
};

// Get trending products
export const getTrendingProducts = async (): Promise<Product[]> => {
  await delay(500);
  const allProducts = await getProducts();
  
  // For demo purposes, we're just showing a slice of products as "trending"
  // In a real app, you might fetch this from analytics or user behavior data
  const trendingProducts = allProducts
    .sort(() => Math.random() - 0.5) // Randomize products
    .slice(0, 5); // Get first 5
  
  return trendingProducts; // getProducts already filters deleted products
};
