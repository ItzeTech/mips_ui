// pages/TantalumPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import { 
  fetchTantalums, 
  setSelectedTantalum, 
  setPagination,
  StockStatus,
  FinanceStatus,
  TantalumSearchParams
} from '../../features/minerals/tantalumSlice';

import CreateTantalumModal from '../../components/dashboard/minerals/tantalum/CreateTantalumModal';
import EditTantalumModal from '../../components/dashboard/minerals/tantalum/EditTantalumModal';
import ViewTantalumModal from '../../components/dashboard/minerals/tantalum/ViewTantalumModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

// Import separated components
import TantalumHeader from '../../components/dashboard/minerals/tantalum/TantalumHeader';
import TantalumSearchBar from '../../components/dashboard/minerals/tantalum/TantalumSearchBar';
import TantalumStats from '../../components/dashboard/minerals/tantalum/TantalumStats';
import TantalumTable from '../../components/dashboard/minerals/tantalum/TantalumTable';
import TantalumEmptyState from '../../components/dashboard/minerals/tantalum/TantalumEmptyState';
import TantalumPagination from '../../components/dashboard/minerals/tantalum/TantalumPagination';

import { useSelectedMinerals } from '../../hooks/useSelectedMinerals';
import { useAuth } from '../../hooks/useAuth';

const TantalumPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { roles } = useAuth();

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
  const [financeStatusFilter, setFinanceStatusFilter] = useState<'all' | FinanceStatus>('all');
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
    const params: Partial<TantalumSearchParams> = {
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

      if (financeStatusFilter !== 'all') {
        params.financeStatus = financeStatusFilter;
      }
    }
    
    dispatch(fetchTantalums(params as TantalumSearchParams));
  };
  
  // If server-side search is enabled, set page to 1 when search params change
  if (serverSideSearch && (searchTerm || stockStatusFilter !== 'all' || financeStatusFilter !== 'all')) {
    dispatch(setPagination({ page: 1 }));
    // Small delay to allow pagination state to update
    setTimeout(fetchData, 0);
  } else {
    fetchData();
  }
}, [dispatch, pagination.page, pagination.limit, serverSideSearch, searchTerm, stockStatusFilter, searchTimeout, financeStatusFilter]);

// Update handleSearch with debounce
const handleSearch = (term: string) => {
  setSearchTerm(term);
  
  if (serverSideSearch) {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      dispatch(setPagination({ page: 1 }));
      
      const params: Partial<TantalumSearchParams> = {
        page: 1,
        limit: pagination.limit
      };
      
      if (term) {
        params.search = term;
      }
      
      if (stockStatusFilter !== 'all') {
        params.stockStatus = stockStatusFilter;
      }
      
      if (financeStatusFilter !== 'all') {
        params.financeStatus = financeStatusFilter;
      }
      
      dispatch(fetchTantalums(params as TantalumSearchParams));
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
      
      const params: Partial<TantalumSearchParams> = {
        page: 1,
        limit: pagination.limit
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (status !== 'all') {
        params.stockStatus = status;
      }
      
      if (financeStatusFilter !== 'all') {
        params.financeStatus = financeStatusFilter;
      }
      
      dispatch(fetchTantalums(params as TantalumSearchParams));
    }, 0);
    
    setSearchTimeout(timeout);
  }
};

const handleFinanceStatusFilter = (status: 'all' | FinanceStatus) => {
  setFinanceStatusFilter(status);
  
  if (serverSideSearch) {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      dispatch(setPagination({ page: 1 }));
      
      const params: Partial<TantalumSearchParams> = {
        page: 1,
        limit: pagination.limit
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (stockStatusFilter !== 'all') {
        params.stockStatus = stockStatusFilter;
      }
      
      if (status !== 'all') {
        params.financeStatus = status;
      }
      
      dispatch(fetchTantalums(params as TantalumSearchParams));
    }, 0);
    
    setSearchTimeout(timeout);
  }
};

const handlePageChange = (newPage: number) => {
  dispatch(setPagination({ page: newPage }));
  
  // If server-side search is enabled, include the search parameters in the fetch
  if (serverSideSearch) {
    const params: Partial<TantalumSearchParams> = {
      page: newPage,
      limit: pagination.limit
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (stockStatusFilter !== 'all') {
      params.stockStatus = stockStatusFilter;
    }
    
    if (financeStatusFilter !== 'all') {
      params.financeStatus = financeStatusFilter;
    }
    
    dispatch(fetchTantalums(params as TantalumSearchParams));
  }
};

// Update handlePageSizeChange too
const handlePageSizeChange = (newLimit: number) => {
  dispatch(setPagination({ page: 1, limit: newLimit }));
  
  if (serverSideSearch) {
    const params: Partial<TantalumSearchParams> = {
      page: 1,
      limit: newLimit
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (stockStatusFilter !== 'all') {
      params.stockStatus = stockStatusFilter;
    }
    
    if (financeStatusFilter !== 'all') {
      params.financeStatus = financeStatusFilter;
    }
    
    dispatch(fetchTantalums(params as TantalumSearchParams));
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
    
    const matchesStockStatus = 
      stockStatusFilter === 'all' || 
      tantalum.stock_status === stockStatusFilter;
      
    const matchesFinanceStatus =
      financeStatusFilter === 'all' ||
      (financeStatusFilter === 'unpaid' 
        ? (tantalum.finance_status === 'unpaid' || tantalum.finance_status === 'invoiced')
        : tantalum.finance_status === financeStatusFilter);
      
    return matchesSearch && matchesStockStatus && matchesFinanceStatus;
  });
}, [tantalums, searchTerm, stockStatusFilter, financeStatusFilter, serverSideSearch]);

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
          financeStatusFilter={financeStatusFilter}
          onFinanceStatusFilterChange={handleFinanceStatusFilter}
          serverSideSearch={serverSideSearch}
          onServerSideSearchChange={setServerSideSearch}
        />

        {/* Stats */}
        <TantalumStats
          tantalums={filteredTantalums}
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
            hasSearch={!!searchTerm || stockStatusFilter !== 'all' || financeStatusFilter !== 'all'}
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
        userRoles={roles}
      />
      
      <ViewTantalumModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
      />
    </div>
  );
};

export default TantalumPage;