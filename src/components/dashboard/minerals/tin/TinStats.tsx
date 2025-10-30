// components/dashboard/minerals/tin/TinStats.tsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ScaleIcon,
  CubeIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useSelectedMinerals } from '../../../../hooks/useSelectedMinerals';

interface TinStatsProps {
  tins: any[];
  selectedTins: any[];
}

const TinStats: React.FC<TinStatsProps> = ({ tins, selectedTins }) => {
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
    // For all tins
    const totalItems = tins.length;
    const totalNetWeight = tins.reduce((sum, item) => sum + item.net_weight, 0);
    
    // Calculate weighted average Sn percentage
    let weightedSumSn = 0;
    let totalWeightWithSn = 0;
    
    tins.forEach(item => {
      if (item.internal_sn_percentage !== null || item.alex_stewart_sn_percentage !== null) {
        weightedSumSn += (item.alex_stewart_sn_percentage ?? item.internal_sn_percentage) * item.net_weight;
        totalWeightWithSn += item.net_weight;
      }
    });
    
    const avgSnPercentage = totalWeightWithSn > 0 
      ? weightedSumSn / totalWeightWithSn 
      : 0;
        
    
    // Calculate total net amount
    const totalNetAmount = tins.reduce((sum, item) => 
      sum + (item.net_amount || 0), 0);
    
    // For selected tins
    const selectedTotalNetWeight = selectedTins.reduce(
      (sum, item) => sum + item.net_weight, 0);
    
    let selectedWeightedSumSn = 0;
    let selectedTotalWeightWithSn = 0;
    
    selectedTins.forEach(item => {
      if (item.internal_sn_percentage !== null || item.alex_stewart_sn_percentage !== null) {
        selectedWeightedSumSn += (item.alex_stewart_sn_percentage ?? item.internal_sn_percentage) * item.net_weight;
        selectedTotalWeightWithSn += item.net_weight;
      }
    });
    
    const selectedAvgSnPercentage = selectedTotalWeightWithSn > 0 
      ? selectedWeightedSumSn / selectedTotalWeightWithSn 
      : 0;
    
    const selectedTotalNetAmount = selectedTins.reduce(
      (sum, item) => sum + (item.net_amount || 0), 0);
    
    return {
      totalItems,
      totalNetWeight,
      avgSnPercentage,
      totalNetAmount,
      selectedTotalNetWeight,
      selectedAvgSnPercentage,
      selectedTotalNetAmount,
      selectedCount: selectedTins.length
    };
  }, [tins, selectedTins]);

  const hasSelected = getCountByType('tin') > 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 md:mb-5">
      {/* Total Net Weight */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
            <ScaleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tin.total_net_weight', 'Total Net Weight')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalNetWeight)} kg
            </p>
            {hasSelected && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {t('common.selected', 'Selected')} {formatNumber(stats.selectedTotalNetWeight)} kg
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
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <CubeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tin.total_items', 'Total Items')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {stats.totalItems}
            </p>
            {hasSelected && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {t('common.selected', 'Selected')} {stats.selectedCount}
              </p>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Average Sn Percentage */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tin.avg_sn_percentage', 'Avg Sn %')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.avgSnPercentage)}%
            </p>
            {hasSelected && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {t('common.selected', 'Selected')} {formatNumber(stats.selectedAvgSnPercentage)}%
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
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tin.total_net_amount', 'Total Net Amount')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              ${formatNumber(stats.totalNetAmount)}
            </p>
            {hasSelected && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {t('common.selected', 'Selected')} ${formatNumber(stats.selectedTotalNetAmount)}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TinStats;