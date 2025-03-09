
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const PromotionBanner: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-800 to-green-600 text-white"
    >
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFFFFF" d="M34.2,-47.3C45.9,-35.6,58.2,-28.2,62.7,-17.4C67.2,-6.7,63.9,7.4,59.3,23.2C54.8,39,48.8,56.4,37.3,63.3C25.8,70.2,8.9,66.7,-3.2,70.7C-15.3,74.7,-22.8,86.3,-34.9,85.6C-47,84.9,-63.6,71.8,-70.2,55.8C-76.8,39.8,-73.3,20.9,-69.9,5.2C-66.5,-10.6,-63.4,-22.2,-56.6,-32.5C-49.9,-42.8,-39.5,-51.9,-28.2,-63.6C-16.8,-75.3,-4.2,-89.5,4.1,-94.9C12.4,-100.4,22.5,-96.9,34.2,-89.1C46,-81.3,59.4,-69.1,70.6,-55.6C81.8,-42.1,90.8,-27.4,89.8,-13.2C88.9,1,78.1,14.7,70.2,27.5C62.3,40.4,57.3,52.3,47.6,65.1C37.9,77.8,23.7,91.4,9.1,93.2C-5.5,95,-20.4,84.9,-34.7,76.6C-48.9,68.3,-62.6,61.8,-69.8,50.7C-77,39.6,-77.7,23.8,-79.2,8.1C-80.6,-7.5,-82.8,-23.1,-76.9,-35.8C-71.1,-48.5,-57.1,-58.4,-42.7,-70.1C-28.3,-81.8,-13.4,-95.4,0.2,-95.7C13.8,-96,27.6,-83,34.2,-68.2C40.8,-53.4,40.4,-36.7,39.4,-22.2C38.4,-7.8,37,-2.8,41.4,5.8C45.7,14.4,55.9,26.5,58.2,39.5C60.5,52.5,54.9,66.3,44.7,76.9C34.5,87.5,19.7,94.8,4.2,89.7C-11.3,84.6,-27.5,67,-39,51.4C-50.5,35.8,-57.3,22.3,-59,7.5C-60.7,-7.3,-57.4,-23.5,-49.7,-38.7C-42,-53.9,-30,-68.3,-16.6,-70.9C-3.3,-73.5,11.5,-64.5,25.3,-56.8C39.2,-49.1,52.2,-42.9,63.2,-32.2C74.2,-21.5,83.3,-6.4,89.1,11.4C94.9,29.2,97.4,49.6,87.6,62.3C77.7,75,55.4,79.9,36.7,77.8C18,75.8,3,66.8,-10.7,58.3C-24.4,49.7,-36.7,41.7,-42.6,30.2C-48.5,18.8,-48,4,-51.9,-13.8C-55.8,-31.6,-64.1,-52.4,-59.3,-70.5C-54.4,-88.5,-36.5,-103.8,-16.9,-110.2C2.7,-116.6,24,-114.2,39.3,-102.1C54.7,-90.1,64,-68.5,66.3,-49.2C68.7,-29.9,64,-12.7,59.1,2.1C54.2,16.9,49,29.2,42.1,45.9C35.2,62.5,26.6,83.5,11.8,93.9C-3,104.3,-24,104.2,-34.5,92.2C-45,80.2,-45,56.4,-45.7,37.4C-46.5,18.4,-48,4.3,-49,-9.3C-50,-23,-50.5,-36.3,-44.8,-53.1C-39.1,-69.9,-27.2,-90.3,-10.2,-102.4C6.9,-114.4,29.1,-118.1,46.4,-109.8C63.7,-101.5,76.2,-81.2,92.8,-63.1Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center relative z-10">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Limited Time Offer</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Get 20% Off On Your First Order
          </h2>
          <p className="text-white/80">
            Sign up today and receive a special discount on your first purchase. Fresh farm products at the best prices.
          </p>
          <div className="pt-4">
            <Button asChild variant="secondary" size="lg">
              <Link to="/products">
                Shop Now
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="hidden md:block relative h-64">
          <img 
            src="https://images.unsplash.com/photo-1595665593673-bf1ad72905c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Fresh harvest" 
            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default PromotionBanner;
