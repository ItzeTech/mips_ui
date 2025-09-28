// LogoutDialog.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiLogOut } from 'react-icons/fi';
import IconWrapper from '../../common/IconWrapper';
import { logout, logoutUserApi } from '../../../features/auth/authSlice';
import { AppDispatch } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../../hooks/useUserInfo';


interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { clearUser } = useUserInfo();

  const handleLogout = async () => {
    await dispatch(logoutUserApi());
    dispatch(logout());
    clearUser();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-xs sm:max-w-md z-50 overflow-hidden cust-transition-center mx-4 sm:mx-0"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 mb-3 sm:mb-4">
                <IconWrapper Icon={FiLogOut} className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              
              <h3 className="text-base sm:text-lg font-medium text-center text-gray-900 dark:text-white mb-2">
                {t('logout.confirm_logout')}
              </h3>
              
              <p className="text-xs sm:text-sm text-center text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                {t('logout.logout_confirmation_message')}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                  onClick={onClose}
                >
                  {t('logout.cancel')}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
                  onClick={handleLogout}
                >
                  {t('logout.logout')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogoutDialog;