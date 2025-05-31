
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard } from 'lucide-react';

interface CheckoutStepsProps {
  activeSection: 'info' | 'payment';
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ activeSection }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div variants={itemVariants} className="flex items-center justify-center mb-8">
      <div className={`flex items-center ${activeSection === 'info' ? 'text-amber-700 font-medium' : 'text-gray-500'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${activeSection === 'info' ? 'bg-amber-100 border-2 border-amber-500' : 'bg-gray-100 border border-gray-300'}`}>
          <ShoppingBag className={`h-4 w-4 ${activeSection === 'info' ? 'text-amber-700' : 'text-gray-500'}`} />
        </div>
        <span>Customer Info</span>
      </div>
      
      <div className="w-20 h-[2px] mx-4 bg-gray-200 relative">
        {activeSection === 'payment' && (
          <motion.div 
            className="absolute inset-0 bg-amber-500 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        )}
      </div>
      
      <div className={`flex items-center ${activeSection === 'payment' ? 'text-amber-700 font-medium' : 'text-gray-500'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${activeSection === 'payment' ? 'bg-amber-100 border-2 border-amber-500' : 'bg-gray-100 border border-gray-300'}`}>
          <CreditCard className={`h-4 w-4 ${activeSection === 'payment' ? 'text-amber-700' : 'text-gray-500'}`} />
        </div>
        <span>Payment</span>
      </div>
    </motion.div>
  );
};

export default CheckoutSteps;
