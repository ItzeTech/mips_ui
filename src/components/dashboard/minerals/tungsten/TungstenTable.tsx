// components/dashboard/minerals/tungsten/TungstenTable.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, PencilIcon, CalendarDaysIcon, ScaleIcon, UserIcon, RectangleGroupIcon, CheckIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { StockStatus, FinanceStatus } from '../../../../features/minerals/tungstenSlice';
import { useSelectedMinerals } from '../../../../hooks/useSelectedMinerals';
import TungstenPrintModal from './TungstenPrintModal';
import { RoleGuard } from '../../../common/RoleGuard';

interface TungstenTableProps {
  tungstens: any[];
  onView: (tungsten: any) => void;
  onEdit: (tungsten: any) => void;
}

const TungstenTable: React.FC<TungstenTableProps> = ({ tungstens, onView, onEdit }) => {
  const { t } = useTranslation();
  const { isSelected, selectTungsten, deselectMineral } = useSelectedMinerals();

    // Print modal state
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [selectedTungstenId, setSelectedTungstenId] = useState<string | null>(null);

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number | null, decimals = 2) => {
    if (num === null) return '—';
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const getStockStatusColor = (status: StockStatus) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'withdrawn':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'resampled':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getFinanceStatusColor = (status: FinanceStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'unpaid':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'invoiced':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'exported':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleToggleSelect = (tungsten: any) => {
    if (isSelected(tungsten.id, 'tungsten')) {
      deselectMineral(tungsten.id, 'tungsten');
    } else {
      selectTungsten(tungsten);
    }
  };


  const handlePrintClick = (tungstenId: string) => {
    setSelectedTungstenId(tungstenId);
    setPrintModalOpen(true);
  };

  return (
    <>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-10">
                  <span className="sr-only">Selection</span>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('tungsten.lot_info', 'Lot Information')}
                </th>
                <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('tungsten.supplier', 'Supplier')}
                </th>
                <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('tungsten.dates', 'Dates')}
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('tungsten.status', 'Status')}
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('tungsten.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence mode="popLayout">
                {tungstens.map((tungsten: any, index: number) => (
                  <motion.tr
                    key={tungsten.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05, type: "spring", stiffness: 100 } }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                    whileHover={{ 
                      backgroundColor: isSelected(tungsten.id, 'tungsten') ? "rgba(5, 150, 105, 0.1)" : "rgba(5, 150, 105, 0.05)", 
                      transition: { duration: 0.2 } 
                    }}
                    className={`group hover:shadow-md transition-all duration-200 ${
                      isSelected(tungsten.id, 'tungsten') ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                    }`}
                  >
                    {/* Selection checkbox */}
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div 
                          onClick={() => handleToggleSelect(tungsten)} 
                          className={`w-4 h-4 rounded-md border cursor-pointer flex items-center justify-center transition-colors duration-200 ${
                            isSelected(tungsten.id, 'tungsten') 
                              ? 'bg-emerald-600 border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-400'
                          }`}
                        >
                          {isSelected(tungsten.id, 'tungsten') && (
                            <CheckIcon className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Lot Information */}
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <motion.div 
                          className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center shadow-md">
                            <RectangleGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                        </motion.div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {tungsten.lot_number}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center flex-wrap gap-1 mt-0.5">
                            <div className="flex items-center">
                              <ScaleIcon className="w-3 h-3 mr-0.5" />
                              {formatNumber(tungsten.net_weight)} kg
                            </div>
                            {tungsten.wo3_percentage !== null && (
                              <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-md text-xs">
                                WO3: {tungsten.wo3_percentage}%
                              </span>
                            )}
                            
                            {/* Mobile-only supplier info */}
                            <div className="md:hidden mt-0.5 w-full">
                              {tungsten.supplier_name && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <UserIcon className="w-2.5 h-2.5 mr-0.5 text-emerald-500" />
                                  {tungsten.supplier_name}
                                </div>
                              )}
                            </div>
                            
                            {/* Mobile-only date info */}
                            <div className="sm:hidden mt-0.5 w-full">
                              <div className="flex items-center text-xs text-gray-500">
                                <CalendarDaysIcon className="w-2.5 h-2.5 mr-0.5 text-emerald-500" />
                                {formatDate(tungsten.date_of_sampling)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Supplier Info - Hidden on mobile */}
                    <td className="hidden md:table-cell px-3 py-3">
                      {tungsten.supplier_name ? (
                        <div>
                          <div className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium flex items-center">
                            <UserIcon className="w-3 h-3 mr-1 text-emerald-500" />
                            {tungsten.supplier_name}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                          {t('tungsten.no_supplier_info', 'No supplier info')}
                        </span>
                      )}
                    </td>
                    
                    {/* Dates - Hidden on mobile, more compact layout */}
                    <td className="hidden sm:table-cell px-3 py-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center text-gray-900 dark:text-white">
                          <CalendarDaysIcon className="w-3 h-3 mr-1 text-emerald-500" />
                          <span className="font-medium">Samp:</span>
                          <span className="ml-1">{formatDate(tungsten.date_of_sampling)}</span>
                        </div>
                        
                        {tungsten.date_of_delivery && (
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <span className="w-3 h-3 mr-1"></span>
                            <span>Del: {formatDate(tungsten.date_of_delivery)}</span>
                          </div>
                        )}
                        
                        {tungsten.has_alex_stewart && (
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <span className="w-3 h-3 mr-1"></span>
                            <span>A.S.: {formatDate(tungsten.date_of_alex_stewart)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Status - Horizontal layout */}
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span className={`px-1.5 py-0.5 text-xs leading-5 font-medium rounded-md ${getStockStatusColor(tungsten.stock_status)}`}>
                          {t(`tungsten.status_${tungsten.stock_status}`, tungsten.stock_status) as string}
                        </span>
                        <span className={`px-1.5 py-0.5 text-xs leading-5 font-medium rounded-md ${getFinanceStatusColor(tungsten.finance_status)}`}>
                          {t(`tungsten.finance_${tungsten.finance_status}`, tungsten.finance_status) as string}
                        </span>
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onView(tungsten)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all duration-200"
                          title={t('tungsten.view', 'View Details')}
                        >
                          <EyeIcon className="w-3.5 h-3.5" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(tungsten)}
                          className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200"
                          title={t('tungsten.edit', 'Edit')}
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                        </motion.button>

                        <RoleGuard allowedRoles={['Finance Officer', 'Manager']}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePrintClick(tungsten.id)}
                            className="p-1.5 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-100 dark:bg-purple-900/30 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all duration-200"
                            title={t('tungsten.print', 'Print Report')}
                          >
                            <PrinterIcon className="w-3.5 h-3.5" />
                          </motion.button>
                        </RoleGuard>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
      {/* Print Modal */}
      {selectedTungstenId && (
        <TungstenPrintModal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          tungstenId={selectedTungstenId}
        />
      )}
    </>
  );
};

export default TungstenTable;