// components/dashboard/sales/SalesSearchBar.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SalesSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SalesSearchBar: React.FC<SalesSearchBarProps> = ({
  searchTerm,
  onSearchChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 md:mb-5">
      <div className="relative flex-grow">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"/>
        <input
          type="text"
          placeholder={t('sales.search_placeholder', 'Search by ID, buyer or mineral type...')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 ${searchTerm ? 'pr-12' : 'pr-4'} py-2.5 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
        />
        
        {/* Clear button */}
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SalesSearchBar;