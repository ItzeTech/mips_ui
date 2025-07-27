// components/dashboard/minerals/tin/CreateTinModal.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon, 
  ScaleIcon,
} from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '../../../../store/store';
import { createTin, resetCreateStatus } from '../../../../features/minerals/tinSlice';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import SelectInput from '../../../mineralsForm/SelectInput';
import DateInput from '../../../mineralsForm/DateInput';
import TextInput from '../../../mineralsForm/TextInput';
import SubmitCancelButtons from '../../../mineralsForm/SubmitCancelButtons';
import HeaderCard from '../../../mineralsForm/HeaderCard';
import { fetchSuppliers_all } from '../../../../features/user/suppliersSlice';

interface CreateTinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTinModal: React.FC<CreateTinModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { createStatus, error } = useSelector((state: RootState) => state.tins);
  
  const [supplierId, setSupplierId] = useState<string>('');
  const [netWeight, setNetWeight] = useState<string>('');
  const [dateOfSampling, setDateOfSampling] = useState<Date | null>(new Date());

  const { suppliers_all, isFetched } = useSelector((state: RootState) => state.suppliers);
  
  const [errors, setErrors] = useState({
    supplierId: '',
    netWeight: '',
    dateOfSampling: '',
  });

  const [formData, setFormData] = useState<any>({
    supplier_id: '',
  });

  useEffect(() => {
    if (isOpen && !isFetched) {
      dispatch(fetchSuppliers_all());
    }
  }, [isOpen, dispatch, isFetched]);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      toast.success(t('tin.add_success', 'Tin added successfully'), {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      handleClose();
      dispatch(resetCreateStatus());
    } else if (createStatus === 'failed' && error) {
      toast.error(error, {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createStatus, error, dispatch, t]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      supplierId: '',
      netWeight: '',
      dateOfSampling: '',
    };

    if (!supplierId) {
      newErrors.supplierId = t('common.validation.required', 'This field is required');
      valid = false;
    }

    if (!netWeight) {
      newErrors.netWeight = t('common.validation.required', 'This field is required');
      valid = false;
    } else if (isNaN(parseFloat(netWeight)) || parseFloat(netWeight) <= 0) {
      newErrors.netWeight = t('common.validation.positive_number', 'Please enter a positive number');
      valid = false;
    }

    if (!dateOfSampling) {
      newErrors.dateOfSampling = t('common.validation.required', 'This field is required');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formattedDate = dateOfSampling?.toISOString().split('T')[0];
    
    dispatch(createTin({
      supplier_id: supplierId,
      net_weight: parseFloat(netWeight),
      date_of_sampling: formattedDate || '',
    }));
  };

  const handleClose = () => {
    // Reset form
    setSupplierId('');
    setNetWeight('');
    setDateOfSampling(new Date());
    setErrors({
      supplierId: '',
      netWeight: '',
      dateOfSampling: '',
    });
    setFormData({
      supplier_id: '',
    })
    dispatch(resetCreateStatus());
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        duration: 0.4, 
        bounce: 0.3,
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 10,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-md lg:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <HeaderCard
                title={t('tin.create_new', 'Add New Tin')}
                description={t('tin.create_description', 'Enter details to add a new tin record')}
                onClose={handleClose}
              />
              
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                {/* Supplier */}
                <SelectInput
                  label={t('tin.supplier', 'Supplier')}
                  icon={<UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
                  iconLabel={<UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                  value={formData.supplier_id}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSupplierId(val);
                    setFormData((prev: any) => ({ ...prev, supplier_id: val }));
                    if (errors.supplierId) {
                      setErrors(prev => ({ ...prev, supplierId: '' }));
                    }
                  }}
                  options={suppliers_all.map(supplier => ({
                    value: supplier.id,
                    label: `${supplier.name} - ${supplier.phone_number}`,
                  }))}
                  error={errors.supplierId}
                  placeholder={t('tin.select_supplier')}
                />
                
                {/* Net Weight */}
                <TextInput
                  label={t('tin.net_weight', 'Net Weight (kg)')}
                  icon={<ScaleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
                  iconLabel={<ScaleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                  value={netWeight}
                  onChange={(e) => {
                    setNetWeight(e.target.value);
                    if (errors.netWeight) {
                      setErrors(prev => ({ ...prev, netWeight: '' }));
                    }
                  }}
                  type="number"
                  step="0.01"
                  placeholder="12.5"
                  error={errors.netWeight}
                />
                
                {/* Date of Sampling */}
                <DateInput
                  label={t('tin.date_of_sampling', 'Date of Sampling')}
                  selected={dateOfSampling}
                  onChange={(date) => {
                    setDateOfSampling(date);
                    if (errors.dateOfSampling) {
                      setErrors(prev => ({ ...prev, dateOfSampling: '' }));
                    }
                  }}
                  error={errors.dateOfSampling}
                />
              
                {/* Submit Button */}
                <SubmitCancelButtons
                  loading={createStatus === 'loading'}
                  onCancel={handleClose}
                  submitLabel={t('tin.create', 'Create Tin')}
                  create={t('common.create')}
                  cancel={t('common.cancel')}
                  creating={t('common.creating')}
                />
                
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTinModal;