
import React from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useCart } from '@/contexts/CartContext';
import { ShieldCheck, TruckIcon, CheckCircle, Clock, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const OrderSummary: React.FC = () => {
  const { items, totalPrice } = useCart();
  const { t, formatPrice } = useLocalization();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
    >
      <motion.h2 variants={itemVariants} className="text-lg font-medium mb-6 pb-2 border-b">
        {t('orderSummary') || 'Order Summary'}
      </motion.h2>
      
      <motion.div variants={itemVariants} className="max-h-60 overflow-y-auto pr-1 mb-4 space-y-3">
        {items.map(item => (
          <div 
            key={item.product.id} 
            className="flex items-center justify-between text-sm pb-3 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center space-x-3">
              {item.product.image && (
                <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800">
                  {item.product.name} <span className="text-gray-500">× {item.quantity}</span>
                </p>
                {item.product.category && (
                  <p className="text-xs text-gray-500">{item.product.category}</p>
                )}
              </div>
            </div>
            <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </motion.div>
      
      <Separator className="my-4" />
      
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('subtotal') || 'Subtotal'}</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <TruckIcon className="h-3.5 w-3.5 text-green-600 mr-1.5" />
            <span className="text-gray-600">{t('shipping') || 'Shipping'}</span>
          </div>
          <span className="text-green-600">{t('free') || 'Free'}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('tax') || 'Tax'}</span>
          <span>Included</span>
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="mt-4 pt-4 border-t border-dashed border-gray-200"
      >
        <div className="flex justify-between font-medium text-lg">
          <span>{t('total') || 'Total'}</span>
          <span className="text-amber-700">{formatPrice(totalPrice)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">
          {t('taxIncluded') || 'Tax included'}
        </p>
      </motion.div>

      {/* Delivery section */}
      <motion.div 
        variants={itemVariants}
        className="mt-6 pt-4 border-t border-gray-100"
      >
        <div className="flex items-center mb-3">
          <Clock className="h-4 w-4 text-amber-600 mr-2" />
          <h4 className="text-sm font-medium">Estimated Delivery</h4>
        </div>
        
        <div className="bg-amber-50 rounded-md p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-amber-700" />
              <span className="text-sm text-amber-800 font-medium">Standard Delivery</span>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-1 rounded-full">
              3-5 Days
            </span>
          </div>
        </div>
      </motion.div>

      {/* Payment Security Notice */}
      <motion.div 
        variants={itemVariants}
        className="mt-6 text-xs text-center space-y-2"
      >
        <div className="flex items-center justify-center text-green-700">
          <ShieldCheck className="h-4 w-4 mr-1" />
          <span className="font-medium">Secure Payment</span>
        </div>
        <p className="text-gray-500 leading-relaxed">
          All transactions are encrypted and secure. Your payment information is never stored on our servers.
        </p>
        <div className="pt-2 flex items-center justify-center text-amber-700 text-xs">
          <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-600" />
          <span>100% satisfaction guaranteed</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;
