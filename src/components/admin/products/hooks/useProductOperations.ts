
import { useState, useCallback, useEffect } from 'react';
import { getProducts, refreshProductData } from '@/services/product';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { addTimestampToImage, persistProducts } from '@/services/product/utils';

export const useProductOperations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      
      // Ensure all images have timestamps
      const productsWithTimestamps = data.map(product => ({
        ...product,
        image: addTimestampToImage(product.image)
      }));
      
      setProducts(productsWithTimestamps);
      
      // Also update localStorage to ensure consistency
      persistProducts(productsWithTimestamps);
      
      console.log('Fetched products:', productsWithTimestamps.length);
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
      // Get current products from localStorage
      const storedProducts = localStorage.getItem('products');
      let allProducts: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
      
      // Make sure image has a timestamp to prevent caching issues
      const updatedProductData = {
        ...productData,
        image: addTimestampToImage(productData.image)
      };
      
      if (currentProductId) {
        // Update existing product
        allProducts = allProducts.map(product => {
          if (product.id === currentProductId) {
            return {
              ...product,
              ...updatedProductData,
            };
          }
          return product;
        });
        toast.success('Product updated successfully');
      } else {
        // Add new product
        const newProduct = {
          id: `product-${Date.now()}`,
          ...updatedProductData,
        };
        allProducts.push(newProduct);
        toast.success('Product added successfully');
      }
      
      // Save back to localStorage using the utility function
      persistProducts(allProducts);
      
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
      // Get current products from localStorage
      const storedProducts = localStorage.getItem('products');
      let allProducts: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
      
      // Filter out the product to delete
      allProducts = allProducts.filter(product => product.id !== productId);
      
      // Save back to localStorage using the utility function
      persistProducts(allProducts);
      
      toast.success('Product deleted successfully');
      // Refresh products list
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
