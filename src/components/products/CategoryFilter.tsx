
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryFilterProps {
  category: string;
  setCategory: (category: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  category, 
  setCategory, 
  showFilters, 
  setShowFilters 
}) => {
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'vegetable', label: 'Vegetables' },
    { value: 'onion', label: 'Onions' },
    { value: 'fruits', label: 'Fruits' },
  ];

  return (
    <>
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
    </>
  );
};

export default CategoryFilter;
