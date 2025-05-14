
import { products } from './data';
import { delay, initializeProducts, refreshProductData, persistProducts } from './utils';
import { getProducts, getProductById, getProductsByCategory } from './base';
import { getRelatedProducts, getTrendingProducts } from './related';
import { addReview } from './reviews';

// Initialize products when importing this module, but only if they don't exist
// This prevents resetting user's custom products
initializeProducts();

// Export all product service functions
export {
  getProducts,
  getProductById,
  getProductsByCategory,
  getRelatedProducts,
  getTrendingProducts,
  addReview,
  initializeProducts,
  refreshProductData,
  persistProducts
};
