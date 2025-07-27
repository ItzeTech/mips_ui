// components/dashboard/advancePayments/AdvancePaymentsHeader.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface AdvancePaymentsHeaderProps {
  onCreateClick: () => void;
}

const AdvancePaymentsHeader: React.FC<AdvancePaymentsHeaderProps> = ({ onCreateClick }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-5 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg">
              <BanknotesIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('advancePayments.title', 'Advance Payments')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t('advancePayments.subtitle', 'Manage supplier advance payments')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateClick}
            className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 hover:from-green-600 hover:via-teal-600 hover:to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
            <span>{t('advancePayments.create_new', 'New Advance Payment')}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AdvancePaymentsHeader;