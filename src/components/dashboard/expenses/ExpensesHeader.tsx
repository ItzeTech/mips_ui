// components/dashboard/expenses/ExpensesHeader.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';

interface ExpensesHeaderProps {
  onCreateClick: () => void;
}

const ExpensesHeader: React.FC<ExpensesHeaderProps> = ({ onCreateClick }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-5 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-rose-500 to-red-500 rounded-xl shadow-lg">
              <ReceiptRefundIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('expenses.title', 'Expenses')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t('expenses.subtitle', 'Track and manage company expenses')}
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
            className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 hover:from-rose-600 hover:via-red-600 hover:to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
            <span>{t('expenses.create_new', 'Record Expense')}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ExpensesHeader;