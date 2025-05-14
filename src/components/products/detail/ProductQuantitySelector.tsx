
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductQuantitySelectorProps {
  product: Product;
  quantity: number;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  handleAddToCart: () => void;
}

const ProductQuantitySelector: React.FC<ProductQuantitySelectorProps> = ({
  product,
  quantity,
  increaseQuantity,
  decreaseQuantity,
  handleAddToCart
}) => {
  return (
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
  );
};

export default ProductQuantitySelector;
