
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { t, formatPrice } = useLocalization();
  
  // Calculate average rating
  const averageRating = product.reviews && product.reviews.length 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
    : 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="rounded-lg overflow-hidden border border-border/50 bg-white shadow-sm hover:shadow-md transition-all"
    >
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full transform transition-transform hover:scale-105 duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <span className="inline-block bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-foreground truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10 mt-1">
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
        
        <div className="mt-4 flex items-center justify-between">
          <Button 
            size="sm" 
            variant="outline"
            className="rounded-full"
            asChild
          >
            <Link to={`/product/${product.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              {t('details')}
            </Link>
          </Button>
          
          <Button 
            size="sm" 
            className="rounded-full"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {t('add')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
