import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ExclamationCircleIcon, CurrencyDollarIcon, UserIcon, CalendarIcon, ScaleIcon, BeakerIcon, BanknotesIcon, CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
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
  
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tantalum: false,
    tin: false,
    tungsten: false,
    advancePayments: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
    // This function is no longer needed as the actual printing is handled in the PaymentHeader component
    // We keep it as a placeholder for compatibility with the PaymentHeader props
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
            
            {/* Audit info card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
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
                      {formatDate(selectedPayment.created_at)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('payments.updated_at', 'Last Updated')}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedPayment.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Mineral Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Mineral Types Overview */}
            {/* Mineral Types Overview - Redesigned */}
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
                {/* Weight Distribution Chart */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight Distribution</p>
                  <div className="flex items-center h-5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {selectedPayment.tantalum_total_weight && (
                      <div 
                        className="h-full bg-purple-500 dark:bg-purple-600" 
                        style={{ 
                          width: `${(selectedPayment.tantalum_total_weight / selectedPayment.total_weight) * 100}%`,
                          transition: 'width 1s ease-in-out'
                        }}
                      />
                    )}
                    {selectedPayment.tin_total_weight && (
                      <div 
                        className="h-full bg-gray-500 dark:bg-gray-600" 
                        style={{ 
                          width: `${(selectedPayment.tin_total_weight / selectedPayment.total_weight) * 100}%`,
                          transition: 'width 1s ease-in-out'
                        }}
                      />
                    )}
                    {selectedPayment.tungsten_total_weight && (
                      <div 
                        className="h-full bg-yellow-500 dark:bg-yellow-600" 
                        style={{ 
                          width: `${(selectedPayment.tungsten_total_weight / selectedPayment.total_weight) * 100}%`,
                          transition: 'width 1s ease-in-out'
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap mt-2 gap-3 text-xs">
                    {selectedPayment.tantalum_total_weight && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 dark:bg-purple-600 rounded-sm mr-1"></div>
                        <span>Tantalum: {Math.round((selectedPayment.tantalum_total_weight / selectedPayment.total_weight) * 100)}%</span>
                      </div>
                    )}
                    {selectedPayment.tin_total_weight && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 dark:bg-gray-600 rounded-sm mr-1"></div>
                        <span>Tin: {Math.round((selectedPayment.tin_total_weight / selectedPayment.total_weight) * 100)}%</span>
                      </div>
                    )}
                    {selectedPayment.tungsten_total_weight && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-600 rounded-sm mr-1"></div>
                        <span>Tungsten: {Math.round((selectedPayment.tungsten_total_weight / selectedPayment.total_weight) * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Tantalum Card - Redesigned */}
                  {selectedPayment.tantalum_total_weight && (
                    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 dark:bg-purple-600"></div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-purple-800 dark:text-purple-300 flex items-center">
                            <BeakerIcon className="w-4 h-4 mr-1.5" />
                            Tantalum
                          </h3>
                          <Badge color="purple" size="sm">
                            {selectedPayment.tantalum_minerals.length} minerals
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatWeight(selectedPayment.tantalum_total_weight)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Ta₂O₅</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatPercentage(selectedPayment.avg_ta2o5_percentage)}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              {formatAmount(selectedPayment.tantalum_minerals.reduce((sum, m) => sum + (m.net_amount || 0), 0))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tin Card - Redesigned */}
                  {selectedPayment.tin_total_weight && (
                    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gray-500 dark:bg-gray-400"></div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-300 flex items-center">
                            <BeakerIcon className="w-4 h-4 mr-1.5" />
                            Tin
                          </h3>
                          <Badge color="gray" size="sm">
                            {selectedPayment.tin_minerals.length} minerals
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatWeight(selectedPayment.tin_total_weight)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Sn</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatPercentage(selectedPayment.avg_sn_percentage)}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              {formatAmount(selectedPayment.tin_minerals.reduce((sum, m) => sum + (m.net_amount || 0), 0))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tungsten Card - Redesigned */}
                  {selectedPayment.tungsten_total_weight && (
                    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-800/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 dark:bg-yellow-600"></div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 flex items-center">
                            <BeakerIcon className="w-4 h-4 mr-1.5" />
                            Tungsten
                          </h3>
                          <Badge color="yellow" size="sm">
                            {selectedPayment.tungsten_minerals.length} minerals
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatWeight(selectedPayment.tungsten_total_weight)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Avg. WO₃</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatPercentage(selectedPayment.avg_wo3_percentage)}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              {formatAmount(selectedPayment.tungsten_minerals.reduce((sum, m) => sum + (m.net_amount || 0), 0))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Collapsible Mineral Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <BeakerIcon className="w-5 h-5 mr-2 text-blue-500" />
                  {t('payments.minerals_details', 'Minerals Details')}
                </h2>
              </div>
              
              <div className="p-3 space-y-3">
                {/* Tantalum Minerals Section */}
                {selectedPayment.tantalum_minerals.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('tantalum')}
                      className="w-full p-3 flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-left transition-colors"
                    >
                      <span className="font-medium text-purple-800 dark:text-purple-300 flex items-center">
                        <BeakerIcon className="w-4 h-4 mr-2" />
                        Tantalum ({selectedPayment.tantalum_minerals.length})
                      </span>
                      {expandedSections.tantalum ? (
                        <ChevronUpIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </button>
                    
                    {expandedSections.tantalum && (
                      <div className="p-3">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                              <tr>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Lot Number</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Weight</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ta₂O₅</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {selectedPayment.tantalum_minerals.map((mineral) => (
                                <tr key={mineral.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{mineral.lot_number}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatWeight(mineral.net_weight)}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                    {formatPercentage(mineral.alex_stewart_ta2o5 || mineral.internal_ta2o5)}
                                    {mineral.has_alex_stewart && <CheckCircleIcon className="w-4 h-4 inline ml-1 text-green-500" />}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                                    {mineral.net_amount ? formatAmount(mineral.net_amount) : '—'}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <Badge color={mineral.finance_status === 'PAID' ? 'green' : 'yellow'} size="sm">
                                      {mineral.finance_status || 'UNKNOWN'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tin Minerals Section */}
                {selectedPayment.tin_minerals.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('tin')}
                      className="w-full p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/20 hover:bg-gray-100 dark:hover:bg-gray-700/30 text-left transition-colors"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-300 flex items-center">
                        <BeakerIcon className="w-4 h-4 mr-2" />
                        Tin ({selectedPayment.tin_minerals.length})
                      </span>
                      {expandedSections.tin ? (
                        <ChevronUpIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                    
                    {expandedSections.tin && (
                      <div className="p-3">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                              <tr>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Lot Number</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Weight</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sn</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {selectedPayment.tin_minerals.map((mineral) => (
                                <tr key={mineral.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{mineral.lot_number}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatWeight(mineral.net_weight)}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                    {formatPercentage(mineral.alex_stewart_sn_percentage || mineral.internal_sn_percentage)}
                                    {mineral.has_alex_stewart && <CheckCircleIcon className="w-4 h-4 inline ml-1 text-green-500" />}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                                    {mineral.net_amount ? formatAmount(mineral.net_amount) : '—'}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <Badge color={mineral.finance_status === 'PAID' ? 'green' : 'yellow'} size="sm">
                                      {mineral.finance_status || 'UNKNOWN'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tungsten Minerals Section */}
                {selectedPayment.tungsten_minerals.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('tungsten')}
                      className="w-full p-3 flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-left transition-colors"
                    >
                      <span className="font-medium text-yellow-800 dark:text-yellow-300 flex items-center">
                        <BeakerIcon className="w-4 h-4 mr-2" />
                        Tungsten ({selectedPayment.tungsten_minerals.length})
                      </span>
                      {expandedSections.tungsten ? (
                        <ChevronUpIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </button>
                    
                    {expandedSections.tungsten && (
                      <div className="p-3">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                              <tr>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Lot Number</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Weight</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">WO₃</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {selectedPayment.tungsten_minerals.map((mineral) => (
                                <tr key={mineral.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{mineral.lot_number}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatWeight(mineral.net_weight)}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                    {formatPercentage(mineral.alex_stewart_wo3_percentage || mineral.wo3_percentage)}
                                    {mineral.has_alex_stewart && <CheckCircleIcon className="w-4 h-4 inline ml-1 text-green-500" />}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                                    {mineral.net_amount ? formatAmount(mineral.net_amount) : '—'}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <Badge color={mineral.finance_status === 'PAID' ? 'green' : 'yellow'} size="sm">
                                      {mineral.finance_status || 'UNKNOWN'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            
                {/* Advance Payments Section */}
                {selectedPayment.advance_payments.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('advancePayments')}
                      className="w-full p-3 flex items-center justify-between bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-left transition-colors"
                    >
                      <span className="font-medium text-green-800 dark:text-green-300 flex items-center">
                        <BanknotesIcon className="w-4 h-4 mr-2" />
                        Advance Payments ({selectedPayment.advance_payments.length})
                      </span>
                      {expandedSections.advancePayments ? (
                        <ChevronUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                    </button>
                    
                    {expandedSections.advancePayments && (
                      <div className="p-3">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                              <tr>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Method</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {selectedPayment.advance_payments.map((advance) => (
                                <tr key={advance.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {new Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: advance.currency,
                                      minimumFractionDigits: 2
                                    }).format(advance.amount)}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{advance.payment_method}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatDate(advance.date)}</td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <Badge color={advance.status === 'Paid' ? 'green' : 'yellow'} size="sm">
                                      {advance.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPaymentPage;