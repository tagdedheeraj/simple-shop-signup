import { db, storage } from '@/services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const saveUploadedFile = async (file: File): Promise<string> => {
  console.log('🔧 saveUploadedFile called with:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  try {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const fileType = file.type.startsWith('video/') ? 'video' : 'image';
    const filename = `${fileType}-${timestamp}.${extension}`;
    
    console.log('📁 Generated filename:', filename);
    
    // First try Firebase Storage
    try {
      console.log('🔄 Uploading to Firebase Storage...');
      const storageRef = ref(storage, `uploads/${filename}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      console.log('✅ File uploaded to Firebase Storage successfully');
      console.log('🔗 Download URL:', downloadUrl);
      
      // Save metadata to Firestore
      const fileData = {
        url: downloadUrl,
        type: file.type,
        name: filename,
        originalName: file.name,
        savedAt: timestamp,
        size: file.size,
        storagePath: `uploads/${filename}`
      };
      
      const storageKey = `uploaded-${fileType}-${filename}`;
      await setDoc(doc(db, 'uploaded-files', storageKey), fileData);
      
      return downloadUrl; // Return the actual Firebase Storage URL
      
    } catch (firebaseError) {
      console.warn('⚠️ Firebase Storage failed, using localStorage fallback:', firebaseError);
      
      // Fallback to localStorage with base64
      console.log('🔄 Converting file to base64...');
      const base64 = await fileToBase64(file);
      console.log('✅ File converted to base64, length:', base64.length);
      
      const fileData = {
        data: base64,
        type: file.type,
        name: filename,
        originalName: file.name,
        savedAt: timestamp,
        size: file.size
      };
      
      const storageKey = `uploaded-${fileType}-${filename}`;
      console.log('💾 Storing file with key:', storageKey);
      
      // Save to Firestore
      try {
        await setDoc(doc(db, 'uploaded-files', storageKey), fileData);
        console.log('✅ File saved to Firestore successfully');
      } catch (firestoreError) {
        console.warn('⚠️ Firestore storage failed, using localStorage fallback:', firestoreError);
        
        // Final fallback to localStorage
        const dataString = JSON.stringify(fileData);
        const sizeInMB = (dataString.length / (1024 * 1024)).toFixed(2);
        console.log('📊 Data size:', sizeInMB, 'MB');
        
        try {
          localStorage.setItem(storageKey, dataString);
          console.log('✅ File saved to localStorage successfully');
        } catch (storageError) {
          console.error('❌ localStorage error:', storageError);
          if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
            throw new Error('Storage quota exceeded. Please delete some old files first.');
          }
          throw storageError;
        }
      }
      
      const customUrl = `firebase-storage://${filename}`;
      console.log('🔗 Returning custom URL:', customUrl);
      return customUrl;
    }
    
  } catch (error) {
    console.error('❌ Error in saveUploadedFile:', error);
    throw new Error(`Failed to save uploaded file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getUploadedFileUrl = async (storageUrl: string): Promise<string> => {
  try {
    console.log('🔍 Getting file URL for:', storageUrl);
    
    if (!storageUrl || (!storageUrl.startsWith('firebase-storage://') && !storageUrl.startsWith('local-storage://') && !storageUrl.startsWith('https://'))) {
      console.log('ℹ️ Not a storage URL, returning as-is');
      return storageUrl || "/placeholder.svg";
    }
    
    // If it's already a direct Firebase Storage URL, return it
    if (storageUrl.startsWith('https://firebasestorage.googleapis.com')) {
      console.log('✅ Direct Firebase Storage URL, returning as-is');
      return storageUrl;
    }
    
    let filename = '';
    if (storageUrl.startsWith('firebase-storage://')) {
      filename = storageUrl.replace('firebase-storage://', '');
    } else if (storageUrl.startsWith('local-storage://')) {
      filename = storageUrl.replace('local-storage://', '');
    }
    
    console.log('📁 Extracted filename:', filename);
    
    // Try Firebase/Firestore first
    try {
      const fileDoc = await getDoc(doc(db, 'uploaded-files', `uploaded-video-${filename}`));
      if (fileDoc.exists()) {
        const fileData = fileDoc.data();
        console.log('✅ File data retrieved from Firestore');
        // Check if it has a direct URL (Firebase Storage)
        if (fileData.url) {
          return fileData.url;
        }
        // Otherwise return base64 data
        return fileData.data;
      }
      
      const imageDoc = await getDoc(doc(db, 'uploaded-files', `uploaded-image-${filename}`));
      if (imageDoc.exists()) {
        const fileData = imageDoc.data();
        console.log('✅ File data retrieved from Firestore');
        // Check if it has a direct URL (Firebase Storage)
        if (fileData.url) {
          return fileData.url;
        }
        // Otherwise return base64 data
        return fileData.data;
      }
    } catch (firebaseError) {
      console.warn('⚠️ Firebase retrieval failed, trying localStorage:', firebaseError);
    }
    
    // Fallback to localStorage
    let storedData = localStorage.getItem(`uploaded-video-${filename}`);
    if (!storedData) {
      storedData = localStorage.getItem(`uploaded-image-${filename}`);
    }
    
    if (!storedData) {
      console.error('❌ Uploaded file not found in storage:', filename);
      return "/placeholder.svg";
    }
    
    const fileData = JSON.parse(storedData);
    console.log('✅ File data retrieved from localStorage');
    return fileData.data;
  } catch (error) {
    console.error('❌ Error retrieving uploaded file:', error);
    return "/placeholder.svg";
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Converting file to base64...');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log('✅ File conversion completed');
      resolve(reader.result as string);
    };
    reader.onerror = error => {
      console.error('❌ File conversion failed:', error);
      reject(error);
    };
  });
};

export const cleanupOldUploadedFiles = async () => {
  try {
    console.log('🧹 Cleaning up old uploaded files...');
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    // Clean localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('uploaded-image-') || key.startsWith('uploaded-video-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.savedAt && data.savedAt < oneWeekAgo) {
            localStorage.removeItem(key);
            cleanedCount++;
          }
        } catch (error) {
          localStorage.removeItem(key);
          cleanedCount++;
        }
      }
    });
    
    console.log(`✅ Cleanup completed. Removed ${cleanedCount} old files`);
  } catch (error) {
    console.error('❌ Error cleaning up old files:', error);
  }
};
