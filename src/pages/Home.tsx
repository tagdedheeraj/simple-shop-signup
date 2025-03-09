
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryGrid from '@/components/home/CategoryGrid';
import PromotionBanner from '@/components/home/PromotionBanner';
import TestimonialSection from '@/components/home/TestimonialSection';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // If not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return (
    <Layout>
      <div className="space-y-16 pb-16">
        {/* Hero Banner Section */}
        <HeroBanner />
        
        {/* Featured Products Section */}
        <FeaturedProducts />
        
        {/* Category Grid Section */}
        <CategoryGrid />
        
        {/* Promotion Banner */}
        <PromotionBanner />
        
        {/* Testimonials */}
        <TestimonialSection />
      </div>
    </Layout>
  );
};

export default Home;
