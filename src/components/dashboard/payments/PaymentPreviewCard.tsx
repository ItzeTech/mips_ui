// components/dashboard/payments/PaymentPreviewCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  ScaleIcon,
  BeakerIcon,
  BanknotesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Payment } from '../../../features/finance/paymentSlice';
import Badge from '../../common/Badge';

interface PaymentPreviewCardProps {
  payment: Payment;
}

const PaymentPreviewCard: React.FC<PaymentPreviewCardProps> = ({ payment }) => {
  const { t } = useTranslation();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatWeight = (weight: number | null) => {
    if (weight === null || weight === undefined) return '—';
    return `${weight.toLocaleString('en-US', { maximumFractionDigits: 2 })} kg`;
  };

  const formatPercentage = (percentage: number | null) => {
    if (percentage === null || percentage === undefined) return '—';
    return `${percentage.toFixed(2)}%`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <CurrencyDollarIcon className="w-6 h-6 mr-3 text-blue-500" />
          {t('payments.payment_preview', 'Payment Preview')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('payments.preview_description', 'Review calculation before creating')}
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Financial Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-500" />
            {t('payments.financial_summary', 'Financial Summary')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('payments.total_amount', 'Total Amount')}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatAmount(payment.total_amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('payments.advance_amount', 'Advance Amount')}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatAmount(payment.advance_amount)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">{t('payments.net_payment', 'Net Payment')}:</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">{formatAmount(payment.payable_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-700/50 dark:to-purple-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <ScaleIcon className="w-5 h-5 mr-2 text-purple-500" />
            {t('payments.weight_summary', 'Weight Summary')}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('payments.total_weight', 'Total Weight')}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatWeight(payment.total_weight)}</span>
            </div>
            {payment.tantalum_total_weight && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tantalum:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatWeight(payment.tantalum_total_weight)}</span>
              </div>
            )}
            {payment.tin_total_weight && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tin:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatWeight(payment.tin_total_weight)}</span>
              </div>
            )}
            {payment.tungsten_total_weight && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tungsten:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatWeight(payment.tungsten_total_weight)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mineral Types */}
        <div className="bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-700/50 dark:to-green-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <BeakerIcon className="w-5 h-5 mr-2 text-indigo-500" />
            {t('payments.mineral_analysis', 'Mineral Analysis')}
          </h3>
          
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('payments.mineral_types', 'Mineral Types')}:</p>
            <div className="flex flex-wrap gap-2">
              {payment.mineral_types.map((type) => (
                <Badge key={type} color="blue" size="sm">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Average Percentages */}
          <div className="space-y-2">
            {payment.avg_ta2o5_percentage && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Avg Ta₂O₅:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatPercentage(payment.avg_ta2o5_percentage)}</span>
              </div>
            )}
            {payment.avg_sn_percentage && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Avg Sn:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatPercentage(payment.avg_sn_percentage)}</span>
              </div>
            )}
            {payment.avg_wo3_percentage && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Avg WO₃:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatPercentage(payment.avg_wo3_percentage)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Item Counts */}
        <div className="bg-gradient-to-r from-gray-50 to-yellow-50 dark:from-gray-700/50 dark:to-yellow-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <BanknotesIcon className="w-5 h-5 mr-2 text-yellow-500" />
            {t('payments.selected_items', 'Selected Items')}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('payments.tantalum_count', 'Tantalum')}:</span>
                <span className="font-medium text-gray-900 dark:text-white">{payment.tantalum_ids.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('payments.tin_count', 'Tin')}:</span>
                <span className="font-medium text-gray-900 dark:text-white">{payment.tin_ids.length}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('payments.tungsten_count', 'Tungsten')}:</span>
                <span className="font-medium text-gray-900 dark:text-white">{payment.tungsten_ids.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('payments.advances_count', 'Advances')}:</span>
                <span className="font-medium text-gray-900 dark:text-white">{payment.advance_ids.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Indicator */}
        <div className="flex items-center justify-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {t('payments.ready_to_create', 'Ready to create payment')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentPreviewCard;