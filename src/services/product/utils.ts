
import { getGlobalTimestamp } from '@/utils/version-checker';
import { initializeFirestoreProducts, refreshFirestoreProducts } from '../firebase/products';

// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products in Firebase if they don't exist
export const initializeProducts = async (options?: { forceRefresh?: boolean; respectDeletedItems?: boolean }) => {
  const shouldRefresh = options?.forceRefresh === true;
  const respectDeleted = options?.respectDeletedItems !== false; // Default to true
  
  // For mobile builds, always force refresh to ensure latest data
  const isCapacitor = !!(window as any).Capacitor;
  
  if (shouldRefresh || isCapacitor) {
    console.log('🔄 Force refreshing product data for mobile build or explicit request');
    // For mobile, don't force reset - just ensure we get fresh data
    await refreshFirestoreProducts({ forceReset: false });
  } else {
    console.log('Initializing products from data files with respectDeletedItems:', respectDeleted);
    // This will only populate if collection is empty
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

// Force refresh product data from source files
export const refreshProductData = async () => {
  console.log('🔄 Refreshing product data');
  
  // Generate a new global timestamp for mobile
  const newTimestamp = Date.now().toString();
  localStorage.setItem('global_timestamp', newTimestamp);
  
  // Clear product caches for mobile builds
  const isCapacitor = !!(window as any).Capacitor;
  if (isCapacitor) {
    console.log('📱 Clearing mobile caches...');
    localStorage.removeItem('products-cache');
    // Don't clear deleted products for mobile - respect admin decisions
  }
  
  // Refresh products in Firebase - don't force reset for mobile
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
