
import { products } from './data';

// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products in localStorage if they don't exist
export const initializeProducts = (options?: { forceRefresh?: boolean }) => {
  const shouldRefresh = options?.forceRefresh === true;
  
  if (shouldRefresh || !localStorage.getItem('products')) {
    // Add a timestamp to product images to prevent caching
    const productsWithTimestamp = products.map(product => ({
      ...product,
      image: addTimestampToImage(product.image)
    }));
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(productsWithTimestamp));
  }
};

// Add timestamp to image URL to prevent caching
export const addTimestampToImage = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;
  
  // Add or update timestamp parameter
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}t=${Date.now()}`;
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
