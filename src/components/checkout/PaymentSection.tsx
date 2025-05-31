import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLocalization } from '@/contexts/LocalizationContext';
import { CustomerInfo } from './CustomerInfoForm';
import PayPalButton from './PayPalButton';
import RazorpayButton from './RazorpayButton';

interface PaymentSectionProps {
  customerInfo: CustomerInfo;
  isFormComplete: boolean;
  onBackToInfo: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ 
  customerInfo, 
  isFormComplete, 
  onBackToInfo 
}) => {
  const { t } = useLocalization();

  return (
    <motion.div 
      id="payment-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">{t('payment') || 'Payment'}</h2>
        <Button variant="ghost" size="sm" onClick={onBackToInfo}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Edit Information
        </Button>
      </div>
      
      <Separator className="mb-6" />
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Customer:</span>
          <span className="font-medium">{customerInfo.fullName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Email:</span>
          <span>{customerInfo.email}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phone:</span>
          <span>{customerInfo.phone}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Address:</span>
          <span className="text-right">
            {customerInfo.address}, {customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}, {customerInfo.country}
          </span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Choose Payment Method</h3>
        
        {/* Razorpay Payment Option */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">Razorpay (India)</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Recommended</span>
          </div>
          <RazorpayButton 
            customerInfo={customerInfo}
            isFormComplete={isFormComplete}
          />
        </div>

        {/* PayPal Payment Option */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-gray-900">PayPal (International)</span>
          </div>
          <PayPalButton 
            customerInfo={customerInfo}
            isFormComplete={isFormComplete}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSection;
