
import React from 'react';
import { ShieldCheck, CreditCard } from 'lucide-react';

const PaymentTrustBadges: React.FC = () => {
  return (
    <div className="pt-4 border-t border-border">
      <div className="flex items-center mb-3">
        <ShieldCheck className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-medium">Secure Payment Options</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {/* PayPal */}
        <div className="flex flex-col items-center justify-center p-3 bg-white border border-border rounded-md shadow-sm">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png" 
            alt="PayPal" 
            className="h-6 object-contain" 
          />
          <span className="text-xs text-muted-foreground mt-1">PayPal</span>
        </div>
        
        {/* Visa */}
        <div className="flex flex-col items-center justify-center p-3 bg-white border border-border rounded-md shadow-sm">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" 
            alt="Visa" 
            className="h-5 object-contain" 
          />
          <span className="text-xs text-muted-foreground mt-1">Visa</span>
        </div>
        
        {/* Mastercard */}
        <div className="flex flex-col items-center justify-center p-3 bg-white border border-border rounded-md shadow-sm">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" 
            alt="Mastercard" 
            className="h-5 object-contain" 
          />
          <span className="text-xs text-muted-foreground mt-1">Mastercard</span>
        </div>
        
        {/* Generic Secure Payments */}
        <div className="flex flex-col items-center justify-center p-3 bg-white border border-border rounded-md shadow-sm">
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="text-xs text-muted-foreground mt-1">Others</span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-3 text-center">
        All transactions are secure and encrypted
      </p>
    </div>
  );
};

export default PaymentTrustBadges;
