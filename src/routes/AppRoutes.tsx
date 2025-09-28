import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Pages
import LoginPage from '../pages/Auth/LoginPage';
import ForgotPasswordPage from '../pages/Auth/ForgetPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import DashboardOverviewPage from '../pages/Dashboard/DashboardOverviewPage';
import ProfilePage from '../pages/Dashboard/ProfilePage';
import SettingsPage from '../pages/Dashboard/SettingsPage';
import ChangePasswordPage from '../pages/Dashboard/ChangePasswordPage';
import UsersPage from '../pages/Dashboard/UsersPage';
import SuppliersPage from '../pages/Dashboard/SuppliersPage';
import MixedMineralsPage from '../pages/minerals/MixedMineralsPage';
import TantalumPage from '../pages/minerals/TantalumPage';
import TinPage from '../pages/minerals/TinPage';
import TungstenPage from '../pages/minerals/TungstenPage';
import NotFoundPage from '../pages/NotFoundPage';

// Sales Pages
import SalesPage from '../pages/sales/SalesPage';
import CreateSalePage from '../pages/sales/CreateSalePage';
import ViewSalePage from '../pages/sales/ViewSalePage';

// Advance Payment Pages
import AdvancePaymentsPage from '../pages/advancePayments/AdvancePaymentsPage';
import CreateAdvancePaymentPage from '../pages/advancePayments/CreateAdvancePaymentPage';
import ViewAdvancePaymentPage from '../pages/advancePayments/ViewAdvancePaymentPage';

// Payment Pages
import PaymentsPage from '../pages/payments/PaymentsPage';
import CreatePaymentPage from '../pages/payments/CreatePaymentPage';
import ViewPaymentPage from '../pages/payments/ViewPaymentPage';

// Expense Pages
import ExpensesPage from '../pages/expenses/ExpensesPage';
import CreateExpensePage from '../pages/expenses/CreateExpensePage';
import ViewExpensePage from '../pages/expenses/ViewExpensePage';

// Route Protectors
import ProtectedRoute from './ProtectedRoutes';
import RoleBasedRoute from './RoleBasedRoute';
import { useAuth } from '../hooks/useAuth';
import { DashboardLayoutWithOutlet } from '../components/dashboard/layout/DashboardLayout';
import Unauthorized from '../pages/Unauthorized';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  return (
    <Routes location={location} key={location.pathname}>
      {/* Auth routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayoutWithOutlet />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="/profile/change-password" element={<ChangePasswordPage/>} />

          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager', 'Boss', 'Stock Manager', 'Lab Technician']} />}>
            <Route path="dashboard" element={<DashboardOverviewPage />} />
          </Route>
          
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager', 'Boss']} />}>
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager', 'Boss']} />}>
            <Route path="manage-users" element={<UsersPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Stock Manager', 'Manager']} />}>
            <Route path="suppliers" element={<SuppliersPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Stock Manager', 'Manager']} />}>
            <Route path="/minerals/mixed" element={<MixedMineralsPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Stock Manager', 'Manager', 'Lab Technician', 'Finance Officer']} />}>
            <Route path="/minerals/tantalum" element={<TantalumPage/>} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Stock Manager', 'Manager', 'Lab Technician', 'Finance Officer']} />}>
            <Route path="/minerals/tin" element={<TinPage/>} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Stock Manager', 'Manager', 'Lab Technician', 'Finance Officer']} />}>
            <Route path="/minerals/tungsten" element={<TungstenPage/>} />
          </Route>
          
          {/* Sales Routes */}
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/sales" element={<SalesPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/sales/create/:mineralType" element={<CreateSalePage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/sales/:saleId" element={<ViewSalePage />} />
          </Route>

          {/* Advance Payment Routes */}
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/advance-payments" element={<AdvancePaymentsPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/advance-payments/create" element={<CreateAdvancePaymentPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/advance-payments/:paymentId" element={<ViewAdvancePaymentPage />} />
          </Route>

          {/* Payment Routes */}
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/payments" element={<PaymentsPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/payments/create" element={<CreatePaymentPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/payments/:paymentId" element={<ViewPaymentPage />} />
          </Route>

           {/* Expenses Routes */}
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/expenses" element={<ExpensesPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/expenses/create" element={<CreateExpensePage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['Finance Officer', 'Manager']} />}>
            <Route path="/expenses/:expenseId" element={<ViewExpensePage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallbacks */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;