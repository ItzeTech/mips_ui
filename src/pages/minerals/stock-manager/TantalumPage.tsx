// pages/TantalumPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';

import { 
  fetchTantalums, 
  setSelectedTantalum, 
  setPagination,
  Tantalum, 
  StockStatus,
  FinanceStatus
} from '../../../features/minerals/tantalumSlice';

import { 
  PlusIcon, 
  EyeIcon, 
  PencilIcon,
  CalendarDaysIcon,
  ScaleIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  UserIcon,
  BeakerIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

import CreateTantalumModal from '../../../components/dashboard/minerals/tantalum/CreateTantalumModal';
import EditTantalumModal from '../../../components/dashboard/minerals/tantalum/EditTantalumModal';
import ViewTantalumModal from '../../../components/dashboard/minerals/tantalum/ViewTantalumModal';
import LoadingSkeleton from '../../../components/common/LoadingSkeleton';

const TantalumPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const { tantalums, status, pagination } = useSelector((state: RootState) => state.tantalums);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | StockStatus>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTantalums({ page: pagination.page, limit: pagination.limit }));
  }, [dispatch, pagination.page, pagination.limit]);

  // Filter tantalums based on search term and status filter
  const filteredTantalums = useMemo(() => {
    return tantalums.filter((tantalum) => {
      const matchesSearch = 
        tantalum.lot_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tantalum.supplier_name && tantalum.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tantalum.net_weight.toString().includes(searchTerm);
      
      const matchesStatus = 
        stockStatusFilter === 'all' || 
        tantalum.stock_status === stockStatusFilter;
        
      return matchesSearch && matchesStatus;
    });
  }, [tantalums, searchTerm, stockStatusFilter]);

  const handleViewTantalum = (tantalum: Tantalum) => {
    dispatch(setSelectedTantalum(tantalum));
    setShowViewModal(true);
  };

  const handleEditTantalum = (tantalum: Tantalum) => {
    dispatch(setSelectedTantalum(tantalum));
    setShowEditModal(true);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handlePageSizeChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // In TantalumPage.tsx, update the getStockStatusColor function

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

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  if (status === 'loading' && tantalums.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-6 relative"
    >
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <BeakerIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {t('tantalum.title', 'Tantalum Management')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('tantalum.subtitle', 'Manage your tantalum minerals inventory')}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.button
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {t('tantalum.create_new', 'Add New Tantalum')}
              <SparklesIcon className="w-4 h-4 ml-2" />
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Stats */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"/>
              <input
                type="text"
                placeholder={t('tantalum.search_placeholder', 'Search by lot number, supplier or weight...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() =>  ('')}
                    className="absolute cust-transition-center right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative">
              <div className="flex items-center">
                <FunnelIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                    value={stockStatusFilter}
                    onChange={(e) => setStockStatusFilter(e.target.value as any)}
                    className="pl-12 pr-10 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white appearance-none"
                    >
                    <option value="all">{t('tantalum.status_all', 'All Status')}</option>
                    <option value="in-stock">{t('tantalum.status_in_stock', 'In Stock')}</option>
                    <option value="withdrawn">{t('tantalum.status_withdrawn', 'Withdrawn')}</option>
                    <option value="resampled">{t('tantalum.status_resampled', 'Resampled')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <ChevronLeftIcon className="w-4 h-4 transform rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                    <BeakerIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('tantalum.total_minerals', 'Total Tantalums')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{pagination.total}</p>
                </div>
                </div>
            </motion.div>
            
            <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                    <CheckBadgeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('tantalum.in_stock', 'In Stock')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tantalums.filter(t => t.stock_status === 'in-stock').length}
                    </p>
                </div>
                </div>
            </motion.div>
            
            <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                    <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('tantalum.finance_status', 'Finance Status')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tantalums.filter(t => t.finance_status === 'unpaid').length} {t('tantalum.unpaid', 'Unpaid')}
                    </p>
                </div>
                </div>
            </motion.div>
            
        </div>
        </motion.div>

        {/* Tantalums Table */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('tantalum.lot_info', 'Lot Information')}
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('tantalum.dates', 'Dates')}
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('tantalum.supplier', 'Supplier')}
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('tantalum.status', 'Status')}
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('tantalum.actions', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence mode="popLayout">
                  {filteredTantalums.map((tantalum: Tantalum, index: number) => (
                    <motion.tr
                      key={tantalum.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
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
                        y: -20,
                        transition: { duration: 0.2 }
                      }}
                      whileHover={{ 
                        backgroundColor: "rgba(79, 70, 229, 0.05)",
                        transition: { duration: 0.2 }
                      }}
                      className="group hover:shadow-lg transition-all duration-200"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <motion.div 
                            className="flex-shrink-0 h-12 w-12"
                            whileHover={{ scale: 1.1 }}
                          >
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                              <BeakerIcon className="h-6 w-6 text-white" />
                            </div>
                          </motion.div>
                          <div className="ml-4">
                            <motion.div 
                              className="text-sm font-semibold text-gray-900 dark:text-white"
                              whileHover={{ x: 2 }}
                            >
                              {tantalum.lot_number}
                            </motion.div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <ScaleIcon className="w-3 h-3 mr-1" />
                              {tantalum.net_weight} kg
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 dark:text-white font-medium flex items-center">
                            <CalendarDaysIcon className="w-4 h-4 mr-2 text-indigo-500" />
                            {t('tantalum.sampling', 'Sampling')}: {formatDate(tantalum.date_of_sampling)}
                          </div>
                          {
                            tantalum.date_of_delivery && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {t('tantalum.delivery', 'Delivery')}: {formatDate(tantalum.date_of_delivery)}
                              </div>
                            )
                          }
                          {tantalum.has_alex_stewart && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {t('tantalum.alex_stewart', 'Alex Stewart')}: {formatDate(tantalum.date_of_alex_stewart)}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          {tantalum.supplier_name ? (
                            <div className="text-sm text-gray-900 dark:text-white font-medium flex items-center">
                              <UserIcon className="w-4 h-4 mr-2 text-blue-500" />
                              {tantalum.supplier_name}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                              {t('tantalum.no_supplier_info', 'No supplier information')}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="space-y-2">
                          <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-medium rounded-full ${getStockStatusColor(tantalum.stock_status)}`}>
                            {t(`tantalum.status_${tantalum.stock_status}`, tantalum.stock_status)}
                          </span>
                          <div>
                            <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-medium rounded-full ${getFinanceStatusColor(tantalum.finance_status)}`}>
                              {t(`tantalum.finance_${tantalum.finance_status}`, tantalum.finance_status)}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewTantalum(tantalum)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
                            title={t('tantalum.view', 'View Details')}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditTantalum(tantalum)}
                            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200"
                            title={t('tantalum.edit', 'Edit')}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          <AnimatePresence>
            {filteredTantalums.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    transition: { 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }
                  }}
                >
                  <BeakerIcon className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm || stockStatusFilter !== 'all' 
                    ? t('tantalum.no_tantalums_found', 'No tantalums found') 
                    : t('tantalum.no_tantalums', 'No tantalums yet')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  {searchTerm || stockStatusFilter !== 'all'
                    ? t('tantalum.try_different_search', 'Try adjusting your search or filter to find what you\'re looking for.')
                    : t('tantalum.no_tantalums_description', 'Start adding tantalum minerals to your inventory.')
                  }
                </p>
                {!searchTerm && stockStatusFilter === 'all' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    {t('tantalum.create_first', 'Add Your First Tantalum')}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('tantalum.showing', 'Showing')} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {t('tantalum.of', 'of')} {pagination.total}
                  </span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </motion.button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, pagination.page - 2)) + i;
                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                          pageNum === pagination.page
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
        <CreateTantalumModal 
            isOpen={showCreateModal} 
            onClose={() => setShowCreateModal(false)} 
        />
        
        <EditTantalumModal
            isOpen={showEditModal} 
            onClose={() => setShowEditModal(false)} 
            userRole='Manager'
        />
        
        <ViewTantalumModal 
            isOpen={showViewModal} 
            onClose={() => setShowViewModal(false)} 
        />
    </motion.div>
  );
};
export default TantalumPage;