// components/dashboard/minerals/UpdateTantalumStatusModal.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowPathIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '../../../../../store/store';
import { updateStockStatus, resetUpdateStockStatus, StockStatus } from '../../../../../features/minerals/tantalumSlice';
import { toast } from 'react-hot-toast';

interface UpdateTantalumStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateTantalumStatusModal: React.FC<UpdateTantalumStatusModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { selectedTantalum, updateStockStatus: updateStatus, error } = useSelector((state: RootState) => state.tantalums);
  
  const [stockStatus, setStockStatus] = useState<StockStatus>('in-stock');

  useEffect(() => {
    if (selectedTantalum) {
      setStockStatus(selectedTantalum.stock_status as StockStatus);
    }
  }, [selectedTantalum]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success(t('tantalum.status_update_success'));
      handleClose();
      dispatch(resetUpdateStockStatus());
    } else if (updateStatus === 'failed' && error) {
      toast.error(error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStatus, error, dispatch, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTantalum) return;
    
    dispatch(updateStockStatus({
      id: selectedTantalum.id,
      statusData: {
        stock_status: stockStatus
      }
    }));
  };

  const handleClose = () => {
    dispatch(resetUpdateStockStatus());
    onClose();
  };

  const getStatusColor = (status: StockStatus, isSelected: boolean) => {
    const baseClasses = "border rounded-lg px-4 py-3 flex items-center space-x-2 cursor-pointer transition-all duration-200";
    const selectedClasses = "ring-2 ring-offset-2";
    
    switch (status) {
      case 'in-stock':
        return `${baseClasses} ${isSelected ? `${selectedClasses} ring-green-500 border-green-500` : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500'}`;
      case 'withdrawn':
        return `${baseClasses} ${isSelected ? `${selectedClasses} ring-red-500 border-red-500` : 'border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500'}`;
      case 'resampled':
        return `${baseClasses} ${isSelected ? `${selectedClasses} ring-amber-500 border-amber-500` : 'border-gray-300 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-500'}`;
      default:
        return `${baseClasses} ${isSelected ? `${selectedClasses} ring-gray-500 border-gray-500` : 'border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500'}`;
    }
  };

  const getStatusIconColor = (status: StockStatus) => {
    switch (status) {
      case 'in-stock':
        return "text-green-500";
      case 'withdrawn':
        return "text-red-500";
      case 'resampled':
        return "text-amber-500";
      default:
        return "text-gray-500";
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
  };

  if (!selectedTantalum) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-md w-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <ArrowPathIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    {t('tantalum.update_status', 'Update Stock Status')}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedTantalum.lot_number} - {selectedTantalum.supplier_name}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('tantalum.select_stock_status', 'Select Stock Status')}
                  </label>
                  
                  <div 
                    className={getStatusColor('in-stock', stockStatus === 'in-stock')}
                    onClick={() => setStockStatus('in-stock')}
                  >
                    <input
                      type="radio"
                      name="stockStatus"
                      value="in-stock"
                      checked={stockStatus === 'in-stock'}
                      onChange={() => setStockStatus('in-stock')}
                      className="sr-only"
                    />
                    <CheckBadgeIcon className={`w-5 h-5 ${getStatusIconColor('in-stock')}`} />
                    <span className="font-medium text-gray-900 dark:text-white">{t('tantalum.status_in-stock', 'In Stock')}</span>
                  </div>
                  
                  <div 
                    className={getStatusColor('withdrawn', stockStatus === 'withdrawn')}
                    onClick={() => setStockStatus('withdrawn')}
                  >
                    <input
                      type="radio"
                      name="stockStatus"
                      value="withdrawn"
                      checked={stockStatus === 'withdrawn'}
                      onChange={() => setStockStatus('withdrawn')}
                      className="sr-only"
                    />
                    <XMarkIcon className={`w-5 h-5 ${getStatusIconColor('withdrawn')}`} />
                    <span className="font-medium text-gray-900 dark:text-white">{t('tantalum.status_withdrawn', 'Withdrawn')}</span>
                  </div>
                  
                  <div 
                    className={getStatusColor('resampled', stockStatus === 'resampled')}
                    onClick={() => setStockStatus('resampled')}
                  >
                    <input
                      type="radio"
                      name="stockStatus"
                      value="resampled"
                      checked={stockStatus === 'resampled'}
                      onChange={() => setStockStatus('resampled')}
                      className="sr-only"
                    />
                    <ArrowPathIcon className={`w-5 h-5 ${getStatusIconColor('resampled')}`} />
                    <span className="font-medium text-gray-900 dark:text-white">{t('tantalum.status_resampled', 'Resampled')}</span>
                  </div>
                </div>
              
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updateStatus === 'loading' || stockStatus === selectedTantalum.stock_status}
                    className={`w-full px-6 py-3 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
                      stockStatus === selectedTantalum.stock_status || updateStatus === 'loading'
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    {updateStatus === 'loading' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('common.updating', 'Updating...')}
                      </>
                    ) : (
                      <>
                        <ArrowPathIcon className="w-5 h-5 mr-2" />
                        {t('tantalum.update_status', 'Update Status')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpdateTantalumStatusModal;