
import { db } from '../index';
import { collection, getDocs, doc, setDoc, deleteDoc, query, limit } from 'firebase/firestore';
import { DELETED_PRODUCTS_COLLECTION } from './constants';
import { DELETED_PRODUCTS_KEY } from '@/config/app-config';
import { toast } from 'sonner';

// Get deleted product IDs from both localStorage and Firebase
export const getDeletedProductIds = async (): Promise<string[]> => {
  try {
    // Get IDs from localStorage (legacy approach)
    const deletedIdsJson = localStorage.getItem(DELETED_PRODUCTS_KEY);
    const localDeletedIds = deletedIdsJson ? JSON.parse(deletedIdsJson) : [];
    
    // Get IDs from Firestore - ensure we get ALL deleted products
    const deletedSnapshot = await getDocs(collection(db, DELETED_PRODUCTS_COLLECTION));
    const firestoreDeletedIds = deletedSnapshot.docs.map(doc => doc.id);
    
    console.log('Local deleted IDs:', localDeletedIds);
    console.log('Firestore deleted IDs:', firestoreDeletedIds);
    
    // Combine both sources
    const allDeletedIds = [...new Set([...localDeletedIds, ...firestoreDeletedIds])];
    
    console.log('Combined deleted IDs:', allDeletedIds);
    
    // Update localStorage with combined list for backward compatibility
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(allDeletedIds));
    
    return allDeletedIds;
  } catch (error) {
    console.error('Error getting deleted product IDs:', error);
    
    // Fallback to localStorage if Firebase fails
    const deletedIdsJson = localStorage.getItem(DELETED_PRODUCTS_KEY);
    return deletedIdsJson ? JSON.parse(deletedIdsJson) : [];
  }
};

// Store a deleted product ID in both localStorage and Firebase
export const addDeletedProductId = async (productId: string): Promise<void> => {
  try {
    // Add to localStorage (legacy approach)
    const deletedIds = localStorage.getItem(DELETED_PRODUCTS_KEY);
    const parsedIds = deletedIds ? JSON.parse(deletedIds) : [];
    if (!parsedIds.includes(productId)) {
      parsedIds.push(productId);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(parsedIds));
    }
    
    // Add to Firestore deleted products collection
    await setDoc(doc(db, DELETED_PRODUCTS_COLLECTION, productId), {
      id: productId,
      deletedAt: new Date().toISOString()
    });
    
    console.log(`Product ${productId} marked as deleted in both localStorage and Firebase`);
  } catch (error) {
    console.error('Error adding product to deleted list:', error);
    toast.error("Failed to track deleted product");
  }
};

// Clear all deleted products IDs - useful for troubleshooting
export const clearAllDeletedProductIds = async (): Promise<void> => {
  try {
    // Clear localStorage
    localStorage.removeItem(DELETED_PRODUCTS_KEY);
    
    // Clear all documents from the deletedProducts collection
    const deletedSnapshot = await getDocs(collection(db, DELETED_PRODUCTS_COLLECTION));
    
    if (!deletedSnapshot.empty) {
      // Delete each document in the collection
      const deletePromises = deletedSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      console.log(`Cleared ${deletedSnapshot.docs.length} deleted product records`);
    }
    
    toast.success("Deleted product tracking has been reset");
  } catch (error) {
    console.error('Error clearing deleted products list:', error);
    toast.error("Failed to clear deleted products tracking");
  }
};
