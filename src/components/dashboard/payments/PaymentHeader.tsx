import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  PrinterIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Payment } from '../../../features/finance/paymentSlice';
import axiosInstance from '../../../config/axiosInstance';

interface PaymentHeaderProps {
  payment: Payment;
  onPrint: () => void;
  onEdit: () => void;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({ payment, onPrint: _onPrint, onEdit }) => {
  const { t } = useTranslation();
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handlePrintClick = () => {
    setPrintModalOpen(true);
  };

  const handleViewReport = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/reports/payment/${payment.id}/payment-slip`, {
        responseType: 'blob'
      });
      
      // Create blob URL and open in new window
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new tab using the browser's built-in PDF viewer
      window.open(url, '_blank');
      
      setPrintModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error viewing report:', error);
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/reports/payment/${payment.id}/payment-slip`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment-slip-${payment.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      setPrintModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      setIsLoading(false);
    }
  };

  const translatedMinerals = payment.mineral_types
  .map((type) => {
    switch (type) {
      case 'TANTALUM':
        return t('sidebar.menu.tantalum');
      case 'TIN':
        return t('sidebar.menu.tin');
      case 'TUNGSTEN':
        return t('sidebar.menu.tungsten');
      default:
        return type; // fallback to original if unknown
    }
  })
  .join(', ').toUpperCase();

  return (
    <>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <CurrencyDollarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {t('payments.payment_id', 'Payment')} #{payment.id.slice(0, 8)}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t('payments.to_supplier', 'Payment to')} {payment.supplier_name}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700/30 px-3 py-1 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">{formatAmount(payment.total_amount)}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 px-3 py-1 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">{translatedMinerals}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 px-3 py-1 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">{payment.total_weight.toFixed(2)} kg</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-colors"
              >
                <PencilIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span>{t('payments.edit', 'Edit')}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrintClick}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
              >
                <PrinterIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span>{t('payments.print', 'Print')}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Options Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t('payments.print_options', 'Print Options')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {t('payments.print_description', 'Choose how you would like to access the payment slip')}
            </p>
            
            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewReport}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                ) : (
                  <EyeIcon className="w-4 h-4 mr-2" />
                )}
                {t('payments.view_slip', 'View Payment Slip')}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadReport}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2.5 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-green-500 border-t-transparent rounded-full"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                {t('payments.download_slip', 'Download Payment Slip')}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPrintModalOpen(false)}
                className="flex items-center justify-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200"
              >
                {t('common.cancel', 'Cancel')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PaymentHeader;