
import { APP_VERSION, APP_VERSION_KEY } from '@/config/app-config';
import { refreshProductData } from '@/services/product';
import { toast } from 'sonner';

/**
 * Checks the stored app version against the current version
 * If versions don't match, clears localStorage and refreshes data
 * @returns Promise that resolves when version check is complete
 */
export const checkAppVersion = async (): Promise<void> => {
  try {
    // Get the stored version (if any)
    const storedVersion = localStorage.getItem(APP_VERSION_KEY);
    
    // If no version is stored or version doesn't match, we need to refresh data
    if (!storedVersion || storedVersion !== APP_VERSION) {
      console.log(`App version changed from ${storedVersion || 'none'} to ${APP_VERSION}. Refreshing data...`);
      
      // Show update notification to user
      toast.info('Updating app data...', {
        duration: 2000,
      });
      
      // Clear all cached data for mobile builds
      if (typeof window !== 'undefined') {
        // Clear product cache
        localStorage.removeItem('products-cache');
        localStorage.removeItem('deleted-products');
        
        // Clear video cache  
        localStorage.removeItem('admin-videos');
        localStorage.removeItem('video-cache');
        
        // Clear other app caches
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('app-') || key.startsWith('cache-')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Force refresh product data
      await refreshProductData();
      
      // Store the new version
      localStorage.setItem(APP_VERSION_KEY, APP_VERSION);
      
      toast.success('App updated successfully!', {
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Error checking app version:', error);
  }
};

/**
 * Force clear all app data - useful for mobile builds
 */
export const forceRefreshAppData = async (): Promise<void> => {
  try {
    console.log('🔄 Force refreshing all app data for mobile build...');
    
    if (typeof window !== 'undefined') {
      // Clear everything except auth data
      const authKeys = ['firebase:authUser', 'firebase:host', 'persist:auth'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!authKeys.some(authKey => key.includes(authKey))) {
          localStorage.removeItem(key);
        }
      });
    }
    
    // Force refresh product data
    await refreshProductData();
    
    console.log('✅ App data force refreshed successfully');
  } catch (error) {
    console.error('❌ Error force refreshing app data:', error);
  }
};

/**
 * Generates a global timestamp for the current session
 * This can be used to prevent image caching across the app
 */
export const generateGlobalTimestamp = (): void => {
  const timestamp = Date.now().toString();
  localStorage.setItem('global_timestamp', timestamp);
};

/**
 * Returns the global timestamp for the current session
 * If no timestamp exists, generates a new one
 */
export const getGlobalTimestamp = (): string => {
  let timestamp = localStorage.getItem('global_timestamp');
  if (!timestamp) {
    timestamp = Date.now().toString();
    localStorage.setItem('global_timestamp', timestamp);
  }
  return timestamp;
};
