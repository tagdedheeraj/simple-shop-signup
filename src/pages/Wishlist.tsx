
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ShoppingCart, Trash2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveAllToCart = () => {
    items.forEach(product => {
      addToCart(product);
    });
    // Optional: clear wishlist after adding all to cart
    // clearWishlist();
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/products')}
              className="group"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Button>
          </div>
          
          <div className="flex gap-2">
            {items.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearWishlist}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Wishlist
                </Button>
                
                <Button 
                  size="sm"
                  onClick={handleMoveAllToCart}
                  className="flex items-center gap-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add All to Cart
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-8">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>
          
          {items.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Explore our products and add items to your wishlist
              </p>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Wishlist;
