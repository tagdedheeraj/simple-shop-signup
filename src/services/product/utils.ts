
import { getGlobalTimestamp } from '@/utils/version-checker';
import { initializeFirestoreProducts, refreshFirestoreProducts } from '../firebase/products';

// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products in Firebase - for mobile, only load from Firebase, no defaults
export const initializeProducts = async (options?: { forceRefresh?: boolean; respectDeletedItems?: boolean }) => {
  const shouldRefresh = options?.forceRefresh === true;
  
  // For mobile builds, never use default data - only Firebase
  const isCapacitor = !!(window as any).Capacitor;
  
  if (isCapacitor) {
    console.log('📱 Mobile app detected - loading ONLY from Firebase, no defaults');
    // For mobile, just ensure Firebase connection, don't add any default data
    return;
  } else if (shouldRefresh) {
    console.log('🔄 Force refreshing product data');
    await refreshFirestoreProducts({ forceReset: false });
  } else {
    console.log('Initializing products from Firebase only');
    // This will only populate if collection is empty and NOT on mobile
    await initializeFirestoreProducts();
  }
};

// Add timestamp to image URL to prevent caching
export const addTimestampToImage = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;
  
  // Skip data URLs and blob URLs
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }
  
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

// Force refresh product data from Firebase only
export const refreshProductData = async () => {
  console.log('🔄 Refreshing product data from Firebase');
  
  // Generate a new global timestamp for mobile
  const newTimestamp = Date.now().toString();
  localStorage.setItem('global_timestamp', newTimestamp);
  
  // Clear product caches for mobile builds
  const isCapacitor = !!(window as any).Capacitor;
  if (isCapacitor) {
    console.log('📱 Clearing mobile caches...');
    localStorage.removeItem('products-cache');
  }
  
  // For mobile, only refresh existing Firebase data, don't add defaults
  await refreshFirestoreProducts({ forceReset: false });
  
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
