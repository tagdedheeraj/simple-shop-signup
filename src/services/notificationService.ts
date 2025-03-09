import { showNotification as show } from './utils';

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return 'denied';
  }

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

export const showNotification = (title: string, options: NotificationOptions = {}) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, options);
    
    // Fix the onclick property by using addEventListener instead
    if (options.data && (options.data as any).url) {
      notification.addEventListener('click', () => {
        window.open((options.data as any).url);
      });
    }
    
    return true;
  }

  return false;
};

export const notify = (title: string, body: string, url?: string) => {
  show(title, {
    body: body,
    icon: '/android-chrome-192x192.png',
    data: { url }
  });
};
