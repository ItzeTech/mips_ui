// pages/TantalumPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';

import { 
  fetchTantalums, 
  setSelectedTantalum, 
  setPagination,
  StockStatus
} from '../../../features/minerals/tantalumSlice';

import CreateTantalumModal from '../../../components/dashboard/minerals/tantalum/CreateTantalumModal';
import EditTantalumModal from '../../../components/dashboard/minerals/tantalum/EditTantalumModal';
import ViewTantalumModal from '../../../components/dashboard/minerals/tantalum/ViewTantalumModal';
import LoadingSkeleton from '../../../components/common/LoadingSkeleton';

// Import separated components
import TantalumHeader from '../../../components/dashboard/minerals/tantalum/TantalumHeader';
import TantalumSearchBar from '../../../components/dashboard/minerals/tantalum/TantalumSearchBar';
import TantalumStats from '../../../components/dashboard/minerals/tantalum/TantalumStats';
import TantalumTable from '../../../components/dashboard/minerals/tantalum/TantalumTable';
import TantalumEmptyState from '../../../components/dashboard/minerals/tantalum/TantalumEmptyState';
import TantalumPagination from '../../../components/dashboard/minerals/tantalum/TantalumPagination';

import { useSelectedMinerals } from '../../../hooks/useSelectedMinerals';

const TantalumPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const { tantalums, status, pagination } = useSelector((state: RootState) => state.tantalums);
  const { getByType } = useSelectedMinerals();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | StockStatus>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [serverSideSearch, setServerSideSearch] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Reset search timeout when component unmounts
  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  // Fetch data with search parameters if needed
  useEffect(() => {
    if (serverSideSearch) {
      dispatch(setPagination({ page: 1 }));
      dispatch(fetchTantalums({ 
        page: 1, 
        limit: pagination.limit,
        // search: searchTerm,
        // stockStatus: stockStatusFilter !== 'all' ? stockStatusFilter : undefined
      }));
    } else {
      dispatch(fetchTantalums({ page: pagination.page, limit: pagination.limit }));
    }
  }, [
    dispatch, 
    pagination.page, 
    pagination.limit, 
    serverSideSearch, 
    searchTerm, 
    stockStatusFilter
  ]);

  // Handle search with debounce
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (serverSideSearch) {
      if (searchTimeout) clearTimeout(searchTimeout);
      
      const timeout = setTimeout(() => {
        dispatch(setPagination({ page: 1 }));
        dispatch(fetchTantalums({ 
          page: 1, 
          limit: pagination.limit,
          // search: term,
          // stockStatus: stockStatusFilter !== 'all' ? stockStatusFilter : undefined
        }));
      }, 500);
      
      setSearchTimeout(timeout);
    }
  };

  // Handle status filter change
  const handleStatusFilter = (status: 'all' | StockStatus) => {
    setStockStatusFilter(status);
    
    if (serverSideSearch) {
      dispatch(setPagination({ page: 1 }));
      dispatch(fetchTantalums({ 
        page: 1, 
        limit: pagination.limit,
        // search: searchTerm,
        // stockStatus: status !== 'all' ? status : undefined
      }));
    }
  };

  // Filter tantalums based on search and filter (client-side)
  const filteredTantalums = useMemo(() => {
    if (serverSideSearch) return tantalums;
    
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
  }, [tantalums, searchTerm, stockStatusFilter, serverSideSearch]);

  // Calculate selected tantalums
  const selectedTantalums = useMemo(() => {
    const selected = getByType('tantalum');
    return selected.map(item => 
      tantalums.find(tantalum => tantalum.id === item.id)
    ).filter(Boolean) as any[];
  }, [tantalums, getByType]);

  // Handle view/edit actions
  const handleViewTantalum = (tantalum: any) => {
    dispatch(setSelectedTantalum(tantalum));
    setShowViewModal(true);
  };

  const handleEditTantalum = (tantalum: any) => {
    dispatch(setSelectedTantalum(tantalum));
    setShowEditModal(true);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handlePageSizeChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
  };

  if (status === 'loading' && tantalums.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <TantalumHeader
          onCreateClick={() => setShowCreateModal(true)}
          selectedTantalums={selectedTantalums}
        />

        {/* Search Bar */}
        <TantalumSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          stockStatusFilter={stockStatusFilter}
          onStatusFilterChange={handleStatusFilter}
          serverSideSearch={serverSideSearch}
          onServerSideSearchChange={setServerSideSearch}
        />

        {/* Stats */}
        <TantalumStats
          tantalums={tantalums}
          selectedTantalums={selectedTantalums}
        />

        {/* Tantalums Table or Empty State */}
        {filteredTantalums.length > 0 ? (
          <TantalumTable
            tantalums={filteredTantalums}
            onView={handleViewTantalum}
            onEdit={handleEditTantalum}
          />
        ) : (
          <TantalumEmptyState
            hasSearch={!!searchTerm || stockStatusFilter !== 'all'}
            onCreateClick={() => setShowCreateModal(true)}
          />
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <TantalumPagination
            currentPage={pagination.page}
            pageSize={pagination.limit}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
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
    </div>
  );
};

export default TantalumPage;