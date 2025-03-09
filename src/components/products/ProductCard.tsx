
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { t, formatPrice } = useLocalization();
  
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
