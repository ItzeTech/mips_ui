import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export type MineralType = 'TANTALUM' | 'TIN' | 'TUNGSTEN';

export interface Supplier {
  id: string;
  name: string;
  phone_number: string;
  company: string | null;
}

// Detailed mineral interfaces
export interface TantalumDetail {
  id: string;
  date_of_delivery: string | null;
  date_of_sampling: string | null;
  date_of_alex_stewart: string | null;
  lot_number: string;
  supplier_id: string;
  supplier_name: string | null;
  net_weight: number;
  
  // Internal composition
  internal_ta2o5: number | null;
  internal_nb2o5: number | null;
  nb_percentage: number | null;
  sn_percentage: number | null;
  fe_percentage: number | null;
  w_percentage: number | null;
  
  // Alex-Stewart composition
  alex_stewart_ta2o5: number | null;
  alex_stewart_nb2o5: number | null;
  
  // Pricing info
  price_per_percentage: number | null;
  purchase_ta2o5_percentage: number | null;
  unit_price: number | null;
  exchange_rate: number | null;
  price_of_tag_per_kg_rwf: number | null;
  total_amount: number | null;
  
  // Fees and charges
  rra: number | null;
  rma: number | null;
  inkomane_fee: number | null;
  advance: number | null;
  total_charge: number | null;
  net_amount: number | null;
  
  // Status
  stock_status: string | null;
  finance_status: string | null;
  previous_finance_status: string | null;
  is_paid: boolean;
  finance_status_changed_date: string | null;
  stock_status_changed_date: string | null;
  has_alex_stewart: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface TinDetail {
  id: string;
  date_of_delivery: string | null;
  date_of_sampling: string | null;
  date_of_alex_stewart: string | null;
  lot_number: string;
  supplier_id: string;
  supplier_name: string | null;
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
  stock_status: string | null;
  finance_status: string | null;
  previous_finance_status: string | null;
  is_paid: boolean;
  finance_status_changed_date: string | null;
  stock_status_changed_date: string | null;
  has_alex_stewart: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface TungstenDetail {
  id: string;
  date_of_delivery: string | null;
  date_of_sampling: string | null;
  date_of_alex_stewart: string | null;
  finance_status_changed_date: string | null;
  stock_status_changed_date: string | null;
  
  lot_number: string;
  supplier_id: string;
  supplier_name: string | null;
  net_weight: number;
  
  // Composition
  wo3_percentage: number | null;
  w_percentage: number | null;
  fe_percentage: number | null;
  bal_percentage: number | null;
  alex_stewart_wo3_percentage: number | null;
  purchase_wo3_percentage: number | null;
  
  // Pricing
  mtu: number | null;
  price_per_kg: number | null;
  total_amount: number | null;
  
  // Charges
  rra: number | null;
  rma: number | null;
  inkomane_fee: number | null;
  exchange_rate: number | null;
  price_of_tag_per_kg_rwf: number | null;
  advance: number | null;
  total_charge: number | null;
  net_amount: number | null;
  
  // Status
  has_alex_stewart: boolean;
  stock_status: string | null;
  finance_status: string | null;
  previous_finance_status: string | null;
  is_paid: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface AdvancePaymentDetail {
  id: string;
  supplier_id: string;
  date: string;
  amount: number;
  payment_method: string;
  status: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  supplier_id: string;
  supplier_name: string | null;
  tantalum_total_weight: number | null;
  tin_total_weight: number | null;
  tungsten_total_weight: number | null;
  total_weight: number;
  advance_amount: number;
  total_amount: number;
  payable_amount: number;
  paid_amount: number;
  is_fully_paid: boolean;
  payment_status: 'UNPAID' | 'PARTIALLY_PAID' | 'FULLY_PAID';
  last_payment_date: string | null;
  avg_ta2o5_percentage: number | null;
  avg_sn_percentage: number | null;
  avg_wo3_percentage: number | null;
  mineral_types: string[];
  
  // Detailed mineral and advance information
  tantalum_minerals: TantalumDetail[];
  tin_minerals: TinDetail[];
  tungsten_minerals: TungstenDetail[];
  advance_payments: AdvancePaymentDetail[];
  
  // Keep ID lists for backward compatibility
  tantalum_ids: string[];
  tin_ids: string[];
  tungsten_ids: string[];
  advance_ids: string[];
  
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentData {
  supplier_id: string;
  tantalum_ids?: string[];
  tin_ids?: string[];
  tungsten_ids?: string[];
  advance_ids?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaymentsResponse {
  items: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdatePaymentsData {
  paid_amount?: number;
}

interface PaymentsState {
  payments: Payment[];
  selectedPayment: Payment | null;
  previewPayment: Payment | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  previewStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  isFetched: boolean;
}

const initialState: PaymentsState = {
  payments: [],
  selectedPayment: null,
  previewPayment: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  status: 'idle',
  error: null,
  createStatus: 'idle',
  previewStatus: 'idle',
  updateStatus: 'idle',
  isFetched: false
};

// Async thunks remain the same...
export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const response = await axiosInstance.get('/payments', { 
        params: { page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch payments');
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData: CreatePaymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/payments', paymentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create payment');
    }
  }
);

export const getPaymentById = createAsyncThunk(
  'payments/getPaymentById',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payments/${paymentId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to get payment details');
    }
  }
);

export const fetchSupplierPayments = createAsyncThunk(
  'payments/fetchSupplierPayments',
  async ({ supplierId, params }: { supplierId: string, params: PaginationParams }, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const response = await axiosInstance.get(`/payments/supplier/${supplierId}`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch supplier payments');
    }
  }
);

export const previewPaymentCalculation = createAsyncThunk(
  'payments/previewPaymentCalculation',
  async (paymentData: CreatePaymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/payments/preview', paymentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to preview payment');
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payments/updatePayment',
  async ({ id, updateData }: { id: string; updateData: UpdatePaymentsData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/payments/${id}`, updateData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update payment');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setSelectedPayment: (state, action: PayloadAction<Payment | null>) => {
      state.selectedPayment = action.payload;
    },
    clearPreviewPayment: (state) => {
      state.previewPayment = null;
      state.previewStatus = 'idle';
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
    resetPreviewStatus: (state) => {
      state.previewStatus = 'idle';
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationParams>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payments = action.payload.items;
        state.isFetched = true;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.payments.unshift(action.payload);
        state.pagination.total += 1;
        // Clear preview after successful creation
        state.previewPayment = null;
        state.previewStatus = 'idle';
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Get payment by ID
      .addCase(getPaymentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedPayment = action.payload;
        
        // Update in the list if exists
        const index = state.payments.findIndex(payment => payment.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(getPaymentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch supplier payments
      .addCase(fetchSupplierPayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSupplierPayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payments = action.payload.items;
        state.isFetched = true;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchSupplierPayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Update payment
      .addCase(updatePayment.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.payments.findIndex(payment => payment.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.selectedPayment?.id === action.payload.id) {
          state.selectedPayment = action.payload;
        }
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Preview payment
      .addCase(previewPaymentCalculation.pending, (state) => {
        state.previewStatus = 'loading';
        state.error = null;
      })
      .addCase(previewPaymentCalculation.fulfilled, (state, action) => {
        state.previewStatus = 'succeeded';
        state.previewPayment = action.payload;
      })
      .addCase(previewPaymentCalculation.rejected, (state, action) => {
        state.previewStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedPayment,
  clearPreviewPayment,
  clearError,
  resetCreateStatus,
  resetPreviewStatus,
  resetUpdateStatus,
  setPagination
} = paymentSlice.actions;

export default paymentSlice.reducer;