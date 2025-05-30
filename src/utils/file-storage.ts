
export const saveUploadedFile = async (file: File): Promise<string> => {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'mp4';
    const filename = `${file.type.startsWith('video/') ? 'video' : 'image'}-${timestamp}.${extension}`;
    
    // Convert file to base64 for storage
    const base64 = await fileToBase64(file);
    
    // Store in localStorage with the filename as key
    const fileData = {
      data: base64,
      type: file.type,
      name: filename,
      originalName: file.name,
      savedAt: timestamp,
      size: file.size
    };
    
    const storageKey = `uploaded-${file.type.startsWith('video/') ? 'video' : 'image'}-${filename}`;
    localStorage.setItem(storageKey, JSON.stringify(fileData));
    
    console.log(`File saved to localStorage with key: ${storageKey}`);
    
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
    
    // Try both video and image prefixes
    let storedData = localStorage.getItem(`uploaded-video-${filename}`);
    if (!storedData) {
      storedData = localStorage.getItem(`uploaded-image-${filename}`);
    }
    
    if (!storedData) {
      console.error('Uploaded file not found in storage:', filename);
      return '/placeholder.svg';
    }
    
    const fileData = JSON.parse(storedData);
    return fileData.data; // Return the base64 data URL
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
      if (key.startsWith('uploaded-image-') || key.startsWith('uploaded-video-')) {
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
