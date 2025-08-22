// pages/expenses/ViewExpensePage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getExpenseById, deleteExpense, resetUpdateStatus, resetDeleteStatus } from '../../features/finance/expenseSlice';

import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ExpenseHeader from '../../components/dashboard/expenses/ExpenseHeader';
import EditExpenseModal from '../../components/dashboard/expenses/EditExpenseModal';

const ViewExpensePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { expenseId } = useParams<{ expenseId: string }>();
  
  const { selectedExpense, status, error: err, updateStatus, deleteStatus } = useSelector((state: RootState) => state.expenses);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false);
  const [showDeleteSuccessMessage, setShowDeleteSuccessMessage] = useState(false);
  
  // Fetch expense data
  useEffect(() => {
    if (expenseId) {
      dispatch(getExpenseById(expenseId));
    }
  }, [expenseId, dispatch]);

  // Handle showing update success message
  useEffect(() => {
    if (updateStatus === 'succeeded') {
      setShowUpdateSuccessMessage(true);
      setShowEditModal(false); // Close the edit modal on success
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowUpdateSuccessMessage(false);
        dispatch(resetUpdateStatus());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [updateStatus, dispatch]);

  // Handle showing delete success message
  useEffect(() => {
    if (deleteStatus === 'succeeded') {
      setShowDeleteSuccessMessage(true);
      
      // Navigate back to list after short delay
      const timer = setTimeout(() => {
        navigate('/expenses');
        dispatch(resetDeleteStatus());
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [deleteStatus, navigate, dispatch]);
  
  const handleGoBack = useCallback(() => {
    navigate('/expenses');
  }, [navigate]);
  
  const handleEdit = useCallback(() => {
    setShowEditModal(true);
  }, []);
  
  const handleDelete = useCallback(() => {
    if (expenseId && window.confirm(t('expenses.confirm_delete', 'Are you sure you want to delete this expense?'))) {
      dispatch(deleteExpense(expenseId));
    }
  }, [expenseId, dispatch, t]);
  
  const formatAmount = useCallback((amount: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);
  
  if (status === 'loading' && !selectedExpense) {
    return <LoadingSkeleton />;
  }
  
  if (!selectedExpense) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('expenses.expense_not_found', 'Expense not found')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('expenses.expense_not_found_desc', 'The expense you are looking for does not exist or has been removed.')}
          </p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoBack}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('expenses.go_back', 'Go Back to Expenses')}
          </motion.button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
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
              {t('expenses.view_title', 'View Expense')}
            </h1>
          </div>
          
          {/* Display error message if it exists */}
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

          {/* Success message for updating expense */}
          {showUpdateSuccessMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm text-green-700 dark:text-green-300"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('expenses.success', 'Success')}</p>
                  <p className="text-sm">{t('expenses.expense_updated', 'Expense has been successfully updated.')}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success message for deleting expense */}
          {showDeleteSuccessMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm text-green-700 dark:text-green-300"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('expenses.success', 'Success')}</p>
                  <p className="text-sm">{t('expenses.expense_deleted', 'Expense has been successfully deleted.')}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <ExpenseHeader 
            expense={selectedExpense}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Expense details card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2 text-red-500" />
                {t('expenses.expense_info', 'Expense Information')}
              </h2>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('expenses.amount', 'Amount')}
                </p>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatAmount(selectedExpense.amount)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('expenses.description', 'Description')}
                </p>
                <div className="flex items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedExpense.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Person info card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-red-500" />
                {t('expenses.person_info', 'Person & Date Information')}
              </h2>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('expenses.person', 'Person')}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedExpense.person}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('expenses.date', 'Date')}
                </p>
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedExpense.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Audit info card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('expenses.audit_info', 'Audit Information')}
            </h2>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('expenses.created_at', 'Created At')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedExpense.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('expenses.id', 'Expense ID')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white font-mono text-sm">
                  {selectedExpense.id}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Edit Modal */}
      {selectedExpense && (
        <EditExpenseModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          expense={selectedExpense}
        />
      )}
    </div>
  );
};

export default ViewExpensePage;