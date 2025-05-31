
import React, { useState, useEffect } from 'react';
import { getImageWithTimestamp } from '@/lib/utils';
import { getUploadedFileUrl } from '@/utils/file-storage';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  fallback = "/placeholder.svg" 
}) => {
  const [imageUrl, setImageUrl] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        if (!src) {
          setImageUrl(fallback);
          setIsLoading(false);
          return;
        }

        console.log('🖼️ Loading product image:', src);

        // Handle uploaded file URLs (Firebase Storage or local storage)
        if (src.startsWith('firebase-storage://') || src.startsWith('local-storage://')) {
          console.log('📁 Resolving uploaded file URL...');
          const resolvedUrl = await getUploadedFileUrl(src);
          setImageUrl(resolvedUrl);
        } 
        // Handle direct Firebase Storage URLs
        else if (src.startsWith('https://firebasestorage.googleapis.com')) {
          console.log('🔗 Direct Firebase Storage URL');
          setImageUrl(src);
        }
        // Handle regular URLs with timestamp
        else {
          console.log('🌐 Regular URL with timestamp');
          const timestampedUrl = getImageWithTimestamp(src);
          setImageUrl(timestampedUrl);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error loading product image:', error);
        setImageUrl(fallback);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src, fallback]);

  const handleImageError = () => {
    console.warn('⚠️ Product image failed to load:', src);
    setHasError(true);
    setImageUrl(fallback);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    console.log('✅ Product image loaded successfully');
    setIsLoading(false);
    setHasError(false);
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      loading="lazy"
    />
  );
};

export default ProductImage;
