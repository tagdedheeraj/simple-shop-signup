import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import { Loader2, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getTrendingProducts } from '@/services/product';

const TrendingProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: async () => {
      return getTrendingProducts();
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
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-2 text-sm mb-4">
          <TrendingUp className="h-4 w-4" />
          <span>Trending Now</span>
        </div>
        
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-800 to-amber-600 bg-clip-text text-transparent">
          Trending Products
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our most popular products that customers love. Don't miss out on these trending items!
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
          className="bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white rounded-full shadow-md"
          asChild
        >
          <Link to="/products">
            View All Products <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default TrendingProducts;
