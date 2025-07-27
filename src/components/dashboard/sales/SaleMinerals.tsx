// components/dashboard/sales/SaleMinerals.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CubeIcon,
  ScaleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useSales } from '../../../hooks/useSales';

interface SaleMineralsProps {
  sale: any;
}

const SaleMinerals: React.FC<SaleMineralsProps> = ({ sale }) => {
  const { t } = useTranslation();
  const { handleRemoveMineralFromSale, removeMineralStatus } = useSales();

  const formatNumber = (num: number | null, decimals = 2) => {
    if (num === null) return '—';
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const getMineralTypeColor = (type: string) => {
    switch (type) {
      case 'TANTALUM':
        return 'from-blue-400 to-indigo-500';
      case 'TIN':
        return 'from-amber-400 to-orange-500';
      case 'TUNGSTEN':
        return 'from-green-400 to-teal-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'withdrawn':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'resampled':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  const getFinanceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'unpaid':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'invoiced':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'exported':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleRemoveMineral = async (mineralId: string) => {
    if (window.confirm(t('sales.confirm_remove_mineral', 'Are you sure you want to remove this mineral from the sale?'))) {
      await handleRemoveMineralFromSale(sale.id, mineralId);
    }
  };

  return (
    <div>
      {sale.minerals.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sale.minerals.map((mineral: any, index: number) => (
              <motion.div
                key={mineral.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getMineralTypeColor(sale.mineral_type)} flex items-center justify-center shadow-md`}>
                        <CubeIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center flex-wrap gap-2">
                        {mineral.lot_number}
                        <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                          <span className={`px-1.5 py-0.5 text-xs leading-5 font-medium rounded-md ${getStockStatusColor(mineral.stock_status)}`}>
                            {mineral.stock_status}
                          </span>
                          <span className={`px-1.5 py-0.5 text-xs leading-5 font-medium rounded-md ${getFinanceStatusColor(mineral.finance_status)}`}>
                            {mineral.finance_status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <ScaleIcon className="w-3 h-3 mr-1" />
                          {formatNumber(mineral.net_weight)} kg
                        </div>
                        <div className="flex items-center">
                          <ChartBarIcon className="w-3 h-3 mr-1" />
                          {formatNumber(mineral.percentage)}%
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="w-3 h-3 mr-1" />
                          ${formatNumber(mineral.net_amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleRemoveMineral(mineral.id)}
                      disabled={removeMineralStatus === 'loading'}
                      className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
            <CubeIcon className="h-12 w-12" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {t('sales.no_minerals', 'No minerals in this sale')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('sales.add_minerals_to_sale', 'Add minerals to this sale using the "Add Mineral" button above.')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SaleMinerals;