// components/dashboard/sales/SalesStats.tsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ScaleIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface SalesStatsProps {
  sales: any[];
}

const SalesStats: React.FC<SalesStatsProps> = ({ sales }) => {
  const { t } = useTranslation();

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
    const totalSales = sales.length;
    
    const totalWeight = sales.reduce((sum, sale) => sum + sale.total_weight, 0);
    
    // Average percentage across all sales (weighted by weight)
    let weightedSumPercentage = 0;
    let totalWeightWithPercentage = 0;
    
    sales.forEach(sale => {
      if (sale.average_percentage !== null && sale.total_weight > 0) {
        weightedSumPercentage += sale.average_percentage * sale.total_weight;
        totalWeightWithPercentage += sale.total_weight;
      }
    });
    
    const avgPercentage = totalWeightWithPercentage > 0 
      ? weightedSumPercentage / totalWeightWithPercentage 
      : 0;
    
    // Total amounts
    const totalAmount = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const totalNetSalesAmount = sales.reduce((sum, sale) => sum + (sale.net_sales_amount || 0), 0);
    
    // Count minerals
    const totalMinerals = sales.reduce((sum, sale) => sum + (sale.minerals ? sale.minerals.length : 0), 0);
    
    // Count unique buyers
    const uniqueBuyers = new Set(
      sales.filter(sale => sale.buyer).map(sale => sale.buyer)
    ).size;
    
    return {
      totalSales,
      totalWeight,
      avgPercentage,
      totalAmount,
      totalNetSalesAmount,
      totalMinerals,
      uniqueBuyers
    };
  }, [sales]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 md:mb-5">
      {/* Total Sales */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('sales.total_sales', 'Total Sales')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {stats.totalSales}
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Total Weight */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <ScaleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('sales.total_weight', 'Total Weight')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalWeight)} kg
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Average Percentage */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('sales.avg_percentage', 'Avg Percentage')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.avgPercentage)}%
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Total Amount */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
            <CurrencyDollarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('sales.total_amount', 'Total Amount')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              ${formatNumber(stats.totalAmount)}
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Unique Buyers */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('sales.unique_buyers', 'Unique Buyers')}</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
              {stats.uniqueBuyers}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalesStats;