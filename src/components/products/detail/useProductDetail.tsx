
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductById, addReview } from '@/services/product';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
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
    if (!product || !productId) return;
    
    try {
      await addReview(productId, {
        userId: "user-id", // This will be replaced with actual user ID in the component
        userName: "User Name", // This will be replaced with actual user name in the component
        rating,
        comment,
        photos
      });
      
      const updatedProduct = await getProductById(productId);
      if (updatedProduct) {
        setProduct(updatedProduct);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
      throw error;
    }
  };

  return {
    product,
    loading,
    quantity,
    handleAddToCart,
    increaseQuantity,
    decreaseQuantity,
    handleAddReview,
  };
};
