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
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '../../../../../store/store';
import { 
  updateLabAnalysis, 
  updateFinancials, 
  updateStockStatus,
  updateFinanceStatus,
  resetUpdateLabAnalysisStatus,
  resetUpdateFinancialsStatus,
  resetUpdateStockStatus,
  resetUpdateFinanceStatus,
  calculateFinancials,
  type UpdateStockStatusData,
  type UpdateFinanceStatusData,
  type FinanceStatus,
  StockFormData,
  LabFormData,
} from '../../../../../features/minerals/tantalumSlice';
import StockTab from './tabs/StockTab';
import LabTab from './tabs/LabTab';
import FinancialTab from './tabs/FinancialTab';

type UserRole = "Stock Manager" | "Boss" | "Manager" | "Lab Technician" | "Finance Officer";

interface EditTantalumModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

interface FinancialFormData {
  price_per_percentage: number | null;
  purchase_ta2o5_percentage: number | null;
  exchange_rate: number | null;
  price_of_tag_per_kg_rwf: number | null;
  finance_status: FinanceStatus;
}


const EditTantalumModal: React.FC<EditTantalumModalProps> = ({ isOpen, onClose, userRole }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { 
    selectedTantalum, 
    updateLabAnalysisStatus,
    updateFinancialsStatus,
    updateStockStatus: stockUpdateStatus,
    updateFinanceStatus: financeUpdateStatus,
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
      });

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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    financialForm.price_per_percentage,
    financialForm.purchase_ta2o5_percentage,
    financialForm.exchange_rate,
    financialForm.price_of_tag_per_kg_rwf,
    stockForm.net_weight
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
    if (!selectedTantalum || !hasStockChanges) return;

    try {
      // Update stock status if changed
      if (stockForm.stock_status !== selectedTantalum.stock_status) {
        const statusData: UpdateStockStatusData = {
          stock_status: stockForm.stock_status
        };
        await dispatch(updateStockStatus({ 
          id: selectedTantalum.id, 
          statusData 
        })).unwrap();
      }

      // Note: In a real implementation, you'd also update other stock fields
      // This would require additional API endpoints for updating basic tantalum data
      console.log('Stock form submitted:', stockForm);
      
    } catch (error) {
      console.error('Stock update failed:', error);
    }
  };

  const handleLabSubmit = async () => {
    if (!selectedTantalum || !hasLabChanges) return;

    try {
      const labData: any = { ...labForm };
      await dispatch(updateLabAnalysis({ 
        id: selectedTantalum.id, 
        labData 
      })).unwrap();
      
    } catch (error) {
      console.error('Lab update failed:', error);
    }
  };

  const handleFinancialSubmit = async () => {
    if (!selectedTantalum || !hasFinancialChanges) return;

    try {
      // Update financial data
      const financialData: any = {
        price_per_percentage: financialForm.price_per_percentage,
        purchase_ta2o5_percentage: financialForm.purchase_ta2o5_percentage,
        exchange_rate: financialForm.exchange_rate,
        price_of_tag_per_kg_rwf: financialForm.price_of_tag_per_kg_rwf
      };
      
      await dispatch(updateFinancials({ 
        id: selectedTantalum.id, 
        financialData 
      })).unwrap();

      // Update finance status if changed
      if (financialForm.finance_status !== selectedTantalum.finance_status) {
        const statusData: UpdateFinanceStatusData = {
          finance_status: financialForm.finance_status
        };
        await dispatch(updateFinanceStatus({ 
          id: selectedTantalum.id, 
          statusData 
        })).unwrap();
      }
      
    } catch (error) {
      console.error('Financial update failed:', error);
    }
  };

  const handleClose = () => {
    dispatch(resetUpdateLabAnalysisStatus());
    dispatch(resetUpdateFinancialsStatus());
    dispatch(resetUpdateStockStatus());
    dispatch(resetUpdateFinanceStatus());
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
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {userRole}
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('stock')}
                    className={`px-4 py-2.5 rounded-xl flex items-center transition-all duration-200 ${
                      activeTab === 'stock' 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ScaleIcon className="w-5 h-5 mr-2" />
                    {t('tantalum.stock', 'Stock')}
                    {hasStockChanges && (
                      <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full"></span>
                    )}
                  </motion.button>
                )}
                
                {canAccessLab() && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('lab')}
                    className={`px-4 py-2.5 rounded-xl flex items-center transition-all duration-200 ${
                      activeTab === 'lab' 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <BeakerIcon className="w-5 h-5 mr-2" />
                    {t('tantalum.lab_analysis', 'Lab Analysis')}
                    {hasLabChanges && (
                      <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full"></span>
                    )}
                  </motion.button>
                )}
                
                {canAccessFinancial() && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('financial')}
                    className={`px-4 py-2.5 rounded-xl flex items-center transition-all duration-200 ${
                      activeTab === 'financial' 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                    {t('tantalum.financial_details', 'Financial')}
                    {hasFinancialChanges && (
                      <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full"></span>
                    )}
                  </motion.button>
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
                    />
                  )}
                  
                  {/* Lab Tab */}
                  {activeTab === 'lab' && canAccessLab() && (
                    <LabTab 
                      labForm={labForm}
                      setLabForm={setLabForm}
                    />
                  )}
                  
                  {/* Financial Tab */}
                  {activeTab === 'financial' && canAccessFinancial() && (
                    <FinancialTab
                      financialForm={financialForm}
                      setFinancialForm={setFinancialForm}
                      labForm={labForm}
                      calculatedValues={calculatedValues}
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
                    <motion.button
                      whileHover={{ scale: hasStockChanges ? 1.05 : 1 }}
                      whileTap={{ scale: hasStockChanges ? 0.95 : 1 }}
                      onClick={handleStockSubmit}
                      disabled={!hasStockChanges || isLoading}
                      className={`px-6 py-2.5 font-medium rounded-xl shadow-md transition-all duration-200 flex items-center ${
                        hasStockChanges && !isLoading
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-lg'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckIcon className="w-4 h-4 mr-2" />
                      )}
                      {t('tantalum.save_stock', 'Save Stock')}
                    </motion.button>
                  )}

                  {activeTab === 'lab' && canAccessLab() && (
                    <motion.button
                      whileHover={{ scale: hasLabChanges ? 1.05 : 1 }}
                      whileTap={{ scale: hasLabChanges ? 0.95 : 1 }}
                      onClick={handleLabSubmit}
                      disabled={!hasLabChanges || isLoading}
                      className={`px-6 py-2.5 font-medium rounded-xl shadow-md transition-all duration-200 flex items-center ${
                        hasLabChanges && !isLoading
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-lg'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckIcon className="w-4 h-4 mr-2" />
                      )}
                      {t('tantalum.save_lab', 'Save Lab Data')}
                    </motion.button>
                  )}

                  {activeTab === 'financial' && canAccessFinancial() && (
                    <motion.button
                      whileHover={{ scale: hasFinancialChanges ? 1.05 : 1 }}
                      whileTap={{ scale: hasFinancialChanges ? 0.95 : 1 }}
                      onClick={handleFinancialSubmit}
                      disabled={!hasFinancialChanges || isLoading}
                      className={`px-6 py-2.5 font-medium rounded-xl shadow-md transition-all duration-200 flex items-center ${
                        hasFinancialChanges && !isLoading
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-lg'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckIcon className="w-4 h-4 mr-2" />
                      )}
                      {t('tantalum.save_financial', 'Save Financial')}
                    </motion.button>
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