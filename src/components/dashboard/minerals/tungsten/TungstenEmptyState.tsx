// components/dashboard/minerals/tungsten/TungstenEmptyState.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RectangleGroupIcon } from '@heroicons/react/24/outline';

interface TungstenEmptyStateProps {
  hasSearch: boolean;
  onCreateClick: () => void;
}

const TungstenEmptyState: React.FC<TungstenEmptyStateProps> = ({ hasSearch, onCreateClick }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-5">
      <div className="text-center py-10 px-4">
        <motion.div
          animate={{ y: [0, -8, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        >
          <RectangleGroupIcon className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-3" />
        </motion.div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {hasSearch ? t('tungsten.no_tungstens_found', 'No tungsten records found') : t('tungsten.no_tungstens', 'No tungsten records yet')}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto">
          {hasSearch 
            ? t('tungsten.try_different_search', 'Try adjusting your search or filter to find what you are looking for.') 
            : t('tungsten.no_tungstens_description', 'Start adding tungsten minerals to your inventory.')
          }
        </p>
        {!hasSearch && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateClick}
            className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200"
          >
            {t('tungsten.create_first', 'Add Your First Tungsten')}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TungstenEmptyState;