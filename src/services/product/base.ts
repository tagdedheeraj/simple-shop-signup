import { Product } from '@/types/product';
import { delay } from './utils';
import { 
  getFirestoreProducts, 
  getFirestoreProductById 
} from '../firebase/products';
import { queryClient } from '@/services/query-client';
import { DELETED_PRODUCTS_KEY } from '@/config/app-config';

// Get deleted product IDs from localStorage
const getDeletedProductIds = (): string[] => {
  const deletedIdsJson = localStorage.getItem(DELETED_PRODUCTS_KEY);
  return deletedIdsJson ? JSON.parse(deletedIdsJson) : [];
};

// Base product retrieval functions
export const getProducts = async (): Promise<Product[]> => {
  await delay(300); // Reduced delay for better UX
  
  // Check if we have cached products
  const cachedProducts = queryClient.getQueryData<Product[]>(['products']);
  if (cachedProducts) {
    console.log('Using cached products', cachedProducts.length);
    // Filter out deleted products even from cache
    const deletedIds = getDeletedProductIds();
    return cachedProducts.filter(product => !deletedIds.includes(product.id));
  }
  
  // Otherwise fetch from Firestore
  console.log('Fetching products from Firestore');
  const products = await getFirestoreProducts();
  
  // Filter out deleted products
  const deletedIds = getDeletedProductIds();
  const filteredProducts = products.filter(product => !deletedIds.includes(product.id));
  
  // Cache the filtered products
  queryClient.setQueryData(['products'], filteredProducts);
  
  return filteredProducts;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(300); // Reduced delay for better UX
  
  // Check if product is deleted
  const deletedIds = getDeletedProductIds();
  if (deletedIds.includes(id)) {
    console.log('Product is deleted', id);
    return undefined;
  }
  
  // Check if we have the product in cache
  const cachedProducts = queryClient.getQueryData<Product[]>(['products']);
  if (cachedProducts) {
    const cachedProduct = cachedProducts.find(p => p.id === id);
    if (cachedProduct) {
      console.log('Using cached product', id);
      return cachedProduct;
    }
  }
  
  // Otherwise fetch from Firestore
  console.log('Fetching product from Firestore', id);
  return getFirestoreProductById(id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(300); // Reduced delay for better UX
  
  // First get all products (which will filter deleted ones)
  const allProducts = await getProducts();
  
  // Then filter by category
  return allProducts.filter(product => product.category === category);
};
