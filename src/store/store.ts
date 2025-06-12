import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/themeSlice';
import userReducer from '../features/user/userSlice';
import usersReducer from '../features/user/usersSlice';
import tantalumSettingsReducer from '../features/settings/tantalumSettingSlice';
import tinSettingsReducer from '../features/settings/tinSettingSlice';
import tungstenSettingsReducer from '../features/settings/tungstenSettingSlice';
import suppliersReducer from '../features/user/suppliersSlice';
import mixedMineralsReducer from '../features/minerals/mixedMineralsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    user: userReducer,
    users: usersReducer,
    tantalumSettings: tantalumSettingsReducer,
    tinSettings: tinSettingsReducer,
    tungstenSettings: tungstenSettingsReducer,
    suppliers: suppliersReducer,
    mixedMinerals: mixedMineralsReducer
  },
  // Middleware can be added here if needed
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
