
import { db } from '../index';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { PRODUCTS_COLLECTION, DELETED_PRODUCTS_COLLECTION } from './constants';
import { products } from '../../product/data';
import { getDeletedProductIds } from './deleted-products';

// Track if products have been initialized
let productsInitialized = false;

// Clean up old products that are no longer needed
const cleanupOldProducts = async () => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    
    const currentProductIds = products.map(p => p.id);
    const deletedIds = await getDeletedProductIds();
    
    const batch = writeBatch(db);
    let hasChanges = false;
    
    snapshot.docs.forEach((docSnapshot) => {
      const productId = docSnapshot.id;
      
      // Only remove products that are not in our current data and not explicitly deleted
      // AND are not manually added products (don't start with default product prefixes)
      const isDefaultProduct = productId.startsWith('rice-') || productId.startsWith('wheat-');
      
      if (!currentProductIds.includes(productId) && !deletedIds.includes(productId) && isDefaultProduct) {
        batch.delete(doc(db, PRODUCTS_COLLECTION, productId));
        hasChanges = true;
        console.log(`Marking old default product for cleanup: ${productId}`);
      }
    });
    
    if (hasChanges) {
      await batch.commit();
      console.log('Old default products cleaned up successfully');
    }
  } catch (error) {
    console.error('Error cleaning up old products:', error);
  }
};

// Initialize Firestore products
export const initializeFirestoreProducts = async (): Promise<boolean> => {
  if (productsInitialized) {
    return true;
  }

  try {
    // Check if we're in a mobile environment
    const isCapacitor = !!(window as any).Capacitor;
    
    if (isCapacitor) {
      console.log('📱 Mobile app detected - loading existing products from Firebase');
      productsInitialized = true;
      return true;
    }

    console.log('🔄 Initializing Firestore products...');
    
    // Get existing products from Firestore first
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    const existingProducts = snapshot.docs.length;
    
    console.log(`Found ${existingProducts} existing products in Firebase`);
    
    // If we have existing products, don't add default ones
    if (existingProducts > 0) {
      console.log('✅ Products already exist in Firestore, skipping default initialization');
      productsInitialized = true;
      return true;
    }
    
    // Only add default products if no products exist
    const existingProductIds = snapshot.docs.map(doc => doc.id);
    const deletedIds = await getDeletedProductIds();
    console.log('Deleted product IDs that will not be re-added:', deletedIds);
    
    // Add only new default products that don't exist and aren't deleted
    const batch = writeBatch(db);
    let addedCount = 0;
    
    for (const product of products) {
      if (!existingProductIds.includes(product.id) && !deletedIds.includes(product.id)) {
        const productRef = doc(db, PRODUCTS_COLLECTION, product.id);
        batch.set(productRef, product);
        addedCount++;
        console.log(`Adding default product: ${product.name}`);
      }
    }
    
    if (addedCount > 0) {
      await batch.commit();
      console.log(`✅ Added ${addedCount} default products to Firestore`);
    } else {
      console.log('✅ No default products needed');
    }
    
    productsInitialized = true;
    return true;
  } catch (error) {
    console.error('Error initializing Firestore products:', error);
    return false;
  }
};

// Force refresh products with option to reset
export const refreshFirestoreProducts = async (options?: { forceReset?: boolean }): Promise<boolean> => {
  try {
    console.log('🔄 Refreshing Firestore products...');
    
    if (options?.forceReset) {
      console.log('🧹 Force reset: Cleaning all existing products...');
      
      // Delete all existing products
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(productsRef);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
      });
      
      if (snapshot.docs.length > 0) {
        await batch.commit();
        console.log(`Deleted ${snapshot.docs.length} existing products`);
      }
      
      // Clear deleted products tracking
      const deletedRef = collection(db, DELETED_PRODUCTS_COLLECTION);
      const deletedSnapshot = await getDocs(deletedRef);
      
      const deletedBatch = writeBatch(db);
      deletedSnapshot.docs.forEach((docSnapshot) => {
        deletedBatch.delete(docSnapshot.ref);
      });
      
      if (deletedSnapshot.docs.length > 0) {
        await deletedBatch.commit();
        console.log('Cleared deleted products tracking');
      }
      
      // Clear localStorage
      localStorage.removeItem('deleted-products');
      
      // Reset initialization flag
      productsInitialized = false;
      
      console.log('✅ Force reset completed - no products remain');
      return true;
    }
    
    // For normal refresh, don't reset the initialization flag
    return await initializeFirestoreProducts();
  } catch (error) {
    console.error('Error refreshing Firestore products:', error);
    return false;
  }
};
