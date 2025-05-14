
import { db } from './index';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';
import { Product } from '@/types/product';
import { products as initialProducts } from '../product/data';
import { toast } from 'sonner';
import { queryClient } from '../query-client';

// Firebase collection name for products
const PRODUCTS_COLLECTION = 'products';

// A flag to track if products have been initialized
let productsInitialized = false;

// Initialize Firestore products collection with data if empty
export const initializeFirestoreProducts = async () => {
  try {
    // Skip initialization if already done
    if (productsInitialized) {
      console.log('Products already initialized in this session, skipping');
      return;
    }

    // Check if products collection exists and has documents
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    if (productsSnapshot.empty) {
      console.log('Initializing Firestore products collection with default data');
      
      // Batch operation would be better but for simplicity we'll use Promise.all
      await Promise.all(
        initialProducts.map(async (product) => {
          await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
        })
      );
      
      console.log('Firestore products initialized successfully');
    } else {
      console.log('Firestore products collection already exists, skipping initialization');
    }
    
    // Mark as initialized
    productsInitialized = true;
  } catch (error) {
    console.error('Error initializing Firestore products:', error);
    toast.error('Failed to initialize product data from Firebase');
  }
};

// Get all products from Firestore
export const getFirestoreProducts = async (): Promise<Product[]> => {
  try {
    // We no longer call initializeFirestoreProducts() here as it can cause reinitialization issues
    // It should only be called once at the app startup
    
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return productsSnapshot.docs.map(doc => doc.data() as Product);
  } catch (error) {
    console.error('Error getting products from Firestore:', error);
    toast.error('Failed to fetch products from Firebase');
    return [];
  }
};

// Get a single product by ID from Firestore
export const getFirestoreProductById = async (id: string): Promise<Product | undefined> => {
  try {
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

// Delete a product from Firestore
export const deleteFirestoreProduct = async (productId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    
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

// Refresh product data - but only ADD missing products, don't delete existing ones
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
      
      // Reset the initialized flag
      productsInitialized = false;
      
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
      
      // Find missing products
      const missingProducts = initialProducts.filter(product => !existingProductIds.has(product.id));
      
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
