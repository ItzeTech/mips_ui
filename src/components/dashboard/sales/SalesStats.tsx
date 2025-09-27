// components/dashboard/sales/SalesStats.tsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ScaleIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CreditCardIcon
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
    
    // New payment stats
    const totalPaidAmount = sales.reduce((sum, sale) => sum + (sale.paid_amount || 0), 0);
    const unpaidSales = sales.filter(sale => sale.payment_status === 'UNPAID').length;
    const partiallyPaidSales = sales.filter(sale => sale.payment_status === 'PARTIALLY_PAID').length;
    const fullyPaidSales = sales.filter(sale => sale.payment_status === 'FULLY_PAID').length;
    const paymentPercentage = totalNetSalesAmount > 0 
      ? (totalPaidAmount / totalNetSalesAmount) * 100 
      : 0;
    
    // Count minerals
    const totalMinerals = sales.reduce((sum, sale) => sum + (sale.minerals ? sale.minerals.length : 0), 0);
    
    return {
      totalSales,
      totalWeight,
      avgPercentage,
      totalAmount,
      totalNetSalesAmount,
      totalMinerals,
      // New payment stats
      totalPaidAmount,
      unpaidSales,
      partiallyPaidSales,
      fullyPaidSales,
      paymentPercentage
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
      
      {/* Payment Stats - New card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="col-span-2 sm:col-span-3 lg:col-span-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700 mt-2"
      >
        <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <CreditCardIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {t('sales.payment_stats', 'Payment Statistics')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('sales.paid_amount', 'Paid Amount')}</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              ${formatNumber(stats.totalPaidAmount)}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('sales.payment_progress', 'Payment Progress')}</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.paymentPercentage)}%
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('sales.fully_paid', 'Fully Paid')}</p>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">
              {stats.fullyPaidSales} / {stats.totalSales}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('sales.outstanding', 'Outstanding')}</p>
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              ${formatNumber(stats.totalNetSalesAmount - stats.totalPaidAmount)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalesStats;