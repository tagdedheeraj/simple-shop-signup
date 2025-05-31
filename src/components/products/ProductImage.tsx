
import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { useWishlist } from '@/contexts/WishlistContext';
import { getUploadedFileUrl } from '@/utils/file-storage';

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
  
  // Enhanced image URL processing for uploaded files
  const getImageUrl = () => {
    if (!product.image) {
      return "/placeholder.svg";
    }

    // For uploaded files (local-storage URLs), convert to displayable format
    if (product.image.startsWith('local-storage://')) {
      const displayUrl = getUploadedFileUrl(product.image);
      console.log('Converting local storage URL:', product.image, 'to:', displayUrl);
      return displayUrl;
    }

    // For regular URLs, return as-is
    return product.image;
  };
  
  return (
    <div className="aspect-square relative overflow-hidden">
      <img 
        src={getImageUrl()} 
        alt={product.name} 
        className="object-cover w-full h-full transform transition-transform hover:scale-105 duration-500"
        loading="lazy"
        onError={(e) => {
          console.error('Image load error for product:', product.name, 'URL:', getImageUrl());
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
        onLoad={() => {
          console.log('Image loaded successfully for product:', product.name, 'URL:', getImageUrl());
        }}
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
