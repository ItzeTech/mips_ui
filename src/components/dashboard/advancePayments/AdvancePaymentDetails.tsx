// components/dashboard/advancePayments/AdvancePaymentDetails.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface AdvancePaymentDetailsProps {
  payment: any;
}

const AdvancePaymentDetails: React.FC<AdvancePaymentDetailsProps> = ({ payment }) => {
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
      {/* Supplier */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <UserIcon className="w-4 h-4 mr-1.5 text-blue-500" />
          <h3 className="text-sm font-medium">{t('advancePayments.supplier', 'Supplier')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          {payment.supplier ? (
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{payment.supplier.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {payment.supplier.phone_number}
                {payment.supplier.company && ` • ${payment.supplier.company}`}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              {t('advancePayments.no_supplier_info', 'No supplier information available')}
            </p>
          )}
        </div>
      </div>
      
      {/* Payment Details */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <CurrencyDollarIcon className="w-4 h-4 mr-1.5 text-green-500" />
          <h3 className="text-sm font-medium">{t('advancePayments.payment_details', 'Payment Details')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('advancePayments.amount', 'Amount')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('advancePayments.payment_method', 'Payment Method')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {payment.payment_method}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <CheckCircleIcon className="w-4 h-4 mr-1.5 text-indigo-500" />
          <h3 className="text-sm font-medium">{t('advancePayments.status', 'Status')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="flex items-center">
            {payment.status === 'Paid' ? (
              <>
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  {t('advancePayments.paid', 'Paid')}
                </span>
              </>
            ) : (
              <>
                <XCircleIcon className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  {t('advancePayments.unpaid', 'Unpaid')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Dates */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
          <CalendarIcon className="w-4 h-4 mr-1.5 text-purple-500" />
          <h3 className="text-sm font-medium">{t('advancePayments.dates', 'Dates')}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('advancePayments.payment_date', 'Payment Date')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(payment.date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('advancePayments.created_at', 'Created At')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(payment.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('advancePayments.updated_at', 'Updated At')}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(payment.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancePaymentDetails;