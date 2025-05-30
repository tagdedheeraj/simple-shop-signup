
export const saveUploadedFile = async (file: File): Promise<string> => {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `product-${timestamp}.${extension}`;
    
    // Convert file to base64 for storage
    const base64 = await fileToBase64(file);
    
    // Store in localStorage with the filename as key
    const imageData = {
      data: base64,
      type: file.type,
      name: filename,
      savedAt: timestamp
    };
    
    localStorage.setItem(`uploaded-image-${filename}`, JSON.stringify(imageData));
    
    // Return a custom URL that we can recognize later
    return `local-storage://${filename}`;
  } catch (error) {
    console.error('Error saving uploaded file:', error);
    throw new Error('Failed to save uploaded file');
  }
};

export const getUploadedFileUrl = (localStorageUrl: string): string => {
  try {
    if (!localStorageUrl.startsWith('local-storage://')) {
      return localStorageUrl; // Return as-is if not our custom URL
    }
    
    const filename = localStorageUrl.replace('local-storage://', '');
    const storedData = localStorage.getItem(`uploaded-image-${filename}`);
    
    if (!storedData) {
      console.error('Uploaded file not found in storage:', filename);
      return '/placeholder.svg';
    }
    
    const imageData = JSON.parse(storedData);
    return imageData.data; // Return the base64 data URL
  } catch (error) {
    console.error('Error retrieving uploaded file:', error);
    return '/placeholder.svg';
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const cleanupOldUploadedFiles = () => {
  try {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('uploaded-image-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.savedAt && data.savedAt < oneWeekAgo) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Remove corrupted entries
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up old files:', error);
  }
};
