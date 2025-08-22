// components/dashboard/expenses/ExpenseHeader.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  PencilIcon, 
  TrashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Expense } from '../../../features/finance/expenseSlice';

interface ExpenseHeaderProps {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}

const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({ expense, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center mb-2">
            <CalendarIcon className="w-5 h-5 mr-2 text-red-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(expense.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {expense.description}
          </h2>
          <div className="flex items-center mt-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">{t('expenses.person_label', 'Person')}:</span> {expense.person}
            </div>
            <div className="ml-4 text-sm font-semibold text-red-600 dark:text-red-400">
              {new Intl.NumberFormat('rw-RW', {
                style: 'currency',
                currency: 'RWF',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(expense.amount)}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <div className="flex items-center">
              <PencilIcon className="w-4 h-4 mr-1" />
              {t('expenses.edit', 'Edit')}
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <div className="flex items-center">
              <TrashIcon className="w-4 h-4 mr-1" />
              {t('expenses.delete', 'Delete')}
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseHeader;