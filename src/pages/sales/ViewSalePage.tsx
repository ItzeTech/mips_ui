// pages/ViewSalePage.tsx (with error display)
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon,
  PlusIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

import { useSales } from '../../hooks/useSales';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import SaleHeader from '../../components/dashboard/sales/SaleHeader';
import SaleDetails from '../../components/dashboard/sales/SaleDetails';
import SaleMinerals from '../../components/dashboard/sales/SaleMinerals';
import AddMineralModal from '../../components/dashboard/sales/AddMineralModal';
import EditSaleModal from '../../components/dashboard/sales/EditSaleModal';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';


const ViewSalePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saleId } = useParams<{ saleId: string }>();
  
  const { loadSaleById, selectedSale, status } = useSales();
  
  const { error: err, addMineralsStatus, removeMineralStatus, updateStatus } = useSelector((state: RootState) => state.sales);
  
  const [showAddMineralModal, setShowAddMineralModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showRemoveSuccessMessage, setShowRemoveSuccessMessage] = useState(false);
  const [showRemoveErrorMessage, setShowRemoveErrorMessage] = useState(false);
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false);
  const [showEditSaleModal, setShowEditSaleModal] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Only fetch on initial mount or when saleId changes
  useEffect(() => {
    if (saleId && (isInitialLoad || !selectedSale || selectedSale.id !== saleId)) {
      loadSaleById(saleId);
      setIsInitialLoad(false);
    }
  }, [saleId, isInitialLoad, selectedSale, loadSaleById]);


  // Handle showing success message
  useEffect(() => {
    if (addMineralsStatus === 'succeeded') {
      setShowSuccessMessage(true);
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [addMineralsStatus]);

  useEffect(() => {
  if (updateStatus === 'succeeded') {
    setShowUpdateSuccessMessage(true);
    setShowEditSaleModal(false); // Close the edit modal on success
    
    // Hide success message after 5 seconds
    const timer = setTimeout(() => {
      setShowUpdateSuccessMessage(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }
}, [updateStatus]);

  useEffect(() => {
  // For success
  if (removeMineralStatus === 'succeeded') {
    setShowRemoveSuccessMessage(true);
    setShowRemoveErrorMessage(false);
    
    // Hide success message after 5 seconds
    const timer = setTimeout(() => {
      setShowRemoveSuccessMessage(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }
  
  // For error
  if (removeMineralStatus === 'failed') {
    setShowRemoveErrorMessage(true);
    setShowRemoveSuccessMessage(false);
    
    // Hide error message after 5 seconds
    const timer = setTimeout(() => {
      setShowRemoveErrorMessage(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }
}, [removeMineralStatus]);
  
  const handleGoBack = useCallback(() => {
    navigate('/sales');
  }, [navigate]);
  
  const handleEdit = useCallback(() => {
    setShowEditSaleModal(true);
  }, []);
  
  const handleAddMineral = useCallback(() => {
    setShowAddMineralModal(true);
  }, []);
  
  const handlePrint = useCallback(() => {
    window.print();
  }, []);
  
  if (status === 'loading' && !selectedSale) {
    return <LoadingSkeleton />;
  }
  
  if (!selectedSale && status !== 'loading') {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('sales.sale_not_found', 'Sale not found')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('sales.sale_not_found_desc', 'The sale you are looking for does not exist or has been removed.')}
          </p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('sales.go_back', 'Go Back to Sales')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleGoBack}
              className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('sales.view_title', 'View Sale')}
            </h1>
          </div>
          
          {/* Display error message if it exists */}
          {err && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              <div className="flex items-center">
                <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('sales.error', 'Error')}</p>
                  <p className="text-sm">{err ? err.replace("_", " "): ''}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success message for adding minerals */}
          {showSuccessMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('sales.success', 'Success')}</p>
                  <p className="text-sm">{t('sales.minerals_added', 'Minerals have been successfully added to the sale.')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success message for removing minerals */}
          {showRemoveSuccessMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('sales.success', 'Success')}</p>
                  <p className="text-sm">{t('sales.mineral_removed', 'Mineral has been successfully removed from the sale.')}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message for removing minerals */}
          {showRemoveErrorMessage && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              <div className="flex items-center">
                <XCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('sales.error', 'Error')}</p>
                  <p className="text-sm">
                    {err || t('sales.mineral_remove_error', 'Failed to remove mineral from the sale.')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showUpdateSuccessMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('sales.success', 'Success')}</p>
                  <p className="text-sm">{t('sales.sale_updated', 'Sale details have been successfully updated.')}</p>
                </div>
              </div>
            </div>
          )}
          
          <SaleHeader 
            sale={selectedSale}
            onEdit={handleEdit}
            onPrint={handlePrint}
            onAddMineral={handleAddMineral}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('sales.minerals', 'Minerals')}
                  </h2>
                  <button
                    onClick={handleAddMineral}
                    className="flex items-center text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <PlusIcon className="w-3.5 h-3.5 mr-1" />
                    {t('sales.add_mineral', 'Add Mineral')}
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <SaleMinerals sale={selectedSale} />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('sales.sale_details', 'Sale Details')}
                </h2>
              </div>
              
              <div className="p-4">
                <SaleDetails sale={selectedSale} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <AddMineralModal
        isOpen={showAddMineralModal}
        onClose={() => setShowAddMineralModal(false)}
        sale={selectedSale}
      />
      
      <EditSaleModal
        isOpen={showEditSaleModal}
        onClose={() => setShowEditSaleModal(false)}
        sale={selectedSale}
      />
    </div>
  );
};

export default ViewSalePage;