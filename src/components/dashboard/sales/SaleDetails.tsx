// components/dashboard/sales/SaleDetails.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  CreditCardIcon
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'FULLY_PAID':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'PARTIALLY_PAID':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'UNPAID':
      default:
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    }
  };

   const translateMineral = (type: string) => {
    switch (type) {
      case 'TANTALUM':
        return t('sidebar.menu.tantalum');
      case 'TIN':
        return t('sidebar.menu.tin');
      case 'TUNGSTEN':
        return t('sidebar.menu.tungsten');
      default:
        return type;
    }
  };

  return (
    <div className="space-y-5">
      {/* Buyer */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mr-2">
            <UserIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold">{t('sales.buyer', 'Buyer')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          {sale.buyer ? (
            <p className="text-sm font-medium text-gray-900 dark:text-white">{sale.buyer}</p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              {t('sales.no_buyer_specified', 'No buyer specified')}
            </p>
          )}
        </div>
      </div>
      
      {/* Payment Status - New Section */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mr-2">
            <CreditCardIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold">{t('sales.payment', 'Payment')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('sales.status', 'Status')}:</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPaymentStatusColor(sale.payment_status)}`}>
                {sale.payment_status === 'FULLY_PAID' ? t('sales.fully_paid', 'Fully Paid') :
                 sale.payment_status === 'PARTIALLY_PAID' ? t('sales.partially_paid', 'Partially Paid') :
                 t('sales.unpaid', 'Unpaid')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('sales.paid_amount', 'Paid Amount')}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  ${sale.paid_amount?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </p>
              </div>
              
              {sale.net_sales_amount !== null && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('sales.remaining', 'Remaining')}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${Math.max(0, (sale.net_sales_amount - (sale.paid_amount || 0))).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>
            
            {sale.last_payment_date && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('sales.last_payment_date', 'Last Payment Date')}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(sale.last_payment_date)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Amounts */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 mr-2">
            <CurrencyDollarIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold">{t('sales.amounts', 'Amounts')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
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
          <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mr-2">
            <ChartBarIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold">{t('sales.mineral_details', 'Mineral Details')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.mineral_type', 'Mineral Type')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {translateMineral(sale.mineral_type).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('sales.avg_percentage', 'Average Percentage')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {sale.average_percentage ? sale.average_percentage.toLocaleString('en-US', { minimumFractionDigits: 2 }) + '%' : '—'}
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
          <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 mr-2">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold">{t('sales.dates', 'Dates')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
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