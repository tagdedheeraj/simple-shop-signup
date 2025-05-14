
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tag, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts, addTimestampToImage } from '@/services/product';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Product } from '@/types/product';

const ProductBanner: React.FC = () => {
  const [imageKeys, setImageKeys] = useState<{[key: string]: string}>({});
  
  // Fetch products with a shorter timeout and disable retry on error
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-banner', Date.now()],
    queryFn: getProducts,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Generate unique keys for images
  useEffect(() => {
    const keys: {[key: string]: string} = {};
    products.forEach(product => {
      keys[product.id] = `${product.id}-${Date.now()}`;
    });
    setImageKeys(keys);
  }, [products]);

  // Get two products to display (preferably wheat and rice products)
  const wheatProduct = products.find(p => p.category === 'wheat');
  const riceProduct = products.find(p => p.category === 'rice');
  
  // Fallback to any products if specific categories not found
  const firstProduct = wheatProduct || products[0];
  const secondProduct = riceProduct || (products.length > 1 ? products[1] : products[0]);

  // Ensuring images have timestamps
  const getImageWithTimestamp = (product: Product | undefined) => {
    if (!product) return "";
    return addTimestampToImage(product.image);
  };

  // Show a minimal loading state instead of a full-height loader
  if (isLoading || !products.length) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-amber-800 to-amber-600 h-[450px] flex items-center">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <motion.div
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-white space-y-6 py-8 z-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Premium Quality<br />Organic Products
              </h1>
              <p className="text-lg opacity-90 font-light max-w-md">
                Discover our premium selection of organic products, freshly harvested and delivered to your doorstep.
              </p>
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
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-amber-800 to-amber-600 h-[450px] flex items-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white space-y-6 py-8 z-10"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
              <Tag className="h-4 w-4" />
              <span className="font-medium">Special Offer</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Premium Quality<br />Organic Products
            </h1>
            
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm py-2 px-4 rounded-lg w-fit">
              <Tag className="h-5 w-5" />
              <span className="text-xl font-bold">20% OFF</span>
              <span className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                Code: <span className="font-bold">ORGANIC20</span>
              </span>
            </div>
            
            <p className="text-lg opacity-90 font-light max-w-md">
              Discover our premium selection of organic products, freshly harvested and delivered to your doorstep. Quality you can trust.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-white text-amber-800 hover:bg-amber-100 rounded-full shadow-md transition-all"
                asChild
              >
                <Link to="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Shop Now 
                  <ArrowRight className="h-5 w-5" />
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
            
            {firstProduct && (
              <Card className="rotate-6 shadow-xl w-80 overflow-hidden border-none">
                <CardContent className="p-0">
                  <AspectRatio ratio={4/3}>
                    <img 
                      src={getImageWithTimestamp(firstProduct)} 
                      alt={firstProduct.name}
                      className="w-full h-full object-cover"
                      key={imageKeys[firstProduct.id] || `${firstProduct.id}-${Date.now()}`}
                      onError={(e) => {
                        console.log('Image error in banner', e);
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                      loading="eager"
                    />
                  </AspectRatio>
                  <div className="p-4 bg-white">
                    <h3 className="font-medium text-lg">{firstProduct.name}</h3>
                    <p className="text-muted-foreground text-sm">{firstProduct.description.slice(0, 40)}...</p>
                    <div className="mt-2 font-bold text-amber-700">${firstProduct.price.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {secondProduct && (
              <Card className="-rotate-6 shadow-xl w-80 absolute -bottom-10 -right-5 overflow-hidden border-none">
                <CardContent className="p-0">
                  <AspectRatio ratio={4/3}>
                    <img 
                      src={getImageWithTimestamp(secondProduct)} 
                      alt={secondProduct.name}
                      className="w-full h-full object-cover"
                      key={imageKeys[secondProduct.id] || `${secondProduct.id}-${Date.now()}`}
                      onError={(e) => {
                        console.log('Image error in banner', e);
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                      loading="eager"
                    />
                  </AspectRatio>
                  <div className="p-4 bg-white">
                    <h3 className="font-medium text-lg">{secondProduct.name}</h3>
                    <p className="text-muted-foreground text-sm">{secondProduct.description.slice(0, 40)}...</p>
                    <div className="mt-2 font-bold text-amber-700">${secondProduct.price.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
            )}
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
