
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, User, Mail, Phone, HomeIcon, MapPin } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { motion } from 'framer-motion';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  isFormComplete: () => boolean;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  customerInfo,
  handleChange,
  handleSubmit,
  isProcessing,
  isFormComplete
}) => {
  const { t } = useLocalization();

  const inputClasses = "bg-white focus-visible:ring-amber-500 focus-visible:ring-offset-0";
  const labelClasses = "text-gray-700 mb-1.5";
  const fieldWrapperClasses = "space-y-1";

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const fieldVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible" 
      onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-5"
    >
      <motion.h2 variants={fieldVariants} className="text-xl font-medium mb-6 border-b pb-4 text-gray-800">
        {t('customerInformation') || 'Customer Information'}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={fieldVariants} className={fieldWrapperClasses}>
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-400 mr-2" />
            <Label htmlFor="fullName" className={labelClasses}>{t('fullName') || 'Full Name'} *</Label>
          </div>
          <Input
            id="fullName"
            name="fullName"
            value={customerInfo.fullName}
            onChange={handleChange}
            className={inputClasses}
            placeholder="John Doe"
            required
          />
        </motion.div>
        
        <motion.div variants={fieldVariants} className={fieldWrapperClasses}>
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-gray-400 mr-2" />
            <Label htmlFor="email" className={labelClasses}>{t('email') || 'Email'} *</Label>
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            value={customerInfo.email}
            onChange={handleChange}
            className={inputClasses}
            placeholder="john@example.com"
            required
          />
        </motion.div>
      </div>
      
      <motion.div variants={fieldVariants} className={fieldWrapperClasses}>
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          <Label htmlFor="phone" className={labelClasses}>{t('phoneNumber') || 'Phone Number'} *</Label>
        </div>
        <Input
          id="phone"
          name="phone"
          value={customerInfo.phone}
          onChange={handleChange}
          className={inputClasses}
          placeholder="+1 (555) 123-4567"
          required
        />
      </motion.div>
      
      <motion.div 
        variants={fieldVariants}
        className="border-t border-gray-100 pt-5 mt-5"
      >
        <div className="flex items-center mb-4">
          <HomeIcon className="h-5 w-5 text-amber-600 mr-2" />
          <h3 className="font-medium text-gray-800">Shipping Address</h3>
        </div>
      </motion.div>
      
      <motion.div variants={fieldVariants} className={fieldWrapperClasses}>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
          <Label htmlFor="address" className={labelClasses}>{t('address') || 'Address'} *</Label>
        </div>
        <Input
          id="address"
          name="address"
          value={customerInfo.address}
          onChange={handleChange}
          className={inputClasses}
          placeholder="123 Main Street, Apt 4B"
          required
        />
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={fieldVariants} className={fieldWrapperClasses}>
          <Label htmlFor="city" className={labelClasses}>{t('city') || 'City'} *</Label>
          <Input
            id="city"
            name="city"
            value={customerInfo.city}
            onChange={handleChange}
            className={inputClasses}
            placeholder="New York"
            required
          />
        </motion.div>
        
        <motion.div variants={fieldVariants} className={fieldWrapperClasses}>
          <Label htmlFor="state" className={labelClasses}>{t('state') || 'State'} *</Label>
          <Input
            id="state"
            name="state"
            value={customerInfo.state}
            onChange={handleChange}
            className={inputClasses}
            placeholder="New York"
            required
          />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={fieldVariants} className={fieldWrapperClasses}>
          <Label htmlFor="zipCode" className={labelClasses}>{t('zipCode') || 'Zip Code'} *</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={customerInfo.zipCode}
            onChange={handleChange}
            className={inputClasses}
            placeholder="10001"
            required
          />
        </motion.div>
        
        <motion.div variants={fieldVariants} className={fieldWrapperClasses}>
          <Label htmlFor="country" className={labelClasses}>{t('country') || 'Country'} *</Label>
          <Input
            id="country"
            name="country"
            value={customerInfo.country}
            onChange={handleChange}
            className={inputClasses}
            placeholder="United States"
            required
          />
        </motion.div>
      </div>
      
      <motion.div 
        variants={fieldVariants}
        className="mt-8"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white shadow-md h-12 text-lg"
          disabled={isProcessing || !isFormComplete()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('processing') || 'Processing'}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              {t('proceedToPayment') || 'Proceed to Payment'}
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default CustomerInfoForm;
