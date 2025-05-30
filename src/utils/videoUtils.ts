
export const convertGoogleDriveUrl = (url: string): string => {
  console.log('🔄 Converting Google Drive URL:', url);
  
  // Don't modify if empty
  if (!url || url.trim() === '') {
    return url;
  }
  
  // Handle different Google Drive URL formats
  let fileId = '';
  
  // Format 1: https://drive.google.com/file/d/FILE_ID/view
  let match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    fileId = match[1];
  }
  
  // Format 2: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    match = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (match) {
      fileId = match[1];
    }
  }
  
  // Format 3: https://docs.google.com/file/d/FILE_ID/edit
  if (!fileId) {
    match = url.match(/docs\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      fileId = match[1];
    }
  }
  
  if (fileId) {
    // Use optimized embed URL with performance parameters
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview?usp=sharing&modestbranding=1`;
    console.log('✅ Converted to optimized embed URL:', embedUrl);
    return embedUrl;
  }
  
  console.log('⚠️ Could not extract file ID, returning original URL');
  return url;
};

export const getGoogleDriveThumbnail = (url: string): string => {
  const fileId = extractFileId(url);
  if (fileId) {
    // Generate thumbnail URL from Google Drive
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`;
  }
  return '';
};

export const extractFileId = (url: string): string => {
  if (!url) return '';
  
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    /[?&]id=([a-zA-Z0-9-_]+)/,
    /docs\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return '';
};

export const validateGoogleDriveUrl = (url: string): boolean => {
  // Allow empty URLs during typing
  if (!url || url.trim() === '') {
    return true;
  }
  
  const patterns = [
    /drive\.google\.com\/file\/d\/[a-zA-Z0-9-_]+/,
    /drive\.google\.com\/open\?id=[a-zA-Z0-9-_]+/,
    /docs\.google\.com\/file\/d\/[a-zA-Z0-9-_]+/
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

// Cache video metadata for better performance
export const cacheVideoMetadata = (videoId: string, metadata: any) => {
  try {
    const cache = JSON.parse(localStorage.getItem('video-cache') || '{}');
    cache[videoId] = {
      ...metadata,
      cached_at: Date.now()
    };
    localStorage.setItem('video-cache', JSON.stringify(cache));
    console.log('📦 Cached metadata for video:', videoId);
  } catch (error) {
    console.warn('Failed to cache video metadata:', error);
  }
};

export const getCachedVideoMetadata = (videoId: string) => {
  try {
    const cache = JSON.parse(localStorage.getItem('video-cache') || '{}');
    const cached = cache[videoId];
    
    if (cached) {
      // Check if cache is less than 24 hours old
      const isValid = (Date.now() - cached.cached_at) < 24 * 60 * 60 * 1000;
      if (isValid) {
        console.log('💾 Using cached metadata for video:', videoId);
        return cached;
      }
    }
  } catch (error) {
    console.warn('Failed to get cached video metadata:', error);
  }
  return null;
};

export const preloadVideo = (embedUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.style.display = 'none';
    iframe.onload = () => {
      console.log('🚀 Video preloaded successfully');
      document.body.removeChild(iframe);
      resolve(true);
    };
    iframe.onerror = () => {
      console.warn('❌ Video preload failed');
      document.body.removeChild(iframe);
      resolve(false);
    };
    document.body.appendChild(iframe);
  });
};
