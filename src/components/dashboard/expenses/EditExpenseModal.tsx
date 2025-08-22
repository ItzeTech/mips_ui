// components/dashboard/expenses/EditExpenseModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  XMarkIcon, 
  ExclamationCircleIcon,
  UserIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { Expense, updateExpense } from '../../../features/finance/expenseSlice';

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ isOpen, onClose, expense }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const [date, setDate] = useState<string>(new Date(expense.date).toISOString().split('T')[0]);
  const [person, setPerson] = useState<string>(expense.person);
  const [description, setDescription] = useState<string>(expense.description);
  const [amount, setAmount] = useState<number>(expense.amount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!date) {
      setError(t('expenses.errors.valid_date', 'Please enter a valid date'));
      setIsSubmitting(false);
      return;
    }
    
    if (!person.trim()) {
      setError(t('expenses.errors.valid_person', 'Please enter a person name'));
      setIsSubmitting(false);
      return;
    }
    
    if (!description.trim()) {
      setError(t('expenses.errors.valid_description', 'Please enter a description'));
      setIsSubmitting(false);
      return;
    }
    
    if (!amount || amount <= 0) {
      setError(t('expenses.errors.valid_amount', 'Please enter a valid amount'));
      setIsSubmitting(false);
      return;
    }
    
    try {
      await dispatch(updateExpense({
        id: expense.id,
        updateData: { date, person, description, amount }
      })).unwrap();
      onClose();
    } catch (err: any) {
      setError(err.message || t('expenses.errors.update_failed', 'Failed to update expense'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('expenses.edit_expense', 'Edit Expense')}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    <div className="flex">
                      <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                      {error}
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('expenses.date', 'Date')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-red-500 focus:border-red-500 shadow-sm"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="person" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('expenses.person', 'Person')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="person"
                      value={person}
                      onChange={(e) => setPerson(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-red-500 focus:border-red-500 shadow-sm"
                      placeholder={t('expenses.person_placeholder', 'Enter person name')}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('expenses.description', 'Description')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-red-500 focus:border-red-500 shadow-sm"
                      placeholder={t('expenses.description_placeholder', 'Enter expense description')}
                    />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('expenses.amount', 'Amount')} (RWF)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      step="1"
                      min="0"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-red-500 focus:border-red-500 shadow-sm"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {t('expenses.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('expenses.saving', 'Saving...') : t('expenses.save_changes', 'Save Changes')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditExpenseModal;