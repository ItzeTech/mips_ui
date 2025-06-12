// components/ViewSupplierModal.tsx
import React from 'react';
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
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ViewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewSupplierModal: React.FC<ViewSupplierModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { selectedSupplier } = useSelector((state: RootState) => state.suppliers);

  if (!selectedSupplier) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const supplierFields = [
    {
      icon: UserIcon,
      label: t('suppliers.name'),
      value: selectedSupplier.name,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: PhoneIcon,
      label: t('suppliers.phone_number'),
      value: selectedSupplier.phone_number,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: EnvelopeIcon,
      label: t('suppliers.email'),
      value: selectedSupplier.email || t('suppliers.not_provided'),
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: IdentificationIcon,
      label: t('suppliers.national_id_or_passport'),
      value: selectedSupplier.national_id_or_passport || t('suppliers.not_provided'),
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: MapPinIcon,
      label: t('suppliers.location'),
      value: selectedSupplier.location || t('suppliers.not_provided'),
      color: 'text-red-600 dark:text-red-400'
    },
    {
      icon: BuildingOfficeIcon,
      label: t('suppliers.company'),
      value: selectedSupplier.company || t('suppliers.not_provided'),
      color: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      icon: BanknotesIcon,
      label: t('suppliers.bank_account'),
      value: selectedSupplier.bank_account || t('suppliers.not_provided'),
      color: 'text-yellow-600 dark:text-yellow-400'
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
              <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-8 py-8">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <EyeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Dialog.Title className="text-xl font-bold text-white">
                          {t('suppliers.supplier_details')}
                        </Dialog.Title>
                        <p className="text-indigo-100 text-sm">
                          {t('suppliers.view_description')}
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

                  {/* Supplier Avatar and Basic Info */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <div className="relative inline-block">
                      <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
                        <UserIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {selectedSupplier.name}
                    </h3>
                    <p className="text-indigo-100 text-lg">
                      {selectedSupplier.phone_number}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-3">
                {/* Supplier Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {supplierFields.map((field, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 shadow-sm`}>
                          <field.icon className={`w-5 h-5 ${field.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {field.label}
                          </p>
                          <p className={`font-medium text-gray-900 dark:text-white ${
                            field.value === t('suppliers.not_provided') ? 'italic text-gray-500' : ''
                          }`}>
                            {field.value}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Timestamps */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gray-500 rounded-xl">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('suppliers.timestamps')}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('suppliers.created_at')}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedSupplier.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('suppliers.updated_at')}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedSupplier.updated_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Close Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="pt-4"
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

export default ViewSupplierModal;