// components/TantalumSettingsForm.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchTantalumSettings,
  saveTantalumSettings,
  resetSaveStatus,
  TantalumSettingsData
} from '../../features/settings/tantalumSettingSlice';
import {
  PercentBadgeIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { NumericFormat } from 'react-number-format';

const TantalumSettingsForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { settings, status, error, saveStatus, isFetched } = useSelector((state: RootState) => state.tantalumSettings);

  const [formData, setFormData] = useState<TantalumSettingsData>({
    rra_percentage: 0,
    rma_usd_per_ton: 0,
    inkomane_fee_per_kg_rwf: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if(!isFetched){
      dispatch(fetchTantalumSettings());
    }
  }, [dispatch, isFetched]);

  useEffect(() => {
    if (settings) {
      setFormData({
        rra_percentage: settings.rra_percentage,
        rma_usd_per_ton: settings.rma_usd_per_ton,
        inkomane_fee_per_kg_rwf: settings.inkomane_fee_per_kg_rwf
      });
    }
  }, [settings]);

  useEffect(() => {
    if (saveStatus === 'succeeded') {
      toast.success(t('settings.tantalum_saved_successfully'));
      dispatch(resetSaveStatus());
    } else if (saveStatus === 'failed' && error) {
      toast.error(error);
      dispatch(resetSaveStatus());
    }
  }, [saveStatus, error, dispatch, t]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.rra_percentage < 0 || formData.rra_percentage > 100) {
      newErrors.rra_percentage = t('settings.validation.percentage_range');
    }

    if (formData.rma_usd_per_ton <= 0) {
      newErrors.rma_usd_per_ton = t('settings.validation.positive_number');
    }

    if (formData.inkomane_fee_per_kg_rwf <= 0) {
      newErrors.inkomane_fee_per_kg_rwf = t('settings.validation.positive_number');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(saveTantalumSettings(formData));
  };

  const handleInputChange = (field: keyof TantalumSettingsData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formFields = [
    {
      key: 'rra_percentage' as keyof TantalumSettingsData,
      label: t('settings.rra_percentage'),
      icon: PercentBadgeIcon,
      unit: '%',
      step: 0.1,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      key: 'rma_usd_per_ton' as keyof TantalumSettingsData,
      label: t('settings.rma_usd_per_ton'),
      icon: CurrencyDollarIcon,
      unit: 'USD/ton',
      step: 0.01,
      color: 'from-green-500 to-emerald-600'
    },
    {
      key: 'inkomane_fee_per_kg_rwf' as keyof TantalumSettingsData,
      label: t('settings.inkomane_fee_per_kg_rwf'),
      icon: ScaleIcon,
      unit: 'RWF/kg',
      step: 0.01,
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  if (status === 'loading') {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formFields.map((field, index) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {field.label}
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r ${field.color} rounded-xl shadow-lg group-focus-within:scale-110 transition-transform duration-200`}>
                  <field.icon className="w-4 h-4 text-white" />
                </div>
                {/* <input
                  type="number"
                  step={field.step}
                  value={formData[field.key]}
                  onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
                  className={`w-full pl-20 pr-20 py-4 text-lg border-2 rounded-2xl focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                    errors[field.key] ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder="0.00"
                /> */}
                <NumericFormat
                    value={formData[field.key]}
                    decimalScale={2}
                    allowNegative={false}
                    allowLeadingZeros={false}
                    onValueChange={(values) => {
                        handleInputChange(field.key, values?.floatValue || 0)
                    }}
                    className={`w-full pl-20 pr-20 py-4 text-lg border-2 rounded-2xl focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                      errors[field.key] ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                    }`}
                    placeholder={`0.00`}    
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300">
                  {field.unit}
                </div>
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

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <motion.button
            type="submit"
            disabled={saveStatus === 'loading'}
            whileHover={{ scale: saveStatus === 'loading' ? 1 : 1.02 }}
            whileTap={{ scale: saveStatus === 'loading' ? 1 : 0.98 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saveStatus === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('common.saving')}</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                <span>{t('common.save_settings')}</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-3"
          >
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default TantalumSettingsForm;