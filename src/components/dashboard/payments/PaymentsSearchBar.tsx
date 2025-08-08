// Updated PaymentsSearchBar.tsx with mineral type filters
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface PaymentsSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTypes: string[];
  onTypeFilterChange: (types: string[]) => void;
}

const PaymentsSearchBar: React.FC<PaymentsSearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  selectedTypes, 
  onTypeFilterChange 
}) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = React.useState(false);

  const mineralTypes = ['TANTALUM', 'TIN', 'TUNGSTEN'];

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeFilterChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeFilterChange([...selectedTypes, type]);
    }
  };

  const toggleAllTypes = () => {
    if (selectedTypes.length === mineralTypes.length) {
      onTypeFilterChange([]);
    } else {
      onTypeFilterChange([...mineralTypes]);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TANTALUM':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30';
      case 'TIN':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600';
      case 'TUNGSTEN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder={t('payments.search_placeholder', 'Search by supplier, amount, mineral type, or payment ID...')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2.5 text-sm border ${
              showFilters || selectedTypes.length !== mineralTypes.length 
                ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700' 
                : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
            } rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors`}
          >
            <FunnelIcon className="w-5 h-5 mr-1.5" />
            {t('payments.filter', 'Filter')}
            {selectedTypes.length !== mineralTypes.length && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                {mineralTypes.length - selectedTypes.length}
              </span>
            )}
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-3">
              <div className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('payments.mineral_types', 'Mineral Types')}
                  </h3>
                  <button 
                    onClick={toggleAllTypes}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {selectedTypes.length === mineralTypes.length 
                      ? t('payments.unselect_all', 'Unselect All') 
                      : t('payments.select_all', 'Select All')}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {mineralTypes.map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      id={`filter-${type}`}
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label 
                      htmlFor={`filter-${type}`}
                      className="ml-2 flex items-center cursor-pointer"
                    >
                      <span className={`px-2 py-0.5 text-xs rounded-md border ${getTypeColor(type)}`}>
                        {type}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsSearchBar;