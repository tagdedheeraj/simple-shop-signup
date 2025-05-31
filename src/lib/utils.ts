
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getUploadedFileUrl } from '@/utils/file-storage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageWithTimestamp(imageUrl: string): string {
  // Handle local storage URLs by converting them to displayable format
  if (imageUrl && imageUrl.startsWith('local-storage://')) {
    const displayUrl = getUploadedFileUrl(imageUrl);
    console.log('Converting local storage URL in utils:', imageUrl, 'to:', displayUrl);
    return displayUrl;
  }
  
  // For regular URLs (not data URLs or blob URLs)
  if (
    imageUrl && 
    !imageUrl.startsWith('data:') && 
    !imageUrl.startsWith('blob:') &&
    imageUrl.trim() !== ''
  ) {
    const timestamp = Date.now();
    
    // Clean existing timestamp
    let cleanUrl = imageUrl;
    if (imageUrl.includes('?t=')) {
      cleanUrl = imageUrl.split('?t=')[0];
    } else if (imageUrl.includes('&t=')) {
      cleanUrl = imageUrl.replace(/&t=\d+/, '');
    }
    
    // Add fresh timestamp
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}t=${timestamp}`;
  }
  
  return imageUrl || "/placeholder.svg";
}
