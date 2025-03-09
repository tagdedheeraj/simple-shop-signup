
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/contexts/LocalizationContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroBanner: React.FC = () => {
  const { t } = useLocalization();
  
  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-800 to-green-600 h-[500px] flex items-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white space-y-6 py-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {t('heroTitle') || 'Quality Organic Products for a Healthy Lifestyle'}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {t('heroSubtitle') || 'Discover locally-sourced organic fruits, vegetables, and agricultural products'}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-white text-green-800 hover:bg-green-100"
                asChild
              >
                <Link to="/products">
                  {t('shopNow') || 'Shop Now'} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                {t('learnMore') || 'Learn More'}
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center justify-center"
          >
            <img 
              src="/lovable-uploads/2a6a68af-beec-4906-b6e9-5eb249505820.png"
              alt="Lakshmikrupa"
              className="max-h-80 drop-shadow-2xl"
            />
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

export default HeroBanner;
