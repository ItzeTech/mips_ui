// components/dashboard/sales/SaleDetails.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface SaleDetailsProps {
  sale: any;
}

const SaleDetails: React.FC<SaleDetailsProps> = ({ sale }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Buyer */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <UserIcon className="w-4 h-4 mr-1.5 text-blue-500" />
          <h3 className="text-sm font-medium">{t('sales.buyer', 'Buyer')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          {sale.buyer ? (
            <p className="text-sm text-gray-900 dark:text-white">{sale.buyer}</p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              {t('sales.no_buyer_specified', 'No buyer specified')}
            </p>
          )}
        </div>
      </div>
      
      {/* Amounts */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <CurrencyDollarIcon className="w-4 h-4 mr-1.5 text-green-500" />
          <h3 className="text-sm font-medium">{t('sales.amounts', 'Amounts')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.total_amount', 'Total Amount')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ${sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.net_sales_amount', 'Net Sales Amount')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {sale.net_sales_amount !== null 
                  ? `$${sale.net_sales_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mineral Details */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <ChartBarIcon className="w-4 h-4 mr-1.5 text-indigo-500" />
          <h3 className="text-sm font-medium">{t('sales.mineral_details', 'Mineral Details')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.mineral_type', 'Mineral Type')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {sale.mineral_type}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.avg_percentage', 'Average Percentage')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {sale.average_percentage.toLocaleString('en-US', { minimumFractionDigits: 2 })}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.total_weight', 'Total Weight')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {sale.total_weight.toLocaleString('en-US', { minimumFractionDigits: 2 })} kg
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.minerals_count', 'Minerals Count')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {sale.minerals?.length || 0} {t('sales.items', 'items')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dates */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <CalendarIcon className="w-4 h-4 mr-1.5 text-purple-500" />
          <h3 className="text-sm font-medium">{t('sales.dates', 'Dates')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.created_at', 'Created At')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(sale.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.updated_at', 'Updated At')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(sale.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetails;