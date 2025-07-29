// components/dashboard/payments/SmartAdvanceSelector.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BanknotesIcon,
  CheckIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CreditCardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../../config/axiosInstance';

interface AdvancePayment {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  date: string;
  created_at: string;
}

interface SmartAdvanceSelectorProps {
  supplierId: string;
  selectedAdvanceIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onDataChange?: () => void; // New prop
}

const SmartAdvanceSelector: React.FC<SmartAdvanceSelectorProps> = ({
  supplierId,
  selectedAdvanceIds,
  onSelectionChange
}) => {
  const { t } = useTranslation();
  const [advances, setAdvances] = useState<AdvancePayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (supplierId) {
      fetchUnpaidAdvances();
    }
  }, [supplierId]);

  const fetchUnpaidAdvances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        `/advance-payments/supplier/${supplierId}/by-status`,
        { statuses: ["Unpaid"] }
      );
      
      const advanceData = Array.isArray(response.data.data.items) ? response.data.data.items : [];
      setAdvances(advanceData);
      
      // Auto-select all advances
      if (advanceData.length > 0) {
        const allAdvanceIds = advanceData.map((advance: any) => advance.id);
        onSelectionChange(allAdvanceIds);
      }
    } catch (error) {
      console.error('Failed to fetch unpaid advances:', error);
      setError('Failed to fetch unpaid advance payments');
      setAdvances([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string = 'USD') => {
    if (currency === 'RWF') {
      return new Intl.NumberFormat('rw-RW', {
        style: 'currency',
        currency: 'RWF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleAdvanceToggle = (advanceId: string) => {
    const newSelection = selectedAdvanceIds.includes(advanceId)
      ? selectedAdvanceIds.filter(id => id !== advanceId)
      : [...selectedAdvanceIds, advanceId];
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = advances.map(a => a.id);
    onSelectionChange(allIds);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const selectedCount = selectedAdvanceIds.length;
  const totalCount = advances.length;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
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
    <div className="border border-green-200 dark:border-green-800 rounded-xl overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <BanknotesIcon className="w-5 h-5 mr-3 text-green-700 dark:text-green-300" />
          <div>
            <h3 className="font-semibold text-green-700 dark:text-green-300">
              {t('payments.advance_payments', 'Advance Payments')} ({totalCount} {t('payments.available', 'available')})
            </h3>
            {selectedCount > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCount} {t('payments.selected', 'selected')} • {t('payments.auto_selected', 'Auto-selected')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {totalCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                selectedCount === totalCount ? handleDeselectAll() : handleSelectAll();
              }}
              className="px-3 py-1 text-xs rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              {selectedCount === totalCount ? t('payments.deselect_all', 'Deselect All') : t('payments.select_all', 'Select All')}
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
            <div className="p-4 pt-0 space-y-2 max-h-60 overflow-y-auto">
              {advances.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {t('payments.no_unpaid_advances', 'No unpaid advance payments available')}
                </p>
              ) : (
                advances.map((advance) => {
                  const isSelected = selectedAdvanceIds.includes(advance.id);

                  return (
                    <motion.div
                      key={advance.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 shadow-sm' 
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:shadow-sm'
                      }`}
                      onClick={() => handleAdvanceToggle(advance.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors ${
                            isSelected 
                              ? 'bg-green-600 border-transparent' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              #{advance.id.slice(0, 8)}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <CreditCardIcon className="w-3 h-3 mr-1" />
                              {advance.payment_method}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-1">
                            <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                            {formatAmount(advance.amount, advance.currency)}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {new Date(advance.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartAdvanceSelector;