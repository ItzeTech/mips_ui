// components/dashboard/sales/EditSaleModal.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PencilIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useSales } from '../../../hooks/useSales';

interface EditSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any;
}

const EditSaleModal: React.FC<EditSaleModalProps> = ({ isOpen, onClose, sale }) => {
  const { t } = useTranslation();
  const { handleUpdateSale, updateStatus } = useSales();
  
  const [buyer, setBuyer] = useState('');
  const [netSalesAmount, setNetSalesAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen && sale) {
      setBuyer(sale.buyer || '');
      setNetSalesAmount(sale.net_sales_amount);
    }
  }, [isOpen, sale]);
  
  const handleClose = () => {
    onClose();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await handleUpdateSale(sale.id, {
        buyer: buyer || undefined,
        net_sales_amount: netSalesAmount || undefined
      });
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update sale');
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
                    {t('sales.edit_sale', 'Edit Sale')}
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
                    <label htmlFor="buyer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('sales.buyer', 'Buyer')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="buyer"
                        value={buyer}
                        onChange={(e) => setBuyer(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('sales.buyer_placeholder', 'Enter buyer name')}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="netSalesAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('sales.net_sales_amount', 'Net Sales Amount')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="netSalesAmount"
                        value={netSalesAmount === null ? '' : netSalesAmount}
                        onChange={(e) => setNetSalesAmount(e.target.value === '' ? null : Number(e.target.value))}
                        step="0.01"
                        min="0"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('sales.amount_placeholder', 'Enter amount')}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {t('sales.cancel', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={updateStatus === 'loading'}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {updateStatus === 'loading' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('sales.updating', 'Updating...')}
                        </>
                      ) : (
                        <>
                          <PencilIcon className="w-4 h-4 mr-2" />
                          {t('sales.save_changes', 'Save Changes')}
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

export default EditSaleModal;