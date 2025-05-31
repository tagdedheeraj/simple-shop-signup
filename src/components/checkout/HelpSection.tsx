
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm"
      variants={itemVariants}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Customer Support</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Need assistance with your order? Our dedicated support team is here to help you.
        </p>
        
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full">
              <Phone className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Call Us</div>
              <div className="text-gray-600">+91 91455 54139</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full">
              <Mail className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Email Support</div>
              <div className="text-gray-600">support@lakshmikrupaagriculture.com</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-amber-50 rounded-full">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Business Hours</div>
              <div className="text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => window.open(`tel:+919145554139`, '_self')}
          >
            <Phone className="h-3 w-3 mr-1" />
            Call Now
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => window.open(`mailto:support@lakshmikrupaagriculture.com`, '_self')}
          >
            <Mail className="h-3 w-3 mr-1" />
            Email Us
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpSection;
