// components/dashboard/sales/AddMineralModal.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { useSales } from '../../../hooks/useSales';
import axiosInstance from '../../../config/axiosInstance';
import { NumericFormat } from 'react-number-format';

interface AddMineralModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any;
}

interface MineralWithReplenish {
  id: string;
  replenish_enabled: boolean;
  replenish_amount: number;
}

const AddMineralModal: React.FC<AddMineralModalProps> = ({ isOpen, onClose, sale }) => {
  const { t } = useTranslation();
  const { handleAddMineralsToSale, addMineralsStatus } = useSales();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [availableMinerals, setAvailableMinerals] = useState<any[]>([]);
  const [selectedMineralIds, setSelectedMineralIds] = useState<string[]>([]);
  const [replenishSettings, setReplenishSettings] = useState<{[key: string]: {enabled: boolean, amount: number}}>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get endpoint based on mineral type
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getEndpoint = useCallback(() => {
    switch (sale?.mineral_type) {
      case 'TANTALUM':
        return '/tantalum/available/exclude';
      case 'TIN':
        return '/tin/available/exclude';
      case 'TUNGSTEN':
        return '/tungsten/available/exclude';
      default:
        return '';
    }
  }, [sale?.mineral_type]);
  
  // Load available minerals (those not in sales yet)
  useEffect(() => {
    if (isOpen && sale) {
      const fetchAvailableMinerals = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const endpoint = getEndpoint();
          if (!endpoint) {
            throw new Error('Invalid mineral type');
          }

          const existingMineralIds = sale?.minerals?.map((mineral: any) => mineral.id) || [];
          
          const data = {
            exclude_ids: existingMineralIds,
            finance_statuses: ["paid", "invoiced"]
          };
          
          const response = await axiosInstance.post(endpoint, data);
          
          setAvailableMinerals(response.data.data.items || []);
        } catch (err: any) {
          console.error('Error fetching available minerals:', err);
          setError(err.message || 'Failed to load available minerals');
        } finally {
          setLoading(false);
        }
      };
      
      fetchAvailableMinerals();
    }
  }, [isOpen, getEndpoint, sale]);
  
  const handleClose = () => {
    setSearchTerm('');
    setSelectedMineralIds([]);
    setReplenishSettings({});
    onClose();
  };
  
  const toggleMineralSelection = (id: string) => {
    if (selectedMineralIds.includes(id)) {
      setSelectedMineralIds(selectedMineralIds.filter(mineralId => mineralId !== id));
    } else {
      setSelectedMineralIds([...selectedMineralIds, id]);
    }
  };
  
  // Toggle replenish mode for a mineral
  const toggleReplenish = (id: string, netWeight: number) => {
    setReplenishSettings(prev => {
      const isCurrentlyEnabled = prev[id]?.enabled || false;
      
      return {
        ...prev,
        [id]: {
          enabled: !isCurrentlyEnabled,
          amount: !isCurrentlyEnabled ? (netWeight / 2) : (prev[id]?.amount || 0)
        }
      };
    });
  };
  
  // Handle replenish amount change
  const handleReplenishChange = (id: string, value: number, maxWeight: number) => {
    const safeValue = Math.min(Math.max(0, value), maxWeight);
    setReplenishSettings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        amount: safeValue
      }
    }));
  };
  
  const handleSubmit = async () => {
    if (selectedMineralIds.length === 0) {
      setError('Please select at least one mineral');
      return;
    }
    
    try {
      // Prepare minerals with replenish information
      const mineralsToAdd = selectedMineralIds.map(id => ({
        mineral_id: id,
        replenish_kgs: replenishSettings[id]?.enabled ? replenishSettings[id]?.amount : 0
      }));
      
      await handleAddMineralsToSale(sale.id, mineralsToAdd);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add minerals to sale');
    }
  };
  
  // Filter minerals based on search term
  const filteredMinerals = availableMinerals.filter(mineral => {
    if (!searchTerm) return true;
    
    return (
      (mineral.lot_number && mineral.lot_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mineral.supplier_name && mineral.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      String(mineral.net_weight).includes(searchTerm)
    );
  });
  
  const formatNumber = (num: number | null, decimals = 2) => {
    if (num === null) return '—';
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {t('sales.add_minerals_to_sale', 'Add Minerals to Sale')}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('sales.search_minerals', 'Search minerals by lot number, supplier, or weight')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('sales.available_minerals', 'Available Minerals')} ({filteredMinerals.length})
                  </div>
                  
                  {loading ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {t('sales.loading_minerals', 'Loading available minerals...')}
                      </p>
                    </div>
                  ) : filteredMinerals.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm 
                          ? t('sales.no_matching_minerals', 'No minerals match your search')
                          : t('sales.no_available_minerals', 'No available minerals found')}
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {t('sales.select', 'Select')}
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {t('sales.lot_number', 'Lot Number')}
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {t('sales.supplier', 'Supplier')}
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {t('sales.weight', 'Weight (kg)')}
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {t('sales.replenish', 'Replenish')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredMinerals.map((mineral) => (
                            <React.Fragment key={mineral.id}>
                              <tr 
                                className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                  selectedMineralIds.includes(mineral.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                              >
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedMineralIds.includes(mineral.id)}
                                      onChange={() => toggleMineralSelection(mineral.id)}
                                      className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded"
                                    />
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {mineral.lot_number}
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {mineral.supplier_name || '—'}
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 dark:text-white flex items-center">
                                    <ScaleIcon className="w-3 h-3 mr-1 text-gray-500" />
                                    {formatNumber(mineral.net_weight)}
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {selectedMineralIds.includes(mineral.id) && (
                                    <button
                                      onClick={() => toggleReplenish(mineral.id, mineral.net_weight)}
                                      className={`py-1 px-2 rounded-md flex items-center ${
                                        replenishSettings[mineral.id]?.enabled 
                                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                      } hover:bg-opacity-80 transition-colors text-xs font-medium`}
                                    >
                                      <ArrowPathIcon className="w-3.5 h-3.5 mr-1" />
                                      {t('sales.replenish', 'Replenish')}
                                    </button>
                                  )}
                                </td>
                              </tr>
                              
                              {/* Replenish controls row */}
                              {selectedMineralIds.includes(mineral.id) && replenishSettings[mineral.id]?.enabled && (
                                <tr className="bg-gray-50 dark:bg-gray-700/50">
                                  <td colSpan={5} className="px-3 py-3">
                                    <div className="flex flex-col">
                                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('sales.replenish_amount', 'Replenish Amount (kg)')}
                                      </label>
                                      
                                      <div className="flex items-center space-x-2">
                                        <NumericFormat
                                          value={replenishSettings[mineral.id]?.amount || 0}
                                          max={mineral.net_weight}
                                          decimalScale={2}
                                          allowNegative={false}
                                          allowLeadingZeros={false}
                                          onValueChange={(values) => {
                                            handleReplenishChange(mineral.id, values?.floatValue || 0, mineral.net_weight)
                                          }}
                                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                          placeholder={`0.00`}
                                        />

                                        <button
                                          onClick={() => handleReplenishChange(mineral.id, mineral.net_weight, mineral.net_weight)}
                                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
                                        >
                                          {t('sales.max', 'Max')}
                                        </button>
                                      </div>
                                      
                                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span>
                                          {((replenishSettings[mineral.id]?.amount || 0) / mineral.net_weight * 100).toFixed(0)}%
                                        </span>
                                        <span>
                                          {(replenishSettings[mineral.id]?.amount || 0).toFixed(2)} / {mineral.net_weight.toFixed(2)} kg
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedMineralIds.length} {t('sales.minerals_selected', 'minerals selected')}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {t('sales.cancel', 'Cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={selectedMineralIds.length === 0 || addMineralsStatus === 'loading'}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {addMineralsStatus === 'loading' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('sales.adding', 'Adding...')}
                        </>
                      ) : (
                        <>
                          <PlusIcon className="w-4 h-4 mr-2" />
                          {t('sales.add_selected', 'Add Selected')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddMineralModal;