
import { useState, useCallback, useEffect } from 'react';
import { getProducts, refreshProductData } from '@/services/product';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { saveFirestoreProduct, deleteFirestoreProduct, getFirestoreProducts, clearAllDeletedProductIds } from '@/services/firebase/products';
import { queryClient } from '@/services/query-client';

export const useProductOperations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching products from Firebase...');
      // Get products directly from Firebase to ensure we have the latest data
      const data = await getFirestoreProducts();
      console.log('Fetched products:', data);
      setProducts(data);
      
      // Update the query cache as well
      queryClient.setQueryData(['products'], data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log('Refreshing product data...');
      await refreshProductData();
      await fetchProducts();
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      
      toast.success("Product data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh products");
      console.error('Error refreshing products:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProducts]);

  const resetDeletedProducts = useCallback(async () => {
    try {
      setRefreshing(true);
      console.log('Resetting deleted products...');
      await clearAllDeletedProductIds();
      await fetchProducts();
      
      toast.success("Deleted products tracking has been reset");
    } catch (error) {
      console.error('Error resetting deleted products:', error);
      toast.error("Failed to reset deleted products tracking");
    } finally {
      setRefreshing(false);
    }
  }, [fetchProducts]);

  const handleSaveProduct = useCallback(async (productData: Omit<Product, 'id'>, currentProductId: string | null): Promise<boolean> => {
    try {
      console.log('Saving product:', { productData, currentProductId });
      
      // Validate the product data
      if (!productData.name?.trim()) {
        throw new Error('Product name is required');
      }
      
      if (!productData.description?.trim()) {
        throw new Error('Product description is required');
      }
      
      if (!productData.image?.trim()) {
        throw new Error('Product image is required');
      }
      
      if (productData.price <= 0) {
        throw new Error('Product price must be greater than 0');
      }
      
      if (productData.stock < 0) {
        throw new Error('Product stock cannot be negative');
      }
      
      // Clean image URL by removing any timestamp parameters for storage
      let cleanImageUrl = productData.image;
      if (cleanImageUrl.includes('?t=')) {
        cleanImageUrl = cleanImageUrl.split('?t=')[0];
      } else if (cleanImageUrl.includes('&t=')) {
        cleanImageUrl = cleanImageUrl.replace(/&t=\d+/, '');
      }
      
      const updatedProductData = {
        ...productData,
        image: cleanImageUrl,
        name: productData.name.trim(),
        description: productData.description.trim(),
        price: Number(productData.price),
        stock: Number(productData.stock)
      };
      
      let product: Product;
      
      if (currentProductId) {
        // Update existing product
        product = {
          id: currentProductId,
          ...updatedProductData,
        };
        
        console.log('Updating existing product:', product);
      } else {
        // Add new product with unique ID
        product = {
          id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...updatedProductData,
        };
        
        console.log('Creating new product:', product);
      }
      
      // Save to Firebase
      const success = await saveFirestoreProduct(product);
      
      if (!success) {
        throw new Error('Failed to save product to Firebase');
      }
      
      console.log('Product saved successfully to Firebase');
      
      // Refresh products list immediately
      await fetchProducts();
      
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      
      return true;
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save product");
      return false;
    }
  }, [fetchProducts]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      console.log('Deleting product:', productId);
      const success = await deleteFirestoreProduct(productId);
      
      if (!success) {
        throw new Error('Failed to delete product from Firebase');
      }
      
      console.log('Product deleted successfully');
      toast.success("Product deleted successfully");
      
      // Refresh products list immediately
      await fetchProducts();
      
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");
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
