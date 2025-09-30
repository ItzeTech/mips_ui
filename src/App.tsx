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
  
  useEffect(() => {
  if (!token) return;
    
  const client = new WSClient({ token });

  client.connectBroadcast((msg) => {
    console.log("📢 Broadcast received:", msg);
    // Handle broadcast message to update Redux state
    
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