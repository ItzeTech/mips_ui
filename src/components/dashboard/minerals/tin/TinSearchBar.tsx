// components/dashboard/minerals/tin/TinSearchBar.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronLeftIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { StockStatus, FinanceStatus } from '../../../../features/minerals/tinSlice';
import { RoleGuard } from '../../../common/RoleGuard';

interface TinSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  stockStatusFilter: 'all' | StockStatus;
  onStatusFilterChange: (status: 'all' | StockStatus) => void;
  financeStatusFilter: 'all' | FinanceStatus;
  onFinanceStatusFilterChange: (status: 'all' | FinanceStatus) => void;
  serverSideSearch: boolean;
  onServerSideSearchChange: (value: boolean) => void;
}

const TinSearchBar: React.FC<TinSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  stockStatusFilter,
  onStatusFilterChange,
  financeStatusFilter,
  onFinanceStatusFilterChange,
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
            placeholder={t('tin.search_placeholder', 'Search by lot number, supplier or weight...')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 ${searchTerm ? 'pr-28' : 'pr-20'} py-2.5 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
          />
          
          {/* Search toggle inside input */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center z-10">
            {/* Clear button */}
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onSearchChange('')}
                  className="mr-2 flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
            
            {/* Toggle switch */}
            <div 
              onClick={() => onServerSideSearchChange(!serverSideSearch)}
              className="flex items-center cursor-pointer group"
            >
              <span className={`mr-1 text-xs ${serverSideSearch ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'} group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors hidden sm:inline`}>
                {t('tin.all_pages', 'All pages')}
              </span>
              <div className={`w-7 h-3.5 rounded-full ${serverSideSearch ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'} relative transition-colors`}>
                <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white transform transition-transform ${serverSideSearch ? 'translate-x-3.5' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stock Status Filter */}
        <RoleGuard allowedRoles={['Stock Manager', 'Manager', 'Lab Technician']}>
          <div className="relative w-full md:w-auto md:min-w-[140px]">
            <div className="flex items-center">
              <FunnelIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={stockStatusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as any)}
                className="w-full pl-9 pr-8 py-2.5 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">{t('tin.status_all', 'All Status')}</option>
                <option value="in-stock">{t('tin.status_in_stock', 'In Stock')}</option>
                <option value="withdrawn">{t('tin.status_withdrawn', 'Withdrawn')}</option>
                <option value="resampled">{t('tin.status_resampled', 'Resampled')}</option>
                <option value="exported">{t('tin.status_exported', 'Exported')}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronLeftIcon className="w-3.5 h-3.5 transform rotate-90" />
              </div>
            </div>
          </div>
        </RoleGuard>
        
        {/* Finance Status Filter */}
        <RoleGuard allowedRoles={['Finance Officer', 'Manager']}>
          <div className="relative w-full md:w-auto md:min-w-[140px]">
            <div className="flex items-center">
              <BanknotesIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={financeStatusFilter}
                onChange={(e) => onFinanceStatusFilterChange(e.target.value as any)}
                className="w-full pl-9 pr-8 py-2.5 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">{t('tin.finance_all', 'All Finance')}</option>
                <option value="paid">{t('tin.finance_paid', 'Paid')}</option>
                <option value="unpaid">{t('tin.finance_unpaid', 'Unpaid')}</option>
                <option value="invoiced">{t('tin.finance_invoiced', 'Invoiced')}</option>
                {/* <option value="exported">{t('tin.finance_exported', 'Exported')}</option> */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronLeftIcon className="w-3.5 h-3.5 transform rotate-90" />
              </div>
            </div>
          </div>
        </RoleGuard>
      </div>
    </div>
  );
};

export default TinSearchBar;