// pages/SuppliersPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { 
  fetchSuppliers, 
  setSelectedSupplier, 
  setPagination,
  Supplier 
} from '../../features/user/suppliersSlice';
import { 
  UserGroupIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  MapPinIcon,
  BanknotesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import CreateSupplierModal from '../../components/suppliers/CreateSupplierModal';
import EditSupplierModal from '../../components/suppliers/EditSupplierModal';
import ViewSupplierModal from '../../components/suppliers/ViewSupplierModal';

const SuppliersPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { suppliers, status, pagination } = useSelector((state: RootState) => state.suppliers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSuppliers({ page: pagination.page, size: pagination.size }));
  }, [dispatch, pagination.page, pagination.size]);

  // Filter suppliers based on search term
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone_number.includes(searchTerm) ||
      (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.company && supplier.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.national_id_or_passport && supplier.national_id_or_passport.includes(searchTerm))
    );
  }, [suppliers, searchTerm]);

  const handleViewSupplier = (supplier: Supplier) => {
    dispatch(setSelectedSupplier(supplier));
    setShowViewModal(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    dispatch(setSelectedSupplier(supplier));
    setShowEditModal(true);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    dispatch(setPagination({ page: 1, size: newSize }));
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(pagination.total / pagination.size);

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

  if (status === 'loading' && suppliers.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-6"
    >
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
                <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {t('suppliers.title')}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t('suppliers.subtitle')}
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
              className="mt-4 text-xs sm:text-sm sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {t('suppliers.create_new')}
              <SparklesIcon className="w-4 h-4 ml-2" />
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Stats */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('suppliers.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-2.5 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 cust-translate-y-center p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('suppliers.total_suppliers')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pagination.total}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('suppliers.with_companies')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {suppliers.filter(s => s.company).length}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                  <EnvelopeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('suppliers.with_email')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {suppliers.filter(s => s.email).length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Suppliers Table */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('suppliers.supplier_info')}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('suppliers.contact')}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('suppliers.business_info')}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('suppliers.created_date')}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {t('suppliers.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence mode="popLayout">
                  {filteredSuppliers.map((supplier, index) => (
                    <motion.tr
                      key={supplier.id}
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
                        backgroundColor: "rgba(16, 185, 129, 0.05)",
                        transition: { duration: 0.2 }
                      }}
                      className="group hover:shadow-lg transition-all duration-200"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <motion.div 
                            className="flex-shrink-0 h-12 w-12"
                            whileHover={{ scale: 1.1 }}
                          >
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                              <UserGroupIcon className="h-6 w-6 text-white" />
                            </div>
                          </motion.div>
                          <div className="ml-4">
                            <motion.div 
                              className="text-sm font-semibold text-gray-900 dark:text-white"
                              whileHover={{ x: 2 }}
                            >
                              {supplier.name}
                            </motion.div>
                            {supplier.national_id_or_passport && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <IdentificationIcon className="w-3 h-3 mr-1" />
                                {supplier.national_id_or_passport}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 dark:text-white font-medium flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-2 text-green-500" />
                            {supplier.phone_number}
                          </div>
                          {supplier.email && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <EnvelopeIcon className="w-4 h-4 mr-2 text-blue-500" />
                              {supplier.email}
                            </div>
                          )}
                          {supplier.location && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <MapPinIcon className="w-4 h-4 mr-2 text-red-500" />
                              {supplier.location}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-2">
                        <div className="space-y-1">
                          {supplier.company && (
                            <div className="text-sm text-gray-900 dark:text-white font-medium flex items-center">
                              <BuildingOfficeIcon className="w-4 h-4 mr-2 text-purple-500" />
                              {supplier.company}
                            </div>
                          )}
                          {supplier.bank_account && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <BanknotesIcon className="w-4 h-4 mr-2 text-yellow-500" />
                              {supplier.bank_account}
                            </div>
                          )}
                          {!supplier.company && !supplier.bank_account && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                              {t('suppliers.no_business_info')}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(supplier.created_at)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t('suppliers.updated')}: {formatDate(supplier.updated_at)}
                        </div>
                      </td>
                      
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewSupplier(supplier)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
                            title={t('suppliers.view')}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditSupplier(supplier)}
                            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200"
                            title={t('suppliers.edit')}
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
            {filteredSuppliers.length === 0 && (
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
                  <UserGroupIcon className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? t('suppliers.no_suppliers_found') : t('suppliers.no_suppliers')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  {searchTerm 
                    ? t('suppliers.try_different_search')
                    : t('suppliers.no_suppliers_description')
                  }
                </p>
                {!searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    {t('suppliers.create_first')}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="px-3 sm:px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('suppliers.showing')} {((pagination.page - 1) * pagination.size) + 1} - {Math.min(pagination.page * pagination.size, pagination.total)} {t('suppliers.of')} {pagination.total}
                  </span>
                  <select
                    value={pagination.size}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
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
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </motion.button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, pagination.page - 2)) + i;
                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-2.5 py-1 text-sm rounded-lg transition-all duration-200 ${
                          pageNum === pagination.page
                            ? 'bg-emerald-600 text-white shadow-lg'
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
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <CreateSupplierModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      <EditSupplierModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
      />
      
      <ViewSupplierModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
      />
    </motion.div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 p-6">
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
            <div className="h-12 w-36 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 rounded-2xl animate-pulse"></div>
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
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 rounded-2xl animate-pulse"></div>
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
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-xl animate-pulse"></div>
                  <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-xl animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;