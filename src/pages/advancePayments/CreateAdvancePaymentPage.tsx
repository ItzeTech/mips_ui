// pages/CreateAdvancePaymentPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  UserIcon,
  CurrencyDollarIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
import { useAdvancePayments } from '../../hooks/useAdvancePayments';
import SupplierSelector from '../../components/dashboard/suppliers/SupplierSelector';

const CreateAdvancePaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { handleCreateAdvancePayment } = useAdvancePayments();
  // const { error: err } = useSelector((state: RootState) => state.advancePayments);
  
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplierName, setSelectedSupplierName] = useState<string>('');
  
  const handleSupplierSelect = (id: string, name: string) => {
    setSupplierId(id);
    setSelectedSupplierName(name);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!supplierId) {
      setError('Please select a supplier');
      setIsSubmitting(false);
      return;
    }
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      setIsSubmitting(false);
      return;
    }
    
    if (!paymentMethod) {
      setError('Please select a payment method');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await handleCreateAdvancePayment({
        supplier_id: supplierId,
        amount: amount,
        payment_method: paymentMethod
      });
      
      if (result) {
        navigate(`/advance-payments/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create advance payment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/advance-payments');
  };
  
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleGoBack}
              className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('advancePayments.create_title', 'Create New Advance Payment')}
            </h1>
          </div>
          
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center text-blue-800 dark:text-blue-300">
              <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">
                {t('advancePayments.supplier_selection_tip', 'Select a supplier and enter payment details')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('advancePayments.payment_details', 'Payment Details')}
            </h2>
          </div>
          
          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('advancePayments.supplier', 'Supplier')}
                </label>
                <SupplierSelector onSelect={handleSupplierSelect} />
                {selectedSupplierName && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <UserIcon className="w-4 h-4 inline mr-1" />
                      {t('advancePayments.selected_supplier', 'Selected')}: <span className="font-medium">{selectedSupplierName}</span>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('advancePayments.amount', 'Amount')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount === null ? '' : amount}
                    onChange={(e) => setAmount(e.target.value === '' ? null : Number(e.target.value))}
                    step="0.01"
                    min="0"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('advancePayments.amount_placeholder', 'Enter amount')}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('advancePayments.payment_method', 'Payment Method')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || !supplierId || !amount || !paymentMethod}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? t('advancePayments.creating', 'Creating...') : t('advancePayments.create_payment', 'Create Payment')}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdvancePaymentPage;