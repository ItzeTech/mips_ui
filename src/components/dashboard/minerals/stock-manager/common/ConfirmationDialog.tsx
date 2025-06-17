// components/dashboard/minerals/common/ConfirmationDialog.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  XMarkIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'warning' | 'info' | 'danger';
  changes?: Array<{ field: string; oldValue: any; newValue: any }>;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
  type = 'warning',
  changes = []
}) => {
  const { t } = useTranslation();

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: ExclamationTriangleIcon,
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'info':
        return {
          icon: CheckIcon,
          iconBg: 'bg-blue-100 dark:bg-blue-900/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
      default:
        return {
          icon: ExclamationTriangleIcon,
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
    }
  };

  const typeStyles = getTypeStyles();
  const IconComponent = typeStyles.icon;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[60] p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${typeStyles.iconBg} mr-4`}>
                    <IconComponent className={`w-6 h-6 ${typeStyles.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isLoading}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Message */}
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {message}
                </p>

                {/* Show changes if provided */}
                {changes.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('common.changes_to_be_made', 'Changes to be made:')}
                    </h4>
                    <div className="space-y-2">
                      {changes.map((change, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {change.field}:
                          </span>
                          <div className="ml-2 flex items-center space-x-2">
                            <span className="text-red-600 dark:text-red-400 line-through">
                              {change.oldValue ?? t('common.empty', 'Empty')}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {change.newValue ?? t('common.empty', 'Empty')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  {cancelText || t('common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${typeStyles.confirmBtn} ${
                    isLoading ? 'cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('common.saving', 'Saving...')}
                    </div>
                  ) : (
                    confirmText || t('common.confirm', 'Confirm')
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;