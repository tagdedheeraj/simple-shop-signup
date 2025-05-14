
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductImageProps {
  product: Product;
  price: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ product, price }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [imageKey, setImageKey] = useState<string>(`${product.id}-${Date.now()}`);
  const [imageSrc, setImageSrc] = useState<string>('');
  
  useEffect(() => {
    // Ensure a fresh image URL on each render and component update
    const timestamp = Date.now();
    let url = product.image || '';
    
    // Clean up any existing timestamp
    if (url.includes('?t=')) {
      url = url.split('?t=')[0];
    } else if (url.includes('&t=')) {
      url = url.replace(/&t=\d+/, '');
    }
    
    // Add fresh timestamp
    const separator = url.includes('?') ? '&' : '?';
    const newSrc = `${url}${separator}t=${timestamp}`;
    
    setImageSrc(newSrc);
    setImageKey(`${product.id}-${timestamp}`);
  }, [product.id, product.image]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleImageError = () => {
    console.log('Image failed to load:', imageSrc);
    // Try loading with a new timestamp on error
    setImageKey(`${product.id}-error-${Date.now()}`);
  };
  
  return (
    <div className="aspect-square relative overflow-hidden bg-gray-100">
      <img 
        src={imageSrc} 
        alt={product.name} 
        className="object-cover w-full h-full transform transition-transform hover:scale-105 duration-500"
        loading="lazy"
        key={imageKey}
        onError={handleImageError}
      />
      <div className="absolute top-2 right-2">
        <span className="inline-block bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
          {price}
        </span>
      </div>
      <button 
        onClick={handleWishlistToggle}
        className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <Heart 
          className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
        />
      </button>
    </div>
  );
};

export default ProductImage;
