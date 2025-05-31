
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

interface CheckoutHeaderProps {
  totalItems: number;
  onBackToCart: () => void;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ totalItems, onBackToCart }) => {
  const { t } = useLocalization();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="flex items-center justify-between mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="text-3xl font-bold">
        {t('checkout') || 'Checkout'} 
        <span className="ml-3 text-base font-normal text-gray-500">
          ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </span>
      </motion.h1>
      <motion.div variants={itemVariants}>
        <Button variant="outline" size="sm" onClick={onBackToCart}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('backToCart') || 'Back to Cart'}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutHeader;
