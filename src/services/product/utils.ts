
import { products } from './data';

// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products in localStorage if they don't exist
export const initializeProducts = (options?: { forceRefresh?: boolean }) => {
  const shouldRefresh = options?.forceRefresh === true;
  
  if (shouldRefresh || !localStorage.getItem('products')) {
    // Use the directly imported products instead of require
    localStorage.setItem('products', JSON.stringify(products));
  }
};

// Force refresh product data from source files
export const refreshProductData = async () => {
  // Clear existing product data from localStorage
  localStorage.removeItem('products');
  
  // Re-initialize with fresh data
  initializeProducts({ forceRefresh: true });
  
  // Add a small delay to simulate API call
  await delay(300);
  
  return true;
};
