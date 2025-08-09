// components/dashboard/minerals/tantalum/TantalumPrintModal.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { EyeIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../../../config/axiosInstance';

interface TantalumPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  tantalumId: string;
}

const TantalumPrintModal: React.FC<TantalumPrintModalProps> = ({ isOpen, onClose, tantalumId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewReport = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/reports/tantalum/${tantalumId}/payment-slip`, {
        responseType: 'blob'
      });
      
      // Create blob URL and open in new window
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new tab using the browser's built-in PDF viewer
      window.open(url, '_blank');
      
      onClose();
      setIsLoading(false);
    } catch (error) {
      console.error('Error viewing report:', error);
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/reports/tantalum/${tantalumId}/payment-slip`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tantalum-report-${tantalumId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      onClose();
      setIsLoading(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5 max-w-md w-full mx-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {t('tantalum.print_options', 'Print Options')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {t('tantalum.print_description', 'Choose how you would like to access the mineral report')}
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
            {t('tantalum.view_report', 'View Report')}
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
            {t('tantalum.download_report', 'Download Report')}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex items-center justify-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200"
          >
            {t('common.cancel', 'Cancel')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TantalumPrintModal;