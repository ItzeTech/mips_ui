import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { EyeIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { Payment } from '../../../features/finance/paymentSlice';
import Badge from '../../common/Badge';
import axiosInstance from '../../../config/axiosInstance';

interface PaymentsTableProps {
  payments: Payment[];
  onView: (paymentId: string) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, onView }) => {
  const { t } = useTranslation();
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    return `${weight.toFixed(2)} kg`;
  };

  const getMineralTypeColor = (type: string) => {
    switch (type) {
      case 'TANTALUM':
        return 'purple';
      case 'TIN':
        return 'gray';
      case 'TUNGSTEN':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  const handlePrintClick = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setPrintModalOpen(true);
  };

  const handleViewReport = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/reports/payment/${selectedPaymentId}/payment-slip`, {
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
      const response = await axiosInstance.get(`/reports/payment/${selectedPaymentId}/payment-slip`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment-receipt-${selectedPaymentId}.pdf`);
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

  return (
    <>
      <div className="mb-6 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('payments.payment_id', 'Payment ID')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('payments.supplier', 'Supplier')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('payments.mineral_types', 'Mineral Types')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('payments.total_weight', 'Total Weight')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('payments.total_amount', 'Total Amount')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('payments.payable_amount', 'Payable Amount')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('payments.date', 'Date')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t('payments.actions_title', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {payments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        #{payment.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.supplier_name || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {payment.mineral_types.map((type) => (
                          <Badge
                            key={type}
                            color={getMineralTypeColor(type)}
                            size="sm"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatWeight(payment.total_weight)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatAmount(payment.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      {formatAmount(payment.payable_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => onView(payment.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <span className="inline-flex items-center">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            {t('payments.view', 'View')}
                          </span>
                        </button>
                        <button
                          onClick={() => handlePrintClick(payment.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <span className="inline-flex items-center">
                            <PrinterIcon className="w-4 h-4 mr-1" />
                            {t('payments.print', 'Print')}
                          </span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
              {t('payments.print_description', 'Choose how you would like to access the payment receipt')}
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
                {t('payments.view_receipt', 'View Receipt')}
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
                {t('payments.download_receipt', 'Download Receipt')}
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

export default PaymentsTable;