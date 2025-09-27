// hooks/useSales.ts (fixed version)
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  fetchSales,
  createSale,
  updateSale,
  addMineralsToSale,
  removeMineralFromSale,
  getSaleById,
  setSelectedSale,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetAddMineralsStatus,
  resetRemoveMineralStatus,
  setPagination,
  Sale,
  CreateSaleData,
  UpdateSaleData,
  PaginationParams,
  SaleMineralInput
} from '../features/finance/salesSlice';
import { useSelectedMinerals } from './useSelectedMinerals';

export const useSales = () => {
  const dispatch = useDispatch<any>();
  
  const {
    sales,
    selectedSale,
    pagination,
    status,
    error,
    createStatus,
    updateStatus,
    addMineralsStatus,
    removeMineralStatus,
    isFetched
  } = useSelector((state: RootState) => state.sales);
  
  const { clearByType } = useSelectedMinerals();
  
  // Load all sales with pagination - memoized
  const loadSales = useCallback((params: PaginationParams) => {
    dispatch(fetchSales(params));
  }, [dispatch]);
  
  // Create a new sale - memoized
  const handleCreateSale = useCallback(async (saleData: CreateSaleData) => {
    const result = await dispatch(createSale(saleData));
    if (createSale.fulfilled.match(result)) {
      // Clear selected minerals of the type that was added to sale
      if (saleData.minerals && saleData.minerals.length > 0) {
        clearByType(saleData.mineral_type.toLowerCase() as any);
      }
      return result.payload;
    }
    return null;
  }, [dispatch, clearByType]);
  
  // Get sale by ID - memoized
  const loadSaleById = useCallback(async (saleId: string) => {
    // Check if we already have this sale selected to avoid unnecessary API calls
    if (selectedSale && selectedSale.id === saleId) {
      return selectedSale;
    }
    
    const result = await dispatch(getSaleById(saleId));
    if (getSaleById.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch, selectedSale]);
  
  // Other functions with useCallback...
  const handleUpdateSale = useCallback(async (id: string, updateData: UpdateSaleData) => {
    const result = await dispatch(updateSale({ id, updateData }));
    if (updateSale.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);
  
  const handleAddMineralsToSale = useCallback(async (saleId: string, salesData: SaleMineralInput[]) => {
    const result = await dispatch(addMineralsToSale({ saleId, salesData }));
    if (addMineralsToSale.fulfilled.match(result)) {
      if (selectedSale?.mineral_type) {
        clearByType(selectedSale.mineral_type.toLowerCase() as any);
      }
      return result.payload;
    }
    return null;
  }, [dispatch, selectedSale, clearByType]);
  
  const handleRemoveMineralFromSale = useCallback(async (saleId: string, mineralId: string) => {
    const result = await dispatch(removeMineralFromSale({ saleId, mineralId }));
    if (removeMineralFromSale.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [dispatch]);
  
  const selectSale = useCallback((sale: Sale | null) => {
    dispatch(setSelectedSale(sale));
  }, [dispatch]);
  
  // Reset functions
  const handleClearError = useCallback(() => dispatch(clearError()), [dispatch]);
  const handleResetCreateStatus = useCallback(() => dispatch(resetCreateStatus()), [dispatch]);
  const handleResetUpdateStatus = useCallback(() => dispatch(resetUpdateStatus()), [dispatch]);
  const handleResetAddMineralsStatus = useCallback(() => dispatch(resetAddMineralsStatus()), [dispatch]);
  const handleResetRemoveMineralStatus = useCallback(() => dispatch(resetRemoveMineralStatus()), [dispatch]);
  
  const handleSetPagination = useCallback((paginationParams: Partial<PaginationParams>) => {
    dispatch(setPagination(paginationParams));
  }, [dispatch]);
  
  return {
    sales,
    selectedSale,
    pagination,
    status,
    error,
    createStatus,
    updateStatus,
    addMineralsStatus,
    removeMineralStatus,
    isFetched,
    loadSales,
    handleCreateSale,
    loadSaleById,
    handleUpdateSale,
    handleAddMineralsToSale,
    handleRemoveMineralFromSale,
    selectSale,
    handleClearError,
    handleResetCreateStatus,
    handleResetUpdateStatus,
    handleResetAddMineralsStatus,
    handleResetRemoveMineralStatus,
    handleSetPagination
  };
};