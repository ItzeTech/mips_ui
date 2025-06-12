// features/settings/tantalumSettingSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export interface TantalumSettings {
  id: string;
  rra_percentage: number;
  rma_usd_per_ton: number;
  inkomane_fee_per_kg_rwf: number;
}

export interface TantalumSettingsData {
  rra_percentage: number;
  rma_usd_per_ton: number;
  inkomane_fee_per_kg_rwf: number;
}

interface TantalumSettingsState {
  settings: TantalumSettings | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  saveStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: TantalumSettingsState = {
  settings: null,
  status: 'idle',
  error: null,
  saveStatus: 'idle',
};

// Async thunks
export const fetchTantalumSettings = createAsyncThunk(
  'tantalumSettings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/settings/tantalum');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tantalum settings');
    }
  }
);

export const saveTantalumSettings = createAsyncThunk(
  'tantalumSettings/saveSettings',
  async (data: TantalumSettingsData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { tantalumSettings: TantalumSettingsState };
      const existingSettings = state.tantalumSettings.settings;
      
      let response;
      if (existingSettings) {
        // Update existing settings
        response = await axiosInstance.put('/settings/tantalum', data);
      } else {
        // Create new settings
        response = await axiosInstance.post('/settings/tantalum', data);
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save tantalum settings');
    }
  }
);

const tantalumSettingsSlice = createSlice({
  name: 'tantalumSettings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSaveStatus: (state) => {
      state.saveStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchTantalumSettings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTantalumSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(fetchTantalumSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Save settings
      .addCase(saveTantalumSettings.pending, (state) => {
        state.saveStatus = 'loading';
        state.error = null;
      })
      .addCase(saveTantalumSettings.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(saveTantalumSettings.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSaveStatus } = tantalumSettingsSlice.actions;
export default tantalumSettingsSlice.reducer;