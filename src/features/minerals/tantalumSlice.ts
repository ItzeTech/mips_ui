// features/minerals/tantalumSlice.tsx
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export type StockStatus = 'in-stock' | 'withdrawn' | 'resampled';
export type FinanceStatus = 'paid' | 'unpaid' | 'invoiced' | 'advance given' | 'exported';

export interface StockFormData {
  net_weight: number | null;
  date_of_sampling: string;
  date_of_delivery: string;
  stock_status: StockStatus;
}

export interface LabFormData {
  internal_ta2o5: number | null;
  internal_nb2o5: number | null;
  nb_percentage: number | null;
  sn_percentage: number | null;
  fe_percentage: number | null;
  w_percentage: number | null;
  alex_stewart_ta2o5: number | null;
  alex_stewart_nb2o5: number | null;
}

export interface FinancialFormData {
  price_per_percentage: number | null;
  purchase_ta2o5_percentage: number | null;
  exchange_rate: number | null;
  price_of_tag_per_kg_rwf: number | null;
  finance_status: FinanceStatus;
}

export interface Tantalum {
  id: string;
  date_of_delivery: string;
  date_of_sampling: string;
  date_of_alex_stewart: string | null;
  lot_number: string;
  supplier_id: string;
  supplier_name: string;
  net_weight: number;
  internal_ta2o5: number | null;
  internal_nb2o5: number | null;
  nb_percentage: number | null;
  sn_percentage: number | null;
  fe_percentage: number | null;
  w_percentage: number | null;
  alex_stewart_ta2o5: number | null;
  alex_stewart_nb2o5: number | null;
  price_per_percentage: number | null;
  purchase_ta2o5_percentage: number | null;
  unit_price: number | null;
  exchange_rate: number | null;
  price_of_tag_per_kg_rwf: number | null;
  total_amount: number | null;
  rra: number | null;
  rma: number | null;
  inkomane_fee: number | null;
  advance: number | null;
  total_charge: number | null;
  net_amount: number | null;
  stock_status: StockStatus;
  finance_status: FinanceStatus;
  finance_status_changed_date: string;
  stock_status_changed_date: string;
  has_alex_stewart: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTantalumData {
  supplier_id: string;
  net_weight: number;
  date_of_sampling: string;
}

export interface UpdateStockStatusData {
  stock_status: 'in-stock' | 'resampled' | 'withdrawn';
}

export interface UpdateLabAnalysisData {
  internal_ta2o5?: number;
  internal_nb2o5?: number;
  nb_percentage?: number;
  sn_percentage?: number;
  fe_percentage?: number;
  w_percentage?: number;
  alex_stewart_ta2o5?: number;
  alex_stewart_nb2o5?: number;
}

export interface UpdateFinancialsData {
  price_per_percentage?: number;
  purchase_ta2o5_percentage?: number;
  unit_price?: number;
  exchange_rate?: number;
  price_of_tag_per_kg?: number;
  total_amount?: number;
  rra?: number;
  rma?: number;
  inkomane_fee?: number;
  advance?: number;
  total_charge?: number;
  net_amount?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface TantalumsResponse {
  items: Tantalum[];
  total: number;
  page: number;
  limit: number;
}

interface TantalumState {
  tantalums: Tantalum[];
  selectedTantalum: Tantalum | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStockStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateLabAnalysisStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateFinancialsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  isFetched: boolean;
}

const initialState: TantalumState = {
  tantalums: [],
  selectedTantalum: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
  updateStockStatus: 'idle',
  updateLabAnalysisStatus: 'idle',
  updateFinancialsStatus: 'idle',
  isFetched: false
};

// Async thunks
export const fetchTantalums = createAsyncThunk(
  'tantalums/fetchTantalums',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/tantalum', {
        params: {
          page: params.page,
          limit: params.limit,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tantalums');
    }
  }
);

export const createTantalum = createAsyncThunk(
  'tantalums/createTantalum',
  async (tantalumData: CreateTantalumData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tantalum', tantalumData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tantalum');
    }
  }
);

export const updateStockStatus = createAsyncThunk(
  'tantalums/updateStockStatus',
  async ({ id, statusData }: { id: string; statusData: UpdateStockStatusData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tantalum/${id}/stock-status`, statusData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stock status');
    }
  }
);

export const updateLabAnalysis = createAsyncThunk(
  'tantalums/updateLabAnalysis',
  async ({ id, labData }: { id: string; labData: UpdateLabAnalysisData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tantalum/${id}/lab-analysis`, labData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lab analysis');
    }
  }
);

export const updateFinancials = createAsyncThunk(
  'tantalums/updateFinancials',
  async ({ id, financialData }: { id: string; financialData: UpdateFinancialsData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tantalum/${id}/financials`, financialData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update financials');
    }
  }
);

const tantalumSlice = createSlice({
  name: 'tantalums',
  initialState,
  reducers: {
    setSelectedTantalum: (state, action: PayloadAction<Tantalum | null>) => {
      state.selectedTantalum = action.payload;
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
    resetUpdateStockStatus: (state) => {
      state.updateStockStatus = 'idle';
    },
    resetUpdateLabAnalysisStatus: (state) => {
      state.updateLabAnalysisStatus = 'idle';
    },
    resetUpdateFinancialsStatus: (state) => {
      state.updateFinancialsStatus = 'idle';
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationParams>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tantalums
      .addCase(fetchTantalums.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTantalums.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tantalums = action.payload.items;
        state.isFetched = true;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchTantalums.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Create tantalum
      .addCase(createTantalum.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createTantalum.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.tantalums.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTantalum.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update stock status
      .addCase(updateStockStatus.pending, (state) => {
        state.updateStockStatus = 'loading';
        state.error = null;
      })
      .addCase(updateStockStatus.fulfilled, (state, action) => {
        state.updateStockStatus = 'succeeded';
        const index = state.tantalums.findIndex(tantalum => tantalum.id === action.payload.id);
        if (index !== -1) {
          state.tantalums[index] = action.payload;
        }
        if (state.selectedTantalum?.id === action.payload.id) {
          state.selectedTantalum = action.payload;
        }
      })
      .addCase(updateStockStatus.rejected, (state, action) => {
        state.updateStockStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update lab analysis
      .addCase(updateLabAnalysis.pending, (state) => {
        state.updateLabAnalysisStatus = 'loading';
        state.error = null;
      })
      .addCase(updateLabAnalysis.fulfilled, (state, action) => {
        state.updateLabAnalysisStatus = 'succeeded';
        const index = state.tantalums.findIndex(tantalum => tantalum.id === action.payload.id);
        if (index !== -1) {
          state.tantalums[index] = action.payload;
        }
        if (state.selectedTantalum?.id === action.payload.id) {
          state.selectedTantalum = action.payload;
        }
      })
      .addCase(updateLabAnalysis.rejected, (state, action) => {
        state.updateLabAnalysisStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update financials
      .addCase(updateFinancials.pending, (state) => {
        state.updateFinancialsStatus = 'loading';
        state.error = null;
      })
      .addCase(updateFinancials.fulfilled, (state, action) => {
        state.updateFinancialsStatus = 'succeeded';
        const index = state.tantalums.findIndex(tantalum => tantalum.id === action.payload.id);
        if (index !== -1) {
          state.tantalums[index] = action.payload;
        }
        if (state.selectedTantalum?.id === action.payload.id) {
          state.selectedTantalum = action.payload;
        }
      })
      .addCase(updateFinancials.rejected, (state, action) => {
        state.updateFinancialsStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedTantalum,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetUpdateStockStatus,
  resetUpdateLabAnalysisStatus,
  resetUpdateFinancialsStatus,
  setPagination
} = tantalumSlice.actions;
export default tantalumSlice.reducer;

// ------------------------------------------------------------------

// export interface Tantalum {
//   id: string;
//   date_of_delivery: string;
//   date_of_sampling: string;
//   date_of_alex_stewart: string | null;
//   lot_number: string; // Format: TA000010, TA000011
//   supplier_id: string;
//   supplier_name: string;
//   net_weight: number; // after sampling
  
//   // Internal lab analysis
//   internal_ta2o5: number | null;
//   internal_nb2o5: number | null;
//   nb_percentage: number | null;
//   sn_percentage: number | null;
//   fe_percentage: number | null;
//   w_percentage: number | null;
  
//   // Alex Stewart analysis
//   alex_stewart_ta2o5: number | null;
//   alex_stewart_nb2o5: number | null;
  
//   // Financial data
//   price_per_percentage: number | null; // Price per 1%
//   purchase_ta2o5_percentage: number | null;
//   unit_price: number | null; // Calculated: price_per_percentage * purchase_ta2o5_percentage
//   exchange_rate: number | null; // USD to RWF
//   price_of_tag_per_kg_rwf: number | null;
//   total_amount: number | null; // Calculated: unit_price * net_weight
//   rra: number | null; // Calculated: 3% * total_amount
//   rma: number | null; // Calculated: 0.125 * net_weight (USD 125 per 1,000 kg)
//   inkomane_fee: number | null; // Calculated: 40 * net_weight (40 RWF per kg)
//   advance: number | null; // Calculated: price_of_tag_per_kg_rwf * net_weight
//   total_charge: number | null; // Calculated: RRA + RMA + (Inkomane/Exchange rate) + (advance/Exchange rate)
//   net_amount: number | null; // Calculated: total_amount - total_charge
  
//   stock_status: StockStatus;
//   finance_status: FinanceStatus;
//   finance_status_changed_date: string;
//   stock_status_changed_date: string;
//   has_alex_stewart: boolean;
//   created_at: string;
//   updated_at: string;
// }

// Helper functions for calculations
export const calculateFinancials = (data: Partial<Tantalum>): Partial<Tantalum> => {
  const {
    price_per_percentage,
    purchase_ta2o5_percentage,
    net_weight,
    exchange_rate,
    price_of_tag_per_kg_rwf
  } = data;

  let calculatedData: Partial<Tantalum> = { ...data };

  // Calculate unit price
  if (price_per_percentage && purchase_ta2o5_percentage) {
    calculatedData.unit_price = price_per_percentage * purchase_ta2o5_percentage;
  }

  // Calculate total amount
  if (calculatedData.unit_price && net_weight) {
    calculatedData.total_amount = calculatedData.unit_price * net_weight;
  }

  // Calculate RRA (3% of total amount)
  if (calculatedData.total_amount) {
    calculatedData.rra = calculatedData.total_amount * 0.03;
  }

  // Calculate RMA (USD 125 per 1,000 kg)
  if (net_weight) {
    calculatedData.rma = 0.125 * net_weight;
  }

  // Calculate Inkomane Fee (40 RWF per kg)
  if (net_weight) {
    calculatedData.inkomane_fee = 40 * net_weight;
  }

  // Calculate Advance (price of tag/kg * net weight)
  if (price_of_tag_per_kg_rwf && net_weight) {
    calculatedData.advance = price_of_tag_per_kg_rwf * net_weight;
  }

  // Calculate Total Charge
  if (calculatedData.rra && calculatedData.rma && calculatedData.inkomane_fee && 
      calculatedData.advance && exchange_rate) {
    calculatedData.total_charge = calculatedData.rra + calculatedData.rma + 
      (calculatedData.inkomane_fee / exchange_rate) + (calculatedData.advance / exchange_rate);
  }

  // Calculate Net Amount
  if (calculatedData.total_amount && calculatedData.total_charge) {
    calculatedData.net_amount = calculatedData.total_amount - calculatedData.total_charge;
  }

  return calculatedData;
};



// Role-based permissions
export const canUpdateStockStatus = (userRole: string): boolean => {
  return userRole === 'stock_manager' || userRole === 'admin';
};

export const canUpdateFinanceStatus = (userRole: string): boolean => {
  return userRole === 'manager' || userRole === 'admin';
};