// features/sales/salesSlice.tsx
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
// import { updateFinancials as updateTinFinancials } from '../minerals/tinSlice';
// import { updateFinancials as updateTantalumFinancials } from '../minerals/tantalumSlice';
// import { updateFinancials as updateTungstenFinancials } from '../minerals/tungstenSlice';

export type SaleMineralType = 'TANTALUM' | 'TIN' | 'TUNGSTEN';

export interface SaleMineralInput {
  mineral_id: string;
  replenish_kgs: number;
}

export interface SaleMineral {
  id: string;
  net_weight: number;
  supplier_name: string;
  percentage: number;
  net_amount: number;
  total_charge: number;
  total_amount: number;
  lot_number: string;
  stock_status: string;
  finance_status: string;
  created_at: string;
}

export interface Sale {
  id: string;
  mineral_type: SaleMineralType;
  total_weight: number;
  average_percentage: number;
  total_amount: number;
  buyer: string | null;
  net_sales_amount: number | null;
  paid_amount: number;
  is_fully_paid: boolean;
  payment_status: 'UNPAID' | 'PARTIALLY_PAID' | 'FULLY_PAID';
  last_payment_date: string | null;
  created_at: string;
  updated_at: string;
  minerals: SaleMineral[];
}

export interface CreateSaleData {
  mineral_type: SaleMineralType;
  minerals: SaleMineralInput[];
  buyer?: string;
  net_sales_amount?: number;
  paid_amount: number;
}

export interface UpdateSaleData {
  buyer?: string;
  net_sales_amount?: number;
  paid_amount?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SalesResponse {
  items: Sale[];
  total: number;
  page: number;
  limit: number;
}

interface SalesState {
  sales: Sale[];
  selectedSale: Sale | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  addMineralsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  removeMineralStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  isFetched: boolean;
}

const initialState: SalesState = {
  sales: [],
  selectedSale: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
  addMineralsStatus: 'idle',
  removeMineralStatus: 'idle',
  isFetched: false
};

// Async thunks
export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const response = await axiosInstance.get('/sales', { 
        params: { page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch sales');
    }
  }
);

export const createSale = createAsyncThunk(
  'sales/createSale',
  async (saleData: CreateSaleData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post('/sales', saleData);
      
      // Update minerals' finance status to 'exported' if any were added
      // if (saleData.mineral_ids && saleData.mineral_ids.length > 0) {
      //   saleData.mineral_ids.forEach(id => {
      //     const updateData = { finance_status: 'exported' };
          
      //     if (saleData.mineral_type === 'TIN') {
      //       dispatch(updateTinFinancials({ id, financialData: updateData }));
      //     } else if (saleData.mineral_type === 'TANTALUM') {
      //       dispatch(updateTantalumFinancials({ id, financialData: updateData }));
      //     } else if (saleData.mineral_type === 'TUNGSTEN') {
      //       dispatch(updateTungstenFinancials({ id, financialData: updateData }));
      //     }
      //   });
      // }
      
      return response.data.data;
    } catch (error: any) {
      console.log(error.response?.data?.detail)
      return rejectWithValue(error.response?.data?.detail || 'Failed to create sale');
    }
  }
);

export const getSaleById = createAsyncThunk(
  'sales/getSaleById',
  async (saleId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/sales/${saleId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to get sale details');
    }
  }
);

export const updateSale = createAsyncThunk(
  'sales/updateSale',
  async ({ id, updateData }: { id: string; updateData: UpdateSaleData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/sales/${id}`, updateData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update sale');
    }
  }
);

export const addMineralsToSale = createAsyncThunk(
  'sales/addMineralsToSale',
  async ({ saleId, salesData }: { saleId: string; salesData: SaleMineralInput[] }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state: any = getState();
      const sale = state.sales.sales.find((s: Sale) => s.id === saleId) || state.sales.selectedSale;
      
      if (!sale) {
        return rejectWithValue('Sale not found');
      }
      
      const response = await axiosInstance.post(`/sales/${saleId}/minerals`, { minerals: salesData });
      
      // Update minerals' finance status to 'exported'
      // mineralIds.forEach(id => {
      //   const updateData = { finance_status: 'exported' };
        
      //   if (sale.mineral_type === 'TIN') {
      //     dispatch(updateTinFinancials({ id, financialData: updateData }));
      //   } else if (sale.mineral_type === 'TANTALUM') {
      //     dispatch(updateTantalumFinancials({ id, financialData: updateData }));
      //   } else if (sale.mineral_type === 'TUNGSTEN') {
      //     dispatch(updateTungstenFinancials({ id, financialData: updateData }));
      //   }
      // });
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to add minerals to sale');
    }
  }
);

// In salesSlice.tsx
export const removeMineralFromSale = createAsyncThunk(
  'sales/removeMineralFromSale',
  async ({ saleId, mineralId }: { saleId: string; mineralId: string }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state: any = getState();
      const sale = state.sales.sales.find((s: Sale) => s.id === saleId) || state.sales.selectedSale;
      
      if (!sale) {
        return rejectWithValue('Sale not found');
      }
      
      // Make a single API call to remove the mineral
      const response = await axiosInstance.delete(`/sales/${saleId}/minerals/${mineralId}`);
      
      // The backend should handle updating the mineral's finance status
      // No need for additional API calls here
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to remove mineral from sale');
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSelectedSale: (state, action: PayloadAction<Sale | null>) => {
      state.selectedSale = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    resetAddMineralsStatus: (state) => {
      state.addMineralsStatus = 'idle';
    },
    resetRemoveMineralStatus: (state) => {
      state.removeMineralStatus = 'idle';
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationParams>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sales
      .addCase(fetchSales.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sales = action.payload?.items || [];
        state.isFetched = true;
        state.pagination = {
          total: action.payload?.total || 0,
          page: action.payload?.page || 1,
          limit: action.payload?.limit || 10,
        };
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Create sale
      .addCase(createSale.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.sales.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createSale.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Get sale by ID
      .addCase(getSaleById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getSaleById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedSale = action.payload;
        
        // Update in the list if exists
        const index = state.sales.findIndex(sale => sale.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
      })
      .addCase(getSaleById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update sale
      .addCase(updateSale.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.sales.findIndex(sale => sale.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.selectedSale?.id === action.payload.id) {
          state.selectedSale = action.payload;
        }
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Add minerals to sale
      .addCase(addMineralsToSale.pending, (state) => {
        state.addMineralsStatus = 'loading';
        state.error = null;
      })
      .addCase(addMineralsToSale.fulfilled, (state, action) => {
        state.addMineralsStatus = 'succeeded';
        const index = state.sales.findIndex(sale => sale.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.selectedSale?.id === action.payload.id) {
          state.selectedSale = action.payload;
        }
      })
      .addCase(addMineralsToSale.rejected, (state, action) => {
        state.addMineralsStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Remove mineral from sale
      .addCase(removeMineralFromSale.pending, (state) => {
        state.removeMineralStatus = 'loading';
        state.error = null;
      })
      .addCase(removeMineralFromSale.fulfilled, (state, action) => {
        state.removeMineralStatus = 'succeeded';
        const index = state.sales.findIndex(sale => sale.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.selectedSale?.id === action.payload.id) {
          state.selectedSale = action.payload;
        }
      })
      .addCase(removeMineralFromSale.rejected, (state, action) => {
        state.removeMineralStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedSale,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetAddMineralsStatus,
  resetRemoveMineralStatus,
  setPagination
} = salesSlice.actions;

export default salesSlice.reducer;