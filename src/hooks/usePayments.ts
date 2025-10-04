import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  fetchPayments,
  createPayment,
  getPaymentById,
  fetchSupplierPayments,
  previewPaymentCalculation,
  setSelectedPayment,
  clearPreviewPayment,
  clearError,
  resetCreateStatus,
  resetPreviewStatus,
  setPagination,
  Payment,
  CreatePaymentData,
  PaginationParams,
  updatePayment,
  UpdatePaymentsData
} from '../features/finance/paymentSlice';

export const usePayments = () => {
  const dispatch = useDispatch<any>();
  
  const {
    payments,
    selectedPayment,
    previewPayment,
    pagination,
    status,
    error,
    createStatus,
    previewStatus,
    updateStatus,
    isFetched
  } = useSelector((state: RootState) => state.payments);
  
  // Load all payments with pagination
  const loadPayments = useCallback((params: PaginationParams) => {
    dispatch(fetchPayments(params));
  }, [dispatch]);
  
  // Create a new payment
  const handleCreatePayment = useCallback(async (paymentData: CreatePaymentData) => {
    const result = await dispatch(createPayment(paymentData));
    if (createPayment.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);
  
  // Get payment by ID
  const loadPaymentById = useCallback(async (paymentId: string) => {
    // Check if we already have this payment selected to avoid unnecessary API calls
    if (selectedPayment && selectedPayment.id === paymentId) {
      return selectedPayment;
    }
    
    const result = await dispatch(getPaymentById(paymentId));
    if (getPaymentById.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch, selectedPayment]);
  
  // Load supplier payments
  const loadSupplierPayments = useCallback((supplierId: string, params: PaginationParams) => {
    dispatch(fetchSupplierPayments({ supplierId, params }));
  }, [dispatch]);
  
  // Preview payment calculation
  const handlePreviewPayment = useCallback(async (paymentData: CreatePaymentData) => {
    const result = await dispatch(previewPaymentCalculation(paymentData)); // Fixed dispatch call
    if (previewPaymentCalculation.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);
  
  // Select payment
  const selectPayment = useCallback((payment: Payment | null) => {
    dispatch(setSelectedPayment(payment));
  }, [dispatch]);
  
  // Clear preview payment
  const handleClearPreviewPayment = useCallback(() => {
    dispatch(clearPreviewPayment());
  }, [dispatch]);
  
  // Reset functions
  const handleClearError = useCallback(() => dispatch(clearError()), [dispatch]);
  const handleResetCreateStatus = useCallback(() => dispatch(resetCreateStatus()), [dispatch]);
  const handleResetPreviewStatus = useCallback(() => dispatch(resetPreviewStatus()), [dispatch]);
  
  const handleSetPagination = useCallback((paginationParams: Partial<PaginationParams>) => {
    dispatch(setPagination(paginationParams));
  }, [dispatch]);
  
  // Helper functions for payment data
  const isPaymentLoading = useCallback(() => {
    return status === 'loading' || createStatus === 'loading' || previewStatus === 'loading';
  }, [status, createStatus, previewStatus]);
  
  const hasError = useCallback(() => {
    return error !== null;
  }, [error]);
  
  const isCreateSuccessful = useCallback(() => {
    return createStatus === 'succeeded';
  }, [createStatus]);
  
  const isPreviewSuccessful = useCallback(() => {
    return previewStatus === 'succeeded';
  }, [previewStatus]);
  
  const isUpdateSuccessful = useCallback(() => {
    return updateStatus === 'succeeded';
  }, [updateStatus]);

  const handleUpdatePayment = useCallback(async (id: string, updateData: UpdatePaymentsData) => {
    const result = await dispatch(updatePayment({ id, updateData }));
    if (updatePayment.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);

  return {
    // State
    payments,
    selectedPayment,
    previewPayment,
    pagination,
    status,
    error,
    createStatus,
    previewStatus,
    updateStatus,
    isFetched,
    
    // Actions
    loadPayments,
    handleCreatePayment,
    loadPaymentById,
    loadSupplierPayments,
    handlePreviewPayment,
    selectPayment,
    handleClearPreviewPayment,
    handleClearError,
    handleResetCreateStatus,
    handleResetPreviewStatus,
    handleUpdatePayment,
    handleSetPagination,
    
    // Helper functions
    isPaymentLoading,
    hasError,
    isCreateSuccessful,
    isPreviewSuccessful,
    isUpdateSuccessful
  };
};