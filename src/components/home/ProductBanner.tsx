
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductBanner: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-amber-700 to-amber-500 h-[450px] flex items-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white space-y-6 py-8 z-10"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Special Offer</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Premium Quality Organic Products
            </h1>
            
            <div className="flex items-center space-x-3">
              <Tag className="h-5 w-5" />
              <span className="text-xl font-bold">20% OFF</span>
              <span className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                Use Code: <span className="font-bold">ORGANIC20</span>
              </span>
            </div>
            
            <p className="text-lg opacity-90 font-light">
              Discover our premium selection of organic products, freshly harvested and delivered to your doorstep.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-white text-amber-800 hover:bg-amber-100 rounded-full"
                asChild
              >
                <Link to="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:flex items-center justify-center relative"
          >
            {/* Decorative elements */}
            <div className="absolute w-64 h-64 rounded-full bg-white/10 top-10 right-10"></div>
            <div className="absolute w-40 h-40 rounded-full bg-white/5 bottom-10 left-10"></div>
            
            <Card className="rotate-6 shadow-xl w-80 overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Premium Whole Wheat Flour"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg">Premium Whole Wheat Flour</h3>
                  <p className="text-muted-foreground text-sm">Organic stone-ground wheat flour</p>
                  <div className="mt-2 font-bold text-amber-600">$5.99</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="-rotate-6 shadow-xl w-80 absolute -bottom-10 -right-5 overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1594385158317-3a8d922c1711?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Basmati Rice"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg">Basmati Rice</h3>
                  <p className="text-muted-foreground text-sm">Premium long-grain aromatic rice</p>
                  <div className="mt-2 font-bold text-amber-600">$8.99</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Wave shape divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default ProductBanner;
