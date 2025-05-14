
import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductImageProps {
  product: Product;
  price: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ product, price }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  // Ensure image has a timestamp parameter to prevent caching
  const ensureTimestamp = (url: string) => {
    if (!url) return "";
    const timestamp = Date.now();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${timestamp}`;
  };

  // Always use the image with a timestamp to prevent caching issues
  const imageUrl = ensureTimestamp(product.image);
  
  return (
    <div className="aspect-square relative overflow-hidden">
      <img 
        src={imageUrl} 
        alt={product.name} 
        className="object-cover w-full h-full transform transition-transform hover:scale-105 duration-500"
        loading="lazy"
        key={product.id + Date.now()} // Force re-render of image when component updates
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
