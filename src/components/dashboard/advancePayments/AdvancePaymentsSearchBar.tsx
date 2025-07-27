// components/dashboard/advancePayments/AdvancePaymentsSearchBar.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface AdvancePaymentsSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const AdvancePaymentsSearchBar: React.FC<AdvancePaymentsSearchBarProps> = ({ searchTerm, onSearchChange }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder={t('advancePayments.search_placeholder', 'Search by supplier, amount, or payment method...')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AdvancePaymentsSearchBar;