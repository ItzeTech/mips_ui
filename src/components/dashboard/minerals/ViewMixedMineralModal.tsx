import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  UserIcon, 
  ScaleIcon, 
  CalendarIcon, 
  TagIcon,
  ClockIcon,
  BeakerIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface ViewMixedMineralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewMixedMineralModal: React.FC<ViewMixedMineralModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { selectedMineral } = useSelector((state: RootState) => state.mixedMinerals);

  if (!selectedMineral) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-auto overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-8 py-8">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <BeakerIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Dialog.Title className="text-xl font-bold text-white">
                          {t('mixedMinerals.mineral_details')}
                        </Dialog.Title>
                        <p className="text-amber-100 text-sm">
                          {t('mixedMinerals.view_description')}
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

                  {/* Lot Number & Status Badge */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {selectedMineral.lot_number}
                      </h3>
                      <div className={`px-4 py-2 rounded-full ${
                        selectedMineral.status === 'processed' 
                          ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                          : 'bg-amber-500/20 text-amber-100 border border-amber-400/30'
                      } backdrop-blur-sm flex items-center`}>
                        {selectedMineral.status === 'processed' ? (
                          <CheckBadgeIcon className="w-4 h-4 mr-2" />
                        ) : (
                          <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                        )}
                        <span className="font-medium capitalize">
                          {selectedMineral.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-orange-100 text-lg mt-1">
                      {t('mixedMinerals.weight')}: {selectedMineral.weight_kg.toLocaleString()} kg
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Supplier Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                        <UserIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('mixedMinerals.supplier_info')}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('mixedMinerals.supplier_name')}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedMineral.supplier_name || t('mixedMinerals.not_available')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('mixedMinerals.supplier_id')}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm font-mono">
                          {selectedMineral.supplier_id}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Delivery Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                        <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('mixedMinerals.delivery_info')}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('mixedMinerals.date_of_delivery')}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(selectedMineral.date_of_delivery)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('mixedMinerals.weight_details')}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <ScaleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedMineral.weight_kg.toLocaleString()} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Lot Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                        <TagIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('mixedMinerals.lot_info')}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('mixedMinerals.lot_number')}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white text-lg">
                          {selectedMineral.lot_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('mixedMinerals.status')}
                        </p>
                        <div className={`inline-flex items-center px-3 py-1 rounded-lg ${
                          selectedMineral.status === 'processed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                          {selectedMineral.status === 'processed' ? (
                            <CheckBadgeIcon className="w-4 h-4 mr-2" />
                          ) : (
                            <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                          )}
                          <span className="font-medium capitalize">
                            {selectedMineral.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Timestamps */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700">
                        <ClockIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('mixedMinerals.timestamps')}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('mixedMinerals.created_at')}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(selectedMineral.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('mixedMinerals.updated_at')}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(selectedMineral.updated_at)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Close Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-6 mt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {t('common.close')}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ViewMixedMineralModal;