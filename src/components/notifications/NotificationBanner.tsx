
import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBanner: React.FC = () => {
  const { permissionStatus, isSupported, requestPermission } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Check if we should show the banner
  useEffect(() => {
    // Only show if supported and permission is not granted or denied
    const shouldShow = isSupported && 
                      permissionStatus === 'default' && 
                      !isDismissed;
    
    // Show banner with a delay for better UX
    let timer: NodeJS.Timeout;
    if (shouldShow) {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    } else {
      setIsVisible(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [permissionStatus, isSupported, isDismissed]);
  
  const handleEnable = async () => {
    const result = await requestPermission();
    if (result !== 'granted') {
      // If user denied in browser prompt, hide banner anyway
      setIsDismissed(true);
    }
  };
  
  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-0 right-0 mx-auto max-w-md z-50 px-4"
        >
          <div className="bg-primary-50 border border-primary-200 rounded-lg shadow-md p-4 flex items-center gap-3">
            <div className="bg-primary-100 rounded-full p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Enable notifications</p>
              <p className="text-xs text-muted-foreground">
                Get updates on your orders and exclusive promotions
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDismiss} 
                className="text-xs h-8"
              >
                Later
              </Button>
              <Button 
                size="sm" 
                onClick={handleEnable} 
                className="text-xs h-8"
              >
                Enable
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBanner;
