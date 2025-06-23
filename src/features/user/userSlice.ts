import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import { loadState, saveState, removeState } from '../../utils/localStorage';

const USER_STATE_KEY = 'userState';

export interface UserState {
  id: string | null;
  full_name: string;
  national_id: string;
  phone_number: string;
  email: string;
  roles: string[];
  location: string;
  status: string;
  created_at: string;
  updated_at: string;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  isFetched: boolean;
}

const persistedUserState = loadState<UserState>(USER_STATE_KEY);

const initialState: UserState = persistedUserState || {
  id: null,
  full_name: '',
  national_id: '',
  phone_number: '',
  email: '',
  roles: [],
  location: '',
  status: '',
  created_at: '',
  updated_at: '',
  loading: 'idle',
  error: null,
  isFetched: false
};

// Async thunk: fetch user from API
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ data: UserState }>('/users/me');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch user data');
    }
  }
);

// Async thunk: update user partially
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (updates: Partial<UserState>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<{ data: UserState }>('/users/me', updates);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue('Failed to update user data');
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData: { current_password: string; new_password: string }, { rejectWithValue }) => {
    try {
      console.log(passwordData)
      const response = await axiosInstance.post('/auth/password/change', passwordData);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      Object.assign(state, {
        id: null,
        full_name: '',
        national_id: '',
        phone_number: '',
        email: '',
        roles: [],
        location: '',
        status: '',
        created_at: '',
        updated_at: '',
        loading: 'idle',
        error: null,
      });
      removeState(USER_STATE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<UserState>) => {
        Object.assign(state, action.payload, { loading: 'succeeded', error: null });
        saveState(USER_STATE_KEY, state);
        state.isFetched = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserState>) => {
        Object.assign(state, action.payload, { loading: 'succeeded', error: null });
        saveState(USER_STATE_KEY, state);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = 'idle';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      })
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;