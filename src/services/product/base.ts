import { Product } from '@/types/product';
import { delay } from './utils';
import { 
  getFirestoreProducts, 
  getFirestoreProductById 
} from '../firebase/products';
import { queryClient } from '@/services/query-client';

// Base product retrieval functions
export const getProducts = async (): Promise<Product[]> => {
  await delay(500); // Reduced delay for better UX
  
  // Check if we have cached products
  const cachedProducts = queryClient.getQueryData<Product[]>(['products']);
  if (cachedProducts) {
    console.log('Using cached products', cachedProducts.length);
    return cachedProducts;
  }
  
  // Otherwise fetch from Firestore
  console.log('Fetching products from Firestore');
  const products = await getFirestoreProducts();
  
  // Cache the products
  queryClient.setQueryData(['products'], products);
  
  return products;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(300); // Reduced delay for better UX
  
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
  await delay(500); // Reduced delay for better UX
  
  // Check if we have cached products
  const cachedProducts = queryClient.getQueryData<Product[]>(['products']);
  if (cachedProducts) {
    console.log('Filtering cached products by category', category);
    return cachedProducts.filter(product => product.category === category);
  }
  
  // Otherwise fetch from Firestore
  console.log('Fetching and filtering products from Firestore by category', category);
  const products = await getFirestoreProducts();
  return products.filter(product => product.category === category);
};
