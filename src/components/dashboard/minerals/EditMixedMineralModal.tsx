
// components/minerals/EditMixedMineralModal.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  CalendarDaysIcon,
  ScaleIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { updateMixedMineral, resetUpdateStatus, UpdateMixedMineralData } from '../../../features/minerals/mixedMineralsSlice';
import toast from 'react-hot-toast';

interface EditMixedMineralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditMixedMineralModal: React.FC<EditMixedMineralModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMineral, updateStatus, error } = useSelector((state: RootState) => state.mixedMinerals);

  const [formData, setFormData] = useState<UpdateMixedMineralData>({
    date_of_delivery: '',
    weight_kg: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedMineral && isOpen) {
      setFormData({
        date_of_delivery: selectedMineral.date_of_delivery,
        weight_kg: selectedMineral.weight_kg
      });
    }
  }, [selectedMineral, isOpen]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success(t('mixedMinerals.update_success'));
      onClose();
      dispatch(resetUpdateStatus());
    } else if (updateStatus === 'failed' && error) {
      toast.error(error);
      dispatch(resetUpdateStatus());
    }
  }, [updateStatus, error, onClose, dispatch, t]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date_of_delivery) {
      newErrors.date_of_delivery = t('mixedMinerals.validation.date_required');
    }

    if (formData.weight_kg <= 0) {
      newErrors.weight_kg = t('mixedMinerals.validation.weight_positive');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedMineral) {
      return;
    }

    dispatch(updateMixedMineral({ 
      id: selectedMineral.id, 
      mineralData: formData 
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
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 px-8 py-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <PencilIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        {t('mixedMinerals.edit_mineral')}
                      </Dialog.Title>
                      <p className="text-blue-100 text-sm">
                        {t('mixedMinerals.edit_description')}
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
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('mixedMinerals.lot_number')}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedMineral.lot_number}
                    </div>
                  </div>
                
                  {/* Date of Delivery */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('mixedMinerals.date_of_delivery')} *
                    </label>
                    <div className="relative">
                      <CalendarDaysIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="date"
                        value={formData.date_of_delivery}
                        onChange={(e) => setFormData(prev => ({ ...prev, date_of_delivery: e.target.value }))}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.date_of_delivery ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      />
                    </div>
                    {errors.date_of_delivery && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.date_of_delivery}
                      </motion.p>
                    )}
                  </div>

                  {/* Weight */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('mixedMinerals.weight_kg')} *
                    </label>
                    <div className="relative">
                      <ScaleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.weight_kg}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: parseFloat(e.target.value) }))}
                        className={`w-full pl-12 pr-10 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.weight_kg ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                        }`}
                        placeholder={t('mixedMinerals.weight_placeholder')}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        kg
                      </div>
                    </div>
                    {errors.weight_kg && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.weight_kg}
                      </motion.p>
                    )}
                  </div>

                  {/* Note about status update */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <span className="font-medium">{t('mixedMinerals.note')}:</span> {t('mixedMinerals.status_update_note')}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-2xl transition-colors duration-200"
                    >
                      {t('common.cancel')}
                    </button>
                    <motion.button
                      type="submit"
                      disabled={updateStatus === 'loading'}
                      whileHover={{ scale: updateStatus === 'loading' ? 1 : 1.02 }}
                      whileTap={{ scale: updateStatus === 'loading' ? 1 : 0.98 }}
                      className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {updateStatus === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{t('common.updating')}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
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

export default EditMixedMineralModal;