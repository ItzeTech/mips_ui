import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, LoginResponse } from '../../types/auth';
import { loadState, saveState, removeState } from '../../utils/localStorage';
import axiosInstance from '../../config/axiosInstance'; // We'll create this next
import qs from 'qs';
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  sub: string; // email
  uid: string;
  roles: string[];
  exp: number;
  type: string;
}

const AUTH_STATE_KEY = 'authState';
const persistedAuthState = loadState<AuthState>(AUTH_STATE_KEY);

const initialState: AuthState = persistedAuthState || {
  accessToken: null,
  roles: [],
  isAuthenticated: false,
  user: null,
  status: 'idle',
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = qs.stringify(credentials); // Converts to username=...&password=...

      const response = await axiosInstance.post<LoginResponse>(
        '/auth/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        'Login failed'
      );
    }
  }
);

// Async thunk for logout (optional API call)
export const logoutUserApi = createAsyncThunk(
  'auth/logoutUserApi',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint if you have one
      await axiosInstance.post('/auth/logout');
      return true;
    } catch (error: any) {
      // Even if API logout fails, client-side logout should proceed
      console.warn("API logout failed, proceeding with client-side logout", error);
      return true; // Or handle specific errors
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<LoginResponse>) {
      state.accessToken = action.payload.access_token;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
      try {
        const decodedToken = jwtDecode<DecodedToken>(action.payload?.access_token);
        state.user = { /* map decoded fields to user object as needed */ email: decodedToken.sub, id: decodedToken.uid };
      } catch (e) {
        console.error("Failed to decode token:", e);
        state.user = null; // Or handle differently
      }
      saveState(AUTH_STATE_KEY, state);
    },
    logout(state) {
      state.accessToken = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      removeState(AUTH_STATE_KEY);
      localStorage.clear();
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.status = 'failed';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Mark as succeeded, actual credential set happens in component
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.roles = [];
      })
      .addCase(logoutUserApi.fulfilled, (state) => {
        logout()
      })
      .addCase(logoutUserApi.rejected, (state, action) => {
        console.error("Logout API call failed:", action.payload);
      });
  },
});

export const { setCredentials, logout, setAuthError } = authSlice.actions;
export default authSlice.reducer;
