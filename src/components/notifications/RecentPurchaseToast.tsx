
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Product } from '@/types/product';

// Sample data for recent purchases
const DEMO_PURCHASES = [
  { 
    id: '1', 
    customerName: 'Rahul M.', 
    location: 'Mumbai', 
    productId: 'prod-1',
    productName: 'Fresh Pomegranates',
    timeAgo: '2 minutes'
  },
  { 
    id: '2', 
    customerName: 'Priya S.', 
    location: 'Bangalore', 
    productId: 'prod-2',
    productName: 'Premium Grapes',
    timeAgo: '4 minutes'
  },
  { 
    id: '3', 
    customerName: 'Amit K.', 
    location: 'Delhi', 
    productId: 'prod-3',
    productName: 'Organic Bananas',
    timeAgo: '7 minutes'
  },
  { 
    id: '4', 
    customerName: 'Sneha R.', 
    location: 'Kolkata', 
    productId: 'prod-4',
    productName: 'Fresh Dragon Fruit',
    timeAgo: '12 minutes'
  },
  { 
    id: '5', 
    customerName: 'Vikram P.', 
    location: 'Chennai', 
    productId: 'prod-5',
    productName: 'Drumsticks',
    timeAgo: '15 minutes'
  }
];

interface PurchaseNotification {
  id: string;
  customerName: string;
  location: string;
  productId: string;
  productName: string;
  timeAgo: string;
}

// Component for showing random purchase notifications
const RecentPurchaseToast: React.FC = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;
    
    // Random interval between 25-45 seconds for natural feeling
    const intervalTime = Math.floor(Math.random() * (45000 - 25000) + 25000);
    
    const interval = setInterval(() => {
      // Pick a random purchase from our sample data
      const randomPurchase = DEMO_PURCHASES[Math.floor(Math.random() * DEMO_PURCHASES.length)];
      showPurchaseNotification(randomPurchase);
    }, intervalTime);
    
    // Show first notification quickly (after 5 seconds)
    const initialTimer = setTimeout(() => {
      const firstPurchase = DEMO_PURCHASES[0];
      showPurchaseNotification(firstPurchase);
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [isActive]);
  
  const showPurchaseNotification = (purchase: PurchaseNotification) => {
    toast(
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 border border-green-200 bg-green-50">
          <AvatarFallback className="bg-green-100 text-green-700">
            {purchase.customerName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">
            {purchase.customerName} from {purchase.location}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            <span>purchased <span className="font-medium text-foreground">{purchase.productName}</span></span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{purchase.timeAgo} ago</p>
        </div>
      </div>,
      {
        position: "bottom-left",
        duration: 4000,
        icon: <ShoppingBag className="h-5 w-5 text-green-600" />
      }
    );
  };
  
  // The component doesn't render anything visible directly
  return null; 
};

export default RecentPurchaseToast;
