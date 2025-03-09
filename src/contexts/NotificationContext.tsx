
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isNotificationSupported, 
  requestNotificationPermission,
  showNotification,
  showOrderUpdateNotification,
  showPromotionNotification
} from '../services/notificationService';
import { toast } from 'sonner';

interface NotificationContextType {
  permissionStatus: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  notifyOrderUpdate: (orderId: string, status: string) => void;
  notifyPromotion: (title: string, description: string, url?: string) => void;
  notifyGeneral: (title: string, body: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const isSupported = isNotificationSupported();
  
  // Check permission on mount
  useEffect(() => {
    if (isSupported) {
      setPermissionStatus(Notification.permission);
    }
  }, [isSupported]);
  
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      toast.error('Notifications are not supported in your browser');
      return 'denied';
    }
    
    try {
      const permission = await requestNotificationPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        toast.success('Notification permission granted!');
        // Send a welcome notification
        showNotification('Notifications Enabled', {
          body: 'You will now receive updates about your orders and special promotions.',
        });
      } else if (permission === 'denied') {
        toast.error('Notification permission denied');
      }
      
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      return 'denied';
    }
  };
  
  const notifyOrderUpdate = (orderId: string, status: string): void => {
    showOrderUpdateNotification(orderId, status);
    // Also show as toast for users who haven't enabled notifications
    toast.info(`Order #${orderId} is now ${status}`);
  };
  
  const notifyPromotion = (title: string, description: string, url?: string): void => {
    showPromotionNotification(title, description, url);
    // Also show as toast for users who haven't enabled notifications
    toast.info(title, {
      description,
      action: url ? { label: 'View', onClick: () => window.open(url, '_blank') } : undefined
    });
  };
  
  const notifyGeneral = (title: string, body: string): void => {
    showNotification(title, { body });
    // Also show as toast for users who haven't enabled notifications
    toast.info(title, { description: body });
  };
  
  return (
    <NotificationContext.Provider value={{
      permissionStatus,
      isSupported,
      requestPermission,
      notifyOrderUpdate,
      notifyPromotion,
      notifyGeneral,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
