// components/dashboard/minerals/tantalum/TantalumStats.tsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ScaleIcon,
  BeakerIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { useSelectedMinerals } from '../../../../hooks/useSelectedMinerals';

interface TantalumStatsProps {
  tantalums: any[];
  selectedTantalums: any[];
}

const TantalumStats: React.FC<TantalumStatsProps> = ({ tantalums, selectedTantalums }) => {
  const { t } = useTranslation();
  const { getCountByType } = useSelectedMinerals();

  // Format number helper
  const formatNumber = (num: number | null, decimals = 2) => {
    if (num === null) return '—';
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Calculate statistics
  const stats = useMemo(() => {
    // For all tantalums
    const totalItems = tantalums.length;
    const totalNetWeight = tantalums.reduce((sum, item) => sum + item.net_weight, 0);
    
    // Calculate weighted average Ta2O5 percentage
    let weightedSumTa2O5 = 0;
    let totalWeightWithTa2O5 = 0;
    
    tantalums.forEach(item => {
      if (item.internal_ta2o5 !== null) {
        weightedSumTa2O5 += item.internal_ta2o5 * item.net_weight;
        totalWeightWithTa2O5 += item.net_weight;
      }
    });
    
    const avgTa2O5Percentage = totalWeightWithTa2O5 > 0 
      ? weightedSumTa2O5 / totalWeightWithTa2O5 
      : 0;
    
    // Calculate average Alex Stewart Ta2O5
    let alexStewartSum = 0;
    let alexStewartCount = 0;
    
    tantalums.forEach(item => {
      if (item.alex_stewart_ta2o5 !== null) {
        alexStewartSum += item.alex_stewart_ta2o5;
        alexStewartCount++;
      }
    });
    
    const avgAlexStewartTa2O5 = alexStewartCount > 0 
      ? alexStewartSum / alexStewartCount 
      : 0;
    
    // Calculate total net amount
    const totalNetAmount = tantalums.reduce((sum, item) => 
      sum + (item.net_amount || 0), 0);
    
    // For selected tantalums
    const selectedTotalNetWeight = selectedTantalums.reduce(
      (sum, item) => sum + item.net_weight, 0);
    
    let selectedWeightedSumTa2O5 = 0;
    let selectedTotalWeightWithTa2O5 = 0;
    
    selectedTantalums.forEach(item => {
      if (item.internal_ta2o5 !== null) {
        selectedWeightedSumTa2O5 += item.internal_ta2o5 * item.net_weight;
        selectedTotalWeightWithTa2O5 += item.net_weight;
      }
    });
    
    const selectedAvgTa2O5Percentage = selectedTotalWeightWithTa2O5 > 0 
      ? selectedWeightedSumTa2O5 / selectedTotalWeightWithTa2O5 
      : 0;
    
    const selectedTotalNetAmount = selectedTantalums.reduce(
      (sum, item) => sum + (item.net_amount || 0), 0);
    
    return {
      totalItems,
      totalNetWeight,
      avgTa2O5Percentage,
      avgAlexStewartTa2O5,
      totalNetAmount,
      selectedTotalNetWeight,
      selectedAvgTa2O5Percentage,
      selectedTotalNetAmount,
      selectedCount: selectedTantalums.length
    };
  }, [tantalums, selectedTantalums]);

  const hasSelected = getCountByType('tantalum') > 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 md:mb-5">
      {/* Total Net Weight */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <ScaleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tantalum.total_net_weight', 'Total Net Weight')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalNetWeight)} kg
            </p>
            {hasSelected && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                Sel: {formatNumber(stats.selectedTotalNetWeight)} kg
              </p>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Total Items */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg">
            <BeakerIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tantalum.total_items', 'Total Items')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {stats.totalItems}
            </p>
            {hasSelected && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                Selected: {stats.selectedCount}
              </p>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Average Ta2O5 Percentage */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tantalum.avg_ta2o5', 'Avg Ta₂O₅ %')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.avgTa2O5Percentage)}%
            </p>
            {hasSelected && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                Sel: {formatNumber(stats.selectedAvgTa2O5Percentage)}%
              </p>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Total Net Amount */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
            <CurrencyDollarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tantalum.total_net_amount', 'Total Net Amount')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              ${formatNumber(stats.totalNetAmount)}
            </p>
            {hasSelected && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                Sel: ${formatNumber(stats.selectedTotalNetAmount)}
              </p>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Average Alex Stewart Ta2O5 */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
            <CheckBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tantalum.avg_alex_stewart', 'Avg A.S. Ta₂O₅')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.avgAlexStewartTa2O5)}%
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TantalumStats;