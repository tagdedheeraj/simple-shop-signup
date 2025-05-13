
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { getProducts, refreshProductData } from '@/services/product';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'vegetable', label: 'Vegetables' },
    { value: 'onion', label: 'Onions' },
    { value: 'fruits', label: 'Fruits' },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Our Products</h1>
                <p className="text-muted-foreground">
                  Browse our selection of fresh, quality products shipped worldwide
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Products'}
              </Button>
            </div>
            
            {/* Search and Filter Section */}
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products by name, description or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                
                {(searchTerm || category !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-500 hover:text-red-700"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              
              {/* Mobile Filters */}
              {showFilters && (
                <div className="md:hidden">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Desktop Category Buttons */}
              <div className="hidden md:flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={category === cat.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat.value)}
                    className="rounded-full"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {searchTerm && (
            <div className="text-sm text-muted-foreground">
              Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} matching "{searchTerm}"
            </div>
          )}
          
          <ProductGrid products={filteredProducts} loading={loading || refreshing} />
        </div>
      </motion.div>
    </Layout>
  );
};

export default Products;
