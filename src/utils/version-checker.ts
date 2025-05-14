
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
