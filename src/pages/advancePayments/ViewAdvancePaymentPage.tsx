// pages/ViewAdvancePaymentPage.tsx
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
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

import { useAdvancePayments } from '../../hooks/useAdvancePayments';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import AdvancePaymentHeader from '../../components/dashboard/advancePayments/AdvancePaymentHeader';
import EditAdvancePaymentModal from '../../components/dashboard/advancePayments/EditAdvancePaymentModal';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import Badge from '../../components/common/Badge';

const ViewAdvancePaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();
  
  const { loadAdvancePaymentById, selectedAdvancePayment, status } = useAdvancePayments();
  
  const { error: err, updateStatus, deleteStatus } = useSelector((state: RootState) => state.advancePayments);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false);
  const [showDeleteSuccessMessage, setShowDeleteSuccessMessage] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Only fetch on initial mount or when paymentId changes
  useEffect(() => {
    if (paymentId && (isInitialLoad || !selectedAdvancePayment || selectedAdvancePayment.id !== paymentId)) {
      loadAdvancePaymentById(paymentId);
      setIsInitialLoad(false);
    }
  }, [paymentId, isInitialLoad, selectedAdvancePayment, loadAdvancePaymentById]);

  // Handle showing update success message
  useEffect(() => {
    if (updateStatus === 'succeeded') {
      setShowUpdateSuccessMessage(true);
      setShowEditModal(false); // Close the edit modal on success
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowUpdateSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [updateStatus]);

  // Handle showing delete success message
  useEffect(() => {
    if (deleteStatus === 'succeeded') {
      setShowDeleteSuccessMessage(true);
      
      // Navigate back to list after short delay
      const timer = setTimeout(() => {
        navigate('/advance-payments');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [deleteStatus, navigate]);
  
  const handleGoBack = useCallback(() => {
    navigate('/advance-payments');
  }, [navigate]);
  
  const handleEdit = useCallback(() => {
    setShowEditModal(true);
  }, []);
  
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Add utility function to format currency based on payment currency
  const formatAmount = useCallback((amount: number, currency: string = 'RWF') => {
    if (currency === 'RWF') {
      return new Intl.NumberFormat('rw-RW', {
        style: 'currency',
        currency: 'RWF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }, []);
  
  if (status === 'loading' && !selectedAdvancePayment) {
    return <LoadingSkeleton />;
  }
  
  // More comprehensive null check that TypeScript can understand
  if (!selectedAdvancePayment) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('advancePayments.payment_not_found', 'Payment not found')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('advancePayments.payment_not_found_desc', 'The advance payment you are looking for does not exist or has been removed.')}
          </p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('advancePayments.go_back', 'Go Back to Advance Payments')}
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
              {t('advancePayments.view_title', 'View Advance Payment')}
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
                  <p className="font-medium">{t('advancePayments.error', 'Error')}</p>
                  <p className="text-sm">{err ? err.replace("_", " "): ''}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success message for updating payment */}
          {showUpdateSuccessMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm text-green-700 dark:text-green-300"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('advancePayments.success', 'Success')}</p>
                  <p className="text-sm">{t('advancePayments.payment_updated', 'Advance payment has been successfully updated.')}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success message for deleting payment */}
          {showDeleteSuccessMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm text-green-700 dark:text-green-300"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('advancePayments.success', 'Success')}</p>
                  <p className="text-sm">{t('advancePayments.payment_deleted', 'Advance payment has been successfully deleted.')}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <AdvancePaymentHeader 
            payment={selectedAdvancePayment}
            onEdit={handleEdit}
            onPrint={handlePrint}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Payment info card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <BanknotesIcon className="w-5 h-5 mr-2 text-blue-500" />
                {t('advancePayments.payment_info', 'Payment Information')}
              </h2>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('advancePayments.payment_status', 'Payment Status')}
                </p>
                <Badge 
                  color={selectedAdvancePayment.status === 'Paid' ? 'green' : 'yellow'}
                >
                  {t(`advancePayments.status.${selectedAdvancePayment.status.toLowerCase()}`, selectedAdvancePayment.status)}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('advancePayments.amount_with_currency', 'Amount & Currency')}
                </p>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatAmount(selectedAdvancePayment.amount, selectedAdvancePayment.currency || 'RWF')}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('advancePayments.payment_method', 'Payment Method')}
                </p>
                <div className="flex items-center">
                  <CreditCardIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedAdvancePayment.payment_method}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('advancePayments.payment_date', 'Payment Date')}
                </p>
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedAdvancePayment.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Supplier info card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
                {t('advancePayments.supplier_info', 'Supplier Information')}
              </h2>
            </div>
            
            <div className="p-5 space-y-4">
              {selectedAdvancePayment.supplier ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('advancePayments.supplier_name', 'Supplier Name')}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedAdvancePayment.supplier.name}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('advancePayments.supplier_contact', 'Contact Number')}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedAdvancePayment.supplier.phone_number}
                    </p>
                  </div>
                  
                  {selectedAdvancePayment.supplier.company && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {t('advancePayments.supplier_company', 'Company')}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedAdvancePayment.supplier.company}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  {t('advancePayments.supplier_not_available', 'Supplier information not available')}
                </p>
              )}
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
              {t('advancePayments.audit_info', 'Audit Information')}
            </h2>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('advancePayments.created_at', 'Created At')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedAdvancePayment.created_at).toLocaleString('en-US', {
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
                  {t('advancePayments.updated_at', 'Last Updated')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedAdvancePayment.updated_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Edit Modal */}
      <EditAdvancePaymentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        payment={selectedAdvancePayment}
      />
    </div>
  );
};

export default ViewAdvancePaymentPage;