// pages/MixedMineralsPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { 
  fetchMixedMinerals, 
  setSelectedMineral, 
  setPagination,
  MixedMineral 
} from '../../features/minerals/mixedMineralsSlice';
import { 
  Square3Stack3DIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilIcon,
  CalendarDaysIcon,
  ScaleIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import CreateMixedMineralModal from '../../components/dashboard/minerals/mixedMineral/CreateMixedMineralModal';
import EditMixedMineralModal from '../../components/dashboard/minerals/mixedMineral/EditMixedMineralModal';
import ViewMixedMineralModal from '../../components/dashboard/minerals/mixedMineral/ViewMixedMineralModal';
import UpdateStatusModal from '../../components/dashboard/minerals/mixedMineral/UpdateStatusModal';

const MixedMineralsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const { minerals, status, pagination } = useSelector((state: RootState) => state.mixedMinerals);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'processed' | 'unprocessed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMixedMinerals({ page: pagination.page, limit: pagination.limit }));
  }, [dispatch, pagination.page, pagination.limit]);

  // Filter minerals based on search term and status filter
  const filteredMinerals = useMemo(() => {
    return minerals.filter(mineral => {
      const matchesSearch = 
        mineral.lot_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mineral.supplier_name && mineral.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        mineral.weight_kg.toString().includes(searchTerm);
      
      const matchesStatus = 
        statusFilter === 'all' || 
        mineral.status === statusFilter;
        
      return matchesSearch && matchesStatus;
    });
  }, [minerals, searchTerm, statusFilter]);

  const handleViewMineral = (mineral: MixedMineral) => {
    dispatch(setSelectedMineral(mineral));
    setShowViewModal(true);
  };

  const handleEditMineral = (mineral: MixedMineral) => {
    dispatch(setSelectedMineral(mineral));
    setShowEditModal(true);
  };
  
  const handleUpdateStatus = (mineral: MixedMineral) => {
    dispatch(setSelectedMineral(mineral));
    setShowStatusModal(true);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handlePageSizeChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (status === 'loading' && minerals.length === 0) {
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
                <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
                  <Square3Stack3DIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {t('mixedMinerals.title')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('mixedMinerals.subtitle')}
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
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {t('mixedMinerals.create_new')}
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
              <MagnifyingGlassIcon className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('mixedMinerals.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="pl-12 pr-10 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white appearance-none"
                >
                  <option value="all">{t('mixedMinerals.status_all')}</option>
                  <option value="processed">{t('mixedMinerals.status_processed')}</option>
                  <option value="unprocessed">{t('mixedMinerals.status_unprocessed')}</option>
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
                <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                  <Square3Stack3DIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('mixedMinerals.total_minerals')}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('mixedMinerals.processed')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {minerals.filter(m => m.status === 'processed').length}
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
                  <ArrowPathIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('mixedMinerals.unprocessed')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {minerals.filter(m => m.status === 'unprocessed').length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Minerals Table */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('mixedMinerals.lot_info')}
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('mixedMinerals.delivery_info')}
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('mixedMinerals.supplier')}
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('mixedMinerals.status')}
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('mixedMinerals.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence mode="popLayout">
                  {filteredMinerals.map((mineral, index) => (
                    <motion.tr
                      key={mineral.id}
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
                        backgroundColor: "rgba(124, 58, 237, 0.05)",
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
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg">
                              <Square3Stack3DIcon className="h-6 w-6 text-white" />
                            </div>
                          </motion.div>
                          <div className="ml-4">
                            <motion.div 
                              className="text-sm font-semibold text-gray-900 dark:text-white"
                              whileHover={{ x: 2 }}
                            >
                              {mineral.lot_number}
                            </motion.div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <ScaleIcon className="w-3 h-3 mr-1" />
                              {mineral.weight_kg} kg
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 dark:text-white font-medium flex items-center">
                            <CalendarDaysIcon className="w-4 h-4 mr-2 text-purple-500" />
                            {formatDate(mineral.date_of_delivery)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('mixedMinerals.created')}: {new Date(mineral.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          {mineral.supplier_name ? (
                            <div className="text-sm text-gray-900 dark:text-white font-medium flex items-center">
                              <UserIcon className="w-4 h-4 mr-2 text-blue-500" />
                              {mineral.supplier_name}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                              {t('mixedMinerals.no_supplier_info')}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                          mineral.status === 'processed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {mineral.status === 'processed' 
                            ? t('mixedMinerals.status_processed')
                            : t('mixedMinerals.status_unprocessed')}
                        </span>
                      </td>
                      
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewMineral(mineral)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
                            title={t('mixedMinerals.view')}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditMineral(mineral)}
                            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200"
                            title={t('mixedMinerals.edit')}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleUpdateStatus(mineral)}
                            className={`p-2 rounded-xl transition-all duration-200 ${
                              mineral.status === 'processed' 
                                ? 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                                : 'text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                            }`}
                            title={t('mixedMinerals.update_status')}
                          >
                            {mineral.status === 'processed' ? (
                              <ArrowPathIcon className="w-4 h-4" />
                            ) : (
                              <CheckBadgeIcon className="w-4 h-4" />
                            )}
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
            {filteredMinerals.length === 0 && (
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
                  <Square3Stack3DIcon className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm || statusFilter !== 'all' 
                    ? t('mixedMinerals.no_minerals_found') 
                    : t('mixedMinerals.no_minerals')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  {searchTerm || statusFilter !== 'all'
                    ? t('mixedMinerals.try_different_search')
                    : t('mixedMinerals.no_minerals_description')
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    {t('mixedMinerals.create_first')}
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
                    {t('mixedMinerals.showing')} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {t('mixedMinerals.of')} {pagination.total}
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
                            ? 'bg-purple-600 text-white shadow-lg'
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
      <CreateMixedMineralModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      <EditMixedMineralModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
      />
      
      <ViewMixedMineralModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
      />
      
      <UpdateStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      />
    </motion.div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
              <div>
                <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="h-12 w-36 bg-gradient-to-r from-purple-200 to-indigo-200 dark:from-purple-800 dark:to-indigo-800 rounded-2xl animate-pulse"></div>
          </div>
        </div>

        {/* Search and Stats Skeleton */}
        <div className="mb-8">
          <div className="h-16 w-full bg-white/80 dark:bg-gray-800/80 rounded-2xl animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/80 dark:bg-gray-800/80 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl overflow-hidden">
          <div className="p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center space-x-6 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-200 to-indigo-200 dark:from-purple-800 dark:to-indigo-800 rounded-2xl animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-xl animate-pulse"></div>
                  <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-xl animate-pulse"></div>
                  <div className="w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded-xl animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixedMineralsPage;