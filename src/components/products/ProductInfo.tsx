
import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  // Calculate average rating
  const averageRating = product.reviews && product.reviews.length 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
    : 0;
    
  return (
    <div className="p-4">
      <h3 className="font-medium text-foreground truncate hover:text-primary transition-colors">{product.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 h-10 mt-1 hover:text-foreground transition-colors">
        {product.description}
      </p>
      
      {/* Display rating if available */}
      {averageRating > 0 && (
        <div className="flex items-center mt-2">
          <Star className={`h-4 w-4 ${averageRating > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          <span className="text-sm ml-1 text-muted-foreground">
            {averageRating.toFixed(1)}
            <span className="ml-1">
              ({product.reviews?.length || 0})
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
