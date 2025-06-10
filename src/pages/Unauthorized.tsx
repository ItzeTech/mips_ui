import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import IconWrapper from '../components/common/IconWrapper';

const Unauthorized: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 p-4 sm:p-6 lg:p-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-8 pt-8 pb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-yellow-600 dark:from-red-600 dark:to-yellow-700"
            >
              <IconWrapper Icon={FiAlertTriangle} className="h-10 w-10 text-white" />
            </motion.div>

            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white"
            >
              {t('unauthorized.title')}
            </motion.h2>

            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300"
            >
              {t('unauthorized.description')}
            </motion.p>
          </div>

          <div className="px-8 pb-8 text-center">
            <Link
              to="/dashboard"
              className="inline-block mt-4 px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
            >
              {t('unauthorized.go_to_dashboard')}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Unauthorized;
