import { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

interface NotificationData {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  notification_type?: string;
}

export const useSmartNotifications = () => {
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );
  
  // Keep track of shown notifications to prevent duplicates
  const shownNotifications = useRef(new Set<string>());
  const toastIds = useRef(new Map<string, string>());

  // Clear old notification IDs periodically (every 5 minutes)
  useEffect(() => {
    const cleanup = setInterval(() => {
      // Only keep notifications from the last 5 minutes
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const currentIds = Array.from(shownNotifications.current);
      
      currentIds.forEach(id => {
        // Extract timestamp from ID if it contains one, or remove old IDs
        const parts = id.split('-');
        const timestamp = parseInt(parts[parts.length - 1]);
        if (!isNaN(timestamp) && timestamp < fiveMinutesAgo) {
          shownNotifications.current.delete(id);
          const toastId = toastIds.current.get(id);
          if (toastId) {
            toast.dismiss(toastId);
            toastIds.current.delete(id);
          }
        }
      });
    }, 60000); // Run every minute

    return () => clearInterval(cleanup);
  }, []);

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const handleFocus = () => setIsPageVisible(true);
    const handleBlur = () => setIsPageVisible(false);
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const requestBrowserNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setBrowserNotificationPermission(permission);
      return permission;
    }
    return Notification.permission;
  }, []);

  // Check if notification was already shown
  const wasNotificationShown = useCallback((id: string) => {
    return shownNotifications.current.has(id);
  }, []);

  // Mark notification as shown
  const markNotificationAsShown = useCallback((id: string) => {
      shownNotifications.current.add(id);
    }, []);
    
  const showToastNotification = useCallback((notification: NotificationData) => {
  // Prevent duplicates early
  if (wasNotificationShown(notification.id)) {
    console.log('Duplicate toast notification prevented:', notification.id);
    return;
  }

  // Mark before showing
  markNotificationAsShown(notification.id);

  const { title, message, type = 'info', notification_type } = notification;
  const toastMessage = title ? `${title}\n${message}` : message;

  const toastOptions = {
    duration: 6000,
    position: 'top-right' as const,
    style: {
      maxWidth: '400px',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      lineHeight: '1.4',
    },
    className: getToastClassName(notification_type),
    id: notification.id, // important!
  };

  let toastId: string;

  switch (type) {
    case 'success':
      toastId = toast.success(toastMessage, { ...toastOptions, icon: '✅' });
      break;
    case 'error':
      toastId = toast.error(toastMessage, { ...toastOptions, icon: '❌', duration: 8000 });
      break;
    case 'warning':
      toastId = toast(toastMessage, {
        ...toastOptions,
        icon: '⚠️',
        style: {
          ...toastOptions.style,
          background: '#fef3c7',
          color: '#92400e',
          border: '1px solid #fbbf24',
        },
      });
      break;
    default:
      toastId = toast(toastMessage, {
        ...toastOptions,
        icon: getNotificationIcon(notification_type),
      });
  }

  toastIds.current.set(notification.id, toastId);
}, [wasNotificationShown, markNotificationAsShown]);


  const showBrowserNotification = useCallback((notification: NotificationData) => {
    // Check for duplicates
    if (wasNotificationShown(notification.id)) {
      console.log('Duplicate browser notification prevented:', notification.id);
      return null;
    }

    if (browserNotificationPermission === 'granted') {
      const { title = 'New Notification', message, id } = notification;
      
      const browserNotification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: id,
        badge: '/favicon.ico',
        silent: false,
        requireInteraction: false
      });

      // Mark as shown
      markNotificationAsShown(notification.id);

      setTimeout(() => {
        browserNotification.close();
      }, 6000);

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };

      return browserNotification;
    }
    return null;
  }, [browserNotificationPermission, wasNotificationShown, markNotificationAsShown]);

  const showSmartNotification = useCallback((notification: NotificationData) => {
  const uniqueId = notification.id;

  if (wasNotificationShown(uniqueId)) {
    console.log('Duplicate smart notification prevented:', uniqueId);
    return;
  }

  // ✅ Mark immediately here
  
  const enhancedNotification = { ...notification, id: uniqueId };
  
  if (isPageVisible) {
    showToastNotification(enhancedNotification);
} else {
    if (browserNotificationPermission === 'granted') {
      // showBrowserNotification(enhancedNotification);
      showToastNotification(enhancedNotification);
    } else if (browserNotificationPermission === 'denied') {
        showToastNotification(enhancedNotification);
    } else {
      requestBrowserNotificationPermission().then((permission) => {
          if (permission === 'granted') {
              // showBrowserNotification(enhancedNotification);
              showToastNotification(enhancedNotification);
            } else {
                showToastNotification(enhancedNotification);
            }
        });
    }
}
markNotificationAsShown(uniqueId);
}, [
  isPageVisible,
  browserNotificationPermission,
  showToastNotification,
  requestBrowserNotificationPermission,
  wasNotificationShown,
  markNotificationAsShown,
]);


  // Method to manually dismiss a notification
  const dismissNotification = useCallback((notificationId: string) => {
    const toastId = toastIds.current.get(notificationId);
    if (toastId) {
      toast.dismiss(toastId);
      toastIds.current.delete(notificationId);
    }
  }, []);

  // Method to clear all notifications
  const clearAllNotifications = useCallback(() => {
    toast.dismiss();
    shownNotifications.current.clear();
    toastIds.current.clear();
  }, []);

  return {
    isPageVisible,
    browserNotificationPermission,
    showSmartNotification,
    showToastNotification,
    showBrowserNotification,
    requestBrowserNotificationPermission,
    dismissNotification,
    clearAllNotifications,
    wasNotificationShown,
  };
};

// Helper functions remain the same
const getNotificationIcon = (notificationType?: string) => {
  switch (notificationType) {
    case 'dashboard_update': return '📊';
    case 'payment_reminder': return '💰';
    case 'mineral_analysis': return '🔬';
    case 'export_ready': return '🚚';
    case 'quality_alert': return '⚠️';
    case 'system_alert': return '🔔';
    default: return '📋';
  }
};

const getToastClassName = (notificationType?: string) => {
  switch (notificationType) {
    case 'dashboard_update': return 'toast-dashboard';
    case 'payment_reminder': return 'toast-payment';
    case 'mineral_analysis': return 'toast-analysis';
    case 'export_ready': return 'toast-export';
    case 'quality_alert': return 'toast-quality';
    case 'system_alert': return 'toast-system';
    default: return 'toast-default';
  }
};