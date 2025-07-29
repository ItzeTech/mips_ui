// pages/CreateAdvancePaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  UserIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAdvancePayments } from '../../hooks/useAdvancePayments';
import SupplierSelector from '../../components/dashboard/suppliers/SupplierSelector';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { currencyType } from '../../features/finance/advancePaymentSlice';

// Currency Selector Component
interface CurrencySelectorProps {
  value: currencyType;
  onChange: (currency: currencyType) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  const currencies = [
    {
      code: 'RWF' as currencyType,
      name: t('currency.rwf', 'Rwandan Franc'),
      symbol: '₣',
      flag: '🇷🇼'
    },
    {
      code: 'USD' as currencyType,
      name: t('currency.usd', 'US Dollar'),
      symbol: '$',
      flag: '🇺🇸'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {currencies.map((currency) => (
        <motion.button
          key={currency.code}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(currency.code)}
          className={`
            relative px-3 py-2.5 rounded-lg border transition-all duration-200 text-sm
            ${value === currency.code
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
            }
          `}
        >
          {/* Selection indicator */}
          {value === currency.code && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <CheckCircleIcon className="w-3 h-3 text-white" />
            </motion.div>
          )}
          
          <div className="flex items-center justify-center space-x-2">
            <span className="text-base">{currency.flag}</span>
            <div className="text-left">
              <div className="font-medium">{currency.code}</div>
              {/* <div className="text-xs opacity-75">{currency.symbol}</div> */}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

const CreateAdvancePaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { handleCreateAdvancePayment } = useAdvancePayments();
  const { createStatus, error: err } = useSelector((state: RootState) => state.advancePayments);
  
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<currencyType>('RWF'); // Default to RWF
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplierName, setSelectedSupplierName] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    if (createStatus === 'succeeded') {
      setShowSuccessMessage(true);
      // Reset form after success (optional)
      setAmount(null);
      setPaymentMethod('');
      setSupplierId(null);
      setSelectedSupplierName('');
      
      // Hide success message after delay
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [createStatus]);
  
  const handleSupplierSelect = (id: string, name: string) => {
    setSupplierId(id);
    setSelectedSupplierName(name);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!supplierId) {
      setError(t('advancePayments.errors.select_supplier', 'Please select a supplier'));
      setIsSubmitting(false);
      return;
    }
    
    if (!amount || amount <= 0) {
      setError(t('advancePayments.errors.valid_amount', 'Please enter a valid amount'));
      setIsSubmitting(false);
      return;
    }
    
    if (!paymentMethod) {
      setError(t('advancePayments.errors.select_payment_method', 'Please select a payment method'));
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await handleCreateAdvancePayment({
        supplier_id: supplierId,
        amount: amount,
        payment_method: paymentMethod,
        currency: currency
      });
      
      if (result) {
        // Navigate after short delay to show success message
        setTimeout(() => {
          navigate(`/advance-payments/${result.id}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || t('advancePayments.errors.create_failed', 'Failed to create advance payment'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/advance-payments');
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
              {t('advancePayments.create_title', 'Create New Advance Payment')}
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
                  <p className="font-medium">{t('advancePayments.success', 'Success')}</p>
                  <p className="text-sm">{t('advancePayments.payment_created', 'Advance payment has been successfully created.')}</p>
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
                  <p className="font-medium">{t('advancePayments.error', 'Error')}</p>
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
                {t('advancePayments.supplier_selection_tip', 'Select a supplier and enter payment details')}
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
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-blue-500" />
              {t('advancePayments.payment_details', 'Payment Details')}
            </h2>
          </div>
          
          <div className="p-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('advancePayments.supplier', 'Supplier')}
                </label>
                <SupplierSelector onSelect={handleSupplierSelect} />
                {selectedSupplierName && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
                  >
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                      <UserIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      {t('advancePayments.selected_supplier', 'Selected')}: <span className="font-medium ml-1">{selectedSupplierName}</span>
                    </p>
                  </motion.div>
                )}
              </div>
              
              {/* Currency Selector */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('advancePayments.currency', 'Currency')}
                </label>
                <CurrencySelector value={currency} onChange={setCurrency} />
              </div>
              
              <div className="mb-5">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('advancePayments.amount', 'Amount')} ({currency})
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-medium">
                      {currency === 'RWF' ? '₣' : '$'}
                    </span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount === null ? '' : amount}
                    onChange={(e) => setAmount(e.target.value === '' ? null : Number(e.target.value))}
                    step={currency === 'RWF' ? '1' : '0.01'}
                    min="0"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder={t('advancePayments.amount_placeholder', 'Enter amount')}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {currency === 'RWF' 
                    ? t('advancePayments.rwf_note', 'Amount in Rwandan Francs (no decimals)')
                    : t('advancePayments.usd_note', 'Amount in US Dollars (with cents)')
                  }
                </p>
              </div>
              
              <div className="mb-5">
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('advancePayments.payment_method', 'Payment Method')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="">{t('advancePayments.select_payment_method', 'Select payment method')}</option>
                    <option value="Cash">{t('advancePayments.payment_methods.cash', 'Cash')}</option>
                    <option value="Check">{t('advancePayments.payment_methods.check', 'Check')}</option>
                    <option value="Bank Transfer">{t('advancePayments.payment_methods.bank_transfer', 'Bank Transfer')}</option>
                    <option value="Mobile Money">{t('advancePayments.payment_methods.mobile_money', 'Mobile Money')}</option>
                  </select>
                </div>
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
                  disabled={isSubmitting || !supplierId || !amount || !paymentMethod}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? t('advancePayments.creating', 'Creating...') : t('advancePayments.create_payment', 'Create Payment')}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateAdvancePaymentPage;