
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
    // Remove any timestamp parameters that might be in the image URL
    let imageUrl = product.image;
    
    // Only clean timestamp parameters from regular URLs
    if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('local-storage://')) {
      if (imageUrl.includes('?t=')) {
        imageUrl = imageUrl.split('?t=')[0];
      } else if (imageUrl.includes('&t=')) {
        imageUrl = imageUrl.replace(/&t=\d+/, '');
      }
    }
    
    // Save the product with the processed image URL
    const productToSave = {
      ...product,
      image: imageUrl
    };
    
    console.log('Saving product to Firebase:', productToSave);
    
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), productToSave);
    
    // If this product was previously deleted, remove it from deleted list
    const deletedIds = await getDeletedProductIds();
    if (deletedIds.includes(product.id)) {
      await deleteDoc(doc(db, DELETED_PRODUCTS_COLLECTION, product.id));
      
      // Also update localStorage
      const filteredIds = deletedIds.filter(id => id !== product.id);
      localStorage.setItem('deleted-products', JSON.stringify(filteredIds));
    }
    
    // Invalidate the products query cache to ensure fresh data is fetched
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
    
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
    // Remove from products collection
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    
    // Add to deleted products tracking in both places
    await addDeletedProductId(productId);
    
    // Invalidate the products query cache to ensure fresh data is fetched
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
    
    return true;
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    toast.error('Failed to delete product from Firebase');
    return false;
  }
};
