
import { Product } from '@/types/product';
import { delay } from './utils';
import { 
  getFirestoreProducts, 
  getFirestoreProductById,
  getDeletedProductIds
} from '../firebase/products';
import { queryClient } from '@/services/query-client';

// Base product retrieval functions - Firebase only, no local storage
export const getProducts = async (): Promise<Product[]> => {
  await delay(300);
  
  console.log('Fetching products from Firebase only');
  const products = await getFirestoreProducts();
  
  // Cache the products (already filtered by getFirestoreProducts)
  queryClient.setQueryData(['products'], products);
  
  return products;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(300);
  
  // Check if product is deleted
  const deletedIds = await getDeletedProductIds();
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
  
  // Fetch from Firebase only
  console.log('Fetching product from Firebase', id);
  return getFirestoreProductById(id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(300);
  
  // Get all products from Firebase (which will filter deleted ones)
  const allProducts = await getProducts();
  
  // Then filter by category
  return allProducts.filter(product => product.category === category);
};
