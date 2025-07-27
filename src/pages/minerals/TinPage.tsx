// pages/TinPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import { 
  fetchTins, 
  setSelectedTin, 
  setPagination,
  StockStatus,
  TinSearchParams
} from '../../features/minerals/tinSlice';

import CreateTinModal from '../../components/dashboard/minerals/tin/CreateTinModal';
import EditTinModal from '../../components/dashboard/minerals/tin/EditTinModal';
import ViewTinModal from '../../components/dashboard/minerals/tin/ViewTinModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

// Import separated components
import TinHeader from '../../components/dashboard/minerals/tin/TinHeader';
import TinSearchBar from '../../components/dashboard/minerals/tin/TinSearchBar';
import TinStats from '../../components/dashboard/minerals/tin/TinStats';
import TinTable from '../../components/dashboard/minerals/tin/TinTable';
import TinEmptyState from '../../components/dashboard/minerals/tin/TinEmptyState';
import TinPagination from '../../components/dashboard/minerals/tin/TinPagination';

import { useSelectedMinerals } from '../../hooks/useSelectedMinerals';

const TinPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const { tins, status, pagination } = useSelector((state: RootState) => state.tins);
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

  // Update the useEffect
  useEffect(() => {
    // Clear any pending search timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const fetchData = () => {
      const params: TinSearchParams = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      // If searching across all pages, add search parameters
      if (serverSideSearch) {
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        if (stockStatusFilter !== 'all') {
          params.stockStatus = stockStatusFilter;
        }
      }
      
      dispatch(fetchTins(params));
    };
    
    // If server-side search is enabled, set page to 1 when search params change
    if (serverSideSearch && (searchTerm || stockStatusFilter !== 'all')) {
      dispatch(setPagination({ page: 1 }));
      // Small delay to allow pagination state to update
      setTimeout(fetchData, 0);
    } else {
      fetchData();
    }
  }, [dispatch, pagination.page, pagination.limit, serverSideSearch, searchTerm, stockStatusFilter, searchTimeout]);

  // Update handleSearch with debounce
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (serverSideSearch) {
      if (searchTimeout) clearTimeout(searchTimeout);
      
      const timeout = setTimeout(() => {
        dispatch(setPagination({ page: 1 }));
        
        const params: TinSearchParams = {
          page: 1,
          limit: pagination.limit
        };
        
        if (term) {
          params.search = term;
        }
        
        if (stockStatusFilter !== 'all') {
          params.stockStatus = stockStatusFilter;
        }
        
        dispatch(fetchTins(params));
      }, 500);
      
      setSearchTimeout(timeout);
    }
  };

  // Update handleStatusFilter
  const handleStatusFilter = (status: 'all' | StockStatus) => {
    setStockStatusFilter(status);
    
    if (serverSideSearch) {
      if (searchTimeout) clearTimeout(searchTimeout);
      
      const timeout = setTimeout(() => {
        dispatch(setPagination({ page: 1 }));
        
        const params: TinSearchParams = {
          page: 1,
          limit: pagination.limit
        };
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        if (status !== 'all') {
          params.stockStatus = status;
        }
        
        dispatch(fetchTins(params));
      }, 0);
      
      setSearchTimeout(timeout);
    }
  };

  // Also update handlePageChange to include search parameters when using serverSideSearch
  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
    
    // If server-side search is enabled, include the search parameters in the fetch
    if (serverSideSearch) {
      const params: TinSearchParams = {
        page: newPage,
        limit: pagination.limit
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (stockStatusFilter !== 'all') {
        params.stockStatus = stockStatusFilter;
      }
      
      dispatch(fetchTins(params));
    }
  };

  // Similarly update handlePageSizeChange
  const handlePageSizeChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
    
    if (serverSideSearch) {
      const params: TinSearchParams = {
        page: 1,
        limit: newLimit
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (stockStatusFilter !== 'all') {
        params.stockStatus = stockStatusFilter;
      }
      
      dispatch(fetchTins(params));
    }
  };

  // Filter tins based on search and filter (client-side)
  const filteredTins = useMemo(() => {
    if (serverSideSearch) return tins;
    
    return tins.filter((tin) => {
      const matchesSearch = 
        tin.lot_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tin.supplier_name && tin.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tin.net_weight.toString().includes(searchTerm);
      
      const matchesStatus = 
        stockStatusFilter === 'all' || 
        tin.stock_status === stockStatusFilter;
        
      return matchesSearch && matchesStatus;
    });
  }, [tins, searchTerm, stockStatusFilter, serverSideSearch]);

  // Calculate selected tins
  const selectedTins = useMemo(() => {
    const selected = getByType('tin');
    return selected.map(item => 
      tins.find(tin => tin.id === item.id)
    ).filter(Boolean) as any[];
  }, [tins, getByType]);

  // Handle view/edit actions
  const handleViewTin = (tin: any) => {
    dispatch(setSelectedTin(tin));
    setShowViewModal(true);
  };

  const handleEditTin = (tin: any) => {
    dispatch(setSelectedTin(tin));
    setShowEditModal(true);
  };

  if (status === 'loading' && tins.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <TinHeader
          onCreateClick={() => setShowCreateModal(true)}
          selectedTins={selectedTins}
        />

        {/* Search Bar */}
        <TinSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          stockStatusFilter={stockStatusFilter}
          onStatusFilterChange={handleStatusFilter}
          serverSideSearch={serverSideSearch}
          onServerSideSearchChange={setServerSideSearch}
        />

        {/* Stats */}
        <TinStats
          tins={tins}
          selectedTins={selectedTins}
        />

        {/* Tins Table or Empty State */}
        {filteredTins.length > 0 ? (
          <TinTable
            tins={filteredTins}
            onView={handleViewTin}
            onEdit={handleEditTin}
          />
        ) : (
          <TinEmptyState
            hasSearch={!!searchTerm || stockStatusFilter !== 'all'}
            onCreateClick={() => setShowCreateModal(true)}
          />
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <TinPagination
            currentPage={pagination.page}
            pageSize={pagination.limit}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      {/* Modals */}
      <CreateTinModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      <EditTinModal
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        userRole='Manager'
      />
      
      <ViewTinModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
      />
    </div>
  );
};

export default TinPage;