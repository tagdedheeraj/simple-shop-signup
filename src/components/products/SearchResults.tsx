
import React from 'react';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
  searchTerm: string;
  filteredProducts: any[];
  category: string;
  clearFilters: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  searchTerm, 
  filteredProducts, 
  category,
  clearFilters 
}) => {
  if (!searchTerm && category === 'all') {
    return null;
  }

  return (
    <div className="flex justify-between items-center">
      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} 
          {searchTerm ? ` matching "${searchTerm}"` : ''}
        </div>
      )}
      
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
  );
};

export default SearchResults;
