// features/finance/expenseSlice.tsx
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export interface Expense {
  id: string;
  date: string;
  person: string;
  description: string;
  amount: number;
  created_at: string;
}

export interface CreateExpenseData {
  date: string;
  person: string;
  description: string;
  amount: number;
}

export interface UpdateExpenseData {
  date?: string;
  person?: string;
  description?: string;
  amount?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ExpensesResponse {
  items: Expense[];
  total: number;
  page: number;
  limit: number;
}

interface ExpensesState {
  expenses: Expense[];
  selectedExpense: Expense | null;
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

const initialState: ExpensesState = {
  expenses: [],
  selectedExpense: null,
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
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const response = await axiosInstance.get('/expenses', { 
        params: { page, limit }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch expenses');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (expenseData: CreateExpenseData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/expenses', expenseData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create expense');
    }
  }
);

export const getExpenseById = createAsyncThunk(
  'expenses/getExpenseById',
  async (expenseId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/expenses/${expenseId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to get expense details');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, updateData }: { id: string; updateData: UpdateExpenseData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/expenses/${id}`, updateData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (expenseId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/expenses/${expenseId}`);
      return expenseId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete expense');
    }
  }
);

export const searchExpenses = createAsyncThunk(
  'expenses/searchExpenses',
  async ({ 
    query, 
    params,
    dateFrom,
    dateTo,
    amountMin,
    amountMax
  }: { 
    query?: string, 
    params: PaginationParams,
    dateFrom?: string,
    dateTo?: string,
    amountMin?: number,
    amountMax?: number
  }, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const response = await axiosInstance.get('/expenses/search', {
        params: { 
          person: query, 
          description: query, 
          page, 
          limit,
          date_from: dateFrom,
          date_to: dateTo,
          amount_min: amountMin,
          amount_max: amountMax
        }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to search expenses');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setSelectedExpense: (state, action: PayloadAction<Expense | null>) => {
      state.selectedExpense = action.payload;
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
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload?.items || [];
        state.isFetched = true;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Create expense
      .addCase(createExpense.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.expenses.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Get expense by ID
      .addCase(getExpenseById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getExpenseById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedExpense = action.payload;
        
        // Update in the list if exists
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(getExpenseById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update expense
      .addCase(updateExpense.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        if (state.selectedExpense?.id === action.payload.id) {
          state.selectedExpense = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Delete expense
      .addCase(deleteExpense.pending, (state) => {
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedExpense?.id === action.payload) {
          state.selectedExpense = null;
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Search expenses
      .addCase(searchExpenses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(searchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedExpense,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  setPagination
} = expenseSlice.actions;

export default expenseSlice.reducer;