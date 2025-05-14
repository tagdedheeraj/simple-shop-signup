
import { getGlobalTimestamp } from '@/utils/version-checker';
import { refreshFirestoreProductData } from '../firebase/products';

// Simulate API calls with a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize products in Firestore if they don't exist
export const initializeProducts = async (options?: { forceRefresh?: boolean }) => {
  const { initializeFirestoreProducts } = await import('../firebase/products');
  const shouldRefresh = options?.forceRefresh === true;
  
  try {
    await initializeFirestoreProducts(shouldRefresh);
  } catch (error) {
    console.error('Error initializing products:', error);
    throw error;
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

// Force refresh product data
export const refreshProductData = async () => {
  console.log('Forcing product data refresh');
  try {
    // Use Firebase to refresh product data
    await refreshFirestoreProductData();
    
    // Generate a new global timestamp
    const newTimestamp = Date.now().toString();
    localStorage.setItem('global_timestamp', newTimestamp);
    
    return true;
  } catch (error) {
    console.error('Error refreshing products in Firestore:', error);
    throw error;
  }
};

// Export a function to persist products
export const persistProducts = async (products: any[]) => {
  console.log('Persisting products to Firestore', products);
  
  try {
    // Import necessary functions from Firebase products service
    const { saveFirestoreProduct } = await import('../firebase/products');
    
    // Add timestamps to all images and save each product
    const savePromises = products.map(product => {
      const productWithTimestamp = {
        ...product,
        image: addTimestampToImage(product.image)
      };
      return saveFirestoreProduct(productWithTimestamp);
    });
    
    await Promise.all(savePromises);
  } catch (error) {
    console.error('Error persisting products to Firestore:', error);
    throw error;
  }
};
