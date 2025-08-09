// features/minerals/tinSlice.tsx
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import { TinSettingsData } from '../settings/tinSettingSlice';

export type StockStatus = 'in-stock' | 'withdrawn' | 'resampled';
export type FinanceStatus = 'paid' | 'unpaid' | 'invoiced' | 'exported';

export interface StockFormData {
  net_weight: number | null;
  date_of_sampling: string;
  date_of_delivery?: string;
  stock_status: StockStatus;
}

export interface LabFormData {
  internal_sn_percentage: number | null;
  bal_percentage: number | null;
  fe_percentage: number | null;
  w_percentage: number | null;
  alex_stewart_sn_percentage?: number | null;
}

export interface FinancialFormData {
  lme_rate: number | null;
  government_tc: number | null;
  purchase_sn_percentage: number | null;
  rra_price_per_kg: number | null;
  fluctuation_fee: number | null;
  internal_tc: number | null;
  internal_price_per_kg: number | null;
  exchange_rate: number | null;
  price_of_tag_per_kg_rwf: number | null;
  finance_status: FinanceStatus;
}

export interface Tin {
  id: string;
  date_of_delivery: string;
  date_of_sampling: string;
  date_of_alex_stewart: string | null;
  lot_number: string;
  supplier_id: string;
  supplier_name: string;
  net_weight: number;
  
  // Composition
  internal_sn_percentage: number | null;
  bal_percentage: number | null;
  fe_percentage: number | null;
  w_percentage: number | null;
  alex_stewart_sn_percentage: number | null;

  // Pricing
  lme_rate: number | null;
  government_tc: number | null;
  purchase_sn_percentage: number | null;
  rra_price_per_kg: number | null;
  
  // Charges
  rra: number | null;
  fluctuation_fee: number | null;
  internal_tc: number | null;
  internal_price_per_kg: number | null;
  total_amount: number | null;
  price_of_tag_per_kg_rwf: number | null;
  exchange_rate: number | null;
  rma: number | null;
  inkomane_fee: number | null;
  advance: number | null;
  total_charge: number | null;
  net_amount: number | null;
  
  // Status
  stock_status: StockStatus;
  finance_status: FinanceStatus;
  previous_finance_status: FinanceStatus;
  finance_status_changed_date: string;
  stock_status_changed_date: string;
  has_alex_stewart: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface CreateTinData {
  supplier_id: string;
  net_weight: number;
  date_of_sampling: string;
}

export interface UpdateLabAnalysisData {
  internal_sn_percentage?: number;
  bal_percentage?: number;
  fe_percentage?: number;
  w_percentage?: number;
  alex_stewart_sn_percentage?: number;
}

export interface UpdateFinancialsData {
  lme_rate?: number | null;
  government_tc?: number | null;
  purchase_sn_percentage?: number | null;
  rra_price_per_kg?: number | null;
  fluctuation_fee?: number | null;
  internal_tc?: number | null;
  internal_price_per_kg?: number | null;
  total_amount?: number | null;
  price_of_tag_per_kg?: number | null;
  exchange_rate?: number | null;
  rra?: number | null;
  rma?: number | null;
  inkomane_fee?: number | null;
  advance?: number | null;
  total_charge?: number | null;
  net_amount?: number | null;
  finance_status?: FinanceStatus;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface TinSearchParams extends PaginationParams {
  search?: string;
  stockStatus?: StockStatus;
}

export interface TinsResponse {
  items: Tin[];
  total: number;
  page: number;
  limit: number;
}

interface TinState {
  tins: Tin[];
  selectedTin: Tin | null;
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

const initialState: TinState = {
  tins: [],
  selectedTin: null,
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

export const fetchTins = createAsyncThunk(
  'tins/fetchTins',
  async (params: TinSearchParams, { rejectWithValue }) => {
    try {
      const { page, limit, search, stockStatus } = params;
      
      const isSearchRequest = !!(search || stockStatus);
      
      if (isSearchRequest) {
        const searchParams: any = {
          page,
          limit
        };
        
        if (search) {
          searchParams.search_term = search;
        }
        
        const response = await axiosInstance.get('/tin/search/item', { params: searchParams });
        return response.data.data;
      } else {
        const response = await axiosInstance.get('/tin', { 
          params: { page, limit }
        });
        return response.data.data;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tins');
    }
  }
);

export const createTin = createAsyncThunk(
  'tins/createTin',
  async (tinData: CreateTinData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tin', tinData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tin');
    }
  }
);

export const updateStock = createAsyncThunk(
  'tins/updateStock',
  async ({ id, stockData }: { id: string; stockData: StockFormData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tin/${id}`, stockData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stock status');
    }
  }
);

export const updateLabAnalysis = createAsyncThunk(
  'tins/updateLabAnalysis',
  async ({ id, labData }: { id: string; labData: UpdateLabAnalysisData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/tin/${id}/lab-analysis`, labData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lab analysis');
    }
  }
);

export const updateFinancials = createAsyncThunk(
  'tins/updateFinancials',
  async ({ id, financialData }: { id: string; financialData: UpdateFinancialsData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/tin/${id}/financials`, financialData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update financials');
    }
  }
);

const tinSlice = createSlice({
  name: 'tins',
  initialState,
  reducers: {
    setSelectedTin: (state, action: PayloadAction<Tin | null>) => {
      state.selectedTin = action.payload;
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
      .addCase(fetchTins.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tins = action.payload.items;
        state.isFetched = true;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchTins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Create tin
      .addCase(createTin.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createTin.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.tins.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTin.rejected, (state, action) => {
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
        const index = state.tins.findIndex(tin => tin.id === action.payload.id);
        if (index !== -1) {
          state.tins[index] = action.payload;
        }
        if (state.selectedTin?.id === action.payload.id) {
          state.selectedTin = action.payload;
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
        const index = state.tins.findIndex(tin => tin.id === action.payload.id);
        if (index !== -1) {
          state.tins[index] = action.payload;
        }
        if (state.selectedTin?.id === action.payload.id) {
          state.selectedTin = action.payload;
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
        const index = state.tins.findIndex(tin => tin.id === action.payload.id);
        if (index !== -1) {
          state.tins[index] = action.payload;
        }
        if (state.selectedTin?.id === action.payload.id) {
          state.selectedTin = action.payload;
        }
      })
      .addCase(updateFinancials.rejected, (state, action) => {
        state.updateFinancialsStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedTin,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetUpdateStockStatus,
  resetUpdateLabAnalysisStatus,
  resetUpdateFinancialsStatus,
  setPagination
} = tinSlice.actions;

export default tinSlice.reducer;

export const calculateFinancials = (
  data: Partial<Tin>,
  settings: TinSettingsData
): Partial<Tin> => {
  const {
    lme_rate,
    purchase_sn_percentage,
    net_weight,
    exchange_rate,
    price_of_tag_per_kg_rwf,
    fluctuation_fee,
    internal_tc,
    government_tc
  } = data;

  let calculatedData: Partial<Tin> = { ...data };

  // --- Debug Logging ---
  console.log("=== DEBUG: Input Data ===", {
    lme_rate,
    purchase_sn_percentage,
    net_weight,
    exchange_rate,
    price_of_tag_per_kg_rwf,
    fluctuation_fee,
    internal_tc,
    government_tc,
    settings
  });

  // Step 1: Net LME
  const netLme =
    (lme_rate ?? 0) - (fluctuation_fee ?? 0);

  // Step 2: LME %
  const lme_percentage =
    netLme * ((purchase_sn_percentage ?? 0) / 100);

  const lme_s_percentage =
    (lme_rate ?? 0) * ((purchase_sn_percentage ?? 0) / 100);

  // Step 3: Final LME values
  const final_lme = lme_s_percentage - (government_tc ?? 0);
  const final_s_lme = lme_percentage - (internal_tc ?? 0);

  // Step 4: RRA price per kg
  calculatedData.rra_price_per_kg = final_lme / 1000;

  // Step 5: RRA total
  calculatedData.rra =
    calculatedData.rra_price_per_kg *
    ((settings.rra_percentage ?? 0) / 100) *
    (net_weight ?? 0);

  // Step 6: Internal price/kg
  calculatedData.internal_price_per_kg = final_s_lme / 1000;

  // Step 7: Total amount (USD)
  calculatedData.total_amount =
    (calculatedData.internal_price_per_kg ?? 0) *
    (net_weight ?? 0);

  // Step 8: RMA & Inkomane in RWF
  calculatedData.rma =
    (settings.rma_per_kg_rwf ?? 0) * (net_weight ?? 0);
  calculatedData.inkomane_fee =
    (settings.inkomane_fee_per_kg_rwf ?? 0) *
    (net_weight ?? 0);

  // Step 9: Advance in RWF
  calculatedData.advance =
    (price_of_tag_per_kg_rwf ?? 0) * (net_weight ?? 0);

  // Step 10: Total charge in USD
  if (exchange_rate && exchange_rate !== 0) {
    calculatedData.total_charge =
      (calculatedData.rra ?? 0) +
      (calculatedData.rma ?? 0) / exchange_rate +
      (calculatedData.inkomane_fee ?? 0) / exchange_rate +
      (calculatedData.advance ?? 0) / exchange_rate;
  } else {
    calculatedData.total_charge = 0;
  }

  // Step 11: Net amount in USD
  calculatedData.net_amount =
    (calculatedData.total_amount ?? 0) -
    (calculatedData.total_charge ?? 0);

  return calculatedData;
};
