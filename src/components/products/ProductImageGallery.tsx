
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProductImageGalleryProps {
  productId: string;
  image: string;
  name: string;
  category: string;
  isOrganic: boolean;
  handleShareProduct: () => void;
  socialShareLinks: {
    facebook: string;
    twitter: string;
    whatsapp: string;
  };
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  productId,
  image,
  name,
  category,
  isOrganic,
  handleShareProduct,
  socialShareLinks
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = () => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      // We need the product object here, but we only pass the ID
      // In a real app, we might need to fetch the product or pass the whole product
      const { products } = require('@/services/product/data');
      const product = products.find((p: any) => p.id === productId);
      if (product) {
        addToWishlist(product);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg overflow-hidden bg-white shadow-md relative"
    >
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          <BadgeCheck className="h-3.5 w-3.5 mr-1" />
          Verified Product
        </Badge>
      </div>
      
      <img 
        src={image} 
        alt={name} 
        className="w-full h-auto object-cover aspect-square"
      />

      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={handleWishlistToggle}
          className="bg-white/90 rounded-full shadow-md hover:bg-white"
        >
          <Heart 
            className={`h-5 w-5 ${isInWishlist(productId) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 rounded-full shadow-md hover:bg-white"
            >
              <Share className="h-5 w-5 text-gray-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <h4 className="font-medium mb-2">Share this product</h4>
            <div className="flex gap-2 mb-3">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => window.open(socialShareLinks.facebook, '_blank')}
              >
                Facebook
              </Button>
              <Button
                size="sm"
                variant="outline" 
                className="flex-1"
                onClick={() => window.open(socialShareLinks.twitter, '_blank')}
              >
                Twitter
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => window.open(socialShareLinks.whatsapp, '_blank')}
              >
                WhatsApp
              </Button>
            </div>
            <div className="pt-2 border-t">
              <Button 
                variant="default" 
                className="w-full"
                onClick={handleShareProduct}
              >
                <Share className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </motion.div>
  );
};

export default ProductImageGallery;
