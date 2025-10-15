import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  title: string | null;
  notification_type: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface NotificationStats {
  total_count: number;
  unread_count: number;
  read_count: number;
}

export interface PaginationParams {
  page: number;
  size: number;
  unread_only?: boolean;
  user_id?: string;
}

export interface NotificationsResponse {
  items: Notification[];
  total: number;
  page: number;
  size: number;
}

interface NotificationsState {
  notifications: Notification[];
  stats: NotificationStats;
  pagination: {
    total: number;
    page: number;
    size: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  markReadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  statsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  isFetched: boolean;
}

const initialState: NotificationsState = {
  notifications: [],
  stats: {
    total_count: 0,
    unread_count: 0,
    read_count: 0,
  },
  pagination: {
    total: 0,
    page: 1,
    size: 20,
  },
  status: 'idle',
  error: null,
  markReadStatus: 'idle',
  statsStatus: 'idle',
  isFetched: false,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/notifications', {
        params: {
          page: params.page,
          size: params.size,
          unread_only: params.unread_only,
          user_id: params.user_id,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch notifications');
    }
  }
);

export const fetchNotificationStats = createAsyncThunk(
  'notifications/fetchStats',
  async (_, { rejectWithValue } ) => {
    try {
      const response = await axiosInstance.get('/notifications/stats/summary');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch notification stats');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/notifications/read-all');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark all notifications as read');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Add new notification to the beginning
      state.notifications.unshift(action.payload);
      state.stats.total_count += 1;
      if (!action.payload.is_read) {
        state.stats.unread_count += 1;
      } else {
        state.stats.read_count += 1;
      }
      state.pagination.total += 1;
    },
    updateNotification: (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        const oldNotification = state.notifications[index];
        state.notifications[index] = action.payload;
        
        // Update stats if read status changed
        if (oldNotification.is_read !== action.payload.is_read) {
          if (action.payload.is_read) {
            state.stats.unread_count -= 1;
            state.stats.read_count += 1;
          } else {
            state.stats.unread_count += 1;
            state.stats.read_count -= 1;
          }
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetMarkReadStatus: (state) => {
      state.markReadStatus = 'idle';
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationParams>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    // For real-time updates from WebSocket
    handleWebSocketNotification: (state, action: PayloadAction<any>) => {
      const { event_type, notification } = action.payload;
      
      if (event_type === 'new_notification' && notification) {
        const newNotification: Notification = {
          id: notification.id,
          user_id: notification.user_id,
          message: notification.message,
          title: notification.title,
          notification_type: notification.notification_type,
          is_read: notification.is_read,
          created_at: notification.created_at,
          read_at: notification.read_at,
        };
        
        // Check if notification already exists to avoid duplicates in store
        const exists = state.notifications.some(n => n.id === newNotification.id);
        if (!exists) {
          state.notifications.unshift(newNotification);
          state.stats.total_count += 1;
          state.stats.unread_count += 1;
          state.pagination.total += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload?.items || [];
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          size: action.payload.size,
        };
        state.isFetched = true;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isFetched = false;
      })

      // Fetch stats
      .addCase(fetchNotificationStats.pending, (state) => {
        state.statsStatus = 'loading';
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchNotificationStats.rejected, (state, action) => {
        state.statsStatus = 'failed';
        state.error = action.payload as string;
      })

      // Mark as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.markReadStatus = 'loading';
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.markReadStatus = 'succeeded';
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          const wasUnread = !state.notifications[index].is_read;
          state.notifications[index] = action.payload;
          if (wasUnread) {
            state.stats.unread_count -= 1;
            state.stats.read_count += 1;
          }
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.markReadStatus = 'failed';
        state.error = action.payload as string;
      })

      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }));
        state.stats.unread_count = 0;
        state.stats.read_count = state.stats.total_count;
      });
  },
});

export const { 
  addNotification,
  updateNotification,
  clearError, 
  resetMarkReadStatus,
  setPagination,
  handleWebSocketNotification
} = notificationsSlice.actions;

export default notificationsSlice.reducer;