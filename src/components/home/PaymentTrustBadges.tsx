
import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Lock } from 'lucide-react';

const PaymentTrustBadges: React.FC = () => {
  const paymentMethods = [
    { name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    { name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
    { name: "Apple Pay", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" },
    { name: "Google Pay", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" }
  ];

  return (
    <section className="container mx-auto px-4 pt-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-medium text-center">Secure Payment Methods</h3>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.name}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <img 
                src={method.logo} 
                alt={`${method.name} payment method`} 
                className="h-8 object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
              />
              <span className="text-xs text-gray-500 mt-1">{method.name}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-5 text-sm text-center text-gray-600">
          <BadgeCheck className="h-4 w-4 text-green-600" />
          <p>All transactions are secure and encrypted</p>
        </div>
      </motion.div>
    </section>
  );
};

export default PaymentTrustBadges;
