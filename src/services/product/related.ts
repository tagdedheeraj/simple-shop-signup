
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

export const getRelatedProducts = async (productId: string, limit: number = 4): Promise<Product[]> => {
  await delay(600); // Simulate network delay
  
  const products = getStoredProducts();
  const currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return [];
  
  // Find products in the same category, excluding the current product
  let relatedProducts = products.filter(p => 
    p.category === currentProduct.category && p.id !== currentProduct.id
  );
  
  // If we don't have enough products in the same category, add some random products
  if (relatedProducts.length < limit) {
    const otherProducts = products.filter(p => 
      p.category !== currentProduct.category && p.id !== currentProduct.id
    );
    
    // Shuffle the array to get random products
    const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
    relatedProducts = [...relatedProducts, ...shuffled.slice(0, limit - relatedProducts.length)];
  }
  
  // Return only the requested number of products
  return relatedProducts.slice(0, limit);
};

// Function to get trending products
export const getTrendingProducts = async (limit: number = 4): Promise<Product[]> => {
  await delay(600); // Simulate network delay
  
  const products = getStoredProducts();
  
  // In a real app, this would be based on product popularity, reviews, etc.
  // For this demo, we'll just select random products and mark them as trending
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};
