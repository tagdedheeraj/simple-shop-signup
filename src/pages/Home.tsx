
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryGrid from '@/components/home/CategoryGrid';
import PromotionBanner from '@/components/home/PromotionBanner';
import TestimonialSection from '@/components/home/TestimonialSection';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // If not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <Layout>
      <motion.div 
        className="space-y-16 pb-8 md:space-y-24 md:pb-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Hero Banner Section */}
        <motion.div variants={item}>
          <HeroBanner />
        </motion.div>
        
        {/* Category Grid Section */}
        <motion.div variants={item}>
          <CategoryGrid />
        </motion.div>
        
        {/* Featured Products Section */}
        <motion.div variants={item}>
          <FeaturedProducts />
        </motion.div>
        
        {/* Promotion Banner */}
        <motion.div variants={item}>
          <PromotionBanner />
        </motion.div>
        
        {/* Testimonials */}
        <motion.div variants={item}>
          <TestimonialSection />
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Home;
