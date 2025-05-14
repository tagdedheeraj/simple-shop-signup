
import { useState, useCallback } from 'react';
import { getProducts, refreshProductData } from '@/services/product';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { addTimestampToImage } from '@/services/product/utils';

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
      
      // Add timestamp to image to prevent caching
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
      
      // Save back to localStorage
      localStorage.setItem('products', JSON.stringify(allProducts));
      
      // Refresh products list
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
      
      // Save back to localStorage
      localStorage.setItem('products', JSON.stringify(allProducts));
      
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
