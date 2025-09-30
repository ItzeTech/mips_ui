import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

interface NotificationPermissionBannerProps {
  onRequestPermission: () => Promise<NotificationPermission>;
}

const NotificationPermissionBanner: React.FC<NotificationPermissionBannerProps> = ({
  onRequestPermission,
}) => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we should show the banner
    const shouldShow = 
      'Notification' in window &&
      Notification.permission === 'default' &&
      !dismissed &&
      !localStorage.getItem('notification-permission-dismissed');

    if (shouldShow) {
      // Show banner after a slight delay
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [dismissed]);

  const handleRequestPermission = async () => {
    const permission = await onRequestPermission();
    setShow(false);
    if (permission === 'denied') {
      localStorage.setItem('notification-permission-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('notification-permission-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-2xl max-w-sm border border-blue-400"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <BellIcon className="w-6 h-6 text-blue-100" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold mb-1">Enable Notifications</h4>
              <p className="text-sm text-blue-100 mb-3">
                Get instant updates about your mineral processing operations, even when you're away.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  Enable
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 bg-transparent hover:bg-white/10 border border-white/20 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPermissionBanner;