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
  Clock,
  Truck,
  BadgeCheck,
  Leaf,
  ThumbsUp,
  HeadphoneIcon,
  Star
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
  
  const handleAddReview = async (rating: number, comment: string) => {
    if (!product || !user) return;
    
    try {
      await addReview(product.id, {
        userId: user.id,
        userName: user.name,
        rating,
        comment
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
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-cover aspect-square"
          />
          <Badge variant="secondary" className="absolute top-4 left-4 z-10 bg-white/90">
            <BadgeCheck className="h-4 w-4 text-green-500 mr-1" /> Verified Product
          </Badge>
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
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2 bg-green-50 border-green-200 text-green-700">
                <Leaf className="h-3 w-3 mr-1" /> Organic
              </Badge>
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                <BadgeCheck className="h-3 w-3 mr-1" /> Quality Tested
              </Badge>
            </div>
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
          
          {/* Shipping Information with Icons */}
          <div className="pt-6 mt-6 border-t border-border">
            <div className="flex items-center mb-3">
              <Truck className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Fast & Reliable Shipping</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Delivery within 2-4 business days
                </p>
              </div>
              <div className="flex items-start">
                <Leaf className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Eco-friendly packaging
                </p>
              </div>
            </div>
          </div>
          
          {/* Product Guarantees */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center mb-3">
              <ShieldCheck className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Our Guarantees</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start">
                <BadgeCheck className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  100% Satisfaction Guarantee
                </p>
              </div>
              <div className="flex items-start">
                <ThumbsUp className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  30-Day Money Back Guarantee
                </p>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center mb-3">
              <HeadphoneIcon className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">24/7 Customer Support</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Have questions? Our dedicated support team is available 24/7 to assist you with any inquiries.
            </p>
          </div>

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
      
      {/* Customer Testimonials */}
      <div className="mt-12 mb-8">
        <h2 className="text-xl font-semibold mb-4">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex text-yellow-400 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-3">
                "This product exceeded my expectations. The quality is outstanding and the customer service was excellent."
              </p>
              <p className="text-xs text-muted-foreground font-medium">— Maria J., Verified Buyer</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex text-yellow-400 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-3">
                "Fast shipping and the product was exactly as described. Will definitely purchase from this store again!"
              </p>
              <p className="text-xs text-muted-foreground font-medium">— Robert K., Verified Buyer</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex text-yellow-400 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-3">
                "I've been ordering regularly for months. The consistency and quality are always top-notch. Highly recommend!"
              </p>
              <p className="text-xs text-muted-foreground font-medium">— Eliza T., Verified Buyer</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
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
