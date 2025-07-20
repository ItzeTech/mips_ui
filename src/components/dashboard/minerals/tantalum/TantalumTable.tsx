// components/dashboard/minerals/tantalum/TantalumTable.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  PencilIcon,
  CalendarDaysIcon,
  ScaleIcon,
  UserIcon,
  BeakerIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { StockStatus, FinanceStatus } from '../../../../features/minerals/tantalumSlice';
import { useSelectedMinerals } from '../../../../hooks/useSelectedMinerals';

interface TantalumTableProps {
  tantalums: any[];
  onView: (tantalum: any) => void;
  onEdit: (tantalum: any) => void;
}

const TantalumTable: React.FC<TantalumTableProps> = ({ tantalums, onView, onEdit }) => {
  const { t } = useTranslation();
  const { isSelected, selectTantalum, deselectMineral } = useSelectedMinerals();

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      case 'advance given':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'exported':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleToggleSelect = (tantalum: any) => {
    if (isSelected(tantalum.id, 'tantalum')) {
      deselectMineral(tantalum.id, 'tantalum');
    } else {
      selectTantalum(tantalum);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-5">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-10">
                <span className="sr-only">Selection</span>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tantalum.lot_info', 'Lot Information')}
              </th>
              <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tantalum.supplier', 'Supplier')}
              </th>
              <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tantalum.dates', 'Dates')}
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tantalum.status', 'Status')}
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tantalum.actions', 'Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence mode="popLayout">
              {tantalums.map((tantalum: any, index: number) => (
                <motion.tr
                  key={tantalum.id}
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
                    backgroundColor: isSelected(tantalum.id, 'tantalum') 
                      ? "rgba(79, 70, 229, 0.1)" 
                      : "rgba(79, 70, 229, 0.05)",
                    transition: { duration: 0.2 }
                  }}
                  className={`group hover:shadow-md transition-all duration-200 ${
                    isSelected(tantalum.id, 'tantalum') ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                  }`}
                >
                  {/* Selection checkbox */}
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <div 
                        onClick={() => handleToggleSelect(tantalum)}
                        className={`w-4 h-4 rounded-md border cursor-pointer flex items-center justify-center transition-colors duration-200 ${
                          isSelected(tantalum.id, 'tantalum')
                            ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400'
                        }`}
                      >
                        {isSelected(tantalum.id, 'tantalum') && (
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
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                          <BeakerIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                      </motion.div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {tantalum.lot_number}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center flex-wrap gap-1 mt-0.5">
                          <div className="flex items-center">
                            <ScaleIcon className="w-3 h-3 mr-0.5" />
                            {tantalum.net_weight} kg
                          </div>
                          {tantalum.internal_ta2o5 !== null && (
                            <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                              Ta₂O₅: {tantalum.internal_ta2o5}%
                            </span>
                          )}
                          
                          {/* Mobile-only supplier info */}
                          <div className="md:hidden mt-0.5 w-full">
                            {tantalum.supplier_name && (
                              <div className="flex items-center text-xs text-gray-500">
                                <UserIcon className="w-2.5 h-2.5 mr-0.5 text-blue-500" />
                                {tantalum.supplier_name}
                              </div>
                            )}
                          </div>
                          
                          {/* Mobile-only date info */}
                          <div className="sm:hidden mt-0.5 w-full">
                            <div className="flex items-center text-xs text-gray-500">
                              <CalendarDaysIcon className="w-2.5 h-2.5 mr-0.5 text-indigo-500" />
                              {formatDate(tantalum.date_of_sampling)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Supplier Info - Hidden on mobile */}
                  <td className="hidden md:table-cell px-3 py-3">
                    {tantalum.supplier_name ? (
                      <div>
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium flex items-center">
                          <UserIcon className="w-3 h-3 mr-1 text-blue-500" />
                          {tantalum.supplier_name}
                        </div>
                        {tantalum.supplier_id && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            ID: {tantalum.supplier_id.substring(0, 6)}...
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                        {t('tantalum.no_supplier_info', 'No supplier info')}
                      </span>
                    )}
                  </td>
                  
                  {/* Dates - Hidden on mobile, more compact layout */}
                  <td className="hidden sm:table-cell px-3 py-3">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <CalendarDaysIcon className="w-3 h-3 mr-1 text-indigo-500" />
                        <span className="font-medium">Samp:</span>
                        <span className="ml-1">{formatDate(tantalum.date_of_sampling)}</span>
                      </div>
                      
                      {tantalum.date_of_delivery && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <span className="w-3 h-3 mr-1"></span>
                          <span>Del: {formatDate(tantalum.date_of_delivery)}</span>
                        </div>
                      )}
                      
                      {tantalum.has_alex_stewart && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <span className="w-3 h-3 mr-1"></span>
                          <span>A.S.: {formatDate(tantalum.date_of_alex_stewart)}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Status - Horizontal layout */}
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className={`px-1.5 py-0.5 text-xs leading-5 font-medium rounded-md ${getStockStatusColor(tantalum.stock_status)}`}>
                        {t(`tantalum.status_${tantalum.stock_status}`, tantalum.stock_status)}
                      </span>
                      <span className={`px-1.5 py-0.5 text-xs leading-5 font-medium rounded-md ${getFinanceStatusColor(tantalum.finance_status)}`}>
                        {t(`tantalum.finance_${tantalum.finance_status}`, tantalum.finance_status)}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onView(tantalum)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
                        title={t('tantalum.view', 'View Details')}
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(tantalum)}
                        className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200"
                        title={t('tantalum.edit', 'Edit')}
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
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
  );
};

export default TantalumTable;