
import { delay, initializeProducts, refreshProductData } from './utils';
import { getProducts, getProductById, getProductsByCategory } from './base';
import { getRelatedProducts, getTrendingProducts } from './related';
import { addReview } from './reviews';

// Initialize products when importing this module
// Changed to an async function call without awaiting to prevent blocking
initializeProducts().catch(error => {
  console.error('Error initializing products:', error);
});

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
};
