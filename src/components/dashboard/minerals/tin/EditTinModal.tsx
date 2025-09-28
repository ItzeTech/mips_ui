import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  PencilIcon, 
  ScaleIcon, 
  CubeIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '../../../../store/store';
import {
  resetUpdateLabAnalysisStatus,
  resetUpdateFinancialsStatus,
  resetUpdateStockStatus,
  calculateFinancials,
  StockFormData,
  LabFormData,
  FinancialFormData,
  updateStock,
  updateFinancials,
  UpdateFinancialsData,
  updateLabAnalysis,
} from '../../../../features/minerals/tinSlice';
import StockTab from './tabs/StockTab';
import LabTab from './tabs/LabTab';
import FinancialTab from './tabs/FinancialTab';
import SaveFormButton from '../common/SaveFormButton';
import TabButton from '../common/TabButton';
import { fetchTinSettings, TinSettingsData } from '../../../../features/settings/tinSettingSlice';
import ConfirmationDialog from '../common/ConfirmationDialog';
import toast from 'react-hot-toast';
import TinPrintModal from './TinPrintModal';
import TinLabResultPrintModal from './TinLabResultPrintModal';

interface EditTinModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRoles: any[];
}

interface ConfirmationState {
  isOpen: boolean;
  type: 'stock' | 'lab' | 'financial' | null;
  title: string;
  message: string;
  changes: Array<{ field: string; oldValue: any; newValue: any }>;
}

const EditTinModal: React.FC<EditTinModalProps> = ({ isOpen, onClose, userRoles }) => {
  const { t } = useTranslation();
  const { settings, isFetched } = useSelector((state: RootState) => state.tinSettings);
  const dispatch = useDispatch<AppDispatch>();
  const [labResultPrintModalOpen, setLabResultPrintModalOpen] = useState(false);

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [isStockDisabled, setIsStockDisabled] = useState(false);
  const [isLabDisabled, setIsLabDisabled] = useState(false);
  const [isFinancialDisabled, setIsFinancialDisabled] = useState(false);

  const handleLabResultPrint = () => {
    if (selectedTin) {
      setLabResultPrintModalOpen(true);
    }
  };
  
   
    const handlePrint = () => {
      if (selectedTin) {
        setPrintModalOpen(true);
      }
    };

  const [tinSetting, setTinSetting] = useState<TinSettingsData>({
      government_treatment_charge_usd: 0,
      rra_percentage: 0,
      rma_per_kg_rwf: 0,
      inkomane_fee_per_kg_rwf: 0
    });

    // Confirmation dialog state
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    changes: []
  });
  

  useEffect(() => {
      if(!isFetched){
        dispatch(fetchTinSettings());
      }
    }, [dispatch, isFetched]);
  
    useEffect(() => {
      if (settings) {
        setTinSetting({
          government_treatment_charge_usd: settings.government_treatment_charge_usd,
          rra_percentage: settings.rra_percentage,
          rma_per_kg_rwf: settings.rma_per_kg_rwf,
          inkomane_fee_per_kg_rwf: settings.inkomane_fee_per_kg_rwf
        });
      }
    }, [settings]);

  const { 
    selectedTin, 
    updateLabAnalysisStatus,
    updateFinancialsStatus,
    updateStockStatus: stockUpdateStatus,
    updateFinancialsStatus: financeUpdateStatus,
    error 
  } = useSelector((state: RootState) => state.tins);

  const [useCustomFees, setUseCustomFees] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'stock' | 'lab' | 'financial'>('stock');
  
  // Separate form states
  const [stockForm, setStockForm] = useState<StockFormData>({
    net_weight: null,
    date_of_sampling: '',
    date_of_delivery: '',
    stock_status: 'in-stock'
  });

  const [labForm, setLabForm] = useState<LabFormData>({
    internal_sn_percentage: null,
    bal_percentage: null,
    fe_percentage: null,
    w_percentage: null,
    alex_stewart_sn_percentage: null
  });

  const [financialForm, setFinancialForm] = useState<FinancialFormData>({
    lme_rate: null,
    government_tc: null,
    purchase_sn_percentage: null,
    rra_price_per_kg: null,
    fluctuation_fee: null,
    internal_tc: null,
    internal_price_per_kg: null,
    exchange_rate: null,
    price_of_tag_per_kg_rwf: null,
    finance_status: 'unpaid',
    government_treatment_charge_usd_fee: null,
    rra_percentage_fee: null,
    rma_per_kg_rwf_fee: null,
    inkomane_fee_per_kg_rwf_fee: null,
    transport_charge: null,
    alex_stewart_charge: null
  });

  const [calculatedValues, setCalculatedValues] = useState({
    rra_price_per_kg: null as number | null,
    internal_price_per_kg: null as number | null,
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
  const canAccessStock = () => ['Stock Manager'].some(role => userRoles.includes(role));
  const canAccessLab = () => ['Lab Technician'].some(role => userRoles.includes(role));
  const canAccessFinancial = () => ['Finance Officer'].some(role => userRoles.includes(role));

  const getDefaultTab = (): 'stock' | 'lab' | 'financial' => {
    if (canAccessStock()) return 'stock';
    if (canAccessLab()) return 'lab';
    if (canAccessFinancial()) return 'financial';
    return 'stock'; // fallback
  };

  // Initialize forms when modal opens
  useEffect(() => {
    if (selectedTin && isOpen) {
      setStockForm({
        net_weight: selectedTin.net_weight,
        date_of_sampling: selectedTin.date_of_sampling,
        date_of_delivery: selectedTin.date_of_delivery,
        stock_status: selectedTin.stock_status
      });

      setLabForm({
        internal_sn_percentage: selectedTin.internal_sn_percentage,
        bal_percentage: selectedTin.bal_percentage,
        fe_percentage: selectedTin.fe_percentage,
        w_percentage: selectedTin.w_percentage,
        alex_stewart_sn_percentage: selectedTin.alex_stewart_sn_percentage
      });

      setFinancialForm({
        lme_rate: selectedTin.lme_rate,
        government_tc: selectedTin.government_tc,
        purchase_sn_percentage: selectedTin.purchase_sn_percentage,
        rra_price_per_kg: selectedTin.rra_price_per_kg,
        fluctuation_fee: selectedTin.fluctuation_fee,
        internal_tc: selectedTin.internal_tc,
        internal_price_per_kg: selectedTin.internal_price_per_kg,
        exchange_rate: selectedTin.exchange_rate,
        price_of_tag_per_kg_rwf: selectedTin.price_of_tag_per_kg_rwf,
        finance_status: selectedTin.finance_status,
        government_treatment_charge_usd_fee: selectedTin.government_treatment_charge_usd_fee,
        rra_percentage_fee: selectedTin.rra_percentage_fee,
        rma_per_kg_rwf_fee: selectedTin.rma_per_kg_rwf_fee,
        inkomane_fee_per_kg_rwf_fee: selectedTin.inkomane_fee_per_kg_rwf_fee,
        transport_charge: selectedTin.transport_charge,
        alex_stewart_charge: selectedTin.alex_stewart_charge
      });

      setUseCustomFees(
        selectedTin.government_treatment_charge_usd_fee !== null ||
        selectedTin.rra_percentage_fee !== null ||
        selectedTin.rma_per_kg_rwf_fee !== null ||
        selectedTin.inkomane_fee_per_kg_rwf_fee !== null
      );

      setIsStockDisabled(selectedTin.finance_status !== 'unpaid');
      setIsLabDisabled(selectedTin.finance_status !== 'unpaid');
      setIsFinancialDisabled(selectedTin.finance_status === 'exported' || selectedTin.finance_status === 'paid' || selectedTin.internal_sn_percentage === null);

      setErrors({});
      setHasStockChanges(false);
      setHasLabChanges(false);
      setHasFinancialChanges(false);
      setActiveTab(getDefaultTab());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTin, isOpen]);

  // Calculate financial values when relevant fields change
  useEffect(() => {

    if (selectedTin && stockForm.net_weight && 
        financialForm.lme_rate !== null && 
        financialForm.purchase_sn_percentage !== null &&
        financialForm.fluctuation_fee !== null &&
        financialForm.internal_tc !== null &&
        financialForm.exchange_rate !== null && 
        financialForm.price_of_tag_per_kg_rwf !== null) {
      
      const calculated = calculateFinancials({
        ...financialForm,
        net_weight: stockForm.net_weight
      },
      tinSetting,
      useCustomFees
    );

      setCalculatedValues({
        rra_price_per_kg: calculated.rra_price_per_kg || null,
        internal_price_per_kg: calculated.internal_price_per_kg || null,
        total_amount: calculated.total_amount || null,
        rra: calculated.rra || null,
        rma: calculated.rma || null,
        inkomane_fee: calculated.inkomane_fee || null,
        advance: calculated.advance || null,
        total_charge: calculated.total_charge || null,
        net_amount: calculated.net_amount || null
      });
    } else {
      setCalculatedValues({
        rra_price_per_kg: null,
        internal_price_per_kg: null,
        total_amount: null,
        rra: null,
        rma: null,
        inkomane_fee: null,
        advance: null,
        total_charge: null,
        net_amount: null
      });
    }
  }, [financialForm.lme_rate, financialForm.purchase_sn_percentage, financialForm.government_tc, financialForm.fluctuation_fee, financialForm.internal_tc, financialForm.exchange_rate, financialForm.price_of_tag_per_kg_rwf, stockForm.net_weight, selectedTin, stockForm, financialForm, tinSetting, useCustomFees]);

  const getFieldDisplayName = (fieldName: string): string => {
    const fieldNames: Record<string, string> = {
      net_weight: t('stock.net_weight', 'Net Weight'),
      date_of_sampling: t('stock.date_of_sampling', 'Date of Sampling'),
      date_of_delivery: t('stock.date_of_delivery', 'Date of Delivery'),
      stock_status: t('stock.status', 'Stock Status'),
      internal_sn_percentage: t('lab.internal_sn_percentage', 'Internal Sn %'),
      bal_percentage: t('lab.bal_percentage', 'Bal %'),
      fe_percentage: t('lab.fe_percentage', 'Fe %'),
      w_percentage: t('lab.w_percentage', 'W %'),
      alex_stewart_sn_percentage: t('lab.alex_stewart_sn_percentage', 'Alex Stewart Sn %'),
      lme_rate: t('financial.lme_rate', 'LME Rate'),
      government_tc: t('financial.government_tc', 'Government TC'),
      purchase_sn_percentage: t('financial.purchase_sn_percentage', 'Purchase Sn %'),
      rra_price_per_kg: t('financial.rra_price_per_kg', 'RRA Price Per kg'),
      fluctuation_fee: t('financial.fluctuation_fee', 'Fluctuation Fee'),
      internal_tc: t('financial.internal_tc', 'Internal TC'),
      internal_price_per_kg: t('financial.internal_price_per_kg', 'Internal Price/kg'),
      exchange_rate: t('financial.exchange_rate', 'Exchange Rate'),
      price_of_tag_per_kg_rwf: t('financial.price_of_tag_per_kg_rwf', 'Price of Tag per kg (RWF)'),
      finance_status: t('financial.status', 'Finance Status'),
      government_treatment_charge_usd_fee: t('financial.government_treatment_charge_usd_fee', 'Government Treatment Charge (USD)'),
      rra_percentage_fee: t('financial.rra_percentage_fee', 'RRA Percentage Fee'),
      rma_per_kg_rwf_fee: t('financial.rma_per_kg_rwf_fee', 'RMA Per kg (RWF) Fee'),
      inkomane_fee_per_kg_rwf_fee: t('financial.inkomane_fee_per_kg_rwf_fee', 'Inkomane Fee Per kg (RWF) Fee'),
      transport_charge: t('financial.transport_charge', 'Transport Charge'),
      alex_stewart_charge: t('financial.alex_stewart_charge', 'Alex Stewart Charge')
    };
    return fieldNames[fieldName] || fieldName;
  };

  const formatValueForDisplay = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return t('common.empty', 'Empty');
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    if (typeof value === 'string' && value.includes('T')) {
      // Format date
      return new Date(value).toLocaleDateString();
    }
    return value.toString();
  };

  // Track changes for each form
  useEffect(() => {
    if (selectedTin) {
      const originalStock = {
        net_weight: selectedTin.net_weight,
        date_of_sampling: selectedTin.date_of_sampling,
        date_of_delivery: selectedTin.date_of_delivery,
        stock_status: selectedTin.stock_status
      };
      setHasStockChanges(JSON.stringify(originalStock) !== JSON.stringify(stockForm));
    }
  }, [stockForm, selectedTin]);
 
  useEffect(() => {
    if (selectedTin) {
      const originalLab = {
        internal_sn_percentage: selectedTin.internal_sn_percentage,
        bal_percentage: selectedTin.bal_percentage,
        fe_percentage: selectedTin.fe_percentage,
        w_percentage: selectedTin.w_percentage,
        alex_stewart_sn_percentage: selectedTin.alex_stewart_sn_percentage
      };
      setHasLabChanges(JSON.stringify(originalLab) !== JSON.stringify(labForm));
    }
  }, [labForm, selectedTin]);

  useEffect(() => {
    if (selectedTin) {
      const originalFinancial = {
        lme_rate: selectedTin.lme_rate,
        government_tc: selectedTin.government_tc,
        purchase_sn_percentage: selectedTin.purchase_sn_percentage,
        rra_price_per_kg: selectedTin.rra_price_per_kg,
        fluctuation_fee: selectedTin.fluctuation_fee,
        internal_tc: selectedTin.internal_tc,
        internal_price_per_kg: selectedTin.internal_price_per_kg,
        exchange_rate: selectedTin.exchange_rate,
        price_of_tag_per_kg_rwf: selectedTin.price_of_tag_per_kg_rwf,
        finance_status: selectedTin.finance_status,
        government_treatment_charge_usd_fee: selectedTin.government_treatment_charge_usd_fee,
        rra_percentage_fee: selectedTin.rra_percentage_fee,
        rma_per_kg_rwf_fee: selectedTin.rma_per_kg_rwf_fee,
        inkomane_fee_per_kg_rwf_fee: selectedTin.inkomane_fee_per_kg_rwf_fee,
        transport_charge: selectedTin.transport_charge,
        alex_stewart_charge: selectedTin.alex_stewart_charge
      };
      setHasFinancialChanges(JSON.stringify(originalFinancial) !== JSON.stringify(financialForm));
    }
  }, [financialForm, selectedTin]);

  // Function to get changes between original and current form data
  const getChanges = (original: any, current: any): Array<{ field: string; oldValue: any; newValue: any }> => {
    const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];
    
    Object.keys(current).forEach(key => {
      if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
        changes.push({
          field: getFieldDisplayName(key),
          oldValue: formatValueForDisplay(original[key]),
          newValue: formatValueForDisplay(current[key])
        });
      }
    });
    
    return changes;
  };


  const handleStockSubmit = async () => {
    if (!selectedTin) return;
  
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
  
      // Get changes and show confirmation
      const originalStock = {
        net_weight: selectedTin.net_weight,
        date_of_sampling: selectedTin.date_of_sampling,
        date_of_delivery: selectedTin.date_of_delivery,
        stock_status: selectedTin.stock_status
      };

      const changes = getChanges(originalStock, stockForm);

      setConfirmation({
        isOpen: true,
        type: 'stock',
        title: t('stock.confirm_update', 'Confirm Stock Update'),
        message: t('stock.confirm_update_message', 'Are you sure you want to update the stock information for this tin batch?'),
        changes
      });
  
    } catch (error) {
      console.error('Stock update failed:', error);
    }
  };
  

  const handleLabSubmit = async () => {
    if (!selectedTin) return;
  
    try {
      const labData: any = { ...labForm };
      const newErrors: Record<string, string> = {};
  
      // Check required fields - must not be null or empty
      if (labData.internal_sn_percentage == null || labData.internal_sn_percentage === '') {
        newErrors.internal_sn_percentage = t('tin.internal_sn_percentage_required', 'Internal Sn % is required');
      }
      if (labData.bal_percentage == null || labData.bal_percentage === '') {
        newErrors.bal_percentage = t('tin.bal_percentage_required', 'Bal % is required');
      }
      if (labData.fe_percentage == null || labData.fe_percentage === '') {
        newErrors.fe_percentage = t('tin.fe_percentage_required', 'Fe % is required');
      }
      if (labData.w_percentage == null || labData.w_percentage === '') {
        newErrors.w_percentage = t('tin.w_percentage_required', 'W % is required');
      }

      // If Alex Stewart field is empty, remove it from payload
      if (labData.alex_stewart_sn_percentage == null || labData.alex_stewart_sn_percentage === '') {
        delete labData.alex_stewart_sn_percentage;
      }
  
      // If there are validation errors, set errors and abort submit
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      setErrors({});

      // Get changes and show confirmation
      const originalLab = {
        internal_sn_percentage: selectedTin.internal_sn_percentage,
        bal_percentage: selectedTin.bal_percentage,
        fe_percentage: selectedTin.fe_percentage,
        w_percentage: selectedTin.w_percentage,
        alex_stewart_sn_percentage: selectedTin.alex_stewart_sn_percentage
      };

      const changes = getChanges(originalLab, labForm);

      setConfirmation({
        isOpen: true,
        type: 'lab',
        title: t('lab.confirm_update', 'Confirm Lab Analysis Update'),
        message: t('lab.confirm_update_message', 'Are you sure you want to update the lab analysis data for this tin batch?'),
        changes
      });
  
    } catch (error) {
      console.error('Lab update failed:', error);
    }
  };
  

  const handleFinancialSubmit = async () => {
    if (!selectedTin || !hasFinancialChanges) return;
  
    // 1. Validate required fields
    const newErrors: Record<string, string> = {};
    if (financialForm.lme_rate == null) {
      newErrors.lme_rate = t('tin.lme_rate_required', 'LME Rate is required');
    }
    if (financialForm.government_tc == null) {
      newErrors.government_tc = t('tin.government_tc_required', 'Government TC is required');
    }
    if (financialForm.purchase_sn_percentage == null) {
      newErrors.purchase_sn_percentage = t('tin.purchase_sn_percentage_required', 'Purchase Sn % is required');
    }
    if (financialForm.exchange_rate == null) {
      newErrors.exchange_rate = t('tin.exchange_rate_required', 'Exchange rate is required');
    }
    if (financialForm.price_of_tag_per_kg_rwf == null) {
      newErrors.price_of_tag_per_kg_rwf = t('tin.price_of_tag_per_kg_rwf_required', 'Price of tag per kg is required');
    }
  
    // 2. If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setErrors({});

      // Get changes and show confirmation
      const originalFinancial = {
        lme_rate: selectedTin.lme_rate,
        government_tc: selectedTin.government_tc,
        purchase_sn_percentage: selectedTin.purchase_sn_percentage,
        rra_price_per_kg: selectedTin.rra_price_per_kg,
        fluctuation_fee: selectedTin.fluctuation_fee,
        internal_tc: selectedTin.internal_tc,
        internal_price_per_kg: selectedTin.internal_price_per_kg,
        exchange_rate: selectedTin.exchange_rate,
        price_of_tag_per_kg_rwf: selectedTin.price_of_tag_per_kg_rwf,
        finance_status: selectedTin.finance_status,
        government_treatment_charge_usd_fee: selectedTin.government_treatment_charge_usd_fee,
        rra_percentage_fee: selectedTin.rra_percentage_fee,
        rma_per_kg_rwf_fee: selectedTin.rma_per_kg_rwf_fee,
        inkomane_fee_per_kg_rwf_fee: selectedTin.inkomane_fee_per_kg_rwf_fee,
        transport_charge: selectedTin.transport_charge,
        alex_stewart_charge: selectedTin.alex_stewart_charge
      };

      const changes = getChanges(originalFinancial, financialForm);

      setConfirmation({
        isOpen: true,
        type: 'financial',
        title: t('financial.confirm_update', 'Confirm Financial Update'),
        message: t('financial.confirm_update_message', 'Are you sure you want to update the financial information for this tin batch?'),
        changes
      });
  
      
    } catch (error) {
      console.error('Financial update failed:', error);
    }
  };
  
  const handleConfirmSubmit = async () => {
    if (!selectedTin || !confirmation.type) return;

    try {
      switch (confirmation.type) {
        case 'stock':
          const stockDataToSubmit: any = { ...stockForm };
          if (!stockDataToSubmit.date_of_delivery) {
            delete stockDataToSubmit.date_of_delivery;
          }
          await dispatch(updateStock({ 
            id: selectedTin.id, 
            stockData: stockDataToSubmit 
          })).unwrap();
          break;

        case 'lab':
          const labDataToSubmit: any = { ...labForm };
          if (labDataToSubmit.alex_stewart_sn_percentage == null || labDataToSubmit.alex_stewart_sn_percentage === '') {
            delete labDataToSubmit.alex_stewart_sn_percentage;
          }
          
          await dispatch(updateLabAnalysis({
            id: selectedTin.id,
            labData: labDataToSubmit
          })).unwrap();
          break;

        case 'financial':
          const financialDataToSubmit: UpdateFinancialsData = {
            lme_rate: financialForm.lme_rate,
            government_tc: financialForm.government_treatment_charge_usd_fee,
            purchase_sn_percentage: financialForm.purchase_sn_percentage,
            rra_price_per_kg: calculatedValues.rra_price_per_kg,
            fluctuation_fee: financialForm.fluctuation_fee,
            internal_tc: financialForm.internal_tc,
            internal_price_per_kg: calculatedValues.internal_price_per_kg,
            total_amount: calculatedValues.total_amount,
            price_of_tag_per_kg: financialForm.price_of_tag_per_kg_rwf,
            exchange_rate: financialForm.exchange_rate,
            rra: calculatedValues.rra,
            rma: calculatedValues.rma,
            inkomane_fee: calculatedValues.inkomane_fee,
            advance: calculatedValues.advance,
            total_charge: calculatedValues.total_charge,
            net_amount: calculatedValues.net_amount,
            finance_status: financialForm.finance_status,
            government_treatment_charge_usd_fee: financialForm.government_treatment_charge_usd_fee ?? settings?.government_treatment_charge_usd ?? null,
            rra_percentage_fee: financialForm.rra_percentage_fee ?? settings?.rra_percentage ?? null,
            rma_per_kg_rwf_fee: financialForm.rma_per_kg_rwf_fee ?? settings?.rma_per_kg_rwf ?? null,
            inkomane_fee_per_kg_rwf_fee: financialForm.inkomane_fee_per_kg_rwf_fee ?? settings?.inkomane_fee_per_kg_rwf ?? null,
            transport_charge: financialForm.transport_charge ?? null,
            alex_stewart_charge: financialForm.alex_stewart_charge ?? null
          };
          
          await dispatch(updateFinancials({
            id: selectedTin.id,
            financialData: financialDataToSubmit
          })).unwrap();
          break;
      }

      // Close confirmation dialog
      setConfirmation({
        isOpen: false,
        type: null,
        title: '',
        message: '',
        changes: []
      });

      setActiveTab(confirmation.type)
      toast.success(t(`common.update_${confirmation.type}_success`));
      
    } catch (error) {
      console.error(`${confirmation.type} update failed:`, error);
      toast.error(t(`common.update_${confirmation.type}_error`));
    }
  };
  

  const handleClose = () => {
    dispatch(resetUpdateLabAnalysisStatus());
    dispatch(resetUpdateFinancialsStatus());
    dispatch(resetUpdateStockStatus());
    setConfirmation({
      isOpen: false,
      type: null,
      title: '',
      message: '',
      changes: []
    });
    onClose();
  };



  const isLoading = updateLabAnalysisStatus === 'loading' || 
                   updateFinancialsStatus === 'loading' || 
                   stockUpdateStatus === 'loading' || 
                   financeUpdateStatus === 'loading';

  // Animation variants
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

  if (!selectedTin) return null;

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
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg mr-4">
                    <PencilIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('tin.edit_details', 'Edit Tin')}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                        {selectedTin.lot_number}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {
                    canAccessLab() && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLabResultPrint}
                        className="p-2 rounded-full text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        title={t('tin.print_lab_result', 'Print Lab Result')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </motion.button>
                      )
                  }
                  {
                    canAccessFinancial() && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrint}
                        className="p-2 rounded-full text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                        title={t('tin.print_report', 'Print Report')}
                      >
                        <PrinterIcon className="w-5 h-5" />
                      </motion.button>
                      )
                  }
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                </div>
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
                    label={t('tin.stock', 'Stock')}
                    hasChanges={hasStockChanges}
                  />
                )}

                {canAccessLab() && (
                  <TabButton
                    isActive={activeTab === 'lab'}
                    onClick={() => setActiveTab('lab')}
                    icon={<CubeIcon className="w-5 h-5 mr-2" />}
                    label={t('tin.lab_analysis', 'Lab Analysis')}
                    hasChanges={hasLabChanges}
                  />
                )}

                {canAccessFinancial() && (
                  <TabButton
                    isActive={activeTab === 'financial'}
                    onClick={() => setActiveTab('financial')}
                    icon={<CurrencyDollarIcon className="w-5 h-5 mr-2" />}
                    label={t('tin.financial_details', 'Financial')}
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
                      {t('tin.no_permission', 'You do not have permission to edit any sections of this tin record.')}
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
                      isStockDisabled={isStockDisabled}
                    />
                  )}
                  
                  {/* Lab Tab */}
                  {activeTab === 'lab' && canAccessLab() && (
                    <LabTab 
                      labForm={labForm}
                      setLabForm={setLabForm}
                      errors={errors}
                      isLabDisabled={isLabDisabled}
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
                      TinSettingsData={settings}
                      setUseCustomFees={setUseCustomFees}
                      useCustomFees={useCustomFees}
                      isFinancialDisabled={isFinancialDisabled}
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
                      label={t('tin.save_stock', 'Save Stock')}
                    />
                  )}

                  {activeTab === 'lab' && canAccessLab() && (
                    <SaveFormButton
                      onClick={handleLabSubmit}
                      disabled={!hasLabChanges || isLoading || isLabDisabled}
                      isLoading={isLoading}
                      hasChanges={hasLabChanges}
                      label={t('tin.save_lab', 'Save Lab Data')}
                    />
                  )}

                  {activeTab === 'financial' && canAccessFinancial() && (
                    <SaveFormButton
                      onClick={handleFinancialSubmit}
                      disabled={!hasFinancialChanges || isLoading || isFinancialDisabled}
                      isLoading={isLoading}
                      hasChanges={hasFinancialChanges}
                      label={t('tin.save_financial', 'Save Financial')}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
          {/* Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={confirmation.isOpen}
            onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
            onConfirm={handleConfirmSubmit}
            title={confirmation.title}
            message={confirmation.message}
            changes={confirmation.changes}
            isLoading={isLoading}
            type="warning"
            confirmText={t('common.save_changes', 'Save Changes')}
            cancelText={t('common.cancel', 'Cancel')}
          />
          {selectedTin && (
            <>
              <TinPrintModal
                isOpen={printModalOpen}
                onClose={() => setPrintModalOpen(false)}
                tinId={selectedTin.id}
              />
              <TinLabResultPrintModal
                isOpen={labResultPrintModalOpen}
                onClose={() => setLabResultPrintModalOpen(false)}
                tinId={selectedTin.id}
              />
            </>
          )}
        </>
        
      )}
    </AnimatePresence>
  );
};

export default EditTinModal;