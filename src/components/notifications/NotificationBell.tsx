
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationBell: React.FC = () => {
  const { permissionStatus, isSupported, requestPermission } = useNotifications();
  
  const handleClick = async () => {
    if (permissionStatus !== 'granted' && isSupported) {
      await requestPermission();
    } else {
      // Could show notification settings in the future
      console.log('Notifications already enabled');
    }
  };
  
  // Different states based on permission
  let tooltipText = 'Enable notifications';
  let buttonVariant: 'ghost' | 'outline' = 'ghost';
  
  if (!isSupported) {
    tooltipText = 'Your browser does not support notifications';
  } else if (permissionStatus === 'granted') {
    tooltipText = 'Notifications are enabled';
    buttonVariant = 'outline';
  } else if (permissionStatus === 'denied') {
    tooltipText = 'Please enable notifications in your browser settings';
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={buttonVariant} 
            size="icon" 
            onClick={handleClick} 
            disabled={!isSupported || permissionStatus === 'denied'}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {permissionStatus === 'granted' && (
              <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-2 h-2" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotificationBell;
