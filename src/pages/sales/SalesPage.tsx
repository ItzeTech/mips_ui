// pages/SalesPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchSales, setPagination } from '../../features/finance/salesSlice';

import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import SalesHeader from '../../components/dashboard/sales/SalesHeader';
import SalesSearchBar from '../../components/dashboard/sales/SalesSearchBar';
import SalesStats from '../../components/dashboard/sales/SalesStats';
import SalesTable from '../../components/dashboard/sales/SalesTable';
import SalesEmptyState from '../../components/dashboard/sales/SalesEmptyState';
import SalesPagination from '../../components/dashboard/sales/SalesPagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';

const SalesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const { sales, status, pagination } = useSelector((state: RootState) => state.sales);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchSales({
      page: pagination.page,
      limit: pagination.limit
    }));
  }, [dispatch, pagination.page, pagination.limit]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch = 
        (sale.buyer && sale.buyer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        sale.id.includes(searchTerm) ||
        sale.mineral_type.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [sales, searchTerm]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handlePageSizeChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
  };

  const handleCreateSale = (mineralType: string) => {
    navigate(`/sales/create/${mineralType.toLowerCase()}`);
  };

  const handleViewSale = (saleId: string) => {
    navigate(`/sales/${saleId}`);
  };

  if (status === 'loading' && sales.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto">
        <SalesHeader onCreateClick={handleCreateSale} />
        <SalesSearchBar searchTerm={searchTerm} onSearchChange={handleSearch} />
        <SalesStats sales={sales} />

        {filteredSales.length > 0 ? (
          <SalesTable sales={filteredSales} onView={handleViewSale} />
        ) : (
          <SalesEmptyState
            hasSearch={!!searchTerm}
            onCreateClick={() => handleCreateSale('TANTALUM')}
          />
        )}

        {pagination.total > 0 && (
          <SalesPagination
            currentPage={pagination.page}
            pageSize={pagination.limit}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default SalesPage;