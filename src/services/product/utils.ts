
import { getGlobalTimestamp } from '@/utils/version-checker';
import { initializeFirestoreProducts, refreshFirestoreProducts } from '../firebase/products';

// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products - for mobile, NEVER use default data
export const initializeProducts = async (options?: { forceRefresh?: boolean; respectDeletedItems?: boolean }) => {
  const shouldRefresh = options?.forceRefresh === true;
  const isCapacitor = !!(window as any).Capacitor;
  
  if (isCapacitor) {
    console.log('📱 Mobile app detected - SKIPPING all default product initialization');
    // For mobile, absolutely no initialization - only Firebase data
    return;
  } else if (shouldRefresh) {
    console.log('🔄 Force refreshing product data');
    await refreshFirestoreProducts({ forceReset: false });
  } else {
    console.log('Web app - initializing products from Firebase');
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
  const isCapacitor = !!(window as any).Capacitor;
  
  if (isCapacitor) {
    console.log('📱 Mobile app - clearing all local caches');
    // Clear all possible caches for mobile
    localStorage.removeItem('products-cache');
    localStorage.removeItem('admin-videos');
    localStorage.removeItem('video-cache');
    
    // Generate new timestamp for cache busting
    const newTimestamp = Date.now().toString();
    localStorage.setItem('global_timestamp', newTimestamp);
  }
  
  // For mobile, never add defaults - only refresh existing Firebase data
  await refreshFirestoreProducts({ forceReset: false });
  
  await delay(300);
  return true;
};

// Export a function to persist products to Firebase
export const persistProducts = async (products: any[]) => {
  console.log('This function is deprecated. Use Firebase direct operations instead.');
  return true;
};
