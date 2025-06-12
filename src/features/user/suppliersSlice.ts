// features/users/suppliersSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export interface Supplier {
  id: string;
  name: string;
  phone_number: string;
  email: string | null;
  national_id_or_passport: string | null;
  location: string | null;
  company: string | null;
  bank_account: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierData {
  name: string;
  phone_number: string;
}

export interface UpdateSupplierData {
  name: string;
  phone_number: string;
  email?: string;
  national_id_or_passport?: string;
  location?: string;
  company?: string;
  bank_account?: string;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface SuppliersResponse {
  items: Supplier[];
  total: number;
  page: number;
  size: number;
}

interface SuppliersState {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  pagination: {
    total: number;
    page: number;
    size: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: SuppliersState = {
  suppliers: [],
  selectedSupplier: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
  },
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
};

// Async thunks
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/suppliers', {
        params: {
          page: params.page,
          size: params.size,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suppliers');
    }
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/createSupplier',
  async (supplierData: CreateSupplierData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/suppliers', supplierData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create supplier');
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/updateSupplier',
  async ({ id, supplierData }: { id: string; supplierData: UpdateSupplierData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/suppliers/${id}`, supplierData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update supplier');
    }
  }
);

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSelectedSupplier: (state, action: PayloadAction<Supplier | null>) => {
      state.selectedSupplier = action.payload;
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
    setPagination: (state, action: PayloadAction<Partial<PaginationParams>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.suppliers = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          size: action.payload.size,
        };
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Create supplier
      .addCase(createSupplier.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        // Add to the beginning of the list
        state.suppliers.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update supplier
      .addCase(updateSupplier.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.suppliers.findIndex(supplier => supplier.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.selectedSupplier?.id === action.payload.id) {
          state.selectedSupplier = action.payload;
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { 
  setSelectedSupplier, 
  clearError, 
  resetCreateStatus, 
  resetUpdateStatus,
  setPagination 
} = suppliersSlice.actions;
export default suppliersSlice.reducer;