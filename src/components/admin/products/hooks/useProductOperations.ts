
import { useState, useCallback } from 'react';
import { getProducts, refreshProductData } from '@/services/product';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { addTimestampToImage } from '@/services/product/utils';
import { saveFirestoreProduct, deleteFirestoreProduct } from '@/services/firebase/products';

export const useProductOperations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProductData();
      await fetchProducts();
      toast.success('Product data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh products');
      console.error('Error refreshing products:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProducts]);

  const handleSaveProduct = useCallback(async (productData: Omit<Product, 'id'>, currentProductId: string | null) => {
    try {
      // We don't add timestamp to image here anymore - we'll display with timestamp but store clean URL
      const updatedProductData = {
        ...productData
      };
      
      if (currentProductId) {
        // Update existing product
        const updatedProduct = {
          id: currentProductId,
          ...updatedProductData,
        };
        
        console.log('Saving updated product to Firebase:', updatedProduct);
        await saveFirestoreProduct(updatedProduct);
        toast.success('Product updated successfully');
      } else {
        // Add new product
        const newProduct = {
          id: `product-${Date.now()}`,
          ...updatedProductData,
        };
        
        console.log('Saving new product to Firebase:', newProduct);
        await saveFirestoreProduct(newProduct);
        toast.success('Product added successfully');
      }
      
      // Refresh products list immediately
      await fetchProducts();
      return true;
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
      return false;
    }
  }, [fetchProducts]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      console.log('Deleting product from Firebase:', productId);
      await deleteFirestoreProduct(productId);
      toast.success('Product deleted successfully');
      
      // Refresh products list immediately
      await fetchProducts();
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
