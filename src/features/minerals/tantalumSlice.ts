// features/minerals/tantalumSlice.tsx
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import { TantalumSettingsData } from '../settings/tantalumSettingSlice';

export type StockStatus = 'in-stock' | 'withdrawn' | 'resampled' | 'exported';
export type FinanceStatus = 'paid' | 'unpaid' | 'invoiced' | 'exported';

export interface StockFormData {
  net_weight: number | null;
  date_of_sampling: string;
  date_of_delivery?: string;
  stock_status: StockStatus;
}

export interface LabFormData {
  internal_ta2o5: number | null;
  internal_nb2o5: number | null;
  nb_percentage: number | null;
  sn_percentage: number | null;
  fe_percentage: number | null;
  w_percentage: number | null;
  alex_stewart_ta2o5?: number | null;
  alex_stewart_nb2o5?: number | null;
}

export interface FinancialFormData {
  price_per_percentage: number | null;
  purchase_ta2o5_percentage: number | null;
  exchange_rate: number | null;
  price_of_tag_per_kg_rwf: number | null;
  finance_status: FinanceStatus;

  rra_percentage_fee: number | null;
  rma_usd_per_ton_fee: number | null;
  inkomane_fee_per_kg_rwf_fee: number | null;
  rra_price_per_percentage_fee: number | null;
  transport_charge: number | null;
  alex_stewart_charge: number | null;
}

export interface Tantalum {
  id: string;
  tantalum_id: string | null;
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
  rra_total_amount: number | number;
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

  rra_percentage_fee: number | null;
  rma_usd_per_ton_fee: number | null;
  inkomane_fee_per_kg_rwf_fee: number | null;
  rra_price_per_percentage_fee: number | null;

  transport_charge: number | null;
  alex_stewart_charge: number | null;
}

export interface CreateTantalumData {
  supplier_id: string;
  net_weight: number;
  date_of_sampling: string;
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
  price_per_percentage?: number | null;
  purchase_ta2o5_percentage?: number | null;
  unit_price?: number | null;
  exchange_rate?: number | null;
  price_of_tag_per_kg?: number | null;
  total_amount?: number | null;
  rra?: number | null;
  rma?: number | null;
  inkomane_fee?: number | null;
  advance?: number | null;
  total_charge?: number | null;
  net_amount?: number | null;
  finance_status?: FinanceStatus;

  rra_percentage_fee?: number | null;
  rma_usd_per_ton_fee?: number | null;
  inkomane_fee_per_kg_rwf_fee?: number | null;
  rra_price_per_percentage_fee?: number | null;

  transport_charge: number | null;
  alex_stewart_charge: number | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface TantalumSearchParams extends PaginationParams {
  search?: string;
  stockStatus?: StockStatus;
  financeStatus: FinanceStatus;
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

export const fetchTantalums = createAsyncThunk(
  'tantalums/fetchTantalums',
  async (params: TantalumSearchParams, { rejectWithValue }) => {
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
        
        const response = await axiosInstance.get('/tantalum/search/item', { params: searchParams });
        return response.data.data;
      } else {
        const response = await axiosInstance.get('/tantalum', { 
          params: { page, limit }
        });
        return response.data.data;
      }
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

export const updateStock = createAsyncThunk(
  'tantalums/updateStock',
  async ({ id, stockData }: { id: string; stockData: StockFormData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tantalum/${id}`, stockData);
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
      const response = await axiosInstance.patch(`/tantalum/${id}/lab-analysis`, labData);
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
      const response = await axiosInstance.patch(`/tantalum/${id}/financials`, financialData);
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
      // Update stock
      .addCase(updateStock.pending, (state) => {
        state.updateStockStatus = 'loading';
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.updateStockStatus = 'succeeded';
        const index = state.tantalums.findIndex(tantalum => tantalum.id === action.payload.id);
        if (index !== -1) {
          state.tantalums[index] = action.payload;
        }
        if (state.selectedTantalum?.id === action.payload.id) {
          state.selectedTantalum = action.payload;
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

export const calculateFinancials = (data: Partial<Tantalum>, {rra_percentage, inkomane_fee_per_kg_rwf, rma_usd_per_ton, rra_price_per_percentage}: TantalumSettingsData, useCustomFees: boolean =false): Partial<Tantalum> => {
  const {
    price_per_percentage,
    purchase_ta2o5_percentage,
    net_weight,
    exchange_rate,
    price_of_tag_per_kg_rwf,
  } = data;

  let calculatedData: Partial<Tantalum> = { ...data };



  const rraPercentage = useCustomFees ? (data.rra_percentage_fee) : rra_percentage;
  const rmaUsdPerKg = useCustomFees ? (data.rma_usd_per_ton_fee ?? 0) : rma_usd_per_ton;
  const inkomaneFeePerKg = useCustomFees ? data.inkomane_fee_per_kg_rwf_fee : inkomane_fee_per_kg_rwf;
  const rraPricePerPercentage = useCustomFees ? data.rra_price_per_percentage_fee : rra_price_per_percentage;

  if (price_per_percentage && purchase_ta2o5_percentage) {
    calculatedData.unit_price = price_per_percentage * purchase_ta2o5_percentage;
  }

  if (calculatedData.unit_price && net_weight) {
    calculatedData.total_amount = calculatedData.unit_price * net_weight;
  }

  if (purchase_ta2o5_percentage && net_weight && rraPricePerPercentage) {
    let rra_total_amount = purchase_ta2o5_percentage * net_weight * rraPricePerPercentage;
    calculatedData.rra = rra_total_amount * ((rraPercentage ?? rra_percentage) / 100);
  }

  if (net_weight) {
    calculatedData.rma = ((rmaUsdPerKg ?? rma_usd_per_ton) / (exchange_rate ?? 1)) * net_weight;
  }

  if (net_weight) {
    calculatedData.inkomane_fee = (inkomaneFeePerKg ?? inkomane_fee_per_kg_rwf) * net_weight;
  }

  if (net_weight) {
    calculatedData.advance = (price_of_tag_per_kg_rwf ?? 0) * net_weight;

  }

  if (calculatedData.rra && calculatedData.rma && calculatedData.inkomane_fee && exchange_rate) {
    calculatedData.total_charge = calculatedData.rra + ((calculatedData.rma ?? 0)) + 
      (calculatedData.inkomane_fee / exchange_rate) + ((calculatedData.advance ?? 0) / exchange_rate) + ((data.transport_charge ?? 0)) + ((data.alex_stewart_charge ?? 0));
  }

  if (calculatedData.total_amount && calculatedData.total_charge) {
    calculatedData.net_amount = calculatedData.total_amount - calculatedData.total_charge;
  }

  console.log(calculatedData);

  return calculatedData;
};