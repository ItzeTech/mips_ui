import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface PaymentsEmptyStateProps {
  hasSearch: boolean;
  onCreateClick: () => void;
}

const PaymentsEmptyState: React.FC<PaymentsEmptyStateProps> = ({ hasSearch, onCreateClick }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
    >
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
        {hasSearch ? (
          <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
        ) : (
          <CurrencyDollarIcon className="h-8 w-8 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {hasSearch 
          ? t('payments.no_search_results', 'No payments found')
          : t('payments.no_payments', 'No payments yet')
        }
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {hasSearch 
          ? t('payments.no_search_results_desc', 'Try adjusting your search criteria or create a new payment.')
          : t('payments.no_payments_desc', 'Get started by creating your first payment for mineral deliveries.')
        }
      </p>
      
      {!hasSearch && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateClick}
          className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {t('payments.create_first', 'Create First Payment')}
        </motion.button>
      )}
    </motion.div>
  );
};

export default PaymentsEmptyState;