// components/dashboard/advancePayments/AdvancePaymentsEmptyState.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BanknotesIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface AdvancePaymentsEmptyStateProps {
  hasSearch: boolean;
  onCreateClick: () => void;
}

const AdvancePaymentsEmptyState: React.FC<AdvancePaymentsEmptyStateProps> = ({ hasSearch, onCreateClick }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
    >
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        {hasSearch ? (
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
        ) : (
          <BanknotesIcon className="w-8 h-8 text-gray-400" />
        )}
      </div>
      
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        {hasSearch
          ? t('advancePayments.no_results', 'No matching advance payments found')
          : t('advancePayments.no_payments', 'No advance payments yet')}
      </h3>
      
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        {hasSearch
          ? t('advancePayments.try_another_search', 'Try adjusting your search terms or create a new advance payment.')
          : t('advancePayments.start_by_creating', 'Get started by creating your first advance payment for a supplier.')}
      </p>
      
      <div className="mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateClick}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {t('advancePayments.new_payment', 'New Advance Payment')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AdvancePaymentsEmptyState;