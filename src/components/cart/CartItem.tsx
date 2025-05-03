
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  image,
  stock,
  onRemove,
  onUpdateQuantity,
}) => {
  const { formatPrice } = useLocalization();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border-b last:border-0 border-border/50 flex items-center"
    >
      <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(price)}
        </p>
      </div>
      
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => onUpdateQuantity(id, quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="w-10 text-center">{quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          disabled={quantity >= stock}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="ml-4 w-20 text-right">
        {formatPrice(price * quantity)}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-2 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default CartItem;
