
import { useState, useCallback, useEffect } from 'react';
import { getProducts, refreshProductData } from '@/services/product';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { addTimestampToImage } from '@/services/product/utils';
import { 
  saveFirestoreProduct, 
  deleteFirestoreProduct 
} from '@/services/firebase/products';

export const useProductOperations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Ensure products are loaded on initial mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProductData();
      await fetchProducts();
      toast.success('Product data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh products');
    } finally {
      setRefreshing(false);
    }
  }, [fetchProducts]);

  const handleSaveProduct = useCallback(async (productData: Omit<Product, 'id'>, currentProductId: string | null) => {
    try {
      // Make sure image has a timestamp to prevent caching issues
      const updatedProductData = {
        ...productData,
        image: addTimestampToImage(productData.image)
      };
      
      if (currentProductId) {
        // Update existing product
        const updatedProduct: Product = {
          id: currentProductId,
          ...updatedProductData,
        };
        
        await saveFirestoreProduct(updatedProduct);
        toast.success('Product updated successfully');
      } else {
        // Add new product
        const newProduct: Product = {
          id: `product-${Date.now()}`,
          ...updatedProductData,
        };
        
        await saveFirestoreProduct(newProduct);
        toast.success('Product added successfully');
      }
      
      // Refresh products list immediately
      setTimeout(() => fetchProducts(), 100);
      return true;
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
      return false;
    }
  }, [fetchProducts]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      // Delete the product from Firestore
      await deleteFirestoreProduct(productId);
      
      toast.success('Product deleted successfully');
      // Refresh products list
      setTimeout(() => fetchProducts(), 100);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      return false;
    }
  }, [fetchProducts]);

  return {
    products,
    loading,
    refreshing,
    fetchProducts,
    handleRefresh,
    handleSaveProduct,
    handleDeleteProduct
  };
};
