import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { getProductById, addReview } from '@/services/productService';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ChevronLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
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
      
      // Refresh product data to show the new review
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
          className="rounded-lg overflow-hidden bg-white shadow-md"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-cover aspect-square"
          />
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
          
          <Button 
            size="lg" 
            onClick={handleAddToCart}
            className="mt-4"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
          
          <div className="pt-6 mt-6 border-t border-border">
            <h3 className="font-medium mb-2">Shipping Worldwide</h3>
            <p className="text-sm text-muted-foreground">
              We ship our premium products globally, ensuring quality and freshness through specialized packaging.
            </p>
          </div>
        </motion.div>
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
