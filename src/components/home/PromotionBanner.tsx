
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/contexts/LocalizationContext';
import { ArrowRight, Clock, PercentIcon, ShoppingBag, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const PromotionBanner: React.FC = () => {
  const { t, formatPrice } = useLocalization();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 12, minutes: 45, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const seconds = prev.seconds - 1;
        if (seconds >= 0) return { ...prev, seconds };
        
        const minutes = prev.minutes - 1;
        if (minutes >= 0) return { ...prev, minutes, seconds: 59 };
        
        const hours = prev.hours - 1;
        if (hours >= 0) return { ...prev, hours, minutes: 59, seconds: 59 };
        
        const days = prev.days - 1;
        if (days >= 0) return { days, hours: 23, minutes: 59, seconds: 59 };
        
        clearInterval(timer);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText('ORGANIC20');
    setCopied(true);
    toast({
      title: "Code copied!",
      description: "Discount code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const timeUnit = (value: number, label: string) => (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg p-2 w-16">
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-xs text-white/80">{label}</span>
    </div>
  );

  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Card className="overflow-hidden border-none shadow-xl rounded-2xl">
          <CardContent className="p-0">
            <Tabs defaultValue="vegetables" className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-600 p-8 md:p-12 space-y-6 flex flex-col justify-center relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute top-0 -right-16 w-40 h-40 rounded-full bg-white/5 blur-xl"></div>
                  <div className="absolute bottom-0 -left-20 w-60 h-60 rounded-full bg-white/5 blur-xl"></div>
                  
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                    <Clock className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">{t('limitedTimeOffer') || 'Limited Time Offer'}</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {t('specialDiscountTitle') || 'Special Discount'}
                  </h2>
                  
                  <TabsList className="bg-white/20 backdrop-blur-md border border-white/20 w-fit">
                    <TabsTrigger value="vegetables" className="data-[state=active]:bg-white/20">
                      Vegetables
                    </TabsTrigger>
                    <TabsTrigger value="fruits" className="data-[state=active]:bg-white/20">
                      Fruits
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center space-x-2">
                    {timeUnit(timeLeft.days, "Days")}
                    {timeUnit(timeLeft.hours, "Hours")}
                    {timeUnit(timeLeft.minutes, "Mins")}
                    {timeUnit(timeLeft.seconds, "Secs")}
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="text-3xl font-bold flex items-center bg-white/10 backdrop-blur-sm px-5 py-2 rounded-lg text-white w-fit"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <PercentIcon className="h-6 w-6 mr-2" />
                        <span>20% OFF</span>
                      </motion.div>
                      
                      <div 
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm pl-4 pr-2 py-2 rounded-full cursor-pointer"
                        onClick={copyCode}
                      >
                        <span className="text-sm text-white">
                          {t('useCode') || 'Use Code'}: <span className="font-bold">ORGANIC20</span>
                        </span>
                        <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
                          {copied ? 
                            <Check className="h-3 w-3 text-white" /> : 
                            <Copy className="h-3 w-3 text-white" />
                          }
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="bg-white text-emerald-800 hover:bg-emerald-50 w-fit rounded-full shadow-lg transition-all"
                      asChild
                    >
                      <Link to="/products" className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        {t('shopNow') || 'Shop Now'} 
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="hidden md:block relative h-full min-h-[400px] overflow-hidden">
                  <TabsContent value="vegetables" className="h-full m-0 p-0">
                    <motion.img 
                      src="https://images.unsplash.com/photo-1576021182211-9ea8dced3690?auto=format&fit=crop&q=80&w=1080" 
                      alt="Fresh organic vegetables"
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-emerald-800/30 pointer-events-none"></div>
                    
                    <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg">
                      <h3 className="font-medium text-emerald-800">Seasonal Vegetables</h3>
                      <p className="text-sm text-gray-600 mt-1">Farm-fresh, pesticide-free vegetables with natural goodness</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="line-through text-gray-500 text-sm">{formatPrice(24.99)}</span>
                        <span className="font-bold text-emerald-600">{formatPrice(19.99)}</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="fruits" className="h-full m-0 p-0">
                    <motion.img 
                      src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=1080" 
                      alt="Fresh organic fruits"
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-emerald-800/30 pointer-events-none"></div>
                    
                    <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg">
                      <h3 className="font-medium text-emerald-800">Tropical Fruits</h3>
                      <p className="text-sm text-gray-600 mt-1">Sweet, nutritious fruits - perfect for a healthy lifestyle</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="line-through text-gray-500 text-sm">{formatPrice(29.99)}</span>
                        <span className="font-bold text-emerald-600">{formatPrice(23.99)}</span>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default PromotionBanner;
