
// Re-export all product-related Firebase functionality from a single entry point
import { initializeFirestoreProducts, refreshFirestoreProducts } from './initialization';
import { getFirestoreProducts, getFirestoreProductById } from './getters';
import { saveFirestoreProduct, deleteFirestoreProduct } from './mutations';
import { getDeletedProductIds, clearAllDeletedProductIds } from './deleted-products';

export {
  // Initialization
  initializeFirestoreProducts,
  refreshFirestoreProducts,
  
  // Getters
  getFirestoreProducts,
  getFirestoreProductById,
  getDeletedProductIds,
  
  // Mutations
  saveFirestoreProduct,
  deleteFirestoreProduct,
  clearAllDeletedProductIds,
};
