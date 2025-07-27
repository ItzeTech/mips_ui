// pages/ViewAdvancePaymentPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import { useAdvancePayments } from '../../hooks/useAdvancePayments';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import AdvancePaymentHeader from '../../components/dashboard/advancePayments/AdvancePaymentHeader';
import AdvancePaymentDetails from '../../components/dashboard/advancePayments/AdvancePaymentDetails';
import EditAdvancePaymentModal from '../../components/dashboard/advancePayments/EditAdvancePaymentModal';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

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
  
  if (status === 'loading' && !selectedAdvancePayment) {
    return <LoadingSkeleton />;
  }
  
  if (!selectedAdvancePayment && status !== 'loading') {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('advancePayments.payment_not_found', 'Payment not found')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('advancePayments.payment_not_found_desc', 'The advance payment you are looking for does not exist or has been removed.')}
          </p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('advancePayments.go_back', 'Go Back to Advance Payments')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleGoBack}
              className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('advancePayments.view_title', 'View Advance Payment')}
            </h1>
          </div>
          
          {/* Display error message if it exists */}
          {err && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              <div className="flex items-center">
                <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('advancePayments.error', 'Error')}</p>
                  <p className="text-sm">{err ? err.replace("_", " "): ''}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success message for updating payment */}
          {showUpdateSuccessMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('advancePayments.success', 'Success')}</p>
                  <p className="text-sm">{t('advancePayments.payment_updated', 'Advance payment has been successfully updated.')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success message for deleting payment */}
          {showDeleteSuccessMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('advancePayments.success', 'Success')}</p>
                  <p className="text-sm">{t('advancePayments.payment_deleted', 'Advance payment has been successfully deleted.')}</p>
                </div>
              </div>
            </div>
          )}
          
          <AdvancePaymentHeader 
            payment={selectedAdvancePayment}
            onEdit={handleEdit}
            onPrint={handlePrint}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('advancePayments.payment_details', 'Payment Details')}
            </h2>
          </div>
          
          <div className="p-4">
            <AdvancePaymentDetails payment={selectedAdvancePayment} />
          </div>
        </div>
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