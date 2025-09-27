// components/dashboard/minerals/tantalum/TantalumLabResultPrintModal.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { EyeIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../../../config/axiosInstance';
import { RootState } from '../../../../store/store';

interface TantalumLabResultPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  tantalumId: string;
}

const TantalumLabResultPrintModal: React.FC<TantalumLabResultPrintModalProps> = ({ isOpen, onClose, tantalumId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { selectedTantalum } = useSelector((state: RootState) => state.tantalums);
  
  // Get the Ta2O5 value - prioritize Alex Stewart, fallback to internal
  const defaultTa2O5 = selectedTantalum?.alex_stewart_ta2o5 ?? selectedTantalum?.internal_ta2o5 ?? null;
  
  // State for custom percentages
  const [customTa2O5, setCustomTa2O5] = useState<number | null>(defaultTa2O5);
  const [error, setError] = useState<string | null>(null);
  
  // Check if all required percentages are available
  const hasRequiredPercentages = (): boolean => {
    if (!selectedTantalum) return false;
    
    // Check if any of these required percentages are null or undefined
    return (
      customTa2O5 !== null &&
      selectedTantalum.nb_percentage !== null && 
      selectedTantalum.sn_percentage !== null && 
      selectedTantalum.fe_percentage !== null && 
      selectedTantalum.w_percentage !== null
    );
  };

  // List missing percentages
  const getMissingPercentages = (): string[] => {
    if (!selectedTantalum) return [];
    
    const missing: string[] = [];
    
    if (customTa2O5 === null) missing.push('Ta2O5');
    if (selectedTantalum.nb_percentage === null) missing.push('Nb');
    if (selectedTantalum.sn_percentage === null) missing.push('Sn');
    if (selectedTantalum.fe_percentage === null) missing.push('Fe');
    if (selectedTantalum.w_percentage === null) missing.push('W');
    
    return missing;
  };

  // Update the custom percentage when the selected tantalum changes
  useEffect(() => {
    if (selectedTantalum) {
      setCustomTa2O5(selectedTantalum?.alex_stewart_ta2o5 ?? selectedTantalum?.internal_ta2o5 ?? null);
    }
  }, [selectedTantalum]);

  const canPrint = hasRequiredPercentages();

  const handleViewReport = async () => {
    if (!canPrint) {
      const missing = getMissingPercentages();
      setError(t('tantalum.missing_percentages', 'Cannot print lab result slip. Missing values for: ') + missing.join(', '));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/reports/tantalum/${tantalumId}/lab-result-slip`, {
        params: { custom_ta2o5_percentage: customTa2O5 },
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
      console.error('Error viewing lab result report:', error);
      setError(t('tantalum.print_error', 'An error occurred while generating the report'));
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!canPrint) {
      const missing = getMissingPercentages();
      setError(t('tantalum.missing_percentages', 'Cannot print lab result slip. Missing values for: ') + missing.join(', '));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/reports/tantalum/${tantalumId}/lab-result-slip`, {
        params: { custom_ta2o5_percentage: customTa2O5 },
        responseType: 'blob'
      });
      
      // Create blob link to download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tantalum-lab-result-${selectedTantalum?.lot_number || tantalumId}.pdf`);
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
      console.error('Error downloading lab result report:', error);
      setError(t('tantalum.print_error', 'An error occurred while generating the report'));
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Display warning if any required percentages are missing
  const missingPercentages = getMissingPercentages();
  const hasMissingValues = missingPercentages.length > 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5 max-w-md w-full mx-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {t('tantalum.lab_result_print', 'Lab Result Slip')}
        </h3>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
            {t('tantalum.lab_result_description', 'The lab result slip for Tantalum lot number ')}
            <span className="font-medium">{selectedTantalum?.lot_number}</span>
            {t('tantalum.lab_result_customer_note', ' will be printed for the customer. Please ensure the percentages shown below are correct.')}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('tantalum.lab_result_note', 'Note: Modifying values here will not update the database. This is only for printing purposes.')}
          </p>
        </div>
        
        {hasMissingValues && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start">
              <ExclamationCircleIcon className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  {t('tantalum.missing_values', 'Missing Required Values')}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                  {t('tantalum.cannot_print_missing', 'Cannot print lab result slip. The following values are missing:')}
                </p>
                <ul className="list-disc list-inside text-xs text-yellow-600 dark:text-yellow-500 mt-1 ml-1">
                  {missingPercentages.map(missing => (
                    <li key={missing}>{missing}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tantalum.ta2o5_percentage', 'Ta2O5 Percentage')}
          </label>
          <input
            type="number"
            value={customTa2O5 === null ? '' : customTa2O5}
            onChange={(e) => setCustomTa2O5(e.target.value === '' ? null : parseFloat(e.target.value))}
            step="0.01"
            min="0"
            max="100"
            className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              customTa2O5 === null 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={t('tantalum.enter_percentage', 'Enter percentage')}
          />
          {customTa2O5 === null && (
            <p className="text-xs text-red-500 mt-1">
              {t('tantalum.ta2o5_required_print', 'Ta2O5 percentage is required')}
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tantalum.other_percentages', 'Other Percentages (from database)')}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Nb:</span>
              <span className={`font-medium ${selectedTantalum?.nb_percentage === null ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                {selectedTantalum?.nb_percentage !== null ? `${selectedTantalum?.nb_percentage}%` : 'Missing'}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Sn:</span>
              <span className={`font-medium ${selectedTantalum?.sn_percentage === null ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                {selectedTantalum?.sn_percentage !== null ? `${selectedTantalum?.sn_percentage}%` : 'Missing'}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Fe:</span>
              <span className={`font-medium ${selectedTantalum?.fe_percentage === null ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                {selectedTantalum?.fe_percentage !== null ? `${selectedTantalum?.fe_percentage}%` : 'Missing'}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">W:</span>
              <span className={`font-medium ${selectedTantalum?.w_percentage === null ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                {selectedTantalum?.w_percentage !== null ? `${selectedTantalum?.w_percentage}%` : 'Missing'}
              </span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md mb-4 flex items-start">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewReport}
            disabled={isLoading || !canPrint}
            className={`flex items-center justify-center px-4 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-all duration-200 ${(!canPrint || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <EyeIcon className="w-4 h-4 mr-2" />
            )}
            {t('tantalum.view_lab_result', 'View Lab Result Slip')}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadReport}
            disabled={isLoading || !canPrint}
            className={`flex items-center justify-center px-4 py-2.5 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-all duration-200 ${(!canPrint || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-green-500 border-t-transparent rounded-full"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            {t('tantalum.download_lab_result', 'Download Lab Result Slip')}
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

export default TantalumLabResultPrintModal;