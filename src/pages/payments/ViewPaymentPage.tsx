import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ExclamationCircleIcon, CurrencyDollarIcon, UserIcon, CalendarIcon, ScaleIcon, BeakerIcon, BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
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

  const formatAmount = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }, []);

  const formatWeight = useCallback((weight: number | null) => {
    if (weight === null || weight === undefined) return '—';
    return `${weight.toLocaleString('en-US', { maximumFractionDigits: 2 })} kg`;
  }, []);

  const formatPercentage = useCallback((percentage: number | null) => {
    if (percentage === null || percentage === undefined) return '—';
    return `${percentage.toFixed(2)}%`;
  }, []);

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  if (status === 'loading' && !selectedPayment) {
    return <LoadingSkeleton />;
  }

  if (!selectedPayment) {
    return (
      <div className="min-h-screen p-3 flex items-center justify-center">
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
    <div className="min-h-screen p-3 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className="mr-3 p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('payments.view_title', 'View Payment')}
            </h1>
          </div>

          {err && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Left Column - Payment & Supplier Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Payment info card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-blue-500" />
                  {t('payments.payment_info', 'Payment Information')}
                </h2>
              </div>
              
              <div className="p-3 space-y-3">
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
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
                  {t('payments.supplier_info', 'Supplier Information')}
                </h2>
              </div>
              
              <div className="p-3">
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
          <div className="lg:col-span-2 space-y-4">
            {/* Mineral Types Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <BeakerIcon className="w-5 h-5 mr-2 text-blue-500" />
                  {t('payments.mineral_breakdown', 'Mineral Breakdown')}
                </h2>
              </div>
              
              <div className="p-3">
                <div className="mb-3">
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Tantalum */}
                  {selectedPayment.tantalum_total_weight && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Tantalum</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Weight: {formatWeight(selectedPayment.tantalum_total_weight)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ta₂O₅: {formatPercentage(selectedPayment.avg_ta2o5_percentage)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Minerals: {selectedPayment.tantalum_minerals.length}</p>
                    </div>
                  )}
                  
                  {/* Tin */}
                  {selectedPayment.tin_total_weight && (
                    <div className="bg-gray-50 dark:bg-gray-700/20 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h3 className="font-medium text-gray-800 dark:text-gray-300 mb-2">Tin</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Weight: {formatWeight(selectedPayment.tin_total_weight)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sn: {formatPercentage(selectedPayment.avg_sn_percentage)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Minerals: {selectedPayment.tin_minerals.length}</p>
                    </div>
                  )}
                  
                  {/* Tungsten */}
                  {selectedPayment.tungsten_total_weight && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Tungsten</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Weight: {formatWeight(selectedPayment.tungsten_total_weight)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">WO₃: {formatPercentage(selectedPayment.avg_wo3_percentage)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Minerals: {selectedPayment.tungsten_minerals.length}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Detailed Tantalum Minerals */}
            {selectedPayment.tantalum_minerals.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
                  <h2 className="text-lg font-bold text-purple-800 dark:text-purple-300 flex items-center">
                    <BeakerIcon className="w-5 h-5 mr-2" />
                    Tantalum Minerals ({selectedPayment.tantalum_minerals.length})
                  </h2>
                </div>
                
                <div className="p-3">
                  <div className="space-y-3">
                    {selectedPayment.tantalum_minerals.map((mineral) => (
                      <div key={mineral.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Lot Number</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{mineral.lot_number}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatWeight(mineral.net_weight)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Ta₂O₅ %</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatPercentage(mineral.alex_stewart_ta2o5 || mineral.internal_ta2o5)}
                              {mineral.has_alex_stewart && <CheckCircleIcon className="w-4 h-4 inline ml-1 text-green-500" />}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Net Amount</p>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              {mineral.net_amount ? formatAmount(mineral.net_amount) : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Delivery Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatDate(mineral.date_of_delivery)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                            <Badge color={mineral.finance_status === 'PAID' ? 'green' : 'yellow'}>
                              {mineral.finance_status || 'UNKNOWN'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Detailed Tin Minerals */}
            {selectedPayment.tin_minerals.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-300 flex items-center">
                    <BeakerIcon className="w-5 h-5 mr-2" />
                    Tin Minerals ({selectedPayment.tin_minerals.length})
                  </h2>
                </div>
                
                <div className="p-3">
                  <div className="space-y-3">
                    {selectedPayment.tin_minerals.map((mineral) => (
                      <div key={mineral.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Lot Number</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{mineral.lot_number}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatWeight(mineral.net_weight)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sn %</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatPercentage(mineral.alex_stewart_sn_percentage || mineral.internal_sn_percentage)}
                              {mineral.has_alex_stewart && <CheckCircleIcon className="w-4 h-4 inline ml-1 text-green-500" />}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Net Amount</p>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              {mineral.net_amount ? formatAmount(mineral.net_amount) : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Delivery Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatDate(mineral.date_of_delivery)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                            <Badge color={mineral.finance_status === 'PAID' ? 'green' : 'yellow'}>
                              {mineral.finance_status || 'UNKNOWN'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Detailed Tungsten Minerals */}
            {selectedPayment.tungsten_minerals.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                  <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 flex items-center">
                    <BeakerIcon className="w-5 h-5 mr-2" />
                    Tungsten Minerals ({selectedPayment.tungsten_minerals.length})
                  </h2>
                </div>
                
                <div className="p-3">
                  <div className="space-y-3">
                    {selectedPayment.tungsten_minerals.map((mineral) => (
                      <div key={mineral.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Lot Number</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{mineral.lot_number}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatWeight(mineral.net_weight)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">WO₃ %</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatPercentage(mineral.alex_stewart_wo3_percentage || mineral.wo3_percentage)}
                              {mineral.has_alex_stewart && <CheckCircleIcon className="w-4 h-4 inline ml-1 text-green-500" />}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Net Amount</p>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              {mineral.net_amount ? formatAmount(mineral.net_amount) : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Delivery Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatDate(mineral.date_of_delivery)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                            <Badge color={mineral.finance_status === 'PAID' ? 'green' : 'yellow'}>
                              {mineral.finance_status || 'UNKNOWN'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Advance Payments */}
            {selectedPayment.advance_payments.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
                  <h2 className="text-lg font-bold text-green-800 dark:text-green-300 flex items-center">
                    <BanknotesIcon className="w-5 h-5 mr-2" />
                    Advance Payments ({selectedPayment.advance_payments.length})
                  </h2>
                </div>
                
                <div className="p-3">
                  <div className="space-y-3">
                    {selectedPayment.advance_payments.map((advance) => (
                      <div key={advance.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: advance.currency,
                                minimumFractionDigits: 2
                              }).format(advance.amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                            <p className="font-medium text-gray-900 dark:text-white">{advance.payment_method}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatDate(advance.date)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                            <Badge color={advance.status === 'Paid' ? 'green' : 'yellow'}>
                              {advance.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
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
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
              {t('payments.audit_info', 'Audit Information')}
            </h2>
          </div>
          
          <div className="p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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