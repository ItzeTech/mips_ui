import { ExclamationTriangleIcon, UserIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';
import { fetchSuppliers } from '../../features/user/suppliersSlice';

export default function SupplierSelect({value, error, isOpen}: any) {

    const { t } = useTranslation();
    const { suppliers } = useSelector((state: RootState) => state.suppliers);
    const dispatch = useDispatch<AppDispatch>();

      useEffect(() => {
        if (isOpen) {
          dispatch(fetchSuppliers({ page: 1, size: 100 }));
        }
      }, [isOpen, dispatch]);

  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('mixedMinerals.supplier')} *
      </label>
      <div className="relative">
        <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
        <select
          value={value}
        >
          <option value="">{t('mixedMinerals.select_supplier')}</option>
          {suppliers.map(supplier => (
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
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center"
        >
          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  )
}
