
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { getProducts, refreshProductData } from '@/services/product';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ProductHeader from '@/components/products/ProductHeader';
import SearchBar from '@/components/products/SearchBar';
import CategoryFilter from '@/components/products/CategoryFilter';
import SearchResults from '@/components/products/SearchResults';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [category, searchTerm, products]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshProductData();
      await fetchProducts();
      toast.success('Product data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing products:', error);
      toast.error('Failed to refresh product data');
    } finally {
      setRefreshing(false);
    }
  };

  const filterProducts = () => {
    let result = [...products];
    
    // Filter by category
    if (category !== 'all') {
      result = result.filter(product => product.category === category);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProducts(result);
  };

  const clearFilters = () => {
    setCategory('all');
    setSearchTerm('');
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-4">
            <ProductHeader refreshing={refreshing} handleRefresh={handleRefresh} />
            
            {/* Search and Filter Section */}
            <div className="flex flex-col space-y-4">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              
              <CategoryFilter 
                category={category}
                setCategory={setCategory}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
              />
            </div>
          </div>
          
          <SearchResults 
            searchTerm={searchTerm} 
            filteredProducts={filteredProducts} 
            category={category}
            clearFilters={clearFilters}
          />
          
          <ProductGrid products={filteredProducts} loading={loading || refreshing} />
        </div>
      </motion.div>
    </Layout>
  );
};

export default Products;
