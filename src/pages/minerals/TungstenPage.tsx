// pages/TungstenPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import { 
  fetchTungstens, 
  setSelectedTungsten, 
  setPagination,
  StockStatus,
  FinanceStatus,
  TungstenSearchParams
} from '../../features/minerals/tungstenSlice';

import CreateTungstenModal from '../../components/dashboard/minerals/tungsten/CreateTungstenModal';
import EditTungstenModal from '../../components/dashboard/minerals/tungsten/EditTungstenModal';
import ViewTungstenModal from '../../components/dashboard/minerals/tungsten/ViewTungstenModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

// Import separated components
import TungstenHeader from '../../components/dashboard/minerals/tungsten/TungstenHeader';
import TungstenSearchBar from '../../components/dashboard/minerals/tungsten/TungstenSearchBar';
import TungstenStats from '../../components/dashboard/minerals/tungsten/TungstenStats';
import TungstenTable from '../../components/dashboard/minerals/tungsten/TungstenTable';
import TungstenEmptyState from '../../components/dashboard/minerals/tungsten/TungstenEmptyState';
import TungstenPagination from '../../components/dashboard/minerals/tungsten/TungstenPagination';

import { useSelectedMinerals } from '../../hooks/useSelectedMinerals';
import { useAuth } from '../../hooks/useAuth';

const TungstenPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { roles } = useAuth();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const { tungstens, status, pagination } = useSelector((state: RootState) => state.tungstens);
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
      const params: Partial<TungstenSearchParams> = {
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
      
      dispatch(fetchTungstens(params as TungstenSearchParams));
    };
    
    // If server-side search is enabled, set page to 1 when search params change
    if (serverSideSearch && (searchTerm || stockStatusFilter !== 'all' || financeStatusFilter !== 'all')) {
      dispatch(setPagination({ page: 1 }));
      // Small delay to allow pagination state to update
      setTimeout(fetchData, 0);
    } else {
      fetchData();
    }
  }, [dispatch, pagination.page, pagination.limit, serverSideSearch, searchTerm, stockStatusFilter, financeStatusFilter, searchTimeout]);

  // Update handleSearch with debounce
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (serverSideSearch) {
      if (searchTimeout) clearTimeout(searchTimeout);
      
      const timeout = setTimeout(() => {
        dispatch(setPagination({ page: 1 }));
        
        const params: Partial<TungstenSearchParams> = {
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
        
        dispatch(fetchTungstens(params as TungstenSearchParams));
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
        
        const params: Partial<TungstenSearchParams> = {
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
        
        dispatch(fetchTungstens(params as TungstenSearchParams));
      }, 0);
      
      setSearchTimeout(timeout);
    }
  };

  // Add handleFinanceStatusFilter
  const handleFinanceStatusFilter = (status: 'all' | FinanceStatus) => {
    setFinanceStatusFilter(status);
    
    if (serverSideSearch) {
      if (searchTimeout) clearTimeout(searchTimeout);
      
      const timeout = setTimeout(() => {
        dispatch(setPagination({ page: 1 }));
        
        const params: Partial<TungstenSearchParams> = {
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
        
        dispatch(fetchTungstens(params as TungstenSearchParams));
      }, 0);
      
      setSearchTimeout(timeout);
    }
  };

  // Update handlePageChange
  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
    
    // If server-side search is enabled, include the search parameters in the fetch
    if (serverSideSearch) {
      const params: Partial<TungstenSearchParams> = {
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
      
      dispatch(fetchTungstens(params as TungstenSearchParams));
    }
  };

  // Update handlePageSizeChange
  const handlePageSizeChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
    
    if (serverSideSearch) {
      const params: Partial<TungstenSearchParams> = {
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
      
      dispatch(fetchTungstens(params as TungstenSearchParams));
    }
  };

  // Filter tungstens based on search and filter (client-side)
  const filteredTungstens = useMemo(() => {
    if (serverSideSearch) return tungstens;
    
    return tungstens.filter((tungsten) => {
      const matchesSearch = 
        tungsten.lot_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tungsten.supplier_name && tungsten.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tungsten.net_weight.toString().includes(searchTerm);
      
      const matchesStockStatus = 
        stockStatusFilter === 'all' || 
        tungsten.stock_status === stockStatusFilter;
        
      const matchesFinanceStatus =
        financeStatusFilter === 'all' ||
        (financeStatusFilter === 'unpaid' 
        ? (tungsten.finance_status === 'unpaid' || tungsten.finance_status === 'invoiced')
        : tungsten.finance_status === financeStatusFilter);

      return matchesSearch && matchesStockStatus && matchesFinanceStatus;
    });
  }, [tungstens, searchTerm, stockStatusFilter, financeStatusFilter, serverSideSearch]);

  // Calculate selected tungstens
  const selectedTungstens = useMemo(() => {
    const selected = getByType('tungsten');
    return selected.map(item => 
      tungstens.find(tungsten => tungsten.id === item.id)
    ).filter(Boolean) as any[];
  }, [tungstens, getByType]);

  // Handle view/edit actions
  const handleViewTungsten = (tungsten: any) => {
    dispatch(setSelectedTungsten(tungsten));
    setShowViewModal(true);
  };

  const handleEditTungsten = (tungsten: any) => {
    dispatch(setSelectedTungsten(tungsten));
    setShowEditModal(true);
  };

  if (status === 'loading' && tungstens.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-500 to-green-600 origin-left z-50"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <TungstenHeader
          onCreateClick={() => setShowCreateModal(true)}
          selectedTungstens={selectedTungstens}
        />

        {/* Search Bar */}
        <TungstenSearchBar
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
        <TungstenStats
          tungstens={filteredTungstens}
          selectedTungstens={selectedTungstens}
        />

        {/* Tungstens Table or Empty State */}
        {filteredTungstens.length > 0 ? (
          <TungstenTable
            tungstens={filteredTungstens}
            onView={handleViewTungsten}
            onEdit={handleEditTungsten}
          />
        ) : (
          <TungstenEmptyState
            hasSearch={!!searchTerm || stockStatusFilter !== 'all' || financeStatusFilter !== 'all'}
            onCreateClick={() => setShowCreateModal(true)}
          />
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <TungstenPagination
            currentPage={pagination.page}
            pageSize={pagination.limit}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      {/* Modals */}
      <CreateTungstenModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      <EditTungstenModal
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        userRoles={roles}
      />
      
      <ViewTungstenModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
      />
    </div>
  );
};

export default TungstenPage;