import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/themeSlice';
import userReducer from '../features/user/userSlice';
import usersReducer from '../features/user/usersSlice';
import generalSettingsReducer from '../features/settings/generalSettingsSlice';
import tantalumSettingsReducer from '../features/settings/tantalumSettingSlice';
import tinSettingsReducer from '../features/settings/tinSettingSlice';
import tungstenSettingsReducer from '../features/settings/tungstenSettingSlice';
import suppliersReducer from '../features/user/suppliersSlice';
import mixedMineralsReducer from '../features/minerals/mixedMineralsSlice';
import tantalumsReducer from '../features/minerals/tantalumSlice';
import tinReducer from '../features/minerals/tinSlice';
import tungstenReducer from '../features/minerals/tungstenSlice';
import selectedMineralsReducer from '../features/minerals/selectedMineralsSlice';
import salesReducer from '../features/finance/salesSlice';
import advancePaymentsReducer from "../features/finance/advancePaymentSlice"
import paymentsReducer from "../features/finance/paymentSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    user: userReducer,
    users: usersReducer,
    generalSettings: generalSettingsReducer,
    tantalumSettings: tantalumSettingsReducer,
    tinSettings: tinSettingsReducer,
    tungstenSettings: tungstenSettingsReducer,
    suppliers: suppliersReducer,
    mixedMinerals: mixedMineralsReducer,
    tantalums: tantalumsReducer,
    tins: tinReducer,
    tungstens: tungstenReducer,
    selectedMinerals: selectedMineralsReducer,
    sales: salesReducer,
    advancePayments: advancePaymentsReducer,
    payments: paymentsReducer
  },
  // Middleware can be added here if needed
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
