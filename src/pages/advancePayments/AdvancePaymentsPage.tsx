// pages/AdvancePaymentsPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchAdvancePayments, setPagination } from '../../features/finance/advancePaymentSlice';

import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import AdvancePaymentsHeader from '../../components/dashboard/advancePayments/AdvancePaymentsHeader';
import AdvancePaymentsSearchBar from '../../components/dashboard/advancePayments/AdvancePaymentsSearchBar';
import AdvancePaymentsTable from '../../components/dashboard/advancePayments/AdvancePaymentsTable';
import AdvancePaymentsEmptyState from '../../components/dashboard/advancePayments/AdvancePaymentsEmptyState';
import AdvancePaymentsPagination from '../../components/dashboard/advancePayments/AdvancePaymentsPagination';

const AdvancePaymentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const { advancePayments, status, pagination } = useSelector((state: RootState) => state.advancePayments);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAdvancePayments({
      page: pagination.page,
      limit: pagination.limit
    }));
  }, [dispatch, pagination.page, pagination.limit]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredPayments = useMemo(() => {
    return advancePayments.filter((payment) => {
      const matchesSearch = 
        payment.id.includes(searchTerm) ||
        (payment.supplier?.name && payment.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm);
      
      return matchesSearch;
    });
  }, [advancePayments, searchTerm]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handlePageSizeChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
  };

  const handleCreatePayment = () => {
    navigate('/advance-payments/create');
  };

  const handleViewPayment = (paymentId: string) => {
    navigate(`/advance-payments/${paymentId}`);
  };

  if (status === 'loading' && advancePayments.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto">
        <AdvancePaymentsHeader onCreateClick={handleCreatePayment} />
        <AdvancePaymentsSearchBar searchTerm={searchTerm} onSearchChange={handleSearch} />

        {filteredPayments.length > 0 ? (
          <AdvancePaymentsTable payments={filteredPayments} onView={handleViewPayment} />
        ) : (
          <AdvancePaymentsEmptyState
            hasSearch={!!searchTerm}
            onCreateClick={handleCreatePayment}
          />
        )}

        {pagination.total > 0 && (
          <AdvancePaymentsPagination
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

export default AdvancePaymentsPage;