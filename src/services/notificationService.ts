
// Browser Notification Service

// Check if browser notifications are supported
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

// Request permission to show notifications
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    console.error('Notifications not supported in this browser');
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

// Show a notification
export const showNotification = (
  title: string, 
  options: NotificationOptions = {}
): Notification | null => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    console.warn('Notifications not allowed');
    return null;
  }
  
  // Default options
  const defaultOptions: NotificationOptions = {
    icon: '/lovable-uploads/2a6a68af-beec-4906-b6e9-5eb249505820.png',
    badge: '/lovable-uploads/2a6a68af-beec-4906-b6e9-5eb249505820.png',
    ...options
  };
  
  try {
    const notification = new Notification(title, defaultOptions);
    
    // Add click handler if not provided
    if (!options.onclick) {
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
    
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Show an order update notification
export const showOrderUpdateNotification = (
  orderId: string,
  status: string
): Notification | null => {
  return showNotification(`Order #${orderId} Update`, {
    body: `Your order status is now: ${status}`,
    tag: `order-${orderId}`,
  });
};

// Show a promotion notification
export const showPromotionNotification = (
  title: string,
  description: string,
  url?: string
): Notification | null => {
  const notification = showNotification(title, {
    body: description,
    tag: `promo-${Date.now()}`,
  });
  
  if (notification && url) {
    notification.onclick = () => {
      window.open(url, '_blank');
      notification.close();
    };
  }
  
  return notification;
};
