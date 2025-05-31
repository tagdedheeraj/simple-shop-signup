
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Shield } from 'lucide-react';

const VideoStats: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-8 mb-8">
      <motion.div 
        className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full shadow-lg backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
      >
        <Users className="h-5 w-5 text-amber-600" />
        <span className="font-semibold text-gray-700">25+ Years Experience</span>
      </motion.div>
      <motion.div 
        className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full shadow-lg backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
      >
        <Award className="h-5 w-5 text-amber-600" />
        <span className="font-semibold text-gray-700">Premium Quality</span>
      </motion.div>
      <motion.div 
        className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full shadow-lg backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
      >
        <Shield className="h-5 w-5 text-amber-600" />
        <span className="font-semibold text-gray-700">ISO Certified</span>
      </motion.div>
    </div>
  );
};

export default VideoStats;
