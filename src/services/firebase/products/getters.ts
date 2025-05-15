
import { db } from '../index';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types/product';
import { PRODUCTS_COLLECTION } from './constants';
import { getDeletedProductIds } from './deleted-products';
import { toast } from 'sonner';

// Get all products from Firestore, filtering out deleted ones
export const getFirestoreProducts = async (): Promise<Product[]> => {
  try {
    // First get the deleted IDs to ensure we have the most up-to-date list
    const deletedIds = await getDeletedProductIds();
    console.log('Deleted products to filter out:', deletedIds);
    
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const allProducts = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { ...data, id: doc.id } as Product;
    });
    
    console.log(`Retrieved ${allProducts.length} products from Firestore`);
    
    // Filter out deleted products
    const filteredProducts = allProducts.filter(product => !deletedIds.includes(product.id));
    
    console.log(`After filtering, ${filteredProducts.length} products remain`);
    
    return filteredProducts;
  } catch (error) {
    console.error('Error getting products from Firestore:', error);
    toast.error("Failed to fetch products from Firebase");
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
      return { ...productDoc.data(), id: productDoc.id } as Product;
    }
    return undefined;
  } catch (error) {
    console.error('Error getting product by ID from Firestore:', error);
    toast.error("Failed to fetch product details from Firebase");
    return undefined;
  }
};
