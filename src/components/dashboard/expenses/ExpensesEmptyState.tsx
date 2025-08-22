// components/dashboard/expenses/ExpensesEmptyState.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ReceiptRefundIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ExpensesEmptyStateProps {
  hasSearch: boolean;
  onCreateClick: () => void;
}

const ExpensesEmptyState: React.FC<ExpensesEmptyStateProps> = ({ hasSearch, onCreateClick }) => {
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
          <ReceiptRefundIcon className="w-8 h-8 text-gray-400" />
        )}
      </div>
      
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        {hasSearch
          ? t('expenses.no_results', 'No matching expenses found')
          : t('expenses.no_expenses', 'No expenses recorded yet')}
      </h3>
      
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        {hasSearch
          ? t('expenses.try_another_search', 'Try adjusting your search terms or record a new expense.')
          : t('expenses.start_by_creating', 'Get started by recording your first expense.')}
      </p>
      
      <div className="mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateClick}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {t('expenses.new_expense', 'Record Expense')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ExpensesEmptyState;