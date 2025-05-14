
import { initializeProducts, refreshProductData, persistProducts } from './utils';
import { getProducts, getProductById, getProductsByCategory } from './base';
import { getRelatedProducts, getTrendingProducts } from './related';
import { addReview } from './reviews';

// Initialize Firebase products when importing this module
initializeProducts().catch(error => {
  console.error('Failed to initialize products:', error);
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
  persistProducts
};
