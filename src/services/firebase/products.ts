
import { db } from './index';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';
import { Product } from '@/types/product';
import { products as initialProducts } from '../product/data';
import { toast } from 'sonner';
import { queryClient } from '../query-client';
import { DELETED_PRODUCTS_KEY } from '@/config/app-config';

// Firebase collection names
const PRODUCTS_COLLECTION = 'products';
const DELETED_PRODUCTS_COLLECTION = 'deletedProducts';

// A flag to track if products have been initialized
let productsInitialized = false;

// Get deleted product IDs from both localStorage and Firebase
export const getDeletedProductIds = async (): Promise<string[]> => {
  try {
    // Get IDs from localStorage (legacy approach)
    const deletedIdsJson = localStorage.getItem(DELETED_PRODUCTS_KEY);
    const localDeletedIds = deletedIdsJson ? JSON.parse(deletedIdsJson) : [];
    
    // Get IDs from Firestore
    const deletedSnapshot = await getDocs(collection(db, DELETED_PRODUCTS_COLLECTION));
    const firestoreDeletedIds = deletedSnapshot.docs.map(doc => doc.id);
    
    // Combine both sources
    const allDeletedIds = [...new Set([...localDeletedIds, ...firestoreDeletedIds])];
    
    // Update localStorage with combined list for backward compatibility
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(allDeletedIds));
    
    return allDeletedIds;
  } catch (error) {
    console.error('Error getting deleted product IDs:', error);
    
    // Fallback to localStorage if Firebase fails
    const deletedIdsJson = localStorage.getItem(DELETED_PRODUCTS_KEY);
    return deletedIdsJson ? JSON.parse(deletedIdsJson) : [];
  }
};

// Store a deleted product ID in both localStorage and Firebase
const addDeletedProductId = async (productId: string): Promise<void> => {
  try {
    // Add to localStorage (legacy approach)
    const deletedIds = localStorage.getItem(DELETED_PRODUCTS_KEY);
    const parsedIds = deletedIds ? JSON.parse(deletedIds) : [];
    if (!parsedIds.includes(productId)) {
      parsedIds.push(productId);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(parsedIds));
    }
    
    // Add to Firestore deleted products collection
    await setDoc(doc(db, DELETED_PRODUCTS_COLLECTION, productId), {
      id: productId,
      deletedAt: new Date().toISOString()
    });
    
    console.log(`Product ${productId} marked as deleted in both localStorage and Firebase`);
  } catch (error) {
    console.error('Error adding product to deleted list:', error);
    toast.error('Failed to track deleted product');
  }
};

// Initialize Firestore products collection with data if empty
export const initializeFirestoreProducts = async () => {
  try {
    // Skip initialization if already done in this session
    if (productsInitialized) {
      console.log('Products already initialized in this session, skipping');
      return;
    }

    // Check if products collection exists and has documents
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    if (productsSnapshot.empty) {
      console.log('Initializing Firestore products collection with default data');
      
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
    productsInitialized = true;
  } catch (error) {
    console.error('Error initializing Firestore products:', error);
    toast.error('Failed to initialize product data from Firebase');
  }
};

// Get all products from Firestore, filtering out deleted ones
export const getFirestoreProducts = async (): Promise<Product[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const allProducts = productsSnapshot.docs.map(doc => doc.data() as Product);
    
    // Filter out deleted products
    const deletedIds = await getDeletedProductIds();
    return allProducts.filter(product => !deletedIds.includes(product.id));
  } catch (error) {
    console.error('Error getting products from Firestore:', error);
    toast.error('Failed to fetch products from Firebase');
    return [];
  }
};

// Get a single product by ID from Firestore
export const getFirestoreProductById = async (id: string): Promise<Product | undefined> => {
  try {
    // First check if product is deleted
    const deletedIds = await getDeletedProductIds();
    if (deletedIds.includes(id)) {
      console.log(`Product ${id} is deleted, not fetching`);
      return undefined;
    }
    
    const productDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
    if (productDoc.exists()) {
      return productDoc.data() as Product;
    }
    return undefined;
  } catch (error) {
    console.error('Error getting product by ID from Firestore:', error);
    toast.error('Failed to fetch product details from Firebase');
    return undefined;
  }
};

// Update or add a product to Firestore
export const saveFirestoreProduct = async (product: Product): Promise<boolean> => {
  try {
    // Remove any timestamp parameters that might be in the image URL
    let imageUrl = product.image;
    if (imageUrl && typeof imageUrl === 'string') {
      if (imageUrl.includes('?t=')) {
        imageUrl = imageUrl.split('?t=')[0];
      } else if (imageUrl.includes('&t=')) {
        imageUrl = imageUrl.replace(/&t=\d+/, '');
      }
    }
    
    // Save the product with the cleaned image URL
    const cleanedProduct = {
      ...product,
      image: imageUrl
    };
    
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), cleanedProduct);
    
    // If this product was previously deleted, remove it from deleted list
    const deletedIds = await getDeletedProductIds();
    if (deletedIds.includes(product.id)) {
      await deleteDoc(doc(db, DELETED_PRODUCTS_COLLECTION, product.id));
      
      // Also update localStorage
      const filteredIds = deletedIds.filter(id => id !== product.id);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(filteredIds));
    }
    
    // Invalidate the products query cache to ensure fresh data is fetched
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
    
    return true;
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
    toast.error('Failed to save product to Firebase');
    return false;
  }
};

// Delete a product from Firestore and mark as deleted
export const deleteFirestoreProduct = async (productId: string): Promise<boolean> => {
  try {
    // Remove from products collection
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    
    // Add to deleted products tracking in both places
    await addDeletedProductId(productId);
    
    // Invalidate the products query cache to ensure fresh data is fetched
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
    
    return true;
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    toast.error('Failed to delete product from Firebase');
    return false;
  }
};

// Refresh product data - but only ADD missing products, don't add deleted ones
export const refreshFirestoreProducts = async (options?: { forceReset?: boolean }): Promise<boolean> => {
  try {
    console.log('Refreshing Firestore products');
    
    // Only perform a complete reset if explicitly requested
    if (options?.forceReset) {
      console.log('Performing full reset of product data as requested');
      
      // Delete all existing products
      const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      await Promise.all(
        productsSnapshot.docs.map(async (doc) => {
          await deleteDoc(doc.ref);
        })
      );
      
      // Clear the deleted products collection (important!)
      const deletedSnapshot = await getDocs(collection(db, DELETED_PRODUCTS_COLLECTION));
      await Promise.all(
        deletedSnapshot.docs.map(async (doc) => {
          await deleteDoc(doc.ref);
        })
      );
      
      // Reset the initialized flag
      productsInitialized = false;
      
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
      // Just add any missing products from the initial data, don't delete existing ones
      console.log('Adding any missing default products');
      
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
    toast.error('Failed to refresh product data in Firebase');
    return false;
  }
};
