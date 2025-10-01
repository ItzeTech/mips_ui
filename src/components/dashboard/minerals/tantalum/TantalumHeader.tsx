import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  CircleStackIcon,
  SparklesIcon,
  CalculatorIcon,
  ChartBarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { useSelectedMinerals } from '../../../../hooks/useSelectedMinerals';
import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '../../../common/RoleGuard';

interface TantalumHeaderProps {
  onCreateClick: () => void;
  selectedTantalums: any[];
}

const TantalumHeader: React.FC<TantalumHeaderProps> = ({ 
  onCreateClick,
  selectedTantalums
}) => {
  const { t } = useTranslation();
  const { clearByType, getCountByType } = useSelectedMinerals();

  const navigate = useNavigate();

  const handleComputeSelected = () => {
    navigate('/sales/create/tantalum');
  };

  return (
    <div className="mb-5 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <CircleStackIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('tantalum.title', 'Tantalum Management')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t('tantalum.subtitle', 'Manage your tantalum minerals inventory')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Compute button - only visible when items are selected */}
          {getCountByType('tantalum') > 0 && (
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
              <span>{t('tantalum.compute_selected', 'Compute')} ({getCountByType('tantalum')})</span>
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
              className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
              <span>{t('tantalum.create_new', 'Add New Tantalum')}</span>
              <SparklesIcon className="w-3 h-3 ml-1 sm:ml-2" />
            </motion.button>
          </RoleGuard>
        </div>
      </div>
      
      {/* Selected items banner */}
      <AnimatePresence>
        {getCountByType('tantalum') > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-2 sm:p-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <CheckBadgeIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-xs sm:text-sm text-indigo-800 dark:text-indigo-300">
                {getCountByType('tantalum')} {t('tantalum.items_selected', 'items selected')}
              </span>
            </div>
            <button
              onClick={() => clearByType('tantalum')}
              className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
            >
              {t('tantalum.clear_selection', 'Clear selection')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TantalumHeader;