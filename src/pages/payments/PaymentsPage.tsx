import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchPayments, setPagination } from '../../features/finance/paymentSlice';

import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import PaymentsHeader from '../../components/dashboard/payments/PaymentsHeader';
import PaymentsSearchBar from '../../components/dashboard/payments/PaymentsSearchBar';
import PaymentsTable from '../../components/dashboard/payments/PaymentsTable';
import PaymentsEmptyState from '../../components/dashboard/payments/PaymentsEmptyState';
import PaymentsPagination from '../../components/dashboard/payments/PaymentsPagination';

const PaymentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const { payments, status, pagination } = useSelector((state: RootState) => state.payments);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPayments({
      page: pagination.page,
      limit: pagination.limit
    }));
  }, [dispatch, pagination.page, pagination.limit]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch = 
        payment.id.includes(searchTerm) ||
        (payment.supplier_name && payment.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        payment.mineral_types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        payment.total_amount.toString().includes(searchTerm);
      
      return matchesSearch;
    });
  }, [payments, searchTerm]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handlePageSizeChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
  };

  const handleCreatePayment = () => {
    navigate('/payments/create');
  };

  const handleViewPayment = (paymentId: string) => {
    navigate(`/payments/${paymentId}`);
  };

  if (status === 'loading' && payments.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto">
        <PaymentsHeader onCreateClick={handleCreatePayment} />
        <PaymentsSearchBar searchTerm={searchTerm} onSearchChange={handleSearch} />

        {filteredPayments.length > 0 ? (
          <PaymentsTable payments={filteredPayments} onView={handleViewPayment} />
        ) : (
          <PaymentsEmptyState
            hasSearch={!!searchTerm}
            onCreateClick={handleCreatePayment}
          />
        )}

        {pagination.total > 0 && (
          <PaymentsPagination
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

export default PaymentsPage;