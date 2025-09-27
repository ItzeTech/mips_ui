// pages/CreateSalePage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  UserIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import { useSelectedMinerals } from '../../hooks/useSelectedMinerals';
import { useSales } from '../../hooks/useSales';
import SelectedMineralsList from '../../components/dashboard/sales/SelectedMineralsList';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { SaleMineralInput } from '../../components/dashboard/sales/SelectedMineralsList';

// Add a confirmation dialog component
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, replenishedMinerals, minerals }: any) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div className="bg-white dark:bg-gray-800" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="ml-3 text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {t('sales.confirm_replenish', 'Confirm Replenishment')}
            </h3>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {t('sales.replenish_confirmation_text', 'The following minerals will be partially replenished. This will create new records with the specified amounts.')}
            </p>
            
            <div className="mt-3 space-y-3 max-h-60 overflow-y-auto">
              {replenishedMinerals.map((item: { mineral_id: React.Key | null | undefined; replenish_kgs: number; }) => {
                const mineral = minerals.find((m: { id: React.Key | null | undefined; }) => m.id === item.mineral_id);
                return (
                  <div key={item.mineral_id} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">{mineral?.lotNumber}</div>
                    <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                      {t('sales.replenish_amount_of', 'Replenish')}: {item.replenish_kgs.toFixed(2)} kg / {mineral?.netWeight.toFixed(2)} kg
                      ({((item.replenish_kgs / mineral?.netWeight) * 100).toFixed(0)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('common.confirm', 'Confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateSalePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mineralType } = useParams<{ mineralType: string }>();
  
  const { getByType, clearByType } = useSelectedMinerals();
  const { handleCreateSale } = useSales();

  const { error: err } = useSelector((state: RootState) => state.sales);
  
  const [buyer, setBuyer] = useState('');
  const [netSalesAmount, setNetSalesAmount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [summaryUpdateTrigger, setSummaryUpdateTrigger] = useState(0);
  
  // Reference to the SelectedMineralsList component to access its methods
  const mineralsListRef = useRef<any>(null);
  
  // Store prepared minerals for confirmation dialog
  const [preparedMinerals, setPreparedMinerals] = useState<SaleMineralInput[]>([]);
  
  const validMineralType = mineralType?.toUpperCase() === 'TANTALUM' || 
                          mineralType?.toUpperCase() === 'TIN' || 
                          mineralType?.toUpperCase() === 'TUNGSTEN' 
                          ? mineralType?.toUpperCase() as 'TANTALUM' | 'TIN' | 'TUNGSTEN'
                          : null;
  
  useEffect(() => {
    if (!validMineralType) {
      navigate('/sales', { replace: true });
    }
  }, [validMineralType, navigate]);

  useEffect(() => {
    setError(err ? err.replace("_", ""): '');
  }, [err]);
  
  // Set up periodic updates for the summary
  useEffect(() => {
    const interval = setInterval(() => {
      setSummaryUpdateTrigger(prev => prev + 1);
    }, 500); // Update every half second
    
    return () => clearInterval(interval);
  }, []);
  
  const selectedMineralsForType = getByType(validMineralType?.toLowerCase() as any);
  
  // Calculate the effective total weight considering replenished amounts
  const calculateTotalWeight = () => {
    if (!mineralsListRef.current) return "0.00";
    return mineralsListRef.current.calculateTotalWeight().toFixed(2);
  };
  
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validMineralType) {
      setError('Invalid mineral type');
      return;
    }
    
    if (selectedMineralsForType.length === 0) {
      setError('Please select at least one mineral');
      return;
    }
    
    // Get prepared minerals from the SelectedMineralsList component
    const minerals = mineralsListRef.current.getPrepairedMinerals();
    setPreparedMinerals(minerals);
    
    // Check if any minerals have replenish enabled
    const hasReplenishedMinerals = minerals.some((item: { replenish_kgs: number; }) => item.replenish_kgs > 0);
    
    if (hasReplenishedMinerals) {
      // Show confirmation dialog for replenished minerals
      setShowConfirmation(true);
    } else {
      // No replenished minerals, proceed with submission
      submitSale(minerals);
    }
  };
  
  const submitSale = async (minerals: SaleMineralInput[]) => {
    setIsSubmitting(true);
    
    try {
      const result = await handleCreateSale({
        mineral_type: validMineralType as any,
        minerals: minerals,
        buyer: buyer || undefined,
        net_sales_amount: netSalesAmount || undefined,
        paid_amount: 0
      });
      
      if (result) {
        clearByType(validMineralType!.toLowerCase() as any);
        navigate(`/sales/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create sale');
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/sales');
  };
  
  const handleSelectMinerals = () => {
    if (validMineralType === 'TANTALUM') {
      navigate('/minerals/tantalum');
    } else if (validMineralType === 'TIN') {
      navigate('/minerals/tin');
    } else if (validMineralType === 'TUNGSTEN') {
      navigate('/minerals/tungsten');
    }
  };
  
  // Filter out minerals with replenish_kgs > 0 for the confirmation dialog
  const replenishedMinerals = preparedMinerals.filter(item => item.replenish_kgs > 0);
  
  if (!validMineralType) return null;
  
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleGoBack}
              className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('sales.create_title', 'Create New Sale')}
            </h1>
          </div>
          
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center text-blue-800 dark:text-blue-300">
              <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">
                {t('sales.creating_sale_for', 'Creating sale for')}: <span className="font-bold">{validMineralType}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('sales.selected_minerals', 'Selected Minerals')}
                  </h2>
                  <button
                    onClick={handleSelectMinerals}
                    className="flex items-center text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <PlusCircleIcon className="w-3.5 h-3.5 mr-1" />
                    {t('sales.select_minerals', 'Select Minerals')}
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {selectedMineralsForType.length > 0 ? (
                  <SelectedMineralsList 
                    ref={mineralsListRef}
                    minerals={selectedMineralsForType}
                    mineralType={validMineralType}
                  />
                ) : (
                  <div className="py-10 text-center">
                    <div className="flex justify-center mb-3">
                      <XCircleIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {t('sales.no_minerals_selected', 'No minerals selected for this sale')}
                    </p>
                    <button
                      onClick={handleSelectMinerals}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {t('sales.select_minerals', 'Select Minerals')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('sales.sale_details', 'Sale Details')}
                </h2>
              </div>
              
              <div className="p-4">
                <form onSubmit={handleSubmitForm}>
                  <div className="mb-4">
                    <label htmlFor="buyer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('sales.buyer', 'Buyer')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="buyer"
                        value={buyer}
                        onChange={(e) => setBuyer(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('sales.buyer_placeholder', 'Enter buyer name')}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="netSalesAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('sales.net_sales_amount', 'Net Sales Amount')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="netSalesAmount"
                        value={netSalesAmount === null ? '' : netSalesAmount}
                        onChange={(e) => setNetSalesAmount(e.target.value === '' ? null : Number(e.target.value))}
                        step="0.01"
                        min="0"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('sales.amount_placeholder', 'Enter amount')}
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('sales.summary', 'Summary')}
                    </h3>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('sales.mineral_type', 'Mineral Type')}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{validMineralType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('sales.items_count', 'Items')}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedMineralsForType.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('sales.total_weight', 'Total Weight')}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedMineralsForType.length > 0 ? calculateTotalWeight() : "0.00"} kg
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting || selectedMineralsForType.length === 0}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? t('sales.creating', 'Creating...') : t('sales.create_sale', 'Create Sale')}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => submitSale(preparedMinerals)}
        replenishedMinerals={replenishedMinerals}
        minerals={selectedMineralsForType}
      />
    </div>
  );
};

export default CreateSalePage;