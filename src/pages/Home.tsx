
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Truck, Shield, Award, Zap, Clock } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryGrid from '@/components/home/CategoryGrid';
import PromotionBanner from '@/components/home/PromotionBanner';
import TestimonialSection from '@/components/home/TestimonialSection';

const Home: React.FC = () => {
  const { t } = useLocalization();

  const features = [
    {
      icon: <ShoppingBag className="h-6 w-6 text-green-600" />,
      title: 'Quality Products',
      description: 'Handpicked fresh produce directly from farms'
    },
    {
      icon: <Truck className="h-6 w-6 text-green-600" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your doorstep'
    },
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: 'Secure Payment',
      description: 'Multiple secure payment options available'
    },
    {
      icon: <Award className="h-6 w-6 text-green-600" />,
      title: 'Premium Quality',
      description: 'Only the best quality agricultural products'
    }
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-16"
      >
        {/* Hero Section */}
        <HeroSection />
        
        {/* Category Grid */}
        <CategoryGrid />
        
        {/* Featured Products */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-green-800">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Our best selling premium products</p>
            </div>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/products">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <FeaturedProducts />
        </section>
        
        {/* Promotion Banner */}
        <PromotionBanner />
        
        {/* Why Choose Us */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-green-50 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Testimonials */}
        <TestimonialSection />
        
        {/* CTA Section */}
        <section className="py-16 bg-green-50 rounded-xl">
          <div className="text-center max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Start Shopping Today</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the best agricultural products delivered right to your doorstep
            </p>
            <Button size="lg" asChild>
              <Link to="/products" className="gap-2">
                Shop Now <Zap className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </motion.div>
    </Layout>
  );
};

export default Home;
