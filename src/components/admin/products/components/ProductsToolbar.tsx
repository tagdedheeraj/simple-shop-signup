
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';

interface ProductsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

const ProductsToolbar: React.FC<ProductsToolbarProps> = ({
  searchTerm,
  onSearchChange,
  refreshing,
  onRefresh
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8 w-full md:w-[300px]"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" onClick={onRefresh} disabled={refreshing}>
        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default ProductsToolbar;
