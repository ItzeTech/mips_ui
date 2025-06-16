// components/minerals/CreateMixedMineralModal.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon,
  CalendarDaysIcon,
  ScaleIcon,
  UserIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { createMixedMineral, resetCreateStatus, CreateMixedMineralData } from '../../../features/minerals/mixedMineralsSlice';
import { fetchSuppliers_all } from '../../../features/user/suppliersSlice';
import toast from 'react-hot-toast';

interface CreateMixedMineralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMixedMineralModal: React.FC<CreateMixedMineralModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { createStatus, error } = useSelector((state: RootState) => state.mixedMinerals);
  const { suppliers_all, isFetched } = useSelector((state: RootState) => state.suppliers);

  const [formData, setFormData] = useState<CreateMixedMineralData>({
    date_of_delivery: new Date().toISOString().split('T')[0],
    supplier_id: '',
    weight_kg: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && !isFetched) {
      dispatch(fetchSuppliers_all());
    }
  }, [isOpen, dispatch, isFetched]);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      toast.success(t('mixedMinerals.create_success'));
      onClose();
      resetForm();
      dispatch(resetCreateStatus());
    } else if (createStatus === 'failed' && error) {
      toast.error(error);
      dispatch(resetCreateStatus());
    }
  }, [createStatus, error, onClose, dispatch, t]);

  const resetForm = () => {
    setFormData({
      date_of_delivery: new Date().toISOString().split('T')[0],
      supplier_id: '',
      weight_kg: 0
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date_of_delivery) {
      newErrors.date_of_delivery = t('mixedMinerals.validation.date_required');
    }

    if (!formData.supplier_id) {
      newErrors.supplier_id = t('mixedMinerals.validation.supplier_required');
    }

    if (formData.weight_kg <= 0) {
      newErrors.weight_kg = t('mixedMinerals.validation.weight_positive');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(createMixedMineral(formData));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          static
          open={isOpen}
          onClose={handleClose}
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
              <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 px-8 py-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        {t('mixedMinerals.create_new')}
                      </Dialog.Title>
                      <p className="text-purple-100 text-sm">
                        {t('mixedMinerals.create_description')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date of Delivery */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('mixedMinerals.date_of_delivery')} *
                    </label>
                    <div className="relative">
                      <CalendarDaysIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <input
                        type="date"
                        value={formData.date_of_delivery}
                        onChange={(e) => setFormData(prev => ({ ...prev, date_of_delivery: e.target.value }))}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
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

                  {/* Supplier */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('mixedMinerals.supplier')} *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <select
                        value={formData.supplier_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, supplier_id: e.target.value }))}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 appearance-none ${
                          errors.supplier_id ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <option value="">{t('mixedMinerals.select_supplier')}</option>
                        {suppliers_all.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name} - {supplier.phone_number}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 12l-6-6 1.5-1.5L10 9l4.5-4.5L16 6l-6 6z" />
                        </svg>
                      </div>
                    </div>
                    {errors.supplier_id && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.supplier_id}
                      </motion.p>
                    )}
                  </div>

                  {/* Weight */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('mixedMinerals.weight_kg')} *
                    </label>
                    <div className="relative">
                      <ScaleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.weight_kg}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: parseFloat(e.target.value) }))}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
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

                  {/* Note */}
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4">
                    <p className="text-sm text-indigo-800 dark:text-indigo-200">
                      <span className="font-medium">{t('mixedMinerals.note')}:</span> {t('mixedMinerals.create_note')}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-2xl transition-colors duration-200"
                    >
                      {t('common.cancel')}
                    </button>
                    <motion.button
                      type="submit"
                      disabled={createStatus === 'loading'}
                      whileHover={{ scale: createStatus === 'loading' ? 1 : 1.02 }}
                      whileTap={{ scale: createStatus === 'loading' ? 1 : 0.98 }}
                      className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {createStatus === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{t('common.creating')}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>{t('common.create')}</span>
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

export default CreateMixedMineralModal;