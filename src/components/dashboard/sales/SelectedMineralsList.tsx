// components/dashboard/sales/SelectedMineralsList.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { XMarkIcon, CubeIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { useSelectedMinerals } from '../../../hooks/useSelectedMinerals';

interface SelectedMineralsListProps {
  minerals: any[];
  mineralType: string;
}

const SelectedMineralsList: React.FC<SelectedMineralsListProps> = ({ minerals, mineralType }) => {
  const { t } = useTranslation();
  const { deselectMineral } = useSelectedMinerals();

  const getMineralTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'TANTALUM':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'TIN':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'TUNGSTEN':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${getMineralTypeColor(mineralType)}`}>
            {mineralType}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {minerals.length} {t('sales.items_selected', 'items selected')}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t('sales.total_weight', 'Total Weight')}: {minerals.reduce((sum, item) => sum + item.netWeight, 0).toFixed(2)} kg
        </div>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {minerals.map((mineral) => (
          <motion.div
            key={mineral.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center group hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                  <CubeIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {mineral.lotNumber}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {mineral.supplierName}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <ScaleIcon className="w-3 h-3 mr-1" />
                <span>{mineral.netWeight.toFixed(2)} kg</span>
              </div>
              
              <button
                onClick={() => deselectMineral(mineral.id, mineralType.toLowerCase() as any)}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SelectedMineralsList;