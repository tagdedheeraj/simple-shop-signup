
export const saveUploadedFile = async (file: File): Promise<string> => {
  console.log('🔧 saveUploadedFile called with:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const fileType = file.type.startsWith('video/') ? 'video' : 'image';
    const filename = `${fileType}-${timestamp}.${extension}`;
    
    console.log('📁 Generated filename:', filename);
    
    // Convert file to base64 for storage
    console.log('🔄 Converting file to base64...');
    const base64 = await fileToBase64(file);
    console.log('✅ File converted to base64, length:', base64.length);
    
    // Store in localStorage with the filename as key
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
    
    // Check localStorage space before saving
    const dataString = JSON.stringify(fileData);
    const sizeInMB = (dataString.length / (1024 * 1024)).toFixed(2);
    console.log('📊 Data size:', sizeInMB, 'MB');
    
    // Check available localStorage space
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
    
    // Return a custom URL that we can recognize later
    const customUrl = `local-storage://${filename}`;
    console.log('🔗 Returning custom URL:', customUrl);
    return customUrl;
    
  } catch (error) {
    console.error('❌ Error in saveUploadedFile:', error);
    throw new Error(`Failed to save uploaded file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getUploadedFileUrl = (localStorageUrl: string): string => {
  try {
    console.log('🔍 Getting file URL for:', localStorageUrl);
    
    if (!localStorageUrl || !localStorageUrl.startsWith('local-storage://')) {
      console.log('ℹ️ Not a local storage URL, returning as-is');
      return localStorageUrl || "/placeholder.svg";
    }
    
    const filename = localStorageUrl.replace('local-storage://', '');
    console.log('📁 Extracted filename:', filename);
    
    // Try both video and image prefixes
    let storedData = localStorage.getItem(`uploaded-video-${filename}`);
    if (!storedData) {
      storedData = localStorage.getItem(`uploaded-image-${filename}`);
    }
    
    if (!storedData) {
      console.error('❌ Uploaded file not found in storage:', filename);
      console.log('Available storage keys:', Object.keys(localStorage).filter(k => k.startsWith('uploaded-')));
      return "/placeholder.svg";
    }
    
    const fileData = JSON.parse(storedData);
    console.log('✅ File data retrieved successfully, returning base64 data');
    return fileData.data; // Return the base64 data URL
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

export const cleanupOldUploadedFiles = () => {
  try {
    console.log('🧹 Cleaning up old uploaded files...');
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('uploaded-image-') || key.startsWith('uploaded-video-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.savedAt && data.savedAt < oneWeekAgo) {
            localStorage.removeItem(key);
            cleanedCount++;
          }
        } catch (error) {
          // Remove corrupted entries
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
