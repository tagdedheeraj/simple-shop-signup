import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import CategoryFilter from '@/components/products/CategoryFilter';
import SearchBar from '@/components/products/SearchBar';
import Pagination from '@/components/ui/Pagination';
import PageTransition from '@/components/layout/PageTransition';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReferralCodeInput from '@/components/referrals/ReferralCodeInput';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch products
  const { data: products, isLoading: isProductsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ['products', searchTerm, selectedCategory],
    queryFn: () => getProducts(searchTerm, selectedCategory),
  });

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Handle errors
  useEffect(() => {
    if (productsError) console.error("Error fetching products:", productsError);
    if (categoriesError) console.error("Error fetching categories:", categoriesError);
  }, [productsError, categoriesError]);

  // Filtered and paginated products
  const filteredProducts = products || [];
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <Layout>
      <PageTransition>
        <div className="container py-8">
          {/* Referral Code Input for new users */}
          <div className="mb-6">
            <ReferralCodeInput />
          </div>
          
          <div className="mb-4 flex justify-between items-center">
            <SearchBar onSearch={setSearchTerm} />
            {categories && (
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}
          </div>

          {isProductsLoading ? (
            <div className="text-center">Loading products...</div>
          ) : productsError ? (
            <div className="text-center text-red-500">Error loading products.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalProducts > productsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Products;
