
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import AdminProductDialog from './AdminProductDialog';
import { useProductOperations } from './hooks/useProductOperations';
import ProductsHeader from './components/ProductsHeader';
import ProductsToolbar from './components/ProductsToolbar';
import ProductsTable from './components/ProductsTable';
import { useQueryClient } from '@tanstack/react-query';

const AdminProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const {
    products,
    loading,
    refreshing,
    fetchProducts,
    handleRefresh,
    handleSaveProduct,
    handleDeleteProduct
  } = useProductOperations();

  useEffect(() => {
    fetchProducts();
    
    // On component mount, invalidate the product queries to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
  }, [fetchProducts, queryClient]);

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleNewProduct = () => {
    setCurrentProduct(null);
    setDialogOpen(true);
  };

  const handleSaveProductDialog = async (productData: Omit<Product, 'id'>) => {
    return handleSaveProduct(productData, currentProduct?.id || null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ProductsHeader onNewProduct={handleNewProduct} />
      
      <ProductsToolbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <ProductsTable 
        products={filteredProducts}
        loading={loading}
        filteredProducts={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <AdminProductDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        product={currentProduct}
        onSave={handleSaveProductDialog}
      />
    </div>
  );
};

export default AdminProducts;
