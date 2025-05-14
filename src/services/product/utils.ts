
import { getGlobalTimestamp } from '@/utils/version-checker';
import { initializeFirestoreProducts, refreshFirestoreProducts } from '../firebase/products';

// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products in Firebase if they don't exist
export const initializeProducts = async (options?: { forceRefresh?: boolean }) => {
  const shouldRefresh = options?.forceRefresh === true;
  
  if (shouldRefresh) {
    console.log('Forcing product data refresh from source files');
    await refreshFirestoreProducts();
  } else {
    console.log('Initializing products from data files');
    await initializeFirestoreProducts();
  }
};

// Add timestamp to image URL to prevent caching
export const addTimestampToImage = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;
  
  // Remove any existing timestamp parameter if present
  let cleanUrl = imageUrl;
  if (imageUrl.includes('?t=')) {
    cleanUrl = imageUrl.split('?t=')[0];
  } else if (imageUrl.includes('&t=')) {
    cleanUrl = imageUrl.replace(/&t=\d+/, '');
  }
  
  // Use the global timestamp instead of Date.now() for consistency
  const timestamp = getGlobalTimestamp();
  
  // Add timestamp parameter
  const separator = cleanUrl.includes('?') ? '&' : '?';
  return `${cleanUrl}${separator}t=${timestamp}`;
};

// Force refresh product data from source files
export const refreshProductData = async () => {
  console.log('Forcing product data refresh from source files');
  
  // Generate a new global timestamp
  const newTimestamp = Date.now().toString();
  localStorage.setItem('global_timestamp', newTimestamp);
  
  // Refresh products in Firebase
  await refreshFirestoreProducts();
  
  // Add a small delay to simulate API call
  await delay(300);
  
  return true;
};

// Export a function to persist products to Firebase
export const persistProducts = async (products: any[]) => {
  console.log('Persisting products to Firebase', products);
  
  // This will be implemented with Firebase batch operations
  // But for now we'll just log it
  console.log('This function is deprecated. Use Firebase direct operations instead.');
  return true;
};
