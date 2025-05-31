
import React from 'react';
import { motion } from 'framer-motion';

const HelpSection: React.FC = () => {
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
      className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100"
      variants={itemVariants}
    >
      <h3 className="text-sm font-medium mb-2 text-amber-800">Need Help?</h3>
      <p className="text-xs text-amber-700 mb-2">
        Having trouble with your order? Contact our support team.
      </p>
      <div className="text-xs text-amber-800 font-medium">
        📞 +91 9876543210 | ✉️ support@example.com
      </div>
    </motion.div>
  );
};

export default HelpSection;
