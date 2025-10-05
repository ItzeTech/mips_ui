import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  PrinterIcon,
  CubeIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../../config/axiosInstance';

interface SalesTableProps {
  sales: any[];
  onView: (saleId: string) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ sales, onView }) => {
  const { t } = useTranslation();
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format number helper
  const formatNumber = (num: number | null, decimals = 2) => {
    if (num === null) return '—';
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Get color for mineral type
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

  const handlePrintClick = (saleId: string) => {
    setSelectedSaleId(saleId);
    setPrintModalOpen(true);
  };

  const handleViewReport = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/reports/sales/${selectedSaleId}/sales-report`, {
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
      const response = await axiosInstance.get(`/reports/sales/${selectedSaleId}/sales-report`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-report-${selectedSaleId}.pdf`);
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
    <>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('sales.sn', 'SN')}
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('sales.mineral_info', 'Mineral Info')}
                </th>
                <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('sales.buyer', 'Buyer')}
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('sales.amounts', 'Amounts')}
                </th>
                <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('sales.date', 'Date')}
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('sales.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence mode="popLayout">
                {sales.map((sale, index) => (
                  <motion.tr
                    key={sale.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: -10,
                      transition: { duration: 0.2 }
                    }}
                    whileHover={{ 
                      backgroundColor: "rgba(59, 130, 246, 0.05)",
                      transition: { duration: 0.2 }
                    }}
                    className="group hover:shadow-md transition-all duration-200"
                  >
                    {/* SN (Sequential Number) */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {index + 1}
                      </div>
                    </td>
                    
                    {/* Mineral Info */}
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <motion.div 
                          className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                            <ShoppingCartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                        </motion.div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            <span className={`px-1.5 py-0.5 text-xs leading-5 font-medium rounded-md mr-2 ${getMineralTypeColor(sale.mineral_type)}`}>
                               {translateMineral(sale.mineral_type).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center flex-wrap gap-1 mt-0.5">
                            <div className="flex items-center">
                              <ScaleIcon className="w-3 h-3 mr-0.5" />
                              {formatNumber(sale.total_weight)} kg
                            </div>
                            <div className="flex items-center ml-2">
                              <CubeIcon className="w-3 h-3 mr-0.5" />
                              {sale.minerals?.length || 0} items
                            </div>
                            
                            {/* Mobile-only buyer info */}
                            <div className="md:hidden mt-0.5 w-full">
                              {sale.buyer ? (
                                <div className="flex items-center text-xs text-gray-500">
                                  <UserIcon className="w-2.5 h-2.5 mr-0.5 text-blue-500" />
                                  {sale.buyer}
                                </div>
                              ) : (
                                <div className="flex items-center text-xs text-gray-400 italic">
                                  <UserIcon className="w-2.5 h-2.5 mr-0.5 text-gray-400" />
                                  No buyer
                                </div>
                              )}
                            </div>
                            
                            {/* Mobile-only date info */}
                            <div className="sm:hidden mt-0.5 w-full">
                              <div className="text-xs text-gray-500">
                                {formatDate(sale.created_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Buyer - Hidden on mobile */}
                    <td className="hidden md:table-cell px-3 py-3">
                      {sale.buyer ? (
                        <div className="text-sm text-gray-900 dark:text-white">
                          {sale.buyer}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                          {t('sales.no_buyer', 'No buyer specified')}
                        </span>
                      )}
                    </td>
                    
                    {/* Amounts */}
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <CurrencyDollarIcon className="w-3.5 h-3.5 mr-1 text-green-500" />
                          ${formatNumber(sale.total_amount)}
                        </div>
                        
                        {sale.net_sales_amount !== null && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t('common.net', 'NET')}: ${formatNumber(sale.net_sales_amount)}
                          </div>
                        )}
                        
                        {/* Payment Status Badge */}
                        <div className="mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            sale.payment_status === 'FULLY_PAID' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                            sale.payment_status === 'PARTIALLY_PAID' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                            'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                            {sale.payment_status === 'FULLY_PAID' ? t('sales.paid', 'Paid') :
                            sale.payment_status === 'PARTIALLY_PAID' ? t('sales.partial', 'Partial') :
                            t('sales.unpaid', 'Unpaid')}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Date - Hidden on mobile */}
                    <td className="hidden sm:table-cell px-3 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(sale.created_at)}
                      </div>
                      {sale.updated_at && sale.updated_at !== sale.created_at && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t('common.updated', 'Updated')}: {formatDate(sale.updated_at)}
                        </div>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onView(sale.id)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
                          title={t('sales.view', 'View Details')}
                        >
                          <EyeIcon className="w-3.5 h-3.5" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePrintClick(sale.id)}
                          className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200"
                          title={t('sales.print', 'Print')}
                        >
                          <PrinterIcon className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
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
              {t('sales.print_options', 'Print Options')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {t('sales.print_description', 'Choose how you would like to access the sales report')}
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
                {t('sales.view_report', 'View Report')}
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
                {t('sales.download_report', 'Download Report')}
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

export default SalesTable;