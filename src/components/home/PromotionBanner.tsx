
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/contexts/LocalizationContext';
import { ArrowRight, Clock, PercentIcon } from 'lucide-react';
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
        <Card className="overflow-hidden bg-gradient-to-r from-green-800 to-green-600 text-white border-none">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 space-y-4 flex flex-col justify-center">
                <div className="bg-white/20 rounded-full px-4 py-2 flex items-center w-fit">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{t('limitedTimeOffer') || 'Limited Time Offer'}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  {t('specialDiscountTitle') || 'Special Discount on Organic Produce'}
                </h2>
                
                <p className="text-white/80">
                  {t('specialDiscountDescription') || 'Get 20% off on all organic vegetables and fruits. Fresh from the farm to your table!'}
                </p>
                
                <div className="flex items-center space-x-4 pt-4">
                  <div className="text-3xl font-bold flex items-center">
                    <PercentIcon className="h-6 w-6 mr-2" />
                    <span>20% OFF</span>
                  </div>
                  
                  <div className="text-sm bg-white/20 rounded px-3 py-1">
                    {t('useCode') || 'Use Code'}: <span className="font-bold">ORGANIC20</span>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-white text-green-800 hover:bg-green-100 w-fit mt-4"
                  asChild
                >
                  <Link to="/products">
                    {t('shopNow') || 'Shop Now'} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="hidden md:block relative h-full min-h-[300px]">
                <img 
                  src="https://images.unsplash.com/photo-1576021182211-9ea8dced3690?auto=format&fit=crop&q=80&w=1080" 
                  alt="Fresh organic vegetables"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default PromotionBanner;
