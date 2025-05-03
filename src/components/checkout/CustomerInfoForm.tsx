
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-medium mb-4">{t('customerInformation') || 'Customer Information'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('fullName') || 'Full Name'} *</Label>
          <Input
            id="fullName"
            name="fullName"
            value={customerInfo.fullName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">{t('email') || 'Email'} *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={customerInfo.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">{t('phoneNumber') || 'Phone Number'} *</Label>
        <Input
          id="phone"
          name="phone"
          value={customerInfo.phone}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">{t('address') || 'Address'} *</Label>
        <Input
          id="address"
          name="address"
          value={customerInfo.address}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">{t('city') || 'City'} *</Label>
          <Input
            id="city"
            name="city"
            value={customerInfo.city}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">{t('state') || 'State'} *</Label>
          <Input
            id="state"
            name="state"
            value={customerInfo.state}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">{t('zipCode') || 'Zip Code'} *</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={customerInfo.zipCode}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">{t('country') || 'Country'} *</Label>
          <Input
            id="country"
            name="country"
            value={customerInfo.country}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isProcessing || !isFormComplete()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('processing') || 'Processing'}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {t('proceedToPayment') || 'Proceed to Payment'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CustomerInfoForm;
