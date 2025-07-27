// pages/CreateSalePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  UserIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

import { useSelectedMinerals } from '../../hooks/useSelectedMinerals';
import { useSales } from '../../hooks/useSales';
import SelectedMineralsList from '../../components/dashboard/sales/SelectedMineralsList';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store'

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

  useEffect(()=> {
    setError(err ? err.replace("_", " "): '');
  }, [err])
  
  const selectedMineralsForType = getByType(validMineralType?.toLowerCase() as any);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!validMineralType) {
      setError('Invalid mineral type');
      setIsSubmitting(false);
      return;
    }
    
    if (selectedMineralsForType.length === 0) {
      setError('Please select at least one mineral');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await handleCreateSale({
        mineral_type: validMineralType,
        mineral_ids: selectedMineralsForType.map(mineral => mineral.id),
        buyer: buyer || undefined,
        net_sales_amount: netSalesAmount || undefined
      });
      
      if (result) {
        clearByType(validMineralType.toLowerCase() as any);
        navigate(`/sales/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create sale');
    } finally {
      setIsSubmitting(false);
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
                <form onSubmit={handleSubmit}>
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
                          {selectedMineralsForType.reduce((sum, item) => sum + item.netWeight, 0).toFixed(2)} kg
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
    </div>
  );
};

export default CreateSalePage;