
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import { Loader2, ArrowRight, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts } from '@/services/productService';

const FeaturedProducts: React.FC = () => {
  const { t } = useLocalization();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const allProducts = await getProducts();
      // Filter to show only featured products, or just take the first 5 products
      return allProducts.slice(0, 5);
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }
  
  return (
    <section className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-2 text-sm mb-4">
          <BadgeCheck className="h-4 w-4" />
          <span>{t('handpicked') || 'Handpicked Selection'}</span>
        </div>
        
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-800 to-teal-600 bg-clip-text text-transparent">
          {t('featuredProducts') || 'Featured Products'}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('featuredProductsDescription') || 'Discover our selection of high-quality organic products, freshly harvested and ready for your table.'}
        </p>
      </motion.div>
      
      {products && <ProductGrid products={products} />}
      
      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white rounded-full shadow-md"
          asChild
        >
          <Link to="/products">
            {t('viewAllProducts') || 'View All Products'} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;
