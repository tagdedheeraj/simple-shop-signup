
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, Leaf, Minus, Plus, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/types/product';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  handleAddToCart: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  quantity,
  increaseQuantity,
  decreaseQuantity,
  handleAddToCart,
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col space-y-6"
    >
      <div>
        <div className="flex gap-2 flex-wrap mb-2">
          <Badge className="bg-green-600 hover:bg-green-700">{product.category}</Badge>
          {product.category === 'vegetable' || product.category === 'fruits' ? (
            <Badge variant="outline" className="border-green-500 text-green-700">
              <Leaf className="h-3 w-3 mr-1" />
              Organic
            </Badge>
          ) : null}
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            <BadgeCheck className="h-3 w-3 mr-1" />
            Quality Tested
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-medium mt-2">${product.price.toFixed(2)}</p>
      </div>
      
      <p className="text-muted-foreground">{product.description}</p>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="rounded-l-md rounded-r-none"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 border-y border-border flex items-center justify-center w-12">
            {quantity}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            className="rounded-r-md rounded-l-none"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {product.stock} available
        </p>
      </div>
      
      <div className="flex gap-3 mt-4">
        <Button 
          size="lg" 
          onClick={handleAddToCart}
          className="flex-1"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
        
        <Button 
          size="lg" 
          variant={isInWishlist(product.id) ? "destructive" : "outline"}
          onClick={handleWishlistToggle}
          className="min-w-[120px]"
        >
          <Heart 
            className={`h-5 w-5 mr-2 ${isInWishlist(product.id) ? 'fill-white' : ''}`} 
          />
          {isInWishlist(product.id) ? 'Remove' : 'Wishlist'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductInfo;
