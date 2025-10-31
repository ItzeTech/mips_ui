// components/dashboard/payments/SmartMineralSelector.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BeakerIcon,
  CheckIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../../config/axiosInstance';

interface Mineral {
  id: string;
  lot_number: string;
  net_weight: number;
  net_amount: number;
  alex_stewart_ta2o5?: number;
  internal_ta2o5?: number;
  alex_stewart_sn_percentage?: number;
  internal_sn_percentage?: number;
  alex_stewart_wo3_percentage?: number;
  wo3_percentage?: number;
  created_at: string;
}

interface SmartMineralSelectorProps {
  supplierId: string;
  selectedMinerals: {
    tantalum: string[];
    tin: string[];
    tungsten: string[];
  };
  onSelectionChange: (type: 'tantalum' | 'tin' | 'tungsten', ids: string[]) => void;
  onDataChange?: () => void;
}

const SmartMineralSelector: React.FC<SmartMineralSelectorProps> = ({
  supplierId,
  selectedMinerals,
  onSelectionChange,
  onDataChange
}) => {
  const { t } = useTranslation();
  const [minerals, setMinerals] = useState<{
    tantalum: Mineral[];
    tin: Mineral[];
    tungsten: Mineral[];
  }>({
    tantalum: [],
    tin: [],
    tungsten: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<{
    tantalum: string;
    tin: string;
    tungsten: string;
  }>({
    tantalum: '',
    tin: '',
    tungsten: ''
  });
  const [expandedSections, setExpandedSections] = useState<{
    tantalum: boolean;
    tin: boolean;
    tungsten: boolean;
  }>({
    tantalum: true,
    tin: true,
    tungsten: true
  });

  // Use ref to store the latest callback without causing re-renders
  const onSelectionChangeRef = useRef(onSelectionChange);
  const onDataChangeRef = useRef(onDataChange);

  // Update refs when callbacks change
  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  // Track if auto-selection has been performed for this supplier
  const hasAutoSelectedRef = useRef<string | null>(null);

  // Fetch function without callback dependencies
  const fetchUnpaidMinerals = useCallback(async () => {
    if (!supplierId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all mineral types in parallel
      const [tantalumResponse, tinResponse, tungstenResponse] = await Promise.all([
        axiosInstance.get(`/tantalum/supplier/${supplierId}/unpaid`),
        axiosInstance.get(`/tin/supplier/${supplierId}/unpaid`),
        axiosInstance.get(`/tungsten/supplier/${supplierId}/unpaid`)
      ]);

      // Extract data consistently
      const tantalumData = Array.isArray(tantalumResponse.data?.data?.items) 
        ? tantalumResponse.data.data.items 
        : Array.isArray(tantalumResponse.data?.data) 
        ? tantalumResponse.data.data 
        : [];

      const tinData = Array.isArray(tinResponse.data?.data?.items) 
        ? tinResponse.data.data.items 
        : Array.isArray(tinResponse.data?.data) 
        ? tinResponse.data.data 
        : [];

      const tungstenData = Array.isArray(tungstenResponse.data?.data?.items) 
        ? tungstenResponse.data.data.items 
        : Array.isArray(tungstenResponse.data?.data) 
        ? tungstenResponse.data.data 
        : [];

      setMinerals({
        tantalum: tantalumData,
        tin: tinData,
        tungsten: tungstenData
      });

      // Auto-select first available mineral type that has records
      // Only run once per supplier
      if (hasAutoSelectedRef.current !== supplierId) {
        hasAutoSelectedRef.current = supplierId;
        
        setTimeout(() => {
          if (tantalumData.length > 0) {
            onSelectionChangeRef.current('tantalum', [tantalumData[0].id]);
          } else if (tinData.length > 0) {
            onSelectionChangeRef.current('tin', [tinData[0].id]);
          } else if (tungstenData.length > 0) {
            onSelectionChangeRef.current('tungsten', [tungstenData[0].id]);
          }
        }, 100);
      }

    } catch (error) {
      console.error('Error fetching unpaid minerals:', error);
      setError('Failed to fetch unpaid minerals');
      setMinerals({
        tantalum: [],
        tin: [],
        tungsten: []
      });
    } finally {
      setLoading(false);
    }
  }, [supplierId]); // Only supplierId as dependency

  // Fetch minerals when supplier changes
  useEffect(() => {
    if (supplierId) {
      fetchUnpaidMinerals();
    }
  }, [supplierId, fetchUnpaidMinerals]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    return `${weight.toFixed(2)} kg`;
  };

  const formatPercentage = (percentage: number | null | undefined) => {
    if (percentage === null || percentage === undefined) return '—';
    return `${percentage.toFixed(2)}%`;
  };

  const getPercentage = (mineral: Mineral, type: 'tantalum' | 'tin' | 'tungsten') => {
    switch (type) {
      case 'tantalum':
        return mineral.alex_stewart_ta2o5 ?? mineral.internal_ta2o5;
      case 'tin':
        return mineral.alex_stewart_sn_percentage ?? mineral.internal_sn_percentage;
      case 'tungsten':
        return mineral.alex_stewart_wo3_percentage ?? mineral.wo3_percentage;
      default:
        return null;
    }
  };

  const handleMineralToggle = (type: 'tantalum' | 'tin' | 'tungsten', mineralId: string) => {
    const currentSelection = selectedMinerals[type];
    const newSelection = currentSelection.includes(mineralId)
      ? currentSelection.filter(id => id !== mineralId)
      : [...currentSelection, mineralId];
    
    onSelectionChange(type, newSelection);
    onDataChange?.();
  };

  const handleSelectAll = (type: 'tantalum' | 'tin' | 'tungsten') => {
    const mineralList = getFilteredMinerals(type);
    if (Array.isArray(mineralList)) {
      const allIds = mineralList.map(m => m.id);
      onSelectionChange(type, allIds);
      onDataChange?.();
    }
  };

  const handleDeselectAll = (type: 'tantalum' | 'tin' | 'tungsten') => {
    onSelectionChange(type, []);
    onDataChange?.();
  };

  const toggleSection = (type: 'tantalum' | 'tin' | 'tungsten') => {
    setExpandedSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSearchChange = (type: 'tantalum' | 'tin' | 'tungsten', searchTerm: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [type]: searchTerm
    }));
  };

  const getFilteredMinerals = (type: 'tantalum' | 'tin' | 'tungsten') => {
    const mineralList = minerals[type];
    const searchTerm = searchTerms[type].toLowerCase();
    
    if (!searchTerm) return mineralList;
    
    return mineralList.filter(mineral => 
      mineral.lot_number?.toLowerCase().includes(searchTerm) ||
      mineral.id.toLowerCase().includes(searchTerm)
    );
  };

  const getMineralTypeColor = (type: 'tantalum' | 'tin' | 'tungsten') => {
    switch (type) {
      case 'tantalum':
        return {
          bg: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
          border: 'border-purple-200 dark:border-purple-800',
          text: 'text-purple-700 dark:text-purple-300',
          button: 'bg-purple-600 hover:bg-purple-700',
          checkBg: 'bg-purple-100 dark:bg-purple-900/30'
        };
      case 'tin':
        return {
          bg: 'from-gray-50 to-slate-50 dark:from-gray-700/20 dark:to-slate-700/20',
          border: 'border-gray-200 dark:border-gray-600',
          text: 'text-gray-700 dark:text-gray-300',
          button: 'bg-gray-600 hover:bg-gray-700',
          checkBg: 'bg-gray-100 dark:bg-gray-700/30'
        };
      case 'tungsten':
        return {
          bg: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-700 dark:text-yellow-300',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          checkBg: 'bg-yellow-100 dark:bg-yellow-900/30'
        };
    }
  };

  const renderMineralSection = (type: 'tantalum' | 'tin' | 'tungsten') => {
    const mineralList = minerals[type];
    const filteredMinerals = getFilteredMinerals(type);
    const colors = getMineralTypeColor(type);
    const isExpanded = expandedSections[type];
    const selectedCount = selectedMinerals[type].length;
    const totalCount = Array.isArray(mineralList) ? mineralList.length : 0;
    const filteredCount = Array.isArray(filteredMinerals) ? filteredMinerals.length : 0;

    return (
      <div key={type} className={`border rounded-xl overflow-hidden bg-gradient-to-r ${colors.bg} ${colors.border}`}>
        <div 
          className="p-4 cursor-pointer flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          onClick={() => toggleSection(type)}
        >
          <div className="flex items-center">
            <BeakerIcon className={`w-5 h-5 mr-3 ${colors.text}`} />
            <div>
              <h3 className={`font-semibold ${colors.text} capitalize`}>
                {type} ({totalCount} {t('payments.available', 'available')})
              </h3>
              {selectedCount > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCount} {t('payments.selected', 'selected')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {totalCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectedCount === filteredCount ? handleDeselectAll(type) : handleSelectAll(type);
                }}
                className={`px-3 py-1 text-xs rounded-lg text-white transition-colors ${colors.button}`}
              >
                {selectedCount === filteredCount ? t('payments.deselect_all', 'Deselect All') : t('payments.select_all', 'Select All')}
              </button>
            )}
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0">
                {/* Search Bar */}
                {totalCount > 0 && (
                  <div className="mb-3">
                    <div className="relative">
                      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={t('payments.search_minerals', `Search ${type} by lot number...`)}
                        value={searchTerms[type]}
                        onChange={(e) => handleSearchChange(type, e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}

                {/* Minerals Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                  {filteredCount === 0 ? (
                    <div className="col-span-full">
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        {searchTerms[type] 
                          ? t('payments.no_minerals_found', 'No minerals found matching your search')
                          : t('payments.no_unpaid_minerals', 'No unpaid minerals available')
                        }
                      </p>
                    </div>
                  ) : (
                    Array.isArray(filteredMinerals) && filteredMinerals.map((mineral) => {
                      const isSelected = selectedMinerals[type].includes(mineral.id);
                      const percentage = getPercentage(mineral, type);

                      return (
                        <motion.div
                          key={mineral.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? `${colors.checkBg} ${colors.border} shadow-sm` 
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:shadow-sm'
                          }`}
                          onClick={() => handleMineralToggle(type, mineral.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1 min-w-0">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 transition-colors ${
                                isSelected 
                                  ? `${colors.button} border-transparent` 
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}>
                                {isSelected && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                  {mineral.lot_number || `#${mineral.id.slice(0, 8)}`}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <ScaleIcon className="w-3 h-3 mr-1" />
                                  <span className="mr-2">{formatWeight(mineral.net_weight)}</span>
                                  <CurrencyDollarIcon className="w-3 h-3 mr-1" />
                                  <span className="truncate">{formatAmount(mineral.net_amount)}</span>
                                  {percentage && (
                                    <span className="ml-1">{` | ${formatPercentage(percentage)}`}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <div className="flex items-center text-red-700 dark:text-red-300">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(['tantalum', 'tin', 'tungsten'] as const).map(renderMineralSection)}
    </div>
  );
};

export default SmartMineralSelector;