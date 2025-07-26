// GeneralSettingsForm.tsx - with responsive adjustments
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchGeneralSettings,
  saveGeneralSettings,
  resetSaveStatus,
  GeneralSettingsData
} from '../../features/settings/generalSettingsSlice';
import {
  BuildingOfficeIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const GeneralSettingsForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { settings, status, error, saveStatus, isFetched } = useSelector((state: RootState) => state.generalSettings);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<GeneralSettingsData>({
    company_name: '',
    tin: '',
    address: '',
    telephone_number: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if(!isFetched){
      dispatch(fetchGeneralSettings());
    }
  }, [dispatch, isFetched]);

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name,
        tin: settings.tin,
        address: settings.address,
        telephone_number: settings.telephone_number
      });
      
      if (settings.logo) {
        setLogoPreview(`data:image/png;base64,${settings.logo}`);
      }
    }
  }, [settings]);

  useEffect(() => {
    if (saveStatus === 'succeeded') {
      toast.success(t('settings.general_saved_successfully'));
      dispatch(resetSaveStatus());
    } else if (saveStatus === 'failed' && error) {
      toast.error(error);
      dispatch(resetSaveStatus());
    }
  }, [saveStatus, error, dispatch, t]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = t('settings.validation.required_field');
    }

    if (!formData.tin.trim()) {
      newErrors.tin = t('settings.validation.required_field');
    }

    if (!formData.address.trim()) {
      newErrors.address = t('settings.validation.required_field');
    }

    if (!formData.telephone_number.trim()) {
      newErrors.telephone_number = t('settings.validation.required_field');
    } else if (!/^\+?[0-9\s\-()]+$/.test(formData.telephone_number)) {
      newErrors.telephone_number = t('settings.validation.invalid_phone');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('company_name', formData.company_name);
    formDataToSubmit.append('tin', formData.tin);
    formDataToSubmit.append('address', formData.address);
    formDataToSubmit.append('telephone_number', formData.telephone_number);
    
    if (logoFile) {
      formDataToSubmit.append('logo', logoFile);
    }

    dispatch(saveGeneralSettings({ 
      formData: formDataToSubmit, 
      isUpdate: !!settings 
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const formFields = [
    {
      key: 'company_name',
      label: t('settings.company_name'),
      icon: BuildingOfficeIcon,
      placeholder: t('settings.company_name_placeholder'),
      color: 'from-purple-500 to-indigo-600'
    },
    {
      key: 'tin',
      label: t('settings.tin'),
      icon: IdentificationIcon,
      placeholder: t('settings.tin_placeholder'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      key: 'address',
      label: t('settings.address'),
      icon: MapPinIcon,
      placeholder: t('settings.address_placeholder'),
      color: 'from-blue-500 to-cyan-600'
    },
    {
      key: 'telephone_number',
      label: t('settings.telephone_number'),
      icon: PhoneIcon,
      placeholder: t('settings.telephone_placeholder'),
      color: 'from-amber-500 to-orange-600'
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-6"
        >
          <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.company_logo')}
          </label>
          <div 
            onClick={handleLogoClick}
            className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors duration-300"
          >
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Company Logo" 
                className="w-full h-full object-contain rounded-full p-2"
              />
            ) : (
              <div className="text-center">
                <PhotoIcon className="mx-auto h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.click_to_upload')}
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map((field, index) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="group"
            >
              <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {field.label}
              </label>
              <div className="relative">
                <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-gradient-to-r ${field.color} rounded-lg md:rounded-xl shadow-lg group-focus-within:scale-110 transition-transform duration-200`}>
                  <field.icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <input
                  type="text"
                  name={field.key}
                  value={formData[field.key as keyof GeneralSettingsData]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className={`w-full pl-12 md:pl-16 pr-3 py-2.5 md:py-3 text-sm md:text-base border-2 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                    errors[field.key] ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors[field.key] && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 flex items-center"
                >
                  <ExclamationTriangleIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
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
          transition={{ delay: 0.6 }}
          className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <motion.button
            type="submit"
            disabled={saveStatus === 'loading'}
            whileHover={{ scale: saveStatus === 'loading' ? 1 : 1.02 }}
            whileTap={{ scale: saveStatus === 'loading' ? 1 : 0.98 }}
            className="px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-semibold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saveStatus === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('common.saving')}</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
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
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-2"
          >
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-10 md:h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl md:rounded-2xl animate-pulse"></div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl md:rounded-2xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default GeneralSettingsForm;