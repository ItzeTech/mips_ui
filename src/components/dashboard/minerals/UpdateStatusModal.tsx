import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Switch } from '@headlessui/react';
import { 
  XMarkIcon, 
  ArrowPathIcon, 
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { updateMixedMineralStatus, resetUpdateStatusStatus } from '../../../features/minerals/mixedMineralsSlice';
import toast from 'react-hot-toast';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMineral, updateStatusStatus, error } = useSelector((state: RootState) => state.mixedMinerals);

  const [status, setStatus] = useState<any>('unprocessed');

  useEffect(() => {
    if (selectedMineral && isOpen) {
      setStatus(selectedMineral.status as 'unprocessed' | 'processed');
    }
  }, [selectedMineral, isOpen]);

  useEffect(() => {
    if (updateStatusStatus === 'succeeded') {
      toast.success(t('mixedMinerals.status_update_success'));
      onClose();
      dispatch(resetUpdateStatusStatus());
    } else if (updateStatusStatus === 'failed' && error) {
      toast.error(error);
      dispatch(resetUpdateStatusStatus());
    }
  }, [updateStatusStatus, error, onClose, dispatch, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMineral) return;

    dispatch(updateMixedMineralStatus({ 
      id: selectedMineral.id, 
      status 
    }));
  };

  if (!selectedMineral) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          static
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <ArrowPathIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        {t('mixedMinerals.update_status')}
                      </Dialog.Title>
                      <p className="text-amber-100 text-sm">
                        {t('mixedMinerals.update_status_description')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Lot Information */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedMineral.lot_number}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedMineral.weight_kg.toLocaleString()} kg
                    </p>
                  </div>
                  
                  {/* Status Toggle */}
                  <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {t('mixedMinerals.processing_status')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {status === 'processed' 
                            ? t('mixedMinerals.processed_description') 
                            : t('mixedMinerals.unprocessed_description')}
                        </p>
                      </div>
                      
                      <Switch
                        checked={status === 'processed'}
                        onChange={() => setStatus(status === 'processed' ? 'unprocessed' : 'processed')}
                        className={`${
                          status === 'processed' ? 'bg-green-600' : 'bg-amber-500'
                        } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      >
                        <span className="sr-only">
                          {t('mixedMinerals.update_processing_status')}
                        </span>
                        <span
                          className={`${
                            status === 'processed' ? 'translate-x-9' : 'translate-x-1'
                          } inline-block h-6 w-6 transform rounded-full bg-white transition-transform flex items-center justify-center`}
                        >
                          {status === 'processed' ? (
                            <CheckBadgeIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <ExclamationCircleIcon className="h-4 w-4 text-amber-500" />
                          )}
                        </span>
                      </Switch>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{t('mixedMinerals.current_status')}:</span>{' '}
                      <span className={`${
                        selectedMineral.status === 'processed' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-amber-600 dark:text-amber-400'
                      } font-medium capitalize`}>
                        {selectedMineral.status}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {t('mixedMinerals.new_status')}:{' '}
                      <span className={`${
                        status === 'processed' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-amber-600 dark:text-amber-400'
                      } font-medium capitalize`}>
                        {status}
                      </span>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-2xl transition-colors duration-200"
                    >
                      {t('common.cancel')}
                    </button>
                    <motion.button
                      type="submit"
                      disabled={updateStatusStatus === 'loading' || status === selectedMineral.status}
                      whileHover={{ scale: (updateStatusStatus === 'loading' || status === selectedMineral.status) ? 1 : 1.02 }}
                      whileTap={{ scale: (updateStatusStatus === 'loading' || status === selectedMineral.status) ? 1 : 0.98 }}
                      className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-2xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                        status === 'processed'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500'
                      }`}
                    >
                      {updateStatusStatus === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{t('common.updating')}</span>
                        </>
                      ) : (
                        <>
                          <ArrowPathIcon className="w-4 h-4" />
                          <span>{t('common.update')}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default UpdateStatusModal;