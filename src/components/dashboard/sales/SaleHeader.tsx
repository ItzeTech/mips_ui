// components/dashboard/sales/SaleHeader.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PencilIcon,
  PrinterIcon,
  PlusIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

interface SaleHeaderProps {
  sale: any;
  onEdit: () => void;
  onPrint: () => void;
  onAddMineral: () => void;
}

const SaleHeader: React.FC<SaleHeaderProps> = ({ sale, onEdit, onPrint, onAddMineral }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMineralTypeColor = (type: string) => {
    switch (type) {
      case 'TANTALUM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'TIN':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'TUNGSTEN':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-md flex-shrink-0">
              <ShoppingCartIcon className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {t('sales.sale_id', 'Sale ID')}: {sale.id.substring(0, 8)}...
                </h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getMineralTypeColor(sale.mineral_type)}`}>
                  {sale.mineral_type}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('sales.created_on', 'Created on')}: {formatDate(sale.created_at)}
                {sale.updated_at && sale.updated_at !== sale.created_at && 
                  ` • ${t('sales.updated_on', 'Updated on')}: ${formatDate(sale.updated_at)}`}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
            >
              <PencilIcon className="w-3.5 h-3.5 mr-1" />
              {t('sales.edit', 'Edit')}
            </button>
            
            <button
              onClick={onAddMineral}
              className="inline-flex items-center px-3 py-1.5 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5 mr-1" />
              {t('sales.add_mineral', 'Add Mineral')}
            </button>
            
            <button
              onClick={onPrint}
              className="inline-flex items-center px-3 py-1.5 text-xs bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg transition-colors"
            >
              <PrinterIcon className="w-3.5 h-3.5 mr-1" />
              {t('sales.print', 'Print')}
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('sales.total_weight', 'Total Weight')}
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {sale.total_weight.toLocaleString('en-US', { minimumFractionDigits: 2 })} kg
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('sales.minerals_count', 'Minerals')}
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {sale.minerals?.length || 0} {t('sales.items', 'items')}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('sales.total_amount', 'Total Amount')}
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              ${sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleHeader;