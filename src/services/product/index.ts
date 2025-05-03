
import { products } from './data';
import { delay, initializeProducts } from './utils';
import { getProducts, getProductById, getProductsByCategory } from './base';
import { getRelatedProducts, getTrendingProducts } from './related';
import { addReview } from './reviews';

// Initialize products when importing this module
initializeProducts({ forceRefresh: false });

// Export all product service functions
export {
  getProducts,
  getProductById,
  getProductsByCategory,
  getRelatedProducts,
  getTrendingProducts,
  addReview,
  initializeProducts
};
