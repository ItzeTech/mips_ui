// features/minerals/tungstenSlice.tsx
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import { TungstenSettingsData } from '../settings/tungstenSettingSlice';

export type StockStatus = 'in-stock' | 'withdrawn' | 'resampled';
export type FinanceStatus = 'paid' | 'unpaid' | 'invoiced' | 'advance given' | 'exported';

export interface StockFormData {
  net_weight: number | null;
  date_of_sampling: string;
  date_of_delivery?: string;
  stock_status: StockStatus;
}

export interface LabFormData {
  wo3_percentage: number | null;
  w_percentage: number | null;
  fe_percentage: number | null;
  bal_percentage: number | null;
  alex_stewart_wo3_percentage?: number | null;
}

export interface FinancialFormData {
  mtu: number | null;
  price_per_kg: number | null;
  purchase_wo3_percentage: number | null;
  exchange_rate: number | null;
  price_of_tag_per_kg_rwf: number | null;
  finance_status: FinanceStatus;
}

export interface Tungsten {
  id: string;
  date_of_delivery: string;
  date_of_sampling: string;
  date_of_alex_stewart: string | null;
  lot_number: string;
  supplier_id: string;
  supplier_name: string;
  net_weight: number;
  wo3_percentage: number | null;
  w_percentage: number | null;
  fe_percentage: number | null;
  bal_percentage: number | null;
  alex_stewart_wo3_percentage: number | null;
  purchase_wo3_percentage: number | null;
  mtu: number | null;
  price_per_kg: number | null;
  total_amount: number | null;
  rra: number | null;
  rma: number | null;
  inkomane_fee: number | null;
  exchange_rate: number | null;
  price_of_tag_per_kg_rwf: number | null;
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

export interface CreateTungstenData {
  supplier_id: string;
  net_weight: number;
  date_of_sampling: string;
}

export interface UpdateLabAnalysisData {
  wo3_percentage?: number;
  w_percentage?: number;
  fe_percentage?: number;
  bal_percentage?: number;
  alex_stewart_wo3_percentage?: number;
}

export interface UpdateFinancialsData {
  mtu?: number | null;
  price_per_kg?: number | null;
  purchase_wo3_percentage?: number | null;
  exchange_rate?: number | null;
  price_of_tag_per_kg_rwf?: number | null;
  total_amount?: number | null;
  rra?: number | null;
  rma?: number | null;
  inkomane_fee?: number | null;
  advance?: number | null;
  total_charge?: number | null;
  net_amount?: number | null;
  finance_status?: FinanceStatus
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface TungstensResponse {
  items: Tungsten[];
  total: number;
  page: number;
  limit: number;
}

interface TungstenState {
  tungstens: Tungsten[];
  selectedTungsten: Tungsten | null;
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

const initialState: TungstenState = {
  tungstens: [],
  selectedTungsten: null,
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
export const fetchTungstens = createAsyncThunk(
  'tungstens/fetchTungstens',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/tungsten', {
        params: {
          page: params.page,
          limit: params.limit,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tungstens');
    }
  }
);

export const createTungsten = createAsyncThunk(
  'tungstens/createTungsten',
  async (tungstenData: CreateTungstenData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tungsten', tungstenData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tungsten');
    }
  }
);

export const updateStock = createAsyncThunk(
  'tungstens/updateStock',
  async ({ id, stockData }: { id: string; stockData: StockFormData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tungsten/${id}`, stockData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stock status');
    }
  }
);

export const updateLabAnalysis = createAsyncThunk(
  'tungstens/updateLabAnalysis',
  async ({ id, labData }: { id: string; labData: UpdateLabAnalysisData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/tungsten/${id}/lab-analysis`, labData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lab analysis');
    }
  }
);

export const updateFinancials = createAsyncThunk(
  'tungstens/updateFinancials',
  async ({ id, financialData }: { id: string; financialData: UpdateFinancialsData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/tungsten/${id}/financials`, financialData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update financials');
    }
  }
);

const tungstenSlice = createSlice({
  name: 'tungstens',
  initialState,
  reducers: {
    setSelectedTungsten: (state, action: PayloadAction<Tungsten | null>) => {
      state.selectedTungsten = action.payload;
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
      // Fetch tungstens
      .addCase(fetchTungstens.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTungstens.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tungstens = action.payload.items;
        state.isFetched = true;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchTungstens.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Create tungsten
      .addCase(createTungsten.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createTungsten.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.tungstens.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTungsten.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update stock
      .addCase(updateStock.pending, (state) => {
        state.updateStockStatus = 'loading';
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.updateStockStatus = 'succeeded';
        const index = state.tungstens.findIndex(tungsten => tungsten.id === action.payload.id);
        if (index !== -1) {
          state.tungstens[index] = action.payload;
        }
        if (state.selectedTungsten?.id === action.payload.id) {
          state.selectedTungsten = action.payload;
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
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
        const index = state.tungstens.findIndex(tungsten => tungsten.id === action.payload.id);
        if (index !== -1) {
          state.tungstens[index] = action.payload;
        }
        if (state.selectedTungsten?.id === action.payload.id) {
          state.selectedTungsten = action.payload;
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
        const index = state.tungstens.findIndex(tungsten => tungsten.id === action.payload.id);
        if (index !== -1) {
          state.tungstens[index] = action.payload;
        }
        if (state.selectedTungsten?.id === action.payload.id) {
          state.selectedTungsten = action.payload;
        }
      })
      .addCase(updateFinancials.rejected, (state, action) => {
        state.updateFinancialsStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedTungsten,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetUpdateStockStatus,
  resetUpdateLabAnalysisStatus,
  resetUpdateFinancialsStatus,
  setPagination
} = tungstenSlice.actions;

export default tungstenSlice.reducer;