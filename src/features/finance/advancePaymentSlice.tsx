// features/advancePayments/advancePaymentSlice.tsx
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export type PaymentStatus = 'Paid' | 'Unpaid';

export interface Supplier {
  id: string;
  name: string;
  phone_number: string;
  company: string | null;
}

export interface AdvancePayment {
  id: string;
  supplier_id: string;
  date: string;
  amount: number;
  payment_method: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  supplier: Supplier | null;
}

export interface CreateAdvancePaymentData {
  supplier_id: string;
  amount: number;
  payment_method: string;
  date?: string;
  status?: PaymentStatus;
}

export interface UpdateAdvancePaymentData {
  amount?: number;
  payment_method?: string;
  date?: string;
  status?: PaymentStatus;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface AdvancePaymentsResponse {
  items: AdvancePayment[];
  total: number;
  page: number;
  limit: number;
}

interface AdvancePaymentsState {
  advancePayments: AdvancePayment[];
  selectedAdvancePayment: AdvancePayment | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  isFetched: boolean;
}

const initialState: AdvancePaymentsState = {
  advancePayments: [],
  selectedAdvancePayment: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  isFetched: false
};

// Async thunks
export const fetchAdvancePayments = createAsyncThunk(
  'advancePayments/fetchAdvancePayments',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const response = await axiosInstance.get('/advance-payments', { 
        params: { page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch advance payments');
    }
  }
);

export const createAdvancePayment = createAsyncThunk(
  'advancePayments/createAdvancePayment',
  async (paymentData: CreateAdvancePaymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/advance-payments', paymentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create advance payment');
    }
  }
);

export const getAdvancePaymentById = createAsyncThunk(
  'advancePayments/getAdvancePaymentById',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/advance-payments/${paymentId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to get advance payment details');
    }
  }
);

export const updateAdvancePayment = createAsyncThunk(
  'advancePayments/updateAdvancePayment',
  async ({ id, updateData }: { id: string; updateData: UpdateAdvancePaymentData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/advance-payments/${id}`, updateData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update advance payment');
    }
  }
);

export const deleteAdvancePayment = createAsyncThunk(
  'advancePayments/deleteAdvancePayment',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/advance-payments/${paymentId}`);
      return paymentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete advance payment');
    }
  }
);

export const fetchSupplierAdvancePayments = createAsyncThunk(
  'advancePayments/fetchSupplierAdvancePayments',
  async ({ supplierId, params }: { supplierId: string, params: PaginationParams }, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const response = await axiosInstance.get(`/advance-payments/supplier/${supplierId}`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch supplier advance payments');
    }
  }
);

export const searchAdvancePayments = createAsyncThunk(
  'advancePayments/searchAdvancePayments',
  async ({ searchTerm, params }: { searchTerm: string, params: PaginationParams }, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const response = await axiosInstance.get('/advance-payments/search', {
        params: { search_term: searchTerm, page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to search advance payments');
    }
  }
);

const advancePaymentSlice = createSlice({
  name: 'advancePayments',
  initialState,
  reducers: {
    setSelectedAdvancePayment: (state, action: PayloadAction<AdvancePayment | null>) => {
      state.selectedAdvancePayment = action.payload;
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
    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationParams>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch advance payments
      .addCase(fetchAdvancePayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdvancePayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.advancePayments = action.payload.items;
        state.isFetched = true;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchAdvancePayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Create advance payment
      .addCase(createAdvancePayment.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createAdvancePayment.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.advancePayments.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createAdvancePayment.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Get advance payment by ID
      .addCase(getAdvancePaymentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAdvancePaymentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedAdvancePayment = action.payload;
        
        // Update in the list if exists
        const index = state.advancePayments.findIndex(payment => payment.id === action.payload.id);
        if (index !== -1) {
          state.advancePayments[index] = action.payload;
        }
      })
      .addCase(getAdvancePaymentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update advance payment
      .addCase(updateAdvancePayment.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateAdvancePayment.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.advancePayments.findIndex(payment => payment.id === action.payload.id);
        if (index !== -1) {
          state.advancePayments[index] = action.payload;
        }
        if (state.selectedAdvancePayment?.id === action.payload.id) {
          state.selectedAdvancePayment = action.payload;
        }
      })
      .addCase(updateAdvancePayment.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Delete advance payment
      .addCase(deleteAdvancePayment.pending, (state) => {
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteAdvancePayment.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.advancePayments = state.advancePayments.filter(payment => payment.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedAdvancePayment?.id === action.payload) {
          state.selectedAdvancePayment = null;
        }
      })
      .addCase(deleteAdvancePayment.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch supplier advance payments
      .addCase(fetchSupplierAdvancePayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSupplierAdvancePayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.advancePayments = action.payload.items;
        state.isFetched = true;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchSupplierAdvancePayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Search advance payments
      .addCase(searchAdvancePayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchAdvancePayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.advancePayments = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(searchAdvancePayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedAdvancePayment,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  setPagination
} = advancePaymentSlice.actions;

export default advancePaymentSlice.reducer;