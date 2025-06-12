// features/minerals/mixed-mineralSlice.tsx
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export interface MixedMineral {
  id: string;
  date_of_delivery: string;
  supplier_id: string;
  weight_kg: number;
  status: 'processed' | 'unprocessed';
  lot_number: string;
  supplier_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMixedMineralData {
  date_of_delivery: string;
  supplier_id: string;
  weight_kg: number;
}

export interface UpdateMixedMineralData {
  date_of_delivery?: string;
  weight_kg: number;
  supplier_id?: string;
}

export interface UpdateMixedMineralStatusData {
  status: 'processed' | 'unprocessed';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface MixedMineralsResponse {
  items: MixedMineral[];
  total: number;
  page: number;
  limit: number;
}

interface MixedMineralsState {
  minerals: MixedMineral[];
  selectedMineral: MixedMineral | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatusStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: MixedMineralsState = {
  minerals: [],
  selectedMineral: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
  updateStatusStatus: 'idle',
};

// Async thunks
export const fetchMixedMinerals = createAsyncThunk(
  'mixedMinerals/fetchMixedMinerals',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/mixed-minerals', {
        params: {
          page: params.page,
          limit: params.limit,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mixed minerals');
    }
  }
);

export const createMixedMineral = createAsyncThunk(
  'mixedMinerals/createMixedMineral',
  async (mineralData: CreateMixedMineralData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/mixed-minerals', mineralData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create mixed mineral');
    }
  }
);

export const updateMixedMineral = createAsyncThunk(
  'mixedMinerals/updateMixedMineral',
  async ({ id, mineralData }: { id: string; mineralData: UpdateMixedMineralData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/mixed-minerals/${id}`, mineralData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update mixed mineral');
    }
  }
);

export const updateMixedMineralStatus = createAsyncThunk(
  'mixedMinerals/updateMixedMineralStatus',
  async ({ id, status }: { id: string; status: UpdateMixedMineralStatusData }, { rejectWithValue }) => {
    try {
      console.log(status)
      const response = await axiosInstance.put(`/mixed-minerals/${id}`, {status: status});
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const mixedMineralsSlice = createSlice({
  name: 'mixedMinerals',
  initialState,
  reducers: {
    setSelectedMineral: (state, action: PayloadAction<MixedMineral | null>) => {
      state.selectedMineral = action.payload;
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
    resetUpdateStatusStatus: (state) => {
      state.updateStatusStatus = 'idle';
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationParams>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch mixed minerals
      .addCase(fetchMixedMinerals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMixedMinerals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.minerals = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchMixedMinerals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Create mixed mineral
      .addCase(createMixedMineral.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createMixedMineral.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        // Add to the beginning of the list
        state.minerals.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createMixedMineral.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update mixed mineral
      .addCase(updateMixedMineral.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateMixedMineral.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.minerals.findIndex(mineral => mineral.id === action.payload.id);
        if (index !== -1) {
          state.minerals[index] = action.payload;
        }
        if (state.selectedMineral?.id === action.payload.id) {
          state.selectedMineral = action.payload;
        }
      })
      .addCase(updateMixedMineral.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update mixed mineral status
      .addCase(updateMixedMineralStatus.pending, (state) => {
        state.updateStatusStatus = 'loading';
        state.error = null;
      })
      .addCase(updateMixedMineralStatus.fulfilled, (state, action) => {
        state.updateStatusStatus = 'succeeded';
        const index = state.minerals.findIndex(mineral => mineral.id === action.payload.id);
        if (index !== -1) {
          state.minerals[index] = action.payload;
        }
        if (state.selectedMineral?.id === action.payload.id) {
          state.selectedMineral = action.payload;
        }
      })
      .addCase(updateMixedMineralStatus.rejected, (state, action) => {
        state.updateStatusStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedMineral,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetUpdateStatusStatus,
  setPagination
} = mixedMineralsSlice.actions;
export default mixedMineralsSlice.reducer;