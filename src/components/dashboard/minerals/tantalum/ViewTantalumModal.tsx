// components/dashboard/minerals/ViewTantalumModal.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  EyeIcon, 
  CalendarDaysIcon, 
  UserIcon, 
  ScaleIcon, 
  CircleStackIcon, 
  CurrencyDollarIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { RootState } from '../../../../store/store';
import { RoleGuard } from '../../../common/RoleGuard';
import { Role } from '../../../../types/roles';
import TantalumPrintModal from './TantalumPrintModal';

interface ViewTantalumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewTantalumModal: React.FC<ViewTantalumModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { selectedTantalum } = useSelector((state: RootState) => state.tantalums);
  
  const [activeTab, setActiveTab] = useState<'details' | 'lab' | 'financial'>('details');
  const [printModalOpen, setPrintModalOpen] = useState(false);


  // Add this inside the component before the return statement
  const handlePrint = () => {
    if (selectedTantalum) {
      setPrintModalOpen(true);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (value: number | null | undefined, suffix = '') => {
    if (value === null || value === undefined) return '—';
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}${suffix}`;
  };

  const getStockStatusColor = (status: string | undefined) => {
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

  const getFinanceStatusColor = (status: string | undefined) => {
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

  const renderFooter = () => (
    <motion.div 
      className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between"
      variants={itemVariants}
    >
      <RoleGuard allowedRoles={['Finance Officer', 'Manager']}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
        >
          <PrinterIcon className="w-5 h-5 mr-2" />
          {t('tantalum.print_report', 'Print Report')}
        </motion.button>
      </RoleGuard>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
      >
        {t('common.close', 'Close')}
      </motion.button>
    </motion.div>
  );

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        duration: 0.4, 
        bounce: 0.3,
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 10,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    }
  };

  const tabVariants = {
    inactive: { 
      opacity: 0.7,
      y: 5,
      backgroundColor: "rgba(229, 231, 235, 0.5)"
    },
    active: { 
      opacity: 1,
      y: 0,
      scale: 1.05,
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.2 } 
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  if (!selectedTantalum) return null;

  const renderDetailRow = (
    label: string, 
    value: React.ReactNode, 
    icon?: React.ReactNode, 
    deniedRoles?: Role[]
  ) => (
    <RoleGuard deniedRoles={deniedRoles}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-b-0 space-y-1 sm:space-y-0">
        <div className="flex items-center">
          {icon}
          <span className="text-gray-600 dark:text-gray-400 ml-2 text-xs sm:text-sm">{label}</span>
        </div>
        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base ml-6 sm:ml-0 break-words">{value}</span>
      </div>
    </RoleGuard>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <motion.div 
                className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-4">
                    <EyeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('tantalum.view_details', 'Tantalum Details')}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                        {selectedTantalum.lot_number}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStockStatusColor(selectedTantalum.stock_status)}`}>
                        {t(`tantalum.status_${selectedTantalum.stock_status}`, selectedTantalum.stock_status)}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>
              
              {/* Tabs */}
              <motion.div
                className="flex items-center justify-center space-x-4 px-6 pt-6"
                variants={itemVariants}
              >
                
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === 'details' ? 'active' : 'inactive'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2.5 rounded-xl flex items-center ${
                    activeTab === 'details' 
                    ? 'text-indigo-700 dark:text-indigo-300 font-medium shadow-md' 
                      : 'text-gray-600 dark:text-gray-400'
                    }`}
                    >
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  {t('tantalum.basic_info', 'Basic Info')}
                </motion.button>
                
                <RoleGuard
                  allowedRoles={['Lab Technician', 'Manager']}
                >
                  <motion.button
                    variants={tabVariants}
                    animate={activeTab === 'lab' ? 'active' : 'inactive'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('lab')}
                    className={`px-4 py-2.5 rounded-xl flex items-center ${
                      activeTab === 'lab' 
                        ? 'text-indigo-700 dark:text-indigo-300 font-medium shadow-md' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <CircleStackIcon className="w-5 h-5 mr-2" />
                    {t('tantalum.lab_analysis', 'Lab Analysis')}
                  </motion.button>
                </RoleGuard>
                
                <RoleGuard
                  allowedRoles={['Finance Officer', 'Manager']}
                >
                  <motion.button
                    variants={tabVariants}
                    animate={activeTab === 'financial' ? 'active' : 'inactive'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('financial')}
                    className={`px-4 py-2.5 rounded-xl flex items-center ${
                      activeTab === 'financial' 
                        ? 'text-indigo-700 dark:text-indigo-300 font-medium shadow-md' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                    {t('tantalum.financial_details', 'Financials')}
                  </motion.button>
                </RoleGuard>
              </motion.div>
              
              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar ">
                <AnimatePresence mode="wait">
                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="space-y-1">
                        {renderDetailRow(
                          t('tantalum.lot_number', 'Lot Number'),
                          selectedTantalum.lot_number,
                          <DocumentTextIcon className="w-4 h-4 text-indigo-500" />
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.net_weight', 'Net Weight'),
                          formatNumber(selectedTantalum.net_weight, ' kg'),
                          <ScaleIcon className="w-4 h-4 text-indigo-500" />
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.supplier', 'Supplier'),
                          selectedTantalum.supplier_name || '—',
                          <UserIcon className="w-4 h-4 text-indigo-500" />,
                          ['Lab Technician']
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.date_of_delivery', 'Date of Delivery'),
                          formatDate(selectedTantalum.date_of_delivery),
                          <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.date_of_sampling', 'Date of Sampling'),
                          formatDate(selectedTantalum.date_of_sampling),
                          <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.date_of_alex_stewart', 'Date of Alex Stewart'),
                          formatDate(selectedTantalum.date_of_alex_stewart),
                          <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.has_alex_stewart', 'Has Alex Stewart'),
                          selectedTantalum.has_alex_stewart 
                            ? t('common.yes', 'Yes') 
                            : t('common.no', 'No'),
                          <InformationCircleIcon className="w-4 h-4 text-indigo-500" />
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.stock_status_label', 'Stock Status'),
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStockStatusColor(selectedTantalum.stock_status)}`}>
                            {t(`tantalum.status_${selectedTantalum.stock_status}`, selectedTantalum.stock_status)}
                          </span>,
                          <CheckBadgeIcon className="w-4 h-4 text-indigo-500" />
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.stock_status_changed', 'Stock Status Changed At'),
                          formatDate(selectedTantalum.stock_status_changed_date),
                          <ArrowPathIcon className="w-4 h-4 text-indigo-500" />
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.finance_status_label', 'Finance Status'),
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getFinanceStatusColor(selectedTantalum.finance_status)}`}>
                            {t(`tantalum.finance_${selectedTantalum.finance_status}`, selectedTantalum.finance_status)}
                          </span>,
                          <CurrencyDollarIcon className="w-4 h-4 text-indigo-500" />
                        )}
                        
                        {renderDetailRow(
                          t('tantalum.finance_status_changed', 'Finance Status Changed At'),
                          formatDate(selectedTantalum.finance_status_changed_date),
                          <ArrowPathIcon className="w-4 h-4 text-indigo-500" />
                        )}

                      </div>
                    </motion.div>
                  )}
                  
                  {activeTab === 'lab' && (
                    <motion.div
                      key="lab"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Internal Analysis */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <CircleStackIcon className="w-5 h-5 mr-2 text-indigo-500" />
                          {t('tantalum.internal_analysis', 'Internal Analysis')}
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ta2O5</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.internal_ta2o5, '%')}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nb2O5</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.internal_nb2o5, '%')}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nb %</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.nb_percentage, '%')}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sn %</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.sn_percentage, '%')}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fe %</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.fe_percentage, '%')}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">W %</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.w_percentage, '%')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Alex Stewart Analysis */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <ArrowPathIcon className="w-5 h-5 mr-2 text-indigo-500" />
                          {t('tantalum.alex_stewart_analysis', 'Alex Stewart Analysis')}
                          {!selectedTantalum.has_alex_stewart && (
                            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                              {t('tantalum.not_available', 'Not available')}
                            </span>
                          )}
                        </h3>
                        
                        {selectedTantalum.has_alex_stewart ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ta2O5</div>
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatNumber(selectedTantalum.alex_stewart_ta2o5, '%')}
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nb2O5</div>
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatNumber(selectedTantalum.alex_stewart_nb2o5, '%')}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
                            {t('tantalum.no_alex_stewart_data', 'No Alex Stewart analysis data available')}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {activeTab === 'financial' && (
                    <motion.div
                      key="financial"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Pricing Information */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <CurrencyDollarIcon className="w-5 h-5 mr-2 text-indigo-500" />
                          {t('tantalum.pricing', 'Pricing Information')}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.price_per_percentage', 'Price Per %')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.price_per_percentage)}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.purchase_ta2o5_percentage', 'Purchase Ta2O5 %')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.purchase_ta2o5_percentage, '%')}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.unit_price', 'Unit Price')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.unit_price)}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.exchange_rate', 'Exchange Rate')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.exchange_rate)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Fees and Charges */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <ArrowPathIcon className="w-5 h-5 mr-2 text-indigo-500" />
                          {t('tantalum.fees_charges', 'Fees & Charges')}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.rra', 'RRA')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.rra)}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.rma', 'RMA')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.rma)}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.inkomane_fee', 'Inkomane Fee (RWF)')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.inkomane_fee)}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.advance', 'Advance')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.advance)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amounts */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <DocumentTextIcon className="w-5 h-5 mr-2 text-indigo-500" />
                          {t('tantalum.amounts', 'Amounts')}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.price_of_tag', 'Price of Tag (RWF)')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.price_of_tag_per_kg_rwf)}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.total_amount', 'Total Amount')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.total_amount)}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.total_charge', 'Total Charge')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.total_charge)}
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {t('tantalum.net_amount', 'Net Amount')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatNumber(selectedTantalum.net_amount)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Footer */}
              {renderFooter()}
              {selectedTantalum && (
                <TantalumPrintModal
                  isOpen={printModalOpen}
                  onClose={() => setPrintModalOpen(false)}
                  tantalumId={selectedTantalum.id}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewTantalumModal;