
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Sparkles, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { getProducts } from '@/services/product';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import ProductImage from '@/components/products/ProductImage';

const HighSellingProducts: React.FC = () => {
  const { formatPrice } = useLocalization();
  const { addToCart } = useCart();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['highSellingProducts'],
    queryFn: async () => {
      const allProducts = await getProducts();
      // Get first 2 products for demo
      return allProducts.slice(0, 2);
    }
  });

  const handleAddToCart = (product: any) => {
    try {
      console.log('Adding product to cart from HighSellingProducts:', product);
      addToCart(product, 1);
      toast.success(`${product.name} added to cart successfully!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  if (isLoading || !products) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">🏆</div>
        <div className="absolute bottom-10 right-10 text-4xl">⭐</div>
        <div className="absolute top-1/2 left-1/4 text-3xl">🔥</div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              🏆
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Best Selling Products
            </h2>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              ⭐
            </motion.div>
          </div>
          
          <p className="text-xl text-gray-700 mb-4 max-w-2xl mx-auto">
            Discover our top-rated premium products loved by thousands of customers
          </p>
          
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Trending Now</span>
            <Sparkles className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-amber-200 relative">
                {/* Bestseller Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <motion.div 
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {index === 0 ? "Best Seller" : "New Arrival"}
                  </motion.div>
                </div>

                {/* Heart Icon */}
                <div className="absolute top-4 right-4 z-10">
                  <motion.div 
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg cursor-pointer hover:bg-red-50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </motion.div>
                </div>

                <Link to={`/product/${product.id}`} className="block">
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <motion.div
                      className="w-full h-64 group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ scale: 1.05 }}
                    >
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick View Button */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        size="sm" 
                        className="bg-white/90 text-gray-800 hover:bg-white shadow-lg backdrop-blur-sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Quick View
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Product Info */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className="h-4 w-4 fill-amber-400 text-amber-400" 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(4.8/5)</span>
                        <span className="text-sm text-gray-500">• 2.5k reviews</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price * 1.2)}
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            20% OFF
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>

                {/* Add to Cart Button */}
                <div className="px-6 pb-6">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-bold rounded-full shadow-xl border-2 border-white/20"
              asChild
            >
              <Link to="/products">
                <Sparkles className="h-5 w-5 mr-2" />
                View All Products
                <TrendingUp className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HighSellingProducts;
