
import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
  quantity?: number;
  increaseQuantity?: () => void;
  decreaseQuantity?: () => void;
  handleAddToCart?: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  quantity, 
  increaseQuantity, 
  decreaseQuantity, 
  handleAddToCart 
}) => {
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

      {/* Only render quantity controls and add to cart button if props are provided */}
      {quantity !== undefined && increaseQuantity && decreaseQuantity && handleAddToCart && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="font-bold text-2xl text-primary">${product.price.toFixed(2)}</span>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          
          {product.stock <= 0 && (
            <p className="text-sm text-red-500 mt-2">Out of stock</p>
          )}
          
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-sm text-amber-500 mt-2">Only {product.stock} left in stock</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
