
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { getRelatedProducts } from '@/services/product';
import ProductCard from './ProductCard';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductById } from '@/services/product';

interface RelatedProductsProps {
  productId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        // First get the current product to know its category
        const currentProduct = await getProductById(productId);
        if (currentProduct) {
          // Then get related products using both productId and category
          const data = await getRelatedProducts(productId, currentProduct.category);
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[150px] flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="flex items-center space-x-2 mb-6">
        <LinkIcon className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Related Products</h2>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  );
};

export default RelatedProducts;
