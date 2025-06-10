import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl"
    >
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">{t('settings')}</h1>
      <p className="text-gray-600 dark:text-gray-300">
        This is the settings page. Content will be added here later.
      </p>
      {/* Example Setting Section */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">Account Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences.</p>
        {/* Placeholder for actual settings options */}
      </div>
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">Notification Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure how you receive notifications.</p>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
