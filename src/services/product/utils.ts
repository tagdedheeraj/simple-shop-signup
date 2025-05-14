
import { products } from './data';

// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products in localStorage if they don't exist
export const initializeProducts = (options?: { forceRefresh?: boolean }) => {
  const shouldRefresh = options?.forceRefresh === true;
  
  // Only initialize products if localStorage is empty or force refresh is requested
  // This ensures we don't overwrite user's custom products
  if (shouldRefresh || !localStorage.getItem('products')) {
    console.log('Initializing products from data files');
    // Add a timestamp to product images to prevent caching
    const productsWithTimestamp = products.map(product => ({
      ...product,
      image: addTimestampToImage(product.image)
    }));
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(productsWithTimestamp));
    
    // Also set in memory cache for faster initial loads
    setProductsCache(productsWithTimestamp);
  } else {
    console.log('Products already exist in localStorage, skipping initialization');
    
    // Load from localStorage to memory cache for faster access
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProductsCache(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error loading products from localStorage to cache:', error);
    }
  }
};

// In-memory cache for faster product access
let productsCache = null;

// Set the products cache
export const setProductsCache = (products) => {
  productsCache = products;
};

// Get products from cache
export const getProductsFromCache = () => {
  return productsCache;
};

// Add timestamp to image URL to prevent caching
export const addTimestampToImage = (imageUrl: string): string => {
  if (!imageUrl) return "";
  
  // Remove any existing timestamp parameter if present
  let cleanUrl = imageUrl;
  if (imageUrl.includes('?t=')) {
    cleanUrl = imageUrl.split('?t=')[0];
  } else if (imageUrl.includes('&t=')) {
    cleanUrl = imageUrl.replace(/&t=\d+/, '');
  }
  
  // Add timestamp parameter
  const separator = cleanUrl.includes('?') ? '&' : '?';
  return `${cleanUrl}${separator}t=${Date.now()}`;
};

// Force refresh product data from source files
export const refreshProductData = async () => {
  console.log('Forcing product data refresh from source files');
  // Clear existing product data from localStorage
  localStorage.removeItem('products');
  
  // Clear the in-memory cache
  productsCache = null;
  
  // Re-initialize with fresh data
  initializeProducts({ forceRefresh: true });
  
  // Add a small delay to simulate API call
  await delay(300);
  
  return true;
};

// Export a function to persist products to localStorage
export const persistProducts = (products: any[]) => {
  console.log('Persisting products to localStorage', products.length);
  
  // Make sure all products have timestamps in their image URLs
  const productsWithTimestamps = products.map(product => ({
    ...product,
    image: addTimestampToImage(product.image)
  }));
  
  // Update in-memory cache
  setProductsCache(productsWithTimestamps);
  
  // Update localStorage
  localStorage.setItem('products', JSON.stringify(productsWithTimestamps));
};
