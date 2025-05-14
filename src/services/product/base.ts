
import { Product } from '@/types/product';
import { delay, addTimestampToImage, getProductsFromCache } from './utils';
import { products } from './data';

// Get products from localStorage or fallback to imported data
const getStoredProducts = (): Product[] => {
  // First try to get from memory cache for fastest access
  const cachedProducts = getProductsFromCache();
  if (cachedProducts) {
    return cachedProducts;
  }
  
  // If not in cache, try localStorage
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    try {
      const parsedProducts = JSON.parse(storedProducts);
      
      // Ensure all products have timestamp in images to prevent caching
      return parsedProducts.map((product: Product) => ({
        ...product,
        image: addTimestampToImage(product.image)
      }));
    } catch (error) {
      console.error('Error parsing stored products:', error);
      return products;
    }
  }
  // Fallback to imported data if localStorage is empty
  return products;
};

// Base product retrieval functions
export const getProducts = async (): Promise<Product[]> => {
  // For the home page banner, reduce delay for faster loading
  await delay(100); // Reduced from 300ms to 100ms for faster loading
  console.log('Getting products with timestamp', Date.now());
  return getStoredProducts();
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(300); // Shorter delay for better mobile experience
  const products = getStoredProducts();
  const product = products.find(product => product.id === id);
  
  if (product) {
    // Ensure product image has timestamp
    return {
      ...product,
      image: addTimestampToImage(product.image)
    };
  }
  
  return undefined;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(300); // Shorter delay for better mobile experience
  const products = getStoredProducts();
  const filteredProducts = products.filter(product => product.category === category);
  
  // Ensure all product images have timestamps
  return filteredProducts.map(product => ({
    ...product,
    image: addTimestampToImage(product.image)
  }));
};
