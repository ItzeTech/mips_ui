// components/dashboard/minerals/tin/TinHeader.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  BeakerIcon,
  SparklesIcon,
  CalculatorIcon,
  ChartBarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { useSelectedMinerals } from '../../../../hooks/useSelectedMinerals';

interface TinHeaderProps {
  onCreateClick: () => void;
  selectedTins: any[];
}

const TinHeader: React.FC<TinHeaderProps> = ({ 
  onCreateClick,
  selectedTins
}) => {
  const { t } = useTranslation();
  const { clearByType, getCountByType } = useSelectedMinerals();

  const handleComputeSelected = () => {
    console.log('Computing for selected tins:', selectedTins);
    // Implement compute functionality
  };

  return (
    <div className="mb-5 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
              <BeakerIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('tin.title', 'Tin Management')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t('tin.subtitle', 'Manage your tin minerals inventory')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Compute button - only visible when items are selected */}
          {getCountByType('tin') > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComputeSelected}
              className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <CalculatorIcon className="w-4 h-4 mr-1 sm:mr-2" />
              <span>{t('tin.compute_selected', 'Compute')} ({getCountByType('tin')})</span>
              <ChartBarIcon className="w-3 h-3 ml-1 sm:ml-2" />
            </motion.button>
          )}
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateClick}
            className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
            <span>{t('tin.create_new', 'Add New Tin')}</span>
            <SparklesIcon className="w-3 h-3 ml-1 sm:ml-2" />
          </motion.button>
        </div>
      </div>
      
      {/* Selected items banner */}
      <AnimatePresence>
        {getCountByType('tin') > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-2 sm:p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <CheckBadgeIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
              <span className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                {getCountByType('tin')} {t('tin.items_selected', 'items selected')}
              </span>
            </div>
            <button
              onClick={() => clearByType('tin')}
              className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
            >
              {t('tin.clear_selection', 'Clear selection')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TinHeader;