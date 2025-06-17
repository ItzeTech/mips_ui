// components/dashboard/minerals/EditTantalumModal.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  PencilIcon, 
  ScaleIcon, 
  BeakerIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '../../../../../store/store';
import {
  resetUpdateLabAnalysisStatus,
  resetUpdateFinancialsStatus,
  resetUpdateStockStatus,
  calculateFinancials,
  StockFormData,
  LabFormData,
  FinancialFormData,
} from '../../../../../features/minerals/tantalumSlice';
import StockTab from './tabs/StockTab';
import LabTab from './tabs/LabTab';
import FinancialTab from './tabs/FinancialTab';
import SaveFormButton from '../common/SaveFormButton';
import TabButton from '../common/TabButton';
import { fetchTantalumSettings, TantalumSettingsData } from '../../../../../features/settings/tantalumSettingSlice';

type UserRole = "Stock Manager" | "Boss" | "Manager" | "Lab Technician" | "Finance Officer";

interface EditTantalumModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

const EditTantalumModal: React.FC<EditTantalumModalProps> = ({ isOpen, onClose, userRole }) => {
  const { t } = useTranslation();
  const { settings, isFetched } = useSelector((state: RootState) => state.tantalumSettings);
  const dispatch = useDispatch<AppDispatch>();

  const [tantalumSetting, setTantalumSetting] = useState<TantalumSettingsData>({
      rra_percentage: 0,
      rma_usd_per_ton: 0,
      inkomane_fee_per_kg_rwf: 0
    });
  

  useEffect(() => {
      if(!isFetched){
        dispatch(fetchTantalumSettings());
      }
    }, [dispatch, isFetched]);
  
    useEffect(() => {
      if (settings) {
        setTantalumSetting({
          rra_percentage: settings.rra_percentage / 100,
          rma_usd_per_ton: settings.rma_usd_per_ton / 1000,
          inkomane_fee_per_kg_rwf: settings.inkomane_fee_per_kg_rwf
        });
      }
    }, [settings]);

  const { 
    selectedTantalum, 
    updateLabAnalysisStatus,
    updateFinancialsStatus,
    updateStockStatus: stockUpdateStatus,
    updateFinancialsStatus: financeUpdateStatus,
    error 
  } = useSelector((state: RootState) => state.tantalums);
  
  const [activeTab, setActiveTab] = useState<'stock' | 'lab' | 'financial'>('stock');
  
  // Separate form states
  const [stockForm, setStockForm] = useState<StockFormData>({
    net_weight: null,
    date_of_sampling: '',
    date_of_delivery: '',
    stock_status: 'in-stock'
  });

  const [labForm, setLabForm] = useState<LabFormData>({
    internal_ta2o5: null,
    internal_nb2o5: null,
    nb_percentage: null,
    sn_percentage: null,
    fe_percentage: null,
    w_percentage: null,
    alex_stewart_ta2o5: null,
    alex_stewart_nb2o5: null
  });

  const [financialForm, setFinancialForm] = useState<FinancialFormData>({
    price_per_percentage: null,
    purchase_ta2o5_percentage: null,
    exchange_rate: null,
    price_of_tag_per_kg_rwf: null,
    finance_status: 'unpaid'
  });

  const [calculatedValues, setCalculatedValues] = useState({
    unit_price: null as number | null,
    total_amount: null as number | null,
    rra: null as number | null,
    rma: null as number | null,
    inkomane_fee: null as number | null,
    advance: null as number | null,
    total_charge: null as number | null,
    net_amount: null as number | null
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasStockChanges, setHasStockChanges] = useState(false);
  const [hasLabChanges, setHasLabChanges] = useState(false);
  const [hasFinancialChanges, setHasFinancialChanges] = useState(false);

  // Role-based access control
  const canAccessStock = () => ['Stock Manager', 'Boss', 'Manager'].includes(userRole);
  const canAccessLab = () => ['Lab Technician', 'Boss', 'Manager'].includes(userRole);
  const canAccessFinancial = () => ['Finance Officer', 'Boss', 'Manager'].includes(userRole);

  const getDefaultTab = (): 'stock' | 'lab' | 'financial' => {
    if (canAccessStock()) return 'stock';
    if (canAccessLab()) return 'lab';
    if (canAccessFinancial()) return 'financial';
    return 'stock'; // fallback
  };

  // Initialize forms when modal opens
  useEffect(() => {
    if (selectedTantalum && isOpen) {
      setStockForm({
        net_weight: selectedTantalum.net_weight,
        date_of_sampling: selectedTantalum.date_of_sampling,
        date_of_delivery: selectedTantalum.date_of_delivery,
        stock_status: selectedTantalum.stock_status
      });

      setLabForm({
        internal_ta2o5: selectedTantalum.internal_ta2o5,
        internal_nb2o5: selectedTantalum.internal_nb2o5,
        nb_percentage: selectedTantalum.nb_percentage,
        sn_percentage: selectedTantalum.sn_percentage,
        fe_percentage: selectedTantalum.fe_percentage,
        w_percentage: selectedTantalum.w_percentage,
        alex_stewart_ta2o5: selectedTantalum.alex_stewart_ta2o5,
        alex_stewart_nb2o5: selectedTantalum.alex_stewart_nb2o5
      });

      setFinancialForm({
        price_per_percentage: selectedTantalum.price_per_percentage,
        purchase_ta2o5_percentage: selectedTantalum.purchase_ta2o5_percentage,
        exchange_rate: selectedTantalum.exchange_rate,
        price_of_tag_per_kg_rwf: selectedTantalum.price_of_tag_per_kg_rwf,
        finance_status: selectedTantalum.finance_status
      });

      setErrors({});
      setHasStockChanges(false);
      setHasLabChanges(false);
      setHasFinancialChanges(false);
      setActiveTab(getDefaultTab());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTantalum, isOpen, userRole]);

  // Calculate financial values when relevant fields change
  useEffect(() => {
    if (selectedTantalum && stockForm.net_weight && 
        financialForm.price_per_percentage !== null && 
        financialForm.purchase_ta2o5_percentage !== null && 
        financialForm.exchange_rate !== null && 
        financialForm.price_of_tag_per_kg_rwf !== null) {
      
      const calculated = calculateFinancials({
        ...financialForm,
        net_weight: stockForm.net_weight
      },
      tantalumSetting
    );

      setCalculatedValues({
        unit_price: calculated.unit_price || null,
        total_amount: calculated.total_amount || null,
        rra: calculated.rra || null,
        rma: calculated.rma || null,
        inkomane_fee: calculated.inkomane_fee || null,
        advance: calculated.advance || null,
        total_charge: calculated.total_charge || null,
        net_amount: calculated.net_amount || null
      });
    }else{
      setCalculatedValues({
        unit_price: null,
        total_amount: null,
        rra: null,
        rma: null,
        inkomane_fee: null,
        advance: null,
        total_charge: null,
        net_amount: null
      });
    }
  }, [
    financialForm.price_per_percentage,
    financialForm.purchase_ta2o5_percentage,
    financialForm.exchange_rate,
    financialForm.price_of_tag_per_kg_rwf,
    stockForm.net_weight,
    selectedTantalum,
    stockForm,
    financialForm,
    tantalumSetting
  ]);

  // Track changes for each form
  useEffect(() => {
    if (selectedTantalum) {
      const originalStock = {
        net_weight: selectedTantalum.net_weight,
        date_of_sampling: selectedTantalum.date_of_sampling,
        date_of_delivery: selectedTantalum.date_of_delivery,
        stock_status: selectedTantalum.stock_status
      };
      setHasStockChanges(JSON.stringify(originalStock) !== JSON.stringify(stockForm));
    }
  }, [stockForm, selectedTantalum]);
 
  useEffect(() => {
    if (selectedTantalum) {
      const originalLab = {
        internal_ta2o5: selectedTantalum.internal_ta2o5,
        internal_nb2o5: selectedTantalum.internal_nb2o5,
        nb_percentage: selectedTantalum.nb_percentage,
        sn_percentage: selectedTantalum.sn_percentage,
        fe_percentage: selectedTantalum.fe_percentage,
        w_percentage: selectedTantalum.w_percentage,
        alex_stewart_ta2o5: selectedTantalum.alex_stewart_ta2o5,
        alex_stewart_nb2o5: selectedTantalum.alex_stewart_nb2o5
      };
      setHasLabChanges(JSON.stringify(originalLab) !== JSON.stringify(labForm));
    }
  }, [labForm, selectedTantalum]);

  useEffect(() => {
    if (selectedTantalum) {
      const originalFinancial = {
        price_per_percentage: selectedTantalum.price_per_percentage,
        purchase_ta2o5_percentage: selectedTantalum.purchase_ta2o5_percentage,
        exchange_rate: selectedTantalum.exchange_rate,
        price_of_tag_per_kg_rwf: selectedTantalum.price_of_tag_per_kg_rwf,
        finance_status: selectedTantalum.finance_status
      };
      setHasFinancialChanges(JSON.stringify(originalFinancial) !== JSON.stringify(financialForm));
    }
  }, [financialForm, selectedTantalum]);

  const handleStockSubmit = async () => {
    if (!selectedTantalum) return;
  
    try {
      const formDataToSubmit: any = { ...stockForm };
      const newErrors: Record<string, string> = {};
  
      // Validate required fields except date_of_delivery
      if (formDataToSubmit.net_weight == null || formDataToSubmit.net_weight === '') {
        newErrors.net_weight = t('stock.net_weight_required', 'Net Weight is required');
      }
      if (!formDataToSubmit.date_of_sampling) {
        newErrors.date_of_sampling = t('stock.date_of_sampling_required', 'Date of Sampling is required');
      }
      if (!formDataToSubmit.stock_status) {
        newErrors.stock_status = t('stock.stock_status_required', 'Stock Status is required');
      }
  
      // Remove date_of_delivery if empty
      if (!formDataToSubmit.date_of_delivery) {
        delete formDataToSubmit.date_of_delivery;
      }
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return; // stop submission
      }
  
      setErrors({}); // clear previous errors
  
      // Submit the form data now
      console.log('Submitting:', formDataToSubmit);
  
      // Call your API or dispatch action here
      // await dispatch(updateStock({ id: selectedTantalan.id, stockData: formDataToSubmit })).unwrap();
  
    } catch (error) {
      console.error('Stock update failed:', error);
    }
  };
  

  const handleLabSubmit = async () => {
    if (!selectedTantalum) return;
  
    try {
      const labData: any = { ...labForm };
      const newErrors: Record<string, string> = {};
  
      // Check required fields - must not be null or empty
      if (labData.internal_ta2o5 == null || labData.internal_ta2o5 === '') {
        newErrors.internal_ta2o5 = t('tantalum.internal_ta2o5_required', 'Internal Ta2O5 is required');
      }
      if (labData.internal_nb2o5 == null || labData.internal_nb2o5 === '') {
        newErrors.internal_nb2o5 = t('tantalum.internal_nb2o5_required', 'Internal Nb2O5 is required');
      }
      if (labData.nb_percentage == null || labData.nb_percentage === '') {
        newErrors.nb_percentage = t('tantalum.nb_percentage_required', 'Nb % is required');
      }
      if (labData.sn_percentage == null || labData.sn_percentage === '') {
        newErrors.sn_percentage = t('tantalum.sn_percentage_required', 'Sn % is required');
      }
      if (labData.fe_percentage == null || labData.fe_percentage === '') {
        newErrors.fe_percentage = t('tantalum.fe_percentage_required', 'Fe % is required');
      }
      if (labData.w_percentage == null || labData.w_percentage === '') {
        newErrors.w_percentage = t('tantalum.w_percentage_required', 'W % is required');
      }
  
      // Validate Alex Stewart fields: both must be present if one is present
      const hasAlexTa2O5 = labData.alex_stewart_ta2o5 != null && labData.alex_stewart_ta2o5 !== '';
      const hasAlexNb2O5 = labData.alex_stewart_nb2o5 != null && labData.alex_stewart_nb2o5 !== '';
  
      if (hasAlexTa2O5 !== hasAlexNb2O5) {
        if (!hasAlexTa2O5) {
          newErrors.alex_stewart_ta2o5 = t(
            'tantalum.alex_stewart_ta2o5_required_if_nb2o5',
            'Alex Stewart Ta2O5 must be filled if Nb2O5 is filled'
          );
        }
        if (!hasAlexNb2O5) {
          newErrors.alex_stewart_nb2o5 = t(
            'tantalum.alex_stewart_nb2o5_required_if_ta2o5',
            'Alex Stewart Nb2O5 must be filled if Ta2O5 is filled'
          );
        }
      }
  
      // If both Alex Stewart fields are empty, remove them from payload
      if (!hasAlexTa2O5 && !hasAlexNb2O5) {
        delete labData.alex_stewart_ta2o5;
        delete labData.alex_stewart_nb2o5;
      }
  
      // If there are validation errors, set errors and abort submit
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      setErrors({}); // Clear previous errors
  
      // Submit the validated data
      console.log('Lab data ready to submit:', labData);
  
      // Your dispatch or API call here
      // await dispatch(updateLab({ id: selectedTantalum.id, labData })).unwrap();
  
    } catch (error) {
      console.error('Lab update failed:', error);
    }
  };
  

  const handleFinancialSubmit = async () => {
    if (!selectedTantalum || !hasFinancialChanges) return;
  
    // 1. Validate required fields
    const newErrors: Record<string, string> = {};
    if (financialForm.price_per_percentage == null) {
      newErrors.price_per_percentage = t('tantalum.price_per_percentage_required', 'Price per percentage is required');
    }
    if (financialForm.purchase_ta2o5_percentage == null) {
      newErrors.purchase_ta2o5_percentage = t('tantalum.purchase_ta2o5_percentage_required', 'Purchase Ta2O5% is required');
    }
    if (financialForm.exchange_rate == null) {
      newErrors.exchange_rate = t('tantalum.exchange_rate_required', 'Exchange rate is required');
    }
    if (financialForm.price_of_tag_per_kg_rwf == null) {
      newErrors.price_of_tag_per_kg_rwf = t('tantalum.price_of_tag_per_kg_rwf_required', 'Price of tag per kg is required');
    }
  
    // 2. If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      // 3. Clear previous errors
      setErrors({});
  
      // 4. Construct and send data
      const financialData = {
        price_per_percentage: financialForm.price_per_percentage,
        purchase_ta2o5_percentage: financialForm.purchase_ta2o5_percentage,
        exchange_rate: financialForm.exchange_rate,
        price_of_tag_per_kg_rwf: financialForm.price_of_tag_per_kg_rwf
      };

      console.log(financialData)
  
      // await dispatch(updateFinancials({
      //   id: selectedTantalum.id,
      //   financialData
      // })).unwrap();
    } catch (error) {
      console.error('Financial update failed:', error);
    }
  };
  

  const handleClose = () => {
    dispatch(resetUpdateLabAnalysisStatus());
    dispatch(resetUpdateFinancialsStatus());
    dispatch(resetUpdateStockStatus());
    onClose();
  };



  const isLoading = updateLabAnalysisStatus === 'loading' || 
                   updateFinancialsStatus === 'loading' || 
                   stockUpdateStatus === 'loading' || 
                   financeUpdateStatus === 'loading';

  // Animation variants (same as before)
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
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



  if (!selectedTantalum) return null;



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
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <motion.div 
                className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg mr-4">
                    <PencilIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('tantalum.edit_details', 'Edit Tantalum')}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                        {selectedTantalum.lot_number}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>
              
              {/* Tabs */}
              <motion.div
                className="flex items-center justify-center space-x-4 px-6 pt-6"
                variants={itemVariants}
              >
                {canAccessStock() && (
                  <TabButton
                    isActive={activeTab === 'stock'}
                    onClick={() => setActiveTab('stock')}
                    icon={<ScaleIcon className="w-5 h-5 mr-2" />}
                    label={t('tantalum.stock', 'Stock')}
                    hasChanges={hasStockChanges}
                  />
                )}

                {canAccessLab() && (
                  <TabButton
                    isActive={activeTab === 'lab'}
                    onClick={() => setActiveTab('lab')}
                    icon={<BeakerIcon className="w-5 h-5 mr-2" />}
                    label={t('tantalum.lab_analysis', 'Lab Analysis')}
                    hasChanges={hasLabChanges}
                  />
                )}

                {canAccessFinancial() && (
                  <TabButton
                    isActive={activeTab === 'financial'}
                    onClick={() => setActiveTab('financial')}
                    icon={<CurrencyDollarIcon className="w-5 h-5 mr-2" />}
                    label={t('tantalum.financial_details', 'Financial')}
                    hasChanges={hasFinancialChanges}
                  />
                )}
              </motion.div>

              {/* Access denied message for unavailable tabs */}
              <div className="px-6 pt-2">
                {(!canAccessStock() && !canAccessLab() && !canAccessFinancial()) && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center text-red-700 dark:text-red-300">
                      <LockClosedIcon className="w-5 h-5 mr-2" />
                      <span className="font-medium">
                        {t('common.access_denied', 'Access Denied')}
                      </span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {t('tantalum.no_permission', 'You do not have permission to edit any sections of this tantalum record.')}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  {/* Stock Tab */}
                  {activeTab === 'stock' && canAccessStock() && (
                    <StockTab 
                      stockForm={stockForm}
                      setStockForm={setStockForm}
                      errors={errors}
                    />
                  )}
                  
                  {/* Lab Tab */}
                  {activeTab === 'lab' && canAccessLab() && (
                    <LabTab 
                      labForm={labForm}
                      setLabForm={setLabForm}
                      errors={errors}
                    />
                  )}
                  
                  {/* Financial Tab */}
                  {activeTab === 'financial' && canAccessFinancial() && (
                    <FinancialTab
                      financialForm={financialForm}
                      net_weight={stockForm.net_weight}
                      setFinancialForm={setFinancialForm}
                      labForm={labForm}
                      calculatedValues={calculatedValues}
                      errors={errors}
                      TantalumSettingsData={settings}

                    />
                  )}
                </AnimatePresence>
              </div>
              
              {/* Footer */}
              <motion.div 
                className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  {error && (
                    <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                      {error}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {t('common.cancel', 'Cancel')}
                  </motion.button>
                  
                  {/* Dynamic save button based on active tab */}
                  {activeTab === 'stock' && canAccessStock() && (
                    <SaveFormButton
                      onClick={handleStockSubmit}
                      disabled={!hasStockChanges || isLoading}
                      isLoading={isLoading}
                      hasChanges={hasStockChanges}
                      label={t('tantalum.save_stock', 'Save Stock')}
                    />
                  )}

                  {activeTab === 'lab' && canAccessLab() && (
                    <SaveFormButton
                      onClick={handleLabSubmit}
                      disabled={!hasLabChanges || isLoading}
                      isLoading={isLoading}
                      hasChanges={hasLabChanges}
                      label={t('tantalum.save_lab', 'Save Lab Data')}
                    />
                  )}

                  {activeTab === 'financial' && canAccessFinancial() && (
                    <SaveFormButton
                      onClick={handleFinancialSubmit}
                      disabled={!hasFinancialChanges || isLoading}
                      isLoading={isLoading}
                      hasChanges={hasFinancialChanges}
                      label={t('tantalum.save_financial', 'Save Financial')}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditTantalumModal;