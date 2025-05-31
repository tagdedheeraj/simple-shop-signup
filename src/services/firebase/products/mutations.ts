import { db } from '../index';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Product } from '@/types/product';
import { PRODUCTS_COLLECTION, DELETED_PRODUCTS_COLLECTION } from './constants';
import { addDeletedProductId, getDeletedProductIds } from './deleted-products';
import { queryClient } from '@/services/query-client';
import { toast } from 'sonner';

// Update or add a product to Firestore
export const saveFirestoreProduct = async (product: Product): Promise<boolean> => {
  try {
    console.log('💾 Saving product to Firebase with image URL:', product.image);
    
    // Keep the original image URL as-is for Firebase Storage URLs
    const productToSave = {
      ...product,
      image: product.image // Keep original URL including firebase-storage:// prefix
    };
    
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), productToSave);
    
    // If this product was previously deleted, remove it from deleted list
    const deletedIds = await getDeletedProductIds();
    if (deletedIds.includes(product.id)) {
      await deleteDoc(doc(db, DELETED_PRODUCTS_COLLECTION, product.id));
    }
    
    // Invalidate the products query cache to ensure fresh data is fetched
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
    
    console.log('✅ Product saved successfully to Firebase');
    return true;
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
    toast.error('Failed to save product to Firebase');
    return false;
  }
};

// Delete a product from Firestore and mark as deleted
export const deleteFirestoreProduct = async (productId: string): Promise<boolean> => {
  try {
    console.log('🗑️ Deleting product from Firebase:', productId);
    
    // Remove from products collection
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    
    // Add to deleted products tracking in Firebase
    await addDeletedProductId(productId);
    
    // Invalidate the products query cache to ensure fresh data is fetched
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
    
    console.log('✅ Product deleted successfully from Firebase');
    return true;
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    toast.error('Failed to delete product from Firebase');
    return false;
  }
};
