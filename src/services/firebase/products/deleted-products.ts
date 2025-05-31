
import { db } from '../index';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { DELETED_PRODUCTS_COLLECTION } from './constants';
import { toast } from 'sonner';

// Get deleted product IDs from Firebase only - no local storage
export const getDeletedProductIds = async (): Promise<string[]> => {
  try {
    console.log('🔍 Getting deleted products from Firebase only');
    
    // Get IDs from Firestore only
    const deletedSnapshot = await getDocs(collection(db, DELETED_PRODUCTS_COLLECTION));
    const firestoreDeletedIds = deletedSnapshot.docs.map(doc => doc.id);
    
    console.log('Firebase deleted IDs:', firestoreDeletedIds);
    
    return firestoreDeletedIds;
  } catch (error) {
    console.error('Error getting deleted product IDs from Firebase:', error);
    return [];
  }
};

// Store a deleted product ID in Firebase only - no local storage
export const addDeletedProductId = async (productId: string): Promise<void> => {
  try {
    console.log(`🗑️ Adding product ${productId} to Firebase deleted list`);
    
    // Add to Firestore deleted products collection only
    await setDoc(doc(db, DELETED_PRODUCTS_COLLECTION, productId), {
      id: productId,
      deletedAt: new Date().toISOString()
    });
    
    console.log(`Product ${productId} marked as deleted in Firebase`);
  } catch (error) {
    console.error('Error adding product to Firebase deleted list:', error);
    toast.error("Failed to track deleted product");
  }
};

// Clear all deleted products IDs from Firebase only
export const clearAllDeletedProductIds = async (): Promise<void> => {
  try {
    console.log('🧹 Clearing all deleted products from Firebase');
    
    // Clear all documents from the deletedProducts collection
    const deletedSnapshot = await getDocs(collection(db, DELETED_PRODUCTS_COLLECTION));
    
    if (!deletedSnapshot.empty) {
      // Delete each document in the collection
      const deletePromises = deletedSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      console.log(`Cleared ${deletedSnapshot.docs.length} deleted product records from Firebase`);
    }
    
    toast.success("Deleted product tracking has been reset");
  } catch (error) {
    console.error('Error clearing deleted products list from Firebase:', error);
    toast.error("Failed to clear deleted products tracking");
  }
};
