// components/dashboard/advancePayments/EditAdvancePaymentModal.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PencilIcon, CreditCardIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAdvancePayments } from '../../../hooks/useAdvancePayments';
import { currencyType } from '../../../features/finance/advancePaymentSlice';
import { motion } from 'framer-motion';

interface EditAdvancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

// Currency Selector Component for Modal
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
            relative px-3 py-2 rounded-lg border transition-all duration-200 text-sm
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
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

const EditAdvancePaymentModal: React.FC<EditAdvancePaymentModalProps> = ({ isOpen, onClose, payment }) => {
  const { t } = useTranslation();
  const { handleUpdateAdvancePayment, updateStatus } = useAdvancePayments();
  
  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<currencyType>('RWF');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState<any>('');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen && payment) {
      setAmount(payment.amount || null);
      setCurrency(payment.currency || 'RWF'); // Default to RWF if no currency
      setPaymentMethod(payment.payment_method || '');
      setStatus(payment.status || '');
      
      if (payment.date) {
        const dateObj = new Date(payment.date);
        setDate(dateObj.toISOString().split('T')[0]);
      } else {
        setDate('');
      }
    }
  }, [isOpen, payment]);
  
  const handleClose = () => {
    setError(null);
    onClose();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!amount || amount <= 0) {
      setError(t('advancePayments.errors.valid_amount', 'Please enter a valid amount'));
      return;
    }
    
    if (!paymentMethod) {
      setError(t('advancePayments.errors.select_payment_method', 'Please select a payment method'));
      return;
    }
    
    if (!status) {
      setError(t('advancePayments.errors.select_status', 'Please select a payment status'));
      return;
    }
    
    if (!date) {
      setError(t('advancePayments.errors.select_date', 'Please select a payment date'));
      return;
    }
    
    try {
      await handleUpdateAdvancePayment(payment.id, {
        amount,
        currency,
        payment_method: paymentMethod,
        status,
        date: new Date(date).toISOString()
      });
      handleClose();
    } catch (err: any) {
      setError(err.message || t('advancePayments.errors.update_failed', 'Failed to update payment'));
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {t('advancePayments.edit_payment', 'Edit Advance Payment')}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                  
                  {/* Currency Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('advancePayments.currency', 'Currency')}
                    </label>
                    <CurrencySelector value={currency} onChange={setCurrency} />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('advancePayments.amount', 'Amount')} ({currency})
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
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
                        <option value="">{t('advancePayments.select_payment_method', 'Select payment method')}</option>
                        <option value="Cash">{t('advancePayments.payment_methods.cash', 'Cash')}</option>
                        <option value="Check">{t('advancePayments.payment_methods.check', 'Check')}</option>
                        <option value="Bank Transfer">{t('advancePayments.payment_methods.bank_transfer', 'Bank Transfer')}</option>
                        <option value="Mobile Money">{t('advancePayments.payment_methods.mobile_money', 'Mobile Money')}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('advancePayments.status_title', 'Status')}
                    </label>
                    <div className="relative">
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">{t('advancePayments.status.select_status', 'Select status')}</option>
                        <option value="Paid">{t('advancePayments.status.paid', 'Paid')}</option>
                        <option value="Unpaid">{t('advancePayments.status.unpaid', 'Unpaid')}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('advancePayments.date', 'Date')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {t('advancePayments.cancel', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={updateStatus === 'loading'}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {updateStatus === 'loading' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('advancePayments.updating', 'Updating...')}
                        </>
                      ) : (
                        <>
                          <PencilIcon className="w-4 h-4 mr-2" />
                          {t('advancePayments.save_changes', 'Save Changes')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditAdvancePaymentModal;