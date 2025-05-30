
import { db } from '../index';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { products as initialProducts } from '@/services/product/data';
import { PRODUCTS_COLLECTION, DELETED_PRODUCTS_COLLECTION, productsInitialized } from './constants';
import { getDeletedProductIds } from './deleted-products';
import { toast } from 'sonner';
import { DELETED_PRODUCTS_KEY } from '@/config/app-config';
import { queryClient } from '@/services/query-client';

// Initialize Firestore products collection - NEVER for mobile apps
export const initializeFirestoreProducts = async () => {
  try {
    // Completely skip initialization for mobile builds
    const isCapacitor = !!(window as any).Capacitor;
    if (isCapacitor) {
      console.log('📱 Mobile app detected - NO default product initialization allowed');
      return;
    }

    // Skip initialization if already done in this session
    if (productsInitialized) {
      console.log('Products already initialized in this session, skipping');
      return;
    }

    // Check if products collection exists and has documents
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    if (productsSnapshot.empty) {
      console.log('Initializing Firestore products collection with default data (web only)');
      
      // Get list of deleted product IDs to avoid re-adding them
      const deletedIds = await getDeletedProductIds();
      
      // Filter out products that were previously deleted
      const productsToAdd = initialProducts.filter(product => !deletedIds.includes(product.id));
      
      // Add remaining products
      await Promise.all(
        productsToAdd.map(async (product) => {
          await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
        })
      );
      
      console.log('Firestore products initialized successfully');
    } else {
      console.log('Firestore products collection already exists, skipping initialization');
    }
    
    // Mark as initialized for this session
    global.productsInitialized = true;
  } catch (error) {
    console.error('Error initializing Firestore products:', error);
    if (typeof window !== 'undefined' && !(window as any).Capacitor) {
      toast.error('Failed to initialize product data from Firebase');
    }
  }
};

// Refresh product data - for mobile, absolutely no defaults
export const refreshFirestoreProducts = async (options?: { forceReset?: boolean }): Promise<boolean> => {
  try {
    console.log('Refreshing Firestore products');
    const isCapacitor = !!(window as any).Capacitor;
    
    if (isCapacitor) {
      console.log('📱 Mobile app - only refreshing existing Firebase data, NO defaults');
      // For mobile, just invalidate cache - no data manipulation
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      return true;
    }
    
    // Only perform full reset if explicitly requested AND not on mobile
    if (options?.forceReset) {
      console.log('Performing full reset of product data as requested (web only)');
      
      // Delete all existing products
      const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      await Promise.all(
        productsSnapshot.docs.map(async (doc) => {
          await deleteDoc(doc.ref);
        })
      );
      
      // Clear the deleted products collection
      const deletedSnapshot = await getDocs(collection(db, DELETED_PRODUCTS_COLLECTION));
      await Promise.all(
        deletedSnapshot.docs.map(async (doc) => {
          await deleteDoc(doc.ref);
        })
      );
      
      // Reset the initialized flag
      global.productsInitialized = false;
      
      // Clear deleted products list if doing a full reset
      localStorage.removeItem(DELETED_PRODUCTS_KEY);
      
      // Re-initialize with fresh data
      await Promise.all(
        initialProducts.map(async (product) => {
          await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
        })
      );
      
      toast.success('Product data completely reset to defaults');
    } else {
      // Just add any missing products from the initial data for web only
      console.log('Adding any missing default products (web only)');
      
      // Get existing product IDs
      const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const existingProductIds = new Set(productsSnapshot.docs.map(doc => doc.id));
      
      // Get deleted product IDs to respect user deletions
      const deletedIds = await getDeletedProductIds();
      
      // Find missing products that weren't explicitly deleted
      const missingProducts = initialProducts.filter(
        product => !existingProductIds.has(product.id) && !deletedIds.includes(product.id)
      );
      
      if (missingProducts.length > 0) {
        console.log(`Adding ${missingProducts.length} missing products`);
        
        // Add missing products
        await Promise.all(
          missingProducts.map(async (product) => {
            await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
          })
        );
        
        toast.success(`Added ${missingProducts.length} missing products`);
      } else {
        console.log('No missing products found');
        toast.info('All default products are already available');
      }
    }
    
    // Invalidate the products query cache
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
    
    return true;
  } catch (error) {
    console.error('Error refreshing Firestore products:', error);
    if (typeof window !== 'undefined' && !(window as any).Capacitor) {
      toast.error('Failed to refresh product data in Firebase');
    }
    return false;
  }
};
