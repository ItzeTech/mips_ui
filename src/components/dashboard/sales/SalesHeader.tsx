// components/dashboard/sales/SalesHeader.tsx
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  CubeIcon,
  ShoppingCartIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon, EyeIcon } from '@heroicons/react/20/solid';
import axiosInstance from '../../../config/axiosInstance';

interface SalesHeaderProps {
  onCreateClick: (mineralType: string) => void;
}

const SalesHeader: React.FC<SalesHeaderProps> = ({ onCreateClick }) => {
  const { t } = useTranslation();

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleOpenDateModal = () => {
    setDateModalOpen(true);
  };

  const handleContinueToPrint = () => {
    if (!startDate || !endDate) return;
    setDateModalOpen(false);
    setPrintModalOpen(true);
  };

  const handleViewReport = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/reports/sales-summary?start_date=${startDate}&end_date=${endDate}`,
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      setPrintModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error viewing sales summary:', error);
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  const handleDownloadReport = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/reports/sales-summary?start_date=${startDate}&end_date=${endDate}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-summary-${startDate}-to-${endDate}.pdf`);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      setPrintModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error downloading sales summary:', error);
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  return (
    <div className="mb-5 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <ShoppingCartIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('sales.title', 'Sales Management')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t('sales.subtitle', 'Manage your mineral sales')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Print Income Statement Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenDateModal}
            className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <PrinterIcon className="w-4 h-4 mr-2" />
            {t('sales.print_income_statement', 'Print Income Statement')}
          </motion.button>

          {/* New Sale Dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button as={motion.button}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span>{t('sales.create_new', 'New Sale')}</span>
                <ChevronDownIcon className="ml-1 sm:ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition as={Fragment} {...{/* same as your code */}}>
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none z-10">
                <div className="px-1 py-1">
                  {/* ... mineral sale items same as before ... */}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-200'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => onCreateClick('TANTALUM')}
                      >
                        <CubeIcon className="mr-2 h-5 w-5 text-blue-500" aria-hidden="true" />
                        {t('sales.create_tantalum', 'Tantalum Sale')}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-gray-200'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => onCreateClick('TIN')}
                      >
                        <CubeIcon className="mr-2 h-5 w-5 text-amber-500" aria-hidden="true" />
                        {t('sales.create_tin', 'Tin Sale')}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-200'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => onCreateClick('TUNGSTEN')}
                      >
                        <CubeIcon className="mr-2 h-5 w-5 text-green-500" aria-hidden="true" />
                        {t('sales.create_tungsten', 'Tungsten Sale')}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Date Selection Modal */}
      {dateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('sales.select_dates', 'Select Date Range')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('sales.start_date', 'Start Date')}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('sales.end_date', 'End Date')}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setDateModalOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleContinueToPrint}
                disabled={!startDate || !endDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {t('common.continue', 'Continue')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Print Options Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t('sales.print_options', 'Print Options')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {t('sales.print_description', 'Choose how you would like to access the sales summary')}
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
    </div>
  );
};

export default SalesHeader;
