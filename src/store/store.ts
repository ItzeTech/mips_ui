import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/themeSlice';
import userReducer from '../features/user/userSlice';
import usersReducer from '../features/user/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    user: userReducer,
    users: usersReducer
  },
  // Middleware can be added here if needed
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
