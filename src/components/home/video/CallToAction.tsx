
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CallToAction: React.FC = () => {
  return (
    <motion.div 
      className="text-center mt-16 p-6 md:p-8 bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-3xl shadow-xl border border-amber-200"
    >
      <motion.div
        className="text-4xl md:text-6xl mb-4"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        📞
      </motion.div>
      <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Want to know more about our processing facilities?
      </h4>
      <p className="text-gray-600 mb-6 text-base md:text-lg px-2">
        Get in touch with our experts to learn about our advanced processing techniques
      </p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold rounded-full shadow-xl border-2 border-white/20 w-full sm:w-auto">
          Contact Now
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CallToAction;
