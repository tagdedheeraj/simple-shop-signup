
import React from 'react';
import Layout from '@/components/layout/Layout';
import CategoryGrid from '@/components/home/CategoryGrid';
import PromotionBanner from '@/components/home/PromotionBanner';
import TestimonialSection from '@/components/home/TestimonialSection';
import ProductBanner from '@/components/home/ProductBanner';
import TrendingProducts from '@/components/home/TrendingProducts';
import TrustBadgesSection from '@/components/home/TrustBadgesSection';
import CustomerStatistics from '@/components/home/CustomerStatistics';
import PaymentTrustBadges from '@/components/home/PaymentTrustBadges';
import FAQSection from '@/components/home/FAQSection';
import ProcessingVideos from '@/components/home/ProcessingVideos';
import HighSellingProducts from '@/components/home/HighSellingProducts';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
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
        className="space-y-12 pb-8 md:space-y-20 md:pb-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Product Banner Section */}
        <motion.div variants={item}>
          <ProductBanner />
        </motion.div>
        
        {/* Trust Badges Section */}
        <motion.div variants={item}>
          <TrustBadgesSection />
        </motion.div>
        
        {/* High Selling Products Section - NEW */}
        <motion.div variants={item}>
          <HighSellingProducts />
        </motion.div>
        
        {/* Processing Videos Section */}
        <motion.div variants={item}>
          <ProcessingVideos />
        </motion.div>
        
        {/* Trending Products Section */}
        <motion.div variants={item}>
          <TrendingProducts />
        </motion.div>
        
        {/* Customer Statistics */}
        <motion.div variants={item}>
          <CustomerStatistics />
        </motion.div>
        
        {/* Category Grid Section */}
        <motion.div variants={item}>
          <CategoryGrid />
        </motion.div>
        
        {/* Promotion Banner */}
        <motion.div variants={item}>
          <PromotionBanner />
        </motion.div>
        
        {/* Testimonials */}
        <motion.div variants={item}>
          <TestimonialSection />
        </motion.div>
        
        {/* FAQ Section */}
        <motion.div variants={item}>
          <FAQSection />
        </motion.div>
        
        {/* Payment Trust Badges */}
        <motion.div variants={item}>
          <PaymentTrustBadges />
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Home;
