import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import AppRoutes from './routes/AppRoutes';
import { useThemeEffect } from './hooks/useTheme';
import { useSmartNotifications } from './hooks/useSmartNotifications';
import { WSClient } from './config/wsClient';
import { useAuth } from './hooks/useAuth';
import NotificationPermissionBanner from './components/common/NotificationPermissionBanner';
import { 
  handleWebSocketNotification, 
  fetchNotificationStats 
} from './features/user/notificationsSlice';
import './toast.css';
import { useBroadcastHandler } from './hooks/useBroadcastHandler';
import { refreshWebSocketToken } from './config/wsTokenManager';
import { store as storeRef } from './store/store';

function App() {
  useThemeEffect();
  const { token } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { 
    showSmartNotification, 
    requestBrowserNotificationPermission,
    wasNotificationShown
  } = useSmartNotifications();

  const { handleBroadcastMessage } = useBroadcastHandler();

   // ⭐ Display environment configuration in console (works in both dev and production)
  useEffect(() => {
    const envConfig = {
      'Environment': process.env.NODE_ENV,
      'API Base URL': process.env.REACT_APP_API_BASE_URL,
      'WebSocket URL': process.env.REACT_APP_WS_BASE_URL,
      'Build Time': new Date().toISOString(),
      'User Agent': navigator.userAgent,
    };

    // Only log environment info in non-production to avoid leaking data in production builds.
    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      console.log('%c🌍 Application Environment Configuration', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
      console.table(envConfig);
      /* eslint-enable no-console */
    }
    
    // Also make it available globally for easy access
    (window as any).__APP_ENV__ = envConfig;

    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      console.log('%cℹ️ Tip: Type "__APP_ENV__" in console to view configuration anytime', 'color: #2196F3; font-style: italic;');
      /* eslint-enable no-console */
    }
  }, []);
  
  useEffect(() => {
  if (!token) return;
    
  const client = new WSClient({ 
    token,
    onTokenExpired: async () => {
      // Handle token expiration and refresh logic
      const newToken = await refreshWebSocketToken(storeRef);
      return newToken;
    }
  });

  client.connectBroadcast((msg) => {    
    handleBroadcastMessage(msg);
  });

  client.connectUser((msg) => {
    dispatch(handleWebSocketNotification(msg));

    if (msg.event_type === 'new_notification' && msg.notification) {
      dispatch(fetchNotificationStats());

      const notificationId = msg.notification.id;

      if (!wasNotificationShown(notificationId)) {
        const notificationData = {
          id: notificationId,
          title: msg.notification.title,
          message: msg.notification.message,
          type: getNotificationType(msg.notification.notification_type),
          notification_type: msg.notification.notification_type,
        };
        showSmartNotification(notificationData);
      }
    }
  });

  return () => {
    client.close();
  };
}, [token, dispatch, wasNotificationShown, showSmartNotification, handleBroadcastMessage]);


  const getNotificationType = (notificationType?: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (notificationType) {
      case 'quality_alert':
      case 'system_alert':
        return 'warning';
      case 'payment_reminder':
        return 'error';
      case 'mineral_analysis':
      case 'export_ready':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <BrowserRouter>
      <NotificationPermissionBanner 
        onRequestPermission={requestBrowserNotificationPermission}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
