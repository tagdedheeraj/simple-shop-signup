
import React, { useState, useEffect } from 'react';
import { getProducts, refreshProductData } from '@/services/product';
import { Product } from '@/types/product';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MoreHorizontal, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import AdminProductDialog from './AdminProductDialog';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = async () => {
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
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleNewProduct = () => {
    setCurrentProduct(null);
    setDialogOpen(true);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      // Get current products from localStorage
      const storedProducts = localStorage.getItem('products');
      let allProducts: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
      
      if (currentProduct) {
        // Update existing product
        allProducts = allProducts.map(product => {
          if (product.id === currentProduct.id) {
            return {
              ...product,
              ...productData,
            };
          }
          return product;
        });
        toast.success('Product updated successfully');
      } else {
        // Add new product
        const newProduct = {
          id: `product-${Date.now()}`,
          ...productData,
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
  };

  const handleDeleteProduct = (productId: string) => {
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
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory.
          </p>
        </div>
        <Button onClick={handleNewProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Loading products...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">No products found</div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="hidden md:table-cell">₹{product.price}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdminProductDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        product={currentProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default AdminProducts;
