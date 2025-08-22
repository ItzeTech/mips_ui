// pages/expenses/CreateExpensePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  UserIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CalendarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { createExpense, resetCreateStatus } from '../../features/finance/expenseSlice';

const CreateExpensePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { createStatus, error: err } = useSelector((state: RootState) => state.expenses);
  
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [person, setPerson] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    if (createStatus === 'succeeded') {
      setShowSuccessMessage(true);
      // Reset form after success
      setDate(new Date().toISOString().split('T')[0]);
      setPerson('');
      setDescription('');
      setAmount(null);
      
      // Hide success message after delay
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        dispatch(resetCreateStatus());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [createStatus, dispatch]);
  
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
      const result = await dispatch(createExpense({
        date,
        person,
        description,
        amount
      })).unwrap();
      
      if (result) {
        // Navigate after short delay to show success message
        setTimeout(() => {
          navigate(`/expenses/${result.id}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || t('expenses.errors.create_failed', 'Failed to create expense'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/expenses');
  };
  
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className="mr-3 p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('expenses.create_title', 'Record New Expense')}
            </h1>
          </div>
          
          {/* Success message */}
          {showSuccessMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm text-green-700 dark:text-green-300"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('expenses.success', 'Success')}</p>
                  <p className="text-sm">{t('expenses.expense_created', 'Expense has been successfully recorded.')}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Error message from Redux */}
          {err && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm text-red-700 dark:text-red-300"
            >
              <div className="flex items-center">
                <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('expenses.error', 'Error')}</p>
                  <p className="text-sm">{err}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm"
          >
            <div className="flex items-center text-blue-800 dark:text-blue-300">
              <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">
                {t('expenses.form_tip', 'Enter expense details including date, person, description, and amount')}
              </span>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-red-500" />
              {t('expenses.expense_details', 'Expense Details')}
            </h2>
          </div>
          
          <div className="p-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
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
              
              <div className="mb-5">
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
              
              <div className="mb-5">
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
                    <span className="text-gray-400 font-medium">₣</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount === null ? '' : amount}
                    onChange={(e) => setAmount(e.target.value === '' ? null : Number(e.target.value))}
                    step="1"
                    min="0"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-red-500 focus:border-red-500 shadow-sm"
                    placeholder={t('expenses.amount_placeholder', 'Enter amount')}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('expenses.amount_note', 'Amount in Rwandan Francs (RWF)')}
                </p>
              </div>
              
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || !date || !person.trim() || !description.trim() || !amount}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? t('expenses.creating', 'Recording...') : t('expenses.create_expense', 'Record Expense')}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateExpensePage;