
import React, { lazy, Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import ProductBanner from '@/components/home/ProductBanner';
import TrustBadgesSection from '@/components/home/TrustBadgesSection';
import { motion } from 'framer-motion';

// Lazy load lower priority components to speed up initial render
const CategoryGrid = lazy(() => import('@/components/home/CategoryGrid'));
const PromotionBanner = lazy(() => import('@/components/home/PromotionBanner'));
const TestimonialSection = lazy(() => import('@/components/home/TestimonialSection'));
const TrendingProducts = lazy(() => import('@/components/home/TrendingProducts'));
const CustomerStatistics = lazy(() => import('@/components/home/CustomerStatistics'));
const PaymentTrustBadges = lazy(() => import('@/components/home/PaymentTrustBadges'));
const FAQSection = lazy(() => import('@/components/home/FAQSection'));

// Loading fallback for lazy-loaded components
const LazyLoadingFallback = () => (
  <div className="w-full py-8 flex justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

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
        {/* Product Banner Section - Render immediately (high priority) */}
        <motion.div variants={item}>
          <ProductBanner />
        </motion.div>
        
        {/* Trust Badges Section - Render immediately (high priority) */}
        <motion.div variants={item}>
          <TrustBadgesSection />
        </motion.div>
        
        {/* Remaining sections - Lazy loaded to improve initial render performance */}
        <Suspense fallback={<LazyLoadingFallback />}>
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
        </Suspense>
      </motion.div>
    </Layout>
  );
};

export default Home;
