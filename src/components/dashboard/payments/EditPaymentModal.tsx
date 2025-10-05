// components/dashboard/payments/EditPaymentModal.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PencilIcon, CurrencyDollarIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { usePayments } from '../../../hooks/usePayments';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ isOpen, onClose, payment }) => {
  const { t } = useTranslation();
  const { handleUpdatePayment, updateStatus } = usePayments();

  const [payableAmount, SetPayableAmount] = useState<number | null>(null);
  const [paidAmount, setPaidAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGreaterMessage, setShowGreaterMessage] = useState(false);
  
  useEffect(() => {
    if (isOpen && payment) {
      SetPayableAmount(payment.payable_amount);
      setPaidAmount(payment.paid_amount || 0);
    }
  }, [isOpen, payment]);
  
  const handleClose = () => {
    onClose();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await handleUpdatePayment(payment.id, {
        paid_amount: paidAmount ?? undefined
      });
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update payment');
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {t('payments.edit_payment', 'Edit payment')}
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
                  
                  
                  <div className="mb-4">
                    <label htmlFor="payableAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payments.payable_amount', 'Payable Amount')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="payableAmount"
                        value={payableAmount === null ? '' : payableAmount}
                        onChange={(e) => SetPayableAmount(e.target.value === '' ? null : Number(e.target.value))}
                        step="0.01"
                        min="0"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        disabled={true}
                      />
                    </div>
                  </div>
                  
                  {/* New field for paid amount */}
                  <div className="mb-4">
                    <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payments.paid_amount', 'Paid Amount')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCardIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="paidAmount"
                        value={paidAmount === null ? '' : paidAmount}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : Number(e.target.value);
                          if (value === null || value <= ( payableAmount ?? 0)) {
                            setPaidAmount(value);
                            setShowGreaterMessage(false);
                          }else if((payableAmount ?? 0) < value){
                            setPaidAmount(payableAmount);
                            setShowGreaterMessage(true);
                          }
                        }}
                        step="0.01"
                        min="0"
                        max={( payableAmount !== null) ? payableAmount : undefined}
                      
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('payments.paid_amount_placeholder', 'Enter paid amount')}
                      />
                    </div>
                    {
                      (showGreaterMessage) && 
                      <span className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {t('payments.paid_amount_exceeds', 'Paid amount cannot exceed the total payable amount. If you wish to pay more, please record it as an advance payment.')}
                      </span>
                    }
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t('payments.payment_status', 'Payment Status')}: 
                      <span className={`ml-1 font-medium ${
                        payment?.payment_status === 'FULLY_PAID' ? 'text-green-600 dark:text-green-400' :
                        payment?.payment_status === 'PARTIALLY_PAID' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {payment?.payment_status === 'FULLY_PAID' ? t('payments.fully_paid', 'Fully Paid') :
                         payment?.payment_status === 'PARTIALLY_PAID' ? t('payments.partially_paid', 'Partially Paid') :
                         t('payments.unpaid', 'Unpaid')}
                      </span>
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {t('payments.cancel', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={updateStatus === 'loading'}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {updateStatus === 'loading' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('payments.updating', 'Updating...')}
                        </>
                      ) : (
                        <>
                          <PencilIcon className="w-4 h-4 mr-2" />
                          {t('payments.save_changes', 'Save Changes')}
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

export default EditPaymentModal;