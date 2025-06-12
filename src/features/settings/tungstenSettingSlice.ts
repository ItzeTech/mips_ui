// features/settings/tungstenSettingSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export interface TungstenSettings {
  id: string;
  rra_percentage: number;
  rma_usd_per_ton: number;
  inkomane_fee_per_kg_rwf: number;
}

export interface TungstenSettingsData {
  rra_percentage: number;
  rma_usd_per_ton: number;
  inkomane_fee_per_kg_rwf: number;
}

interface TungstenSettingsState {
  settings: TungstenSettings | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  saveStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: TungstenSettingsState = {
  settings: null,
  status: 'idle',
  error: null,
  saveStatus: 'idle',
};

// Async thunks
export const fetchTungstenSettings = createAsyncThunk(
  'tungstenSettings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/settings/tungsten');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tungsten settings');
    }
  }
);

export const saveTungstenSettings = createAsyncThunk(
  'tungstenSettings/saveSettings',
  async (data: TungstenSettingsData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { tungstenSettings: TungstenSettingsState };
      const existingSettings = state.tungstenSettings.settings;
      
      let response;
      if (existingSettings) {
        // Update existing settings
        response = await axiosInstance.put('/settings/tungsten', data);
      } else {
        // Create new settings
        response = await axiosInstance.post('/settings/tungsten', data);
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save tungsten settings');
    }
  }
);

const tungstenSettingsSlice = createSlice({
  name: 'tungstenSettings',
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
      .addCase(fetchTungstenSettings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTungstenSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(fetchTungstenSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Save settings
      .addCase(saveTungstenSettings.pending, (state) => {
        state.saveStatus = 'loading';
        state.error = null;
      })
      .addCase(saveTungstenSettings.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(saveTungstenSettings.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSaveStatus } = tungstenSettingsSlice.actions;
export default tungstenSettingsSlice.reducer;