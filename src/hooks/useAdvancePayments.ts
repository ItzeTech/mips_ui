// hooks/useAdvancePayments.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  fetchAdvancePayments,
  createAdvancePayment,
  updateAdvancePayment,
  deleteAdvancePayment,
  getAdvancePaymentById,
  fetchSupplierAdvancePayments,
  searchAdvancePayments,
  setSelectedAdvancePayment,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  setPagination,
  AdvancePayment,
  CreateAdvancePaymentData,
  UpdateAdvancePaymentData,
  PaginationParams
} from '../features/finance/advancePaymentSlice';

export const useAdvancePayments = () => {
  const dispatch = useDispatch<any>();
  
  const {
    advancePayments,
    selectedAdvancePayment,
    pagination,
    status,
    error,
    createStatus,
    updateStatus,
    deleteStatus,
    isFetched
  } = useSelector((state: RootState) => state.advancePayments);
  
  // Load all advance payments with pagination
  const loadAdvancePayments = useCallback((params: PaginationParams) => {
    dispatch(fetchAdvancePayments(params));
  }, [dispatch]);
  
  // Create a new advance payment
  const handleCreateAdvancePayment = useCallback(async (paymentData: CreateAdvancePaymentData) => {
    const result = await dispatch(createAdvancePayment(paymentData));
    if (createAdvancePayment.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);
  
  // Get advance payment by ID
  const loadAdvancePaymentById = useCallback(async (paymentId: string) => {
    // Check if we already have this payment selected to avoid unnecessary API calls
    if (selectedAdvancePayment && selectedAdvancePayment.id === paymentId) {
      return selectedAdvancePayment;
    }
    
    const result = await dispatch(getAdvancePaymentById(paymentId));
    if (getAdvancePaymentById.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch, selectedAdvancePayment]);
  
  // Update advance payment
  const handleUpdateAdvancePayment = useCallback(async (id: string, updateData: UpdateAdvancePaymentData) => {
    const result = await dispatch(updateAdvancePayment({ id, updateData }));
    if (updateAdvancePayment.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);
  
  // Delete advance payment
  const handleDeleteAdvancePayment = useCallback(async (paymentId: string) => {
    const result = await dispatch(deleteAdvancePayment(paymentId));
    if (deleteAdvancePayment.fulfilled.match(result)) {
      return true;
    }
    return false;
  }, [dispatch]);
  
  // Load supplier advance payments
  const loadSupplierAdvancePayments = useCallback((supplierId: string, params: PaginationParams) => {
    dispatch(fetchSupplierAdvancePayments({ supplierId, params }));
  }, [dispatch]);
  
  // Search advance payments
  const searchPayments = useCallback((searchTerm: string, params: PaginationParams) => {
    dispatch(searchAdvancePayments({ searchTerm, params }));
  }, [dispatch]);
  
  // Select advance payment
  const selectAdvancePayment = useCallback((payment: AdvancePayment | null) => {
    dispatch(setSelectedAdvancePayment(payment));
  }, [dispatch]);
  
  // Reset functions
  const handleClearError = useCallback(() => dispatch(clearError()), [dispatch]);
  const handleResetCreateStatus = useCallback(() => dispatch(resetCreateStatus()), [dispatch]);
  const handleResetUpdateStatus = useCallback(() => dispatch(resetUpdateStatus()), [dispatch]);
  const handleResetDeleteStatus = useCallback(() => dispatch(resetDeleteStatus()), [dispatch]);
  
  const handleSetPagination = useCallback((paginationParams: Partial<PaginationParams>) => {
    dispatch(setPagination(paginationParams));
  }, [dispatch]);
  
  return {
    advancePayments,
    selectedAdvancePayment,
    pagination,
    status,
    error,
    createStatus,
    updateStatus,
    deleteStatus,
    isFetched,
    loadAdvancePayments,
    handleCreateAdvancePayment,
    loadAdvancePaymentById,
    handleUpdateAdvancePayment,
    handleDeleteAdvancePayment,
    loadSupplierAdvancePayments,
    searchPayments,
    selectAdvancePayment,
    handleClearError,
    handleResetCreateStatus,
    handleResetUpdateStatus,
    handleResetDeleteStatus,
    handleSetPagination
  };
};