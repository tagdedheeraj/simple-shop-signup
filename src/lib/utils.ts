
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getGlobalTimestamp } from '@/utils/version-checker';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to force browser to reload images by appending a timestamp query parameter
export function getImageWithTimestamp(imageUrl: string): string {
  // Only add timestamp to URLs that don't already have query parameters
  // and are not data URLs or blob URLs
  if (
    imageUrl && 
    !imageUrl.startsWith('data:') && 
    !imageUrl.startsWith('blob:')
  ) {
    // Get the global timestamp for this session
    const timestamp = getGlobalTimestamp();
    
    // Remove any existing timestamp parameter if present
    let cleanUrl = imageUrl;
    if (imageUrl.includes('?t=')) {
      cleanUrl = imageUrl.split('?t=')[0];
    } else if (imageUrl.includes('&t=')) {
      cleanUrl = imageUrl.replace(/&t=\d+/, '');
    }
    
    // Add timestamp parameter
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}t=${timestamp}`;
  }
  return imageUrl;
}
