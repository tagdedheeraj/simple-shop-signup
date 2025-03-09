
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 leading-tight">
            Fresh Harvest, <br />
            <span className="text-green-600">From Farm to Table</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Fresh, organic produce sourced directly from farmers.
            Discover the taste of nature with our premium selection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link to="/products" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/categories">
                Explore Categories
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-8 pt-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-green-700">5k+</span>
              <span className="text-muted-foreground">Products</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-green-700">8k+</span>
              <span className="text-muted-foreground">Happy Customers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-green-700">10+</span>
              <span className="text-muted-foreground">Years</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-[400px] rounded-2xl overflow-hidden"
        >
          <img
            src="/lovable-uploads/2a6a68af-beec-4906-b6e9-5eb249505820.png"
            alt="Fresh agricultural products"
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 to-transparent rounded-2xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
