
import { db } from '../index';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types/product';
import { PRODUCTS_COLLECTION } from './constants';
import { getDeletedProductIds } from './deleted-products';
import { toast } from 'sonner';

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
