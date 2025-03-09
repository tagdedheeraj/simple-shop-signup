
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/contexts/LocalizationContext';
import { ArrowRight, Clock, PercentIcon, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromotionBanner: React.FC = () => {
  const { t, formatPrice } = useLocalization();
  
  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Card className="overflow-hidden border-none shadow-lg rounded-2xl">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gradient-to-tr from-green-900 via-green-700 to-green-600 p-8 md:p-12 space-y-5 flex flex-col justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center w-fit">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium text-white">{t('limitedTimeOffer') || 'Limited Time Offer'}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {t('specialDiscountTitle') || 'Special Discount on Organic Produce'}
                </h2>
                
                <p className="text-white/90">
                  {t('specialDiscountDescription') || 'Get 20% off on all organic vegetables and fruits. Fresh from the farm to your table!'}
                </p>
                
                <div className="flex items-center space-x-4 pt-2">
                  <motion.div 
                    className="text-3xl font-bold flex items-center text-white"
                    whileHover={{ scale: 1.05 }}
                  >
                    <PercentIcon className="h-6 w-6 mr-2" />
                    <span>20% OFF</span>
                  </motion.div>
                  
                  <div className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white">
                    {t('useCode') || 'Use Code'}: <span className="font-bold">ORGANIC20</span>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-white text-green-800 hover:bg-green-100 w-fit mt-2 rounded-full shadow-md"
                  asChild
                >
                  <Link to="/products" className="flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {t('shopNow') || 'Shop Now'} 
                  </Link>
                </Button>
              </div>
              
              <div className="hidden md:block relative h-full min-h-[300px] overflow-hidden">
                <motion.img 
                  src="https://images.unsplash.com/photo-1576021182211-9ea8dced3690?auto=format&fit=crop&q=80&w=1080" 
                  alt="Fresh organic vegetables"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-green-900/20 pointer-events-none"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default PromotionBanner;
