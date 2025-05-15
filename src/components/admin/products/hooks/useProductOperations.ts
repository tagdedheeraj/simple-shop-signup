
import { useState, useCallback, useEffect } from 'react';
import { getProducts, refreshProductData } from '@/services/product';
import { Product } from '@/types/product';
import { toast } from '@/components/ui/use-toast';
import { saveFirestoreProduct, deleteFirestoreProduct, getFirestoreProducts, clearAllDeletedProductIds } from '@/services/firebase/products';
import { queryClient } from '@/services/query-client';

export const useProductOperations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Get products directly from Firebase to ensure we have the latest data
      const data = await getFirestoreProducts();
      console.log('Fetched products directly from Firebase:', data);
      setProducts(data);
      
      // Update the query cache as well
      queryClient.setQueryData(['products'], data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProductData();
      await fetchProducts();
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      
      toast({
        title: "Success",
        description: "Product data refreshed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh products"
      });
      console.error('Error refreshing products:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProducts]);

  const resetDeletedProducts = useCallback(async () => {
    try {
      setRefreshing(true);
      await clearAllDeletedProductIds();
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Deleted products tracking has been reset"
      });
    } catch (error) {
      console.error('Error resetting deleted products:', error);
      toast({
        title: "Error",
        description: "Failed to reset deleted products tracking"
      });
    } finally {
      setRefreshing(false);
    }
  }, [fetchProducts]);

  const handleSaveProduct = useCallback(async (productData: Omit<Product, 'id'>, currentProductId: string | null) => {
    try {
      // We'll store clean image URLs without timestamps in Firebase
      // The timestamp will be added when displayed
      const cleanImageUrl = productData.image;
      
      const updatedProductData = {
        ...productData,
        image: cleanImageUrl
      };
      
      if (currentProductId) {
        // Update existing product
        const updatedProduct = {
          id: currentProductId,
          ...updatedProductData,
        };
        
        console.log('Saving updated product to Firebase:', updatedProduct);
        await saveFirestoreProduct(updatedProduct);
        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        // Add new product
        const newProduct = {
          id: `product-${Date.now()}`,
          ...updatedProductData,
        };
        
        console.log('Saving new product to Firebase:', newProduct);
        await saveFirestoreProduct(newProduct);
        toast({
          title: "Success",
          description: "Product added successfully"
        });
      }
      
      // Refresh products list immediately
      await fetchProducts();
      
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      
      return true;
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product"
      });
      return false;
    }
  }, [fetchProducts]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      console.log('Deleting product from Firebase:', productId);
      await deleteFirestoreProduct(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
      
      // Refresh products list immediately
      await fetchProducts();
      
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product"
      });
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
    handleDeleteProduct,
    resetDeletedProducts
  };
};
