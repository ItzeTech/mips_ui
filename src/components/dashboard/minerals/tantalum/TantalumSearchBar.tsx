// components/dashboard/minerals/tantalum/TantalumSearchBar.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { StockStatus } from '../../../../features/minerals/tantalumSlice';

interface TantalumSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  stockStatusFilter: 'all' | StockStatus;
  onStatusFilterChange: (status: 'all' | StockStatus) => void;
  serverSideSearch: boolean;
  onServerSideSearchChange: (value: boolean) => void;
}

const TantalumSearchBar: React.FC<TantalumSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  stockStatusFilter,
  onStatusFilterChange,
  serverSideSearch,
  onServerSideSearchChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 md:mb-5">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"/>
          <input
            type="text"
            placeholder={t('tantalum.search_placeholder', 'Search by lot number, supplier or weight...')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          
          {/* Search toggle inside input */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex items-center z-10">
            <div 
              onClick={() => onServerSideSearchChange(!serverSideSearch)}
              className="flex items-center cursor-pointer group"
            >
              <span className={`mr-1 text-xs ${serverSideSearch ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors hidden sm:inline`}>
                {t('tantalum.all_pages', 'All pages')}
              </span>
              <div className={`w-7 h-3.5 rounded-full ${serverSideSearch ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'} relative transition-colors`}>
                <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white transform transition-transform ${serverSideSearch ? 'translate-x-3.5' : ''}`}></div>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <div className="relative w-full md:w-auto md:min-w-[140px]">
          <div className="flex items-center">
            <FunnelIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={stockStatusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as any)}
              className="w-full pl-9 pr-8 py-2.5 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white appearance-none"
            >
              <option value="all">{t('tantalum.status_all', 'All Status')}</option>
              <option value="in-stock">{t('tantalum.status_in_stock', 'In Stock')}</option>
              <option value="withdrawn">{t('tantalum.status_withdrawn', 'Withdrawn')}</option>
              <option value="resampled">{t('tantalum.status_resampled', 'Resampled')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <ChevronLeftIcon className="w-3.5 h-3.5 transform rotate-90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TantalumSearchBar;