// components/dashboard/minerals/tungsten/TungstenHeader.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, RectangleGroupIcon, SparklesIcon, CalculatorIcon, ChartBarIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { useSelectedMinerals } from '../../../../hooks/useSelectedMinerals';
import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '../../../common/RoleGuard';

interface TungstenHeaderProps {
  onCreateClick: () => void;
  selectedTungstens: any[];
}

const TungstenHeader: React.FC<TungstenHeaderProps> = ({ onCreateClick, selectedTungstens: _selectedSupplierId }) => {
  const { t } = useTranslation();
  const { clearByType, getCountByType } = useSelectedMinerals();

  const navigate = useNavigate();

  const handleComputeSelected = () => {
    navigate('/sales/create/tungsten');
  };

  return (
    <div className="mb-5 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
              <RectangleGroupIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('tungsten.title', 'Tungsten Management')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t('tungsten.subtitle', 'Manage your tungsten minerals inventory')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Compute button - only visible when items are selected */}
          {getCountByType('tungsten') > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComputeSelected}
              className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <CalculatorIcon className="w-4 h-4 mr-1 sm:mr-2" />
              <span>{t('tungsten.compute_selected', 'Compute')} ({getCountByType('tungsten')})</span>
              <ChartBarIcon className="w-3 h-3 ml-1 sm:ml-2" />
            </motion.button>
          )}
          
          <RoleGuard
            allowedRoles={['Manager', 'Stock Manager']}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateClick}
              className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-emerald-500 to-green-600 hover:from-emerald-600 hover:via-emerald-600 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
              <span>{t('tungsten.create_new', 'Add New Tungsten')}</span>
              <SparklesIcon className="w-3 h-3 ml-1 sm:ml-2" />
            </motion.button>
          </RoleGuard>
        </div>
      </div>
      
      {/* Selected items banner */}
      <AnimatePresence>
        {getCountByType('tungsten') > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <CheckBadgeIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
              <span className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                {getCountByType('tungsten')} {t('tungsten.items_selected', 'items selected')}
              </span>
            </div>
            <button
              onClick={() => clearByType('tungsten')}
              className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium"
            >
              {t('tungsten.clear_selection', 'Clear selection')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TungstenHeader;