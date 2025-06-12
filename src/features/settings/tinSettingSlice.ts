// features/settings/tinSettingSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export interface TinSettings {
  id: string;
  government_treatment_charge_usd: number;
  rra_percentage: number;
  rma_per_kg_rwf: number;
  inkomane_fee_per_kg_rwf: number;
}

export interface TinSettingsData {
  government_treatment_charge_usd: number;
  rra_percentage: number;
  rma_per_kg_rwf: number;
  inkomane_fee_per_kg_rwf: number;
}

interface TinSettingsState {
  settings: TinSettings | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  saveStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: TinSettingsState = {
  settings: null,
  status: 'idle',
  error: null,
  saveStatus: 'idle',
};

// Async thunks
export const fetchTinSettings = createAsyncThunk(
  'tinSettings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/settings/tin');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tin settings');
    }
  }
);

export const saveTinSettings = createAsyncThunk(
  'tinSettings/saveSettings',
  async (data: TinSettingsData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { tinSettings: TinSettingsState };
      const existingSettings = state.tinSettings.settings;
      
      let response;
      if (existingSettings) {
        // Update existing settings
        response = await axiosInstance.put('/settings/tin', data);
      } else {
        // Create new settings
        response = await axiosInstance.post('/settings/tin', data);
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save tin settings');
    }
  }
);

const tinSettingsSlice = createSlice({
  name: 'tinSettings',
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
      .addCase(fetchTinSettings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTinSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(fetchTinSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Save settings
      .addCase(saveTinSettings.pending, (state) => {
        state.saveStatus = 'loading';
        state.error = null;
      })
      .addCase(saveTinSettings.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(saveTinSettings.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSaveStatus } = tinSettingsSlice.actions;
export default tinSettingsSlice.reducer;