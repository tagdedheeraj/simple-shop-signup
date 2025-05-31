
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageWithTimestamp(imageUrl: string): string {
  // For regular URLs (not data URLs or blob URLs)
  if (
    imageUrl && 
    !imageUrl.startsWith('data:') && 
    !imageUrl.startsWith('blob:') &&
    !imageUrl.startsWith('firebase-storage://') &&
    !imageUrl.startsWith('local-storage://') &&
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
