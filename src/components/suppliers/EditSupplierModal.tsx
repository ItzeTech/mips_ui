// components/EditSupplierModal.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  IdentificationIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { updateSupplier, resetUpdateStatus, UpdateSupplierData } from '../../features/user/suppliersSlice';
import toast from 'react-hot-toast';

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSupplier, updateStatus, error } = useSelector((state: RootState) => state.suppliers);

  const [formData, setFormData] = useState<UpdateSupplierData>({
    name: '',
    phone_number: '',
    email: '',
    national_id_or_passport: '',
    location: '',
    company: '',
    bank_account: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedSupplier && isOpen) {
      setFormData({
        name: selectedSupplier.name,
        phone_number: selectedSupplier.phone_number,
        email: selectedSupplier.email || '',
        national_id_or_passport: selectedSupplier.national_id_or_passport || '',
        location: selectedSupplier.location || '',
        company: selectedSupplier.company || '',
        bank_account: selectedSupplier.bank_account || ''
      });
    }
  }, [selectedSupplier, isOpen]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success(t('suppliers.update_success'));
      onClose();
      dispatch(resetUpdateStatus());
    } else if (updateStatus === 'failed' && error) {
      toast.error(error);
      dispatch(resetUpdateStatus());
    }
  }, [updateStatus, error, onClose, dispatch, t]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('suppliers.validation.name_required');
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = t('suppliers.validation.phone_required');
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = t('suppliers.validation.phone_invalid');
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('suppliers.validation.email_invalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedSupplier) {
      return;
    }

    // Remove empty optional fields
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => {
        if (key === 'name' || key === 'phone_number') return true;
        return value && value.trim() !== '';
      })
    );

    dispatch(updateSupplier({ id: selectedSupplier.id, supplierData: cleanedData as UpdateSupplierData }));
  };

  if (!selectedSupplier) return null;

  const formFields = [
    {
      key: 'name' as keyof UpdateSupplierData,
      label: t('suppliers.name'),
      icon: UserIcon,
      required: true,
      type: 'text',
      placeholder: t('suppliers.name_placeholder')
    },
    {
      key: 'phone_number' as keyof UpdateSupplierData,
      label: t('suppliers.phone_number'),
      icon: PhoneIcon,
      required: true,
      type: 'tel',
      placeholder: t('suppliers.phone_placeholder')
    },
    {
      key: 'email' as keyof UpdateSupplierData,
      label: t('suppliers.email'),
      icon: EnvelopeIcon,
      required: false,
      type: 'email',
      placeholder: t('suppliers.email_placeholder')
    },
    {
      key: 'national_id_or_passport' as keyof UpdateSupplierData,
      label: t('suppliers.national_id_or_passport'),
      icon: IdentificationIcon,
      required: false,
      type: 'text',
      placeholder: t('suppliers.id_placeholder')
    },
    {
      key: 'location' as keyof UpdateSupplierData,
      label: t('suppliers.location'),
      icon: MapPinIcon,
      required: false,
      type: 'text',
      placeholder: t('suppliers.location_placeholder')
    },
    {
      key: 'company' as keyof UpdateSupplierData,
      label: t('suppliers.company'),
      icon: BuildingOfficeIcon,
      required: false,
      type: 'text',
      placeholder: t('suppliers.company_placeholder')
    },
    {
      key: 'bank_account' as keyof UpdateSupplierData,
      label: t('suppliers.bank_account'),
      icon: BanknotesIcon,
      required: false,
      type: 'text',
      placeholder: t('suppliers.bank_placeholder')
    }
  ];

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
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <PencilSquareIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        {t('suppliers.edit_supplier')}
                      </Dialog.Title>
                      <p className="text-blue-100 text-sm">
                        {t('suppliers.edit_description')}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map((field, index) => (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {field.label} {field.required && '*'}
                        </label>
                        <div className="relative">
                          <field.icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type={field.type}
                            value={formData[field.key] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                              errors[field.key] ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                            }`}
                            placeholder={field.placeholder}
                          />
                        </div>
                        {errors[field.key] && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 flex items-center"
                          >
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            {errors[field.key]}
                          </motion.p>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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

export default EditSupplierModal;