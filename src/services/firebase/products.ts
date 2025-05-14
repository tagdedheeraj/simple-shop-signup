
import { db } from './index';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Product } from '@/types/product';
import { addTimestampToImage } from '../product/utils';
import { delay } from '../product/utils';

const PRODUCTS_COLLECTION = 'products';

// Initialize products collection in Firestore if needed
export const initializeFirestoreProducts = async (forceRefresh = false) => {
  try {
    // Check if products collection already has data
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    if (snapshot.empty || forceRefresh) {
      console.log('Initializing products in Firestore from data files');
      // Get products from local data
      const { products } = require('../product/data');
      
      // Add each product to Firestore
      const batch = [];
      for (const product of products) {
        const productWithTimestamp = {
          ...product,
          image: addTimestampToImage(product.image)
        };
        batch.push(setDoc(doc(db, PRODUCTS_COLLECTION, product.id), productWithTimestamp));
      }
      
      await Promise.all(batch);
      console.log('Products initialized in Firestore');
      return true;
    } else {
      console.log('Products already exist in Firestore, skipping initialization');
      return false;
    }
  } catch (error) {
    console.error('Error initializing Firestore products:', error);
    throw error;
  }
};

// Get all products from Firestore
export const getFirestoreProducts = async (): Promise<Product[]> => {
  try {
    await delay(300); // Keep small delay for UX consistency
    
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products: Product[] = [];
    
    snapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products from Firestore:', error);
    throw error;
  }
};

// Get a product by ID from Firestore
export const getFirestoreProductById = async (id: string): Promise<Product | undefined> => {
  try {
    await delay(200); // Keep small delay for UX consistency
    
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Product;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error getting product by ID from Firestore:', error);
    throw error;
  }
};

// Get products by category from Firestore
export const getFirestoreProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    await delay(300); // Keep small delay for UX consistency
    
    const q = query(collection(db, PRODUCTS_COLLECTION), where("category", "==", category));
    const snapshot = await getDocs(q);
    
    const products: Product[] = [];
    snapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products by category from Firestore:', error);
    throw error;
  }
};

// Save a product to Firestore (create or update)
export const saveFirestoreProduct = async (product: Product): Promise<void> => {
  try {
    // Make sure image has timestamp
    const updatedProduct = {
      ...product,
      image: addTimestampToImage(product.image)
    };
    
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), updatedProduct);
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
    throw error;
  }
};

// Delete a product from Firestore
export const deleteFirestoreProduct = async (productId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    throw error;
  }
};

// Refresh Firestore product data
export const refreshFirestoreProductData = async (): Promise<boolean> => {
  try {
    // Re-initialize with force refresh
    return await initializeFirestoreProducts(true);
  } catch (error) {
    console.error('Error refreshing Firestore product data:', error);
    throw error;
  }
};
