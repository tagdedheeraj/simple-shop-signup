
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
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    console.log('✅ Converted to embed URL:', embedUrl);
    return embedUrl;
  }
  
  console.log('⚠️ Could not extract file ID, returning original URL');
  return url;
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
