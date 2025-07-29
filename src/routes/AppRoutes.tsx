import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

// Route Protectors
import ProtectedRoute from './ProtectedRoutes';
import RoleBasedRoute from './RoleBasedRoute';
import { useAuth } from '../hooks/useAuth';
import { DashboardLayoutWithOutlet } from '../components/dashboard/layout/DashboardLayout';
import Unauthorized from '../pages/Unauthorized';


const AnimatedOutlet: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <MotionPage><LoginPage /></MotionPage>} 
        />
        <Route path="/forgot-password" element={<MotionPage><ForgotPasswordPage /></MotionPage>} />
        <Route path="/reset-password" element={<MotionPage><ResetPasswordPage /></MotionPage>} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayoutWithOutlet />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<MotionPage><DashboardOverviewPage /></MotionPage>} />
            <Route path="profile" element={<MotionPage><ProfilePage /></MotionPage>} />
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="settings" element={<MotionPage><SettingsPage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="manage-users" element={<MotionPage><UsersPage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="suppliers" element={<MotionPage><SuppliersPage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/minerals/mixed" element={<MotionPage><MixedMineralsPage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/minerals/tantalum" element={<MotionPage><TantalumPage/></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/minerals/tin" element={<MotionPage><TinPage/></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/minerals/tungsten" element={<MotionPage><TungstenPage/></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/profile/change-password" element={<MotionPage><ChangePasswordPage/></MotionPage>} />
            </Route>
            
            {/* Sales Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/sales" element={<MotionPage><SalesPage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/sales/create/:mineralType" element={<MotionPage><CreateSalePage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/sales/:saleId" element={<MotionPage><ViewSalePage /></MotionPage>} />
            </Route>

            {/* Advance Payment Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/advance-payments" element={<MotionPage><AdvancePaymentsPage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/advance-payments/create" element={<MotionPage><CreateAdvancePaymentPage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/advance-payments/:paymentId" element={<MotionPage><ViewAdvancePaymentPage /></MotionPage>} />
            </Route>

            {/* Payment Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/payments" element={<MotionPage><PaymentsPage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/payments/create" element={<MotionPage><CreatePaymentPage /></MotionPage>} />
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['Manager', 'Boss']} />}>
              <Route path="/payments/:paymentId" element={<MotionPage><ViewPaymentPage /></MotionPage>} />
            </Route>

          </Route>

        </Route>

        {/* Fallbacks */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
        <Route path="/unauthorized" element={<MotionPage><Unauthorized /></MotionPage>} />
        <Route path="*" element={<MotionPage><NotFoundPage /></MotionPage>} />
      </Routes>
    </AnimatePresence>
  );
};

// Wrapper for page animations
const MotionPage: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);


export default AnimatedOutlet;