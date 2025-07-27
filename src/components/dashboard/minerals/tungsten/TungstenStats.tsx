// components/dashboard/minerals/tungsten/TungstenStats.tsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ScaleIcon, RectangleGroupIcon, ChartBarIcon, CurrencyDollarIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { useSelectedMinerals } from '../../../../hooks/useSelectedMinerals';

interface TungstenStatsProps {
  tungstens: any[];
  selectedTungstens: any[];
}

const TungstenStats: React.FC<TungstenStatsProps> = ({ tungstens, selectedTungstens }) => {
  const { t } = useTranslation();
  const { getCountByType } = useSelectedMinerals();

  // Format number helper
  const formatNumber = (num: number | null, decimals = 2) => {
    if (num === null) return '—';
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  // Calculate statistics
  const stats = useMemo(() => {
    // For all tungstens
    const totalItems = tungstens.length;
    const totalNetWeight = tungstens.reduce((sum, item) => sum + item.net_weight, 0);

    // Calculate weighted average WO3 percentage
    let weightedSumWO3 = 0;
    let totalWeightWithWO3 = 0;

    tungstens.forEach(item => {
      if (item.wo3_percentage !== null) {
        weightedSumWO3 += item.wo3_percentage * item.net_weight;
        totalWeightWithWO3 += item.net_weight;
      }
    });

    const avgWO3Percentage = totalWeightWithWO3 > 0 
      ? weightedSumWO3 / totalWeightWithWO3 
      : 0;

    // Calculate average Alex Stewart WO3
    let alexStewartSum = 0;
    let alexStewartCount = 0;

    tungstens.forEach(item => {
      if (item.alex_stewart_wo3_percentage !== null) {
        alexStewartSum += item.alex_stewart_wo3_percentage;
        alexStewartCount++;
      }
    });

    const avgAlexStewartWO3 = alexStewartCount > 0 
      ? alexStewartSum / alexStewartCount 
      : 0;

    // Calculate total net amount
    const totalNetAmount = tungstens.reduce((sum, item) => 
      sum + (item.net_amount || 0), 0);

    // For selected tungstens
    const selectedTotalNetWeight = selectedTungstens.reduce(
      (sum, item) => sum + item.net_weight, 0);

    let selectedWeightedSumWO3 = 0;
    let selectedTotalWeightWithWO3 = 0;

    selectedTungstens.forEach(item => {
      if (item.wo3_percentage !== null) {
        selectedWeightedSumWO3 += item.wo3_percentage * item.net_weight;
        selectedTotalWeightWithWO3 += item.net_weight;
      }
    });

    const selectedAvgWO3Percentage = selectedTotalWeightWithWO3 > 0 
      ? selectedWeightedSumWO3 / selectedTotalWeightWithWO3 
      : 0;

    const selectedTotalNetAmount = selectedTungstens.reduce(
      (sum, item) => sum + (item.net_amount || 0), 0);

    return {
      totalItems,
      totalNetWeight,
      avgWO3Percentage,
      avgAlexStewartWO3,
      totalNetAmount,
      selectedTotalNetWeight,
      selectedAvgWO3Percentage,
      selectedTotalNetAmount,
      selectedCount: selectedTungstens.length
    };
  }, [tungstens, selectedTungstens]);

  const hasSelected = getCountByType('tungsten') > 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 md:mb-5">
      {/* Total Net Weight */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
            <ScaleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tungsten.total_net_weight', 'Total Net Weight')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalNetWeight)} kg
            </p>
            {hasSelected && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
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
            <RectangleGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tungsten.total_items', 'Total Items')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {stats.totalItems}
            </p>
            {hasSelected && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Selected: {stats.selectedCount}
              </p>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Average WO3 Percentage */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
            <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tungsten.avg_wo3_percentage', 'Avg WO3 %')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.avgWO3Percentage)}%
            </p>
            {hasSelected && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Sel: {formatNumber(stats.selectedAvgWO3Percentage)}%
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
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tungsten.total_net_amount', 'Total Net Amount')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              ${formatNumber(stats.totalNetAmount)}
            </p>
            {hasSelected && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Sel: ${formatNumber(stats.selectedTotalNetAmount)}
              </p>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Average Alex Stewart WO3 */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
            <CheckBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('tungsten.avg_alex_stewart', 'Avg A.S. WO3 %')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.avgAlexStewartWO3)}%
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TungstenStats;