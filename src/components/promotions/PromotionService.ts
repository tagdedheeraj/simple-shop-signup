
import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface Promotion {
  id: string;
  title: string;
  description: string;
  url?: string;
  delay: number;
}

const promotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Special Offer!',
    description: '20% off on all wheat products. Limited time offer!',
    url: '/products?category=wheat',
    delay: 20000 // 20 seconds
  },
  {
    id: 'promo-2',
    title: 'New Arrival',
    description: 'Check out our fresh seasonal fruits basket!',
    url: '/product/5',
    delay: 45000 // 45 seconds
  },
  {
    id: 'promo-3',
    title: 'Flash Sale',
    description: 'Basmati Rice at special price for the next 24 hours!',
    url: '/product/2',
    delay: 70000 // 70 seconds
  }
];

export const usePromotionService = () => {
  const { notifyPromotion, permissionStatus } = useNotifications();

  useEffect(() => {
    // Only show promotions if notifications are enabled
    if (permissionStatus !== 'granted') return;

    // Get shown promotions from storage
    const shownPromotionsStr = localStorage.getItem('shownPromotions') || '[]';
    const shownPromotions = new Set(JSON.parse(shownPromotionsStr));
    
    // Set timeouts for each promotion
    const timeouts: NodeJS.Timeout[] = [];
    
    promotions.forEach((promo) => {
      // Only show if not already shown
      if (!shownPromotions.has(promo.id)) {
        const timeout = setTimeout(() => {
          notifyPromotion(promo.title, promo.description, promo.url);
          
          // Mark as shown
          shownPromotions.add(promo.id);
          localStorage.setItem('shownPromotions', JSON.stringify([...shownPromotions]));
        }, promo.delay);
        
        timeouts.push(timeout);
      }
    });
    
    return () => {
      // Clear all timeouts on unmount
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [notifyPromotion, permissionStatus]);
};

// Reset shown promotions (for testing)
export const resetShownPromotions = () => {
  localStorage.removeItem('shownPromotions');
};
