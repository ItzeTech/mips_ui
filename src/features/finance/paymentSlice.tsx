import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export type MineralType = 'TANTALUM' | 'TIN' | 'TUNGSTEN';

export interface Supplier {
  id: string;
  name: string;
  phone_number: string;
  company: string | null;
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
  paid_amount: number;
  avg_ta2o5_percentage: number | null;
  avg_sn_percentage: number | null;
  avg_wo3_percentage: number | null;
  mineral_types: string[];
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
  isFetched: false
};

// Async thunks
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
  setPagination
} = paymentSlice.actions;

export default paymentSlice.reducer;