
import { db } from '../index';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { DELETED_PRODUCTS_COLLECTION } from './constants';
import { DELETED_PRODUCTS_KEY } from '@/config/app-config';
import { toast } from 'sonner';

// Get deleted product IDs from both localStorage and Firebase
export const getDeletedProductIds = async (): Promise<string[]> => {
  try {
    // Get IDs from localStorage (legacy approach)
    const deletedIdsJson = localStorage.getItem(DELETED_PRODUCTS_KEY);
    const localDeletedIds = deletedIdsJson ? JSON.parse(deletedIdsJson) : [];
    
    // Get IDs from Firestore
    const deletedSnapshot = await getDocs(collection(db, DELETED_PRODUCTS_COLLECTION));
    const firestoreDeletedIds = deletedSnapshot.docs.map(doc => doc.id);
    
    // Combine both sources
    const allDeletedIds = [...new Set([...localDeletedIds, ...firestoreDeletedIds])];
    
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
    toast.error('Failed to track deleted product');
  }
};
