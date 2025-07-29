import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  PrinterIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { Payment } from '../../../features/finance/paymentSlice';

interface PaymentHeaderProps {
  payment: Payment;
  onPrint: () => void;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({ payment, onPrint }) => {
  const { t } = useTranslation();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg text-white p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {t('payments.payment_id', 'Payment')} #{payment.id.slice(0, 8)}
              </h2>
              <p className="text-white/80 text-sm">
                {t('payments.to_supplier', 'Payment to')} {payment.supplier_name}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="font-medium">{formatAmount(payment.total_amount)}</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <span>{payment.mineral_types.join(', ')}</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <span>{payment.total_weight.toFixed(2)} kg</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrint}
            className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300"
          >
            <PrinterIcon className="w-4 h-4 mr-1 sm:mr-2" />
            <span>{t('payments.print', 'Print')}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHeader;