import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { getProductById, addReview } from '@/services/productService';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Loader2, 
  ChevronLeft, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Heart, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Clock, 
  BadgeCheck, 
  Leaf, 
  Headphones 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const data = await getProductById(productId);
        if (data) {
          setProduct(data);
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddReview = async (rating: number, comment: string, photos?: string[]) => {
    if (!product || !user) return;
    
    try {
      await addReview(product.id, {
        userId: user.id,
        userName: user.name,
        rating,
        comment,
        photos
      });
      
      const updatedProduct = await getProductById(product.id);
      if (updatedProduct) {
        setProduct(updatedProduct);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
      throw error;
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[600px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[600px] flex flex-col items-center justify-center">
          <p className="text-xl text-muted-foreground">Product not found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/products')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-cover aspect-square"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 bg-white/90 rounded-full shadow-md z-10 hover:bg-white"
          >
            <Heart 
              className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col space-y-6"
        >
          <div>
            <div className="flex gap-2 flex-wrap mb-2">
              <Badge className="bg-green-600 hover:bg-green-700">{product.category}</Badge>
              {product.category === 'vegetable' || product.category === 'fruits' ? (
                <Badge variant="outline" className="border-green-500 text-green-700">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                </Badge>
              ) : null}
              <Badge variant="outline" className="border-blue-500 text-blue-700">
                <BadgeCheck className="h-3 w-3 mr-1" />
                Quality Tested
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-medium mt-2">${product.price.toFixed(2)}</p>
          </div>
          
          <p className="text-muted-foreground">{product.description}</p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="rounded-l-md rounded-r-none"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="px-4 py-2 border-y border-border flex items-center justify-center w-12">
                {quantity}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                className="rounded-r-md rounded-l-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {product.stock} available
            </p>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button 
              size="lg" 
              onClick={handleAddToCart}
              className="flex-1"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            
            <Button 
              size="lg" 
              variant={isInWishlist(product.id) ? "destructive" : "outline"}
              onClick={handleWishlistToggle}
              className="min-w-[120px]"
            >
              <Heart 
                className={`h-5 w-5 mr-2 ${isInWishlist(product.id) ? 'fill-white' : ''}`} 
              />
              {isInWishlist(product.id) ? 'Remove' : 'Wishlist'}
            </Button>
          </div>
          
          {/* Trust Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 mt-3 border-t border-border">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm">Fast Shipping</h3>
                <p className="text-xs text-muted-foreground">
                  2-3 day delivery nationwide
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <RotateCcw className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm">Easy Returns</h3>
                <p className="text-xs text-muted-foreground">
                  30-day money back guarantee
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm">Quality Guarantee</h3>
                <p className="text-xs text-muted-foreground">
                  100% satisfaction promise
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Headphones className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm">24/7 Support</h3>
                <p className="text-xs text-muted-foreground">
                  Live chat & phone support
                </p>
              </div>
            </div>
          </div>

          {/* Customer Support Banner */}
          <Card className="bg-green-50 border-green-100">
            <CardContent className="flex items-center p-4">
              <div className="rounded-full bg-green-100 p-2 mr-3">
                <Headphones className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Need help with this product?</h3>
                <p className="text-xs text-muted-foreground">
                  Our experts are here to help you 24/7. Call us at <span className="font-medium">1-800-123-4567</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Trust Badges */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center mb-3">
              <ShieldCheck className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Secure Payment Options</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {/* PayPal */}
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-border rounded-md shadow-sm">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png" 
                  alt="PayPal" 
                  className="h-6 object-contain" 
                />
                <span className="text-xs text-muted-foreground mt-1">PayPal</span>
              </div>
              
              {/* Visa */}
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-border rounded-md shadow-sm">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" 
                  alt="Visa" 
                  className="h-5 object-contain" 
                />
                <span className="text-xs text-muted-foreground mt-1">Visa</span>
              </div>
              
              {/* Mastercard */}
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-border rounded-md shadow-sm">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" 
                  alt="Mastercard" 
                  className="h-5 object-contain" 
                />
                <span className="text-xs text-muted-foreground mt-1">Mastercard</span>
              </div>
              
              {/* Generic Secure Payments */}
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-border rounded-md shadow-sm">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground mt-1">Others</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              All transactions are secure and encrypted
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Customer Testimonial for this specific product */}
      <div className="mt-10 bg-gray-50 rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Why Customers Love {product.name}</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-1/3">
            <CardContent className="p-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm mt-3">"This product exceeded my expectations! The quality is exceptional and the delivery was super fast."</p>
              <p className="text-xs font-medium mt-3">- Sarah Johnson</p>
            </CardContent>
          </Card>
          
          <Card className="md:w-1/3">
            <CardContent className="p-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm mt-3">"I've been using this for months now and it's consistently great. Will definitely buy again!"</p>
              <p className="text-xs font-medium mt-3">- Michael Chen</p>
            </CardContent>
          </Card>
          
          <Card className="md:w-1/3">
            <CardContent className="p-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm mt-3">"The attention to detail and quality packaging made the whole experience premium. Highly recommend!"</p>
              <p className="text-xs font-medium mt-3">- Priya Sharma</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-12">
        <ProductReviews 
          productId={product.id}
          reviews={product.reviews} 
          onAddReview={handleAddReview}
        />
      </div>

      <RelatedProducts productId={product.id} />
    </Layout>
  );
};

export default ProductDetail;
