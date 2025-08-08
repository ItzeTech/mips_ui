import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PencilIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface AdvancePaymentHeaderProps {
  payment: any;
  onEdit: () => void;
  onPrint: () => void;
}

const AdvancePaymentHeader: React.FC<AdvancePaymentHeaderProps> = ({ payment, onEdit, onPrint }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Unpaid':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // const handleDelete = async () => {
  //   if (window.confirm(t('advancePayments.confirm_delete', 'Are you sure you want to delete this advance payment?'))) {
  //     await handleDeleteAdvancePayment(payment.id);
  //   }
  // };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-md flex-shrink-0">
              <BanknotesIcon className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {t('advancePayments.payment_id', 'Payment ID')}: {payment.id.substring(0, 8)}...
                </h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('advancePayments.created_on', 'Created on')}: {formatDate(payment.created_at)}
                {payment.updated_at && payment.updated_at !== payment.created_at && 
                  ` • ${t('advancePayments.updated_on', 'Updated on')}: ${formatDate(payment.updated_at)}`}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
            >
              <PencilIcon className="w-3.5 h-3.5 mr-1" />
              {t('advancePayments.edit', 'Edit')}
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('advancePayments.amount', 'Amount')}
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              ${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('advancePayments.payment_method', 'Payment Method')}
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {payment.payment_method}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('advancePayments.payment_date', 'Payment Date')}
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {formatDate(payment.date)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancePaymentHeader;