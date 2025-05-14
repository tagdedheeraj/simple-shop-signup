
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { useLocalization } from '@/contexts/LocalizationContext';
import { motion } from 'framer-motion';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import ProductActions from './ProductActions';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice } = useLocalization();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="rounded-lg overflow-hidden border border-border/50 bg-white shadow-sm hover:shadow-md transition-all"
    >
      <Link to={`/product/${product.id}`} className="block">
        <ProductImage 
          product={product}
          price={formatPrice(product.price)} 
        />
        <ProductInfo product={product} />
      </Link>
      
      <ProductActions product={product} />
    </motion.div>
  );
};

export default ProductCard;
