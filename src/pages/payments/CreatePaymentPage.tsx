// pages/payments/CreatePaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  UserIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  ExclamationCircleIcon,
  EyeIcon,
  BanknotesIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { usePayments } from '../../hooks/usePayments';
import SupplierSelector from '../../components/dashboard/suppliers/SupplierSelector';
import SmartMineralSelector from '../../components/dashboard/payments/SmartMineralSelector';
import SmartAdvanceSelector from '../../components/dashboard/payments/SmartAdvanceSelector';
import PaymentPreviewCard from '../../components/dashboard/payments/PaymentPreviewCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const CreatePaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { handleCreatePayment, handlePreviewPayment, previewPayment, handleClearPreviewPayment } = usePayments();
  const { createStatus, previewStatus, error: err } = useSelector((state: RootState) => state.payments);
  
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [selectedSupplierName, setSelectedSupplierName] = useState<string>('');
  
  // Selected mineral and advance IDs
  const [selectedMinerals, setSelectedMinerals] = useState<{
    tantalum: string[];
    tin: string[];
    tungsten: string[];
  }>({
    tantalum: [],
    tin: [],
    tungsten: []
  });
  
  const [selectedAdvances, setSelectedAdvances] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hasPreviewedCurrentSelection, setHasPreviewedCurrentSelection] = useState(false);
  
  // Reset everything when component mounts (for fresh start)
  useEffect(() => {
    resetForm();
  }, []);
  
  useEffect(() => {
    if (createStatus === 'succeeded') {
      setShowSuccessMessage(true);
      resetForm();
      
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [createStatus]);
  
  const resetForm = () => {
    setSupplierId(null);
    setSelectedSupplierName('');
    setSelectedMinerals({ tantalum: [], tin: [], tungsten: [] });
    setSelectedAdvances([]);
    handleClearPreviewPayment();
    setShowPreview(false);
    setHasPreviewedCurrentSelection(false);
  };
  
  const handleSupplierSelect = (id: string, name: string) => {
    setSupplierId(id);
    setSelectedSupplierName(name);
    // Reset selections when supplier changes
    setSelectedMinerals({ tantalum: [], tin: [], tungsten: [] });
    setSelectedAdvances([]);
    handleClearPreviewPayment();
    setShowPreview(false);
    setHasPreviewedCurrentSelection(false);
  };
  
  const handleMineralSelectionChange = (type: 'tantalum' | 'tin' | 'tungsten', ids: string[]) => {
    setSelectedMinerals(prev => ({
      ...prev,
      [type]: ids
    }));
    // Disable create button when selection changes after preview
    setHasPreviewedCurrentSelection(false);
  };

  const handleAdvanceSelectionChange = (ids: string[]) => {
    setSelectedAdvances(ids);
    // Disable create button when selection changes after preview
    setHasPreviewedCurrentSelection(false);
  };

  // Handle any data change that should invalidate the preview
  const handleDataChange = () => {
    setHasPreviewedCurrentSelection(false);
  };
  
  const handlePreview = async () => {
    setError(null);
    
    if (!supplierId) {
      setError(t('payments.errors.select_supplier', 'Please select a supplier'));
      return;
    }
    
    const { tantalum, tin, tungsten } = selectedMinerals;
    if (!tantalum.length && !tin.length && !tungsten.length) {
      setError(t('payments.errors.select_minerals', 'Please select at least one mineral'));
      return;
    }
    
    try {
      await handlePreviewPayment({
        supplier_id: supplierId,
        tantalum_ids: tantalum.length > 0 ? tantalum : undefined,
        tin_ids: tin.length > 0 ? tin : undefined,
        tungsten_ids: tungsten.length > 0 ? tungsten : undefined,
        advance_ids: selectedAdvances.length > 0 ? selectedAdvances : undefined
      });
      setShowPreview(true);
      setHasPreviewedCurrentSelection(true);
    } catch (err: any) {
      setError(err.message || t('payments.errors.preview_failed', 'Failed to preview payment'));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!supplierId) {
      setError(t('payments.errors.select_supplier', 'Please select a supplier'));
      setIsSubmitting(false);
      return;
    }
    
    const { tantalum, tin, tungsten } = selectedMinerals;
    if (!tantalum.length && !tin.length && !tungsten.length) {
      setError(t('payments.errors.select_minerals', 'Please select at least one mineral'));
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await handleCreatePayment({
        supplier_id: supplierId,
        tantalum_ids: tantalum.length > 0 ? tantalum : undefined,
        tin_ids: tin.length > 0 ? tin : undefined,
        tungsten_ids: tungsten.length > 0 ? tungsten : undefined,
        advance_ids: selectedAdvances.length > 0 ? selectedAdvances : undefined
      });
      
      if (result) {
        setTimeout(() => {
          navigate(`/payments/${result.id}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || t('payments.errors.create_failed', 'Failed to create payment'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/payments');
  };

  const getTotalSelectedMinerals = () => {
    const { tantalum, tin, tungsten } = selectedMinerals;
    return tantalum.length + tin.length + tungsten.length;
  };

  const canCreatePayment = () => {
    return hasPreviewedCurrentSelection && showPreview && !isSubmitting;
  };
  
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className="mr-4 p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg backdrop-blur-sm transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t('payments.create_title', 'Create New Payment')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('payments.create_subtitle', 'Process payments for mineral deliveries')}
              </p>
            </div>
          </div>
          
          {/* Status Messages */}
          {showSuccessMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm"
            >
              <div className="flex items-center text-green-700 dark:text-green-300">
                <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('payments.success', 'Success')}</p>
                  <p className="text-sm">{t('payments.payment_created', 'Payment has been successfully created.')}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {(err || error) && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm"
            >
              <div className="flex items-center text-red-700 dark:text-red-300">
                <ExclamationCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('payments.error', 'Error')}</p>
                  <p className="text-sm">{err || error}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Progress Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center text-blue-800 dark:text-blue-300">
                <SparklesIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium text-sm">
                    {!supplierId 
                      ? t('payments.step_1', 'Step 1: Select a supplier')
                      : getTotalSelectedMinerals() === 0
                      ? t('payments.step_2', 'Step 2: Choose minerals & advances')
                      : !hasPreviewedCurrentSelection
                      ? t('payments.step_3', 'Step 3: Preview calculation')
                      : t('payments.step_4', 'Step 4: Create payment')
                    }
                  </span>
                </div>
              </div>
              {supplierId && (
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {getTotalSelectedMinerals()} {t('payments.minerals_selected', 'minerals selected')}
                  {selectedAdvances.length > 0 && ` • ${selectedAdvances.length} ${t('payments.advances_selected', 'advances')}`}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Supplier Selection */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-gray-700/30">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <UserIcon className="w-6 h-6 mr-3 text-blue-500" />
                  {t('payments.supplier_selection', 'Supplier Selection')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('payments.supplier_description', 'Choose the supplier for this payment')}
                </p>
              </div>
              
              <div className="p-6">
                <SupplierSelector onSelect={handleSupplierSelect} />
                {selectedSupplierName && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                  >
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                      <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      {t('payments.selected_supplier', 'Selected')}: <span className="font-semibold ml-1">{selectedSupplierName}</span>
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Mineral Selection */}
            {supplierId && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-purple-50/30 dark:from-gray-800/50 dark:to-gray-700/30">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <BeakerIcon className="w-6 h-6 mr-3 text-purple-500" />
                    {t('payments.mineral_selection', 'Mineral Selection')}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t('payments.mineral_description', 'Select unpaid minerals to include in this payment')}
                  </p>
                </div>
                
                <div className="p-6">
                  <SmartMineralSelector
                    supplierId={supplierId}
                    selectedMinerals={selectedMinerals}
                    onSelectionChange={handleMineralSelectionChange}
                    onDataChange={handleDataChange}
                  />
                </div>
              </motion.div>
            )}
            
            {/* Advance Payments Selection */}
            {supplierId && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-green-50/30 dark:from-gray-800/50 dark:to-gray-700/30">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <BanknotesIcon className="w-6 h-6 mr-3 text-green-500" />
                    {t('payments.advance_selection', 'Advance Payments')}
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                      {t('payments.optional', 'Optional')}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t('payments.advance_description', 'Select advance payments to deduct from this payment')}
                  </p>
                </div>
                
                <div className="p-6">
                  <SmartAdvanceSelector
                    supplierId={supplierId}
                    selectedAdvanceIds={selectedAdvances}
                    onSelectionChange={handleAdvanceSelectionChange}
                    onDataChange={handleDataChange}
                  />
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Right Column - Preview & Actions */}
          <div className="xl:col-span-1 space-y-6">
            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6"
            >
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handlePreview}
                  disabled={previewStatus === 'loading' || !supplierId || getTotalSelectedMinerals() === 0}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  <EyeIcon className="w-5 h-5 mr-2" />
                  {previewStatus === 'loading' ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('payments.previewing', 'Previewing...')}
                    </div>
                  ) : (
                    t('payments.preview', 'Preview Calculation')
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: canCreatePayment() ? 1.02 : 1 }}
                  whileTap={{ scale: canCreatePayment() ? 0.98 : 1 }}
                  onClick={handleSubmit}
                  disabled={!canCreatePayment()}
                  className={`w-full px-4 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center justify-center ${
                    canCreatePayment()
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('payments.creating', 'Creating...')}
                    </div>
                  ) : (
                    t('payments.create_payment', 'Create Payment')
                  )}
                </motion.button>
              </div>
              
              {!hasPreviewedCurrentSelection && supplierId && getTotalSelectedMinerals() > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  {t('payments.preview_first', 'Preview the calculation before creating the payment')}
                </p>
              )}
              
              {hasPreviewedCurrentSelection && (
                <p className="text-xs text-green-600 dark:text-green-400 text-center mt-3">
                  {t('payments.ready_to_create', 'Ready to create payment')}
                </p>
              )}
            </motion.div>
            
            {/* Preview Card */}
            {showPreview && previewPayment && (
              <PaymentPreviewCard payment={previewPayment} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePaymentPage;