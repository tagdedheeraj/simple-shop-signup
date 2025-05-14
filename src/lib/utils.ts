
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to force browser to reload images by appending a timestamp query parameter
export function getImageWithTimestamp(imageUrl: string): string {
  // Only add timestamp to URLs that don't already have query parameters
  // and are not data URLs or blob URLs
  if (
    imageUrl && 
    !imageUrl.includes('?') && 
    !imageUrl.startsWith('data:') && 
    !imageUrl.startsWith('blob:')
  ) {
    return `${imageUrl}?t=${Date.now()}`;
  }
  return imageUrl;
}
