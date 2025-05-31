
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck } from 'lucide-react';

const TrustBadges: React.FC = () => {
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
      className="mt-6 p-4 bg-white/50 rounded-lg border border-gray-100 flex flex-col space-y-3"
      variants={itemVariants}
    >
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <span>Your personal information is secure and encrypted</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Truck className="h-4 w-4 text-amber-600" />
        <span>Free shipping on orders above ₹500</span>
      </div>
    </motion.div>
  );
};

export default TrustBadges;
