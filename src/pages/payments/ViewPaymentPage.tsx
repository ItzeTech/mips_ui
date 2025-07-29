import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  ScaleIcon,
  BeakerIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

import { usePayments } from '../../hooks/usePayments';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import PaymentHeader from '../../components/dashboard/payments/PaymentHeader';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import Badge from '../../components/common/Badge';

const ViewPaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();
  
  const { loadPaymentById, selectedPayment, status } = usePayments();
  
  const { error: err } = useSelector((state: RootState) => state.payments);
  
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Only fetch on initial mount or when paymentId changes
  useEffect(() => {
    if (paymentId && (isInitialLoad || !selectedPayment || selectedPayment.id !== paymentId)) {
      loadPaymentById(paymentId);
      setIsInitialLoad(false);
    }
  }, [paymentId, isInitialLoad, selectedPayment, loadPaymentById]);
  
  const handleGoBack = useCallback(() => {
    navigate('/payments');
  }, [navigate]);
  
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Format currency amounts
  const formatAmount = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }, []);

  // Format weight
  const formatWeight = useCallback((weight: number | null) => {
    if (weight === null || weight === undefined) return '—';
    return `${weight.toLocaleString('en-US', { maximumFractionDigits: 2 })} kg`;
  }, []);

  // Format percentage
  const formatPercentage = useCallback((percentage: number | null) => {
    if (percentage === null || percentage === undefined) return '—';
    return `${percentage.toFixed(2)}%`;
  }, []);
  
  if (status === 'loading' && !selectedPayment) {
    return <LoadingSkeleton />;
  }
  
  if (!selectedPayment) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('payments.payment_not_found', 'Payment not found')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('payments.payment_not_found_desc', 'The payment you are looking for does not exist or has been removed.')}
          </p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('payments.go_back', 'Go Back to Payments')}
          </motion.button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
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
              {t('payments.view_title', 'View Payment')}
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
                  <p className="font-medium">{t('payments.error', 'Error')}</p>
                  <p className="text-sm">{err ? err.replace("_", " "): ''}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <PaymentHeader 
            payment={selectedPayment}
            onPrint={handlePrint}
          />
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Payment & Supplier Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment info card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-blue-500" />
                  {t('payments.payment_info', 'Payment Information')}
                </h2>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('payments.total_amount', 'Total Amount')}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatAmount(selectedPayment.total_amount)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('payments.advance_amount', 'Advance Amount')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatAmount(selectedPayment.advance_amount)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('payments.paid_amount', 'Net Paid Amount')}
                  </p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatAmount(selectedPayment.paid_amount)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('payments.total_weight', 'Total Weight')}
                  </p>
                  <div className="flex items-center">
                    <ScaleIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatWeight(selectedPayment.total_weight)}
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
                  {t('payments.supplier_info', 'Supplier Information')}
                </h2>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('payments.supplier_name', 'Supplier Name')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedPayment.supplier_name || '—'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Mineral Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mineral Types */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <BeakerIcon className="w-5 h-5 mr-2 text-blue-500" />
                  {t('payments.mineral_breakdown', 'Mineral Breakdown')}
                </h2>
              </div>
              
              <div className="p-5">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {t('payments.mineral_types', 'Mineral Types')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPayment.mineral_types.map((type) => (
                      <Badge key={type} color="blue">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tantalum */}
                  {selectedPayment.tantalum_total_weight && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Tantalum</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Weight: {formatWeight(selectedPayment.tantalum_total_weight)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ta₂O₅: {formatPercentage(selectedPayment.avg_ta2o5_percentage)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">IDs: {selectedPayment.tantalum_ids.length}</p>
                    </div>
                  )}
                  
                  {/* Tin */}
                  {selectedPayment.tin_total_weight && (
                    <div className="bg-gray-50 dark:bg-gray-700/20 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h3 className="font-medium text-gray-800 dark:text-gray-300 mb-2">Tin</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Weight: {formatWeight(selectedPayment.tin_total_weight)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sn: {formatPercentage(selectedPayment.avg_sn_percentage)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">IDs: {selectedPayment.tin_ids.length}</p>
                    </div>
                  )}
                  
                  {/* Tungsten */}
                  {selectedPayment.tungsten_total_weight && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Tungsten</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Weight: {formatWeight(selectedPayment.tungsten_total_weight)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">WO₃: {formatPercentage(selectedPayment.avg_wo3_percentage)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">IDs: {selectedPayment.tungsten_ids.length}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* Advance Payments */}
            {selectedPayment.advance_ids.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <BanknotesIcon className="w-5 h-5 mr-2 text-blue-500" />
                    {t('payments.advance_payments', 'Associated Advance Payments')}
                  </h2>
                </div>
                
                <div className="p-5">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {t('payments.advance_count', `${selectedPayment.advance_ids.length} advance payment(s) applied`)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPayment.advance_ids.map((id) => (
                      <span key={id} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded">
                        {id.slice(0, 8)}...
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Audit info card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
              {t('payments.audit_info', 'Audit Information')}
            </h2>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('payments.created_at', 'Created At')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedPayment.created_at).toLocaleString('en-US', {
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
                  {t('payments.updated_at', 'Last Updated')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedPayment.updated_at).toLocaleString('en-US', {
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
    </div>
  );
};

export default ViewPaymentPage;