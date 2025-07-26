// features/settings/generalSettingsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export interface GeneralSettings {
  id: string;
  company_name: string;
  logo: string | null;
  tin: string;
  address: string;
  telephone_number: string;
  updated_at?: string;
}

export interface GeneralSettingsData {
  company_name: string;
  tin: string;
  address: string;
  telephone_number: string;
}

interface GeneralSettingsState {
  settings: GeneralSettings | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  saveStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  isFetched: boolean;
}

const initialState: GeneralSettingsState = {
  settings: null,
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  isFetched: false
};

// Async thunks
export const fetchGeneralSettings = createAsyncThunk(
  'generalSettings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/settings/general');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch general settings');
    }
  }
);

export const saveGeneralSettings = createAsyncThunk(
  'generalSettings/saveSettings',
  async ({ formData, isUpdate }: { formData: FormData, isUpdate: boolean }, { rejectWithValue }) => {
    try {
      let response;
      if (isUpdate) {
        // Update existing settings
        response = await axiosInstance.put('/settings/general', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new settings
        response = await axiosInstance.post('/settings/general', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save general settings');
    }
  }
);

const generalSettingsSlice = createSlice({
  name: 'generalSettings',
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
      .addCase(fetchGeneralSettings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGeneralSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
        state.isFetched = true;
      })
      .addCase(fetchGeneralSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Save settings
      .addCase(saveGeneralSettings.pending, (state) => {
        state.saveStatus = 'loading';
        state.error = null;
      })
      .addCase(saveGeneralSettings.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(saveGeneralSettings.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSaveStatus } = generalSettingsSlice.actions;
export default generalSettingsSlice.reducer;