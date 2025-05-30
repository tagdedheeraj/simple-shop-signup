
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import { Loader2, ArrowRight, TrendingUp, Star, Zap } from 'lucide-react';
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
      <div className="flex justify-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-amber-600 animate-spin" />
          <p className="text-gray-600 animate-pulse">Loading trending products...</p>
        </div>
      </div>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-12"
      >
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full px-6 py-3 text-sm font-medium mb-6 shadow-sm border border-amber-200"
        >
          <TrendingUp className="h-5 w-5 animate-bounce" />
          <span className="font-semibold">🔥 Hot Trending</span>
          <Zap className="h-4 w-4 text-orange-600" />
        </motion.div>
        
        <motion.h2 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-900 via-amber-700 to-orange-700 bg-clip-text text-transparent leading-tight"
        >
          Most Popular Products
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Discover what our customers love most! These hand-picked products are flying off our shelves. 
          <span className="text-amber-700 font-medium"> Don't miss out on these amazing deals!</span>
        </motion.p>

        {/* Enhanced Stats */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 mt-8 mb-2"
        >
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-amber-100">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">4.9★ Rated</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-green-100">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">1000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-blue-100">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Top Quality</span>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-3xl -rotate-1 transform scale-105 opacity-50"></div>
        <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          {products && <ProductGrid products={products} />}
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 hover:from-amber-800 hover:via-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold group"
            asChild
          >
            <Link to="/products">
              <span className="mr-2">Explore All Products</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </motion.div>
        
        <motion.p 
          variants={itemVariants}
          className="text-sm text-gray-500 mt-4"
        >
          ✨ Free shipping on orders above ₹500 | 🚚 Fast delivery across India
        </motion.p>
      </motion.div>
    </section>
  );
};

export default TrendingProducts;
