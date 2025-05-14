
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface ProductActionsProps {
  onGoBack: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ onGoBack }) => {
  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onGoBack}
        className="group"
      >
        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Button>
    </div>
  );
};

export default ProductActions;
