// pages/expenses/ExpensesPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchExpenses, setPagination } from '../../features/finance/expenseSlice';

import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ExpensesHeader from '../../components/dashboard/expenses/ExpensesHeader';
import ExpensesSearchBar from '../../components/dashboard/expenses/ExpensesSearchBar';
import ExpensesTable from '../../components/dashboard/expenses/ExpensesTable';
import ExpensesEmptyState from '../../components/dashboard/expenses/ExpensesEmptyState';
import ExpensesPagination from '../../components/dashboard/expenses/ExpensesPagination';

const ExpensesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const { expenses = [], status = 'idle', pagination = { page: 1, limit: 10, total: 0 } } = useSelector((state: RootState) => state.expenses || {});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchExpenses({
      page: pagination.page,
      limit: pagination.limit
    }));
  }, [dispatch, pagination.page, pagination.limit]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter((expense) => {
      const matchesSearch = 
        expense.id.includes(searchTerm) ||
        expense.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.amount.toString().includes(searchTerm);
      
      return matchesSearch;
    });
  }, [expenses, searchTerm]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handlePageSizeChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
  };

  const handleCreateExpense = () => {
    navigate('/expenses/create');
  };

  const handleViewExpense = (expenseId: string) => {
    navigate(`/expenses/${expenseId}`);
  };

  if (status === 'loading' && expenses && expenses.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto">
        <ExpensesHeader onCreateClick={handleCreateExpense} />
        <ExpensesSearchBar searchTerm={searchTerm} onSearchChange={handleSearch} />

        {filteredExpenses.length > 0 ? (
          <ExpensesTable expenses={filteredExpenses} onView={handleViewExpense} />
        ) : (
          <ExpensesEmptyState
            hasSearch={!!searchTerm}
            onCreateClick={handleCreateExpense}
          />
        )}

        {pagination.total > 0 && (
          <ExpensesPagination
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

export default ExpensesPage;