
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';
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
  const [activeToastId, setActiveToastId] = useState<string | null>(null);

  const toggleNotifications = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (!isActive) return;
    
    // Random interval between 25-45 seconds for natural feeling
    const intervalTime = Math.floor(Math.random() * (45000 - 25000) + 25000);
    
    const interval = setInterval(() => {
      // Only show a new notification if no active toast
      if (!activeToastId) {
        // Pick a random purchase from our sample data
        const randomPurchase = DEMO_PURCHASES[Math.floor(Math.random() * DEMO_PURCHASES.length)];
        showPurchaseNotification(randomPurchase);
      }
    }, intervalTime);
    
    // Show first notification quickly (after 5 seconds)
    const initialTimer = setTimeout(() => {
      if (!activeToastId) {
        const firstPurchase = DEMO_PURCHASES[0];
        showPurchaseNotification(firstPurchase);
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [isActive, activeToastId]);
  
  const showPurchaseNotification = (purchase: PurchaseNotification) => {
    // First dismiss any existing notification
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }
    
    // Set the new active toast ID
    setActiveToastId(purchase.id);
    
    toast(
      <div className="flex items-start gap-3 pointer-events-auto">
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
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(purchase.id);
            setActiveToastId(null);
          }} 
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Close notification"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>,
      {
        id: purchase.id,
        position: "top-right",
        duration: 2000, // Auto hide after 2 seconds
        onDismiss: () => setActiveToastId(null), // Clear active toast ID when dismissed
        icon: <ShoppingBag className="h-5 w-5 text-green-600" />,
        style: { zIndex: 40 }, // Lower z-index to not block interactions
        className: "pointer-events-auto" // Ensure the toast itself is clickable
      }
    );
  };
  
  // The component doesn't render anything visible directly
  return null; 
};

export default RecentPurchaseToast;
