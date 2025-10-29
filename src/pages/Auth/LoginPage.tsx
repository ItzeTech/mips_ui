import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch } from '../../store/store';
import { loginUser, setCredentials, setAuthError } from '../../features/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';
import { LoginResponse } from '../../types/auth';
import IconWrapper from '../../components/common/IconWrapper';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { status: authStatus, error: authError, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  // Focus management
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Handle field focus
  const handleFocus = useCallback((fieldName: string) => {
    setFocusedField(fieldName);
  }, []);

  // Handle field blur
  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return username.trim() !== '' && password.trim() !== '';
  }, [username, password]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    // Clear previous auth errors when component mounts or inputs change
    if(authError) dispatch(setAuthError(null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    dispatch(setAuthError(null)); // Clear previous errors

    if (!username || !password) {
      setFormError("Username and password are required.");
      return;
    }

    const resultAction = await dispatch(loginUser({ username, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      // The thunk was successful, response data is in resultAction.payload
      const loginData = resultAction.payload as LoginResponse;
      dispatch(setCredentials(loginData));
      navigate(from, { replace: true });
    }
  }, [username, password, dispatch, navigate, from]);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 p-4 sm:p-6 lg:p-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-8 pt-8 pb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700"
            >
              {/* <FiLogIn className="h-10 w-10 text-white" /> */}
              <IconWrapper Icon={FiLogIn} className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white"
            >
              {t('login.welcome_back')}
            </motion.h2>
            
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300"
            >
              {t('login.login_to_access')}
            </motion.p>
          </div>

          <AnimatePresence>
            {(formError || (authStatus === 'failed' && authError)) && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mx-8 mb-4 overflow-hidden"
              >
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start">
                  {/* <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" /> */}
                  <IconWrapper Icon={FiAlertCircle} className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {formError || authError}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-8 pb-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('login.username')}
                </label>
                <motion.div 
                  className={`relative rounded-lg shadow-sm ${
                    focusedField === 'username' ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  animate={{ 
                    borderColor: focusedField === 'username' ? 'rgb(99, 102, 241)' : 'rgb(209, 213, 219)'
                  }}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <FiUser className={`h-5 w-5 ${focusedField === 'username' ? 'text-indigo-500' : 'text-gray-400'} transition-colors duration-200`} /> */}
                    <IconWrapper Icon={FiUser} className={`h-5 w-5 ${focusedField === 'username' ? 'text-indigo-500' : 'text-gray-400'} transition-colors duration-200`} />
                  </div>
                  <input
                    id="username"
                    type="email"
                    autoComplete="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => handleFocus('username')}
                    onBlur={handleBlur}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </motion.div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('login.password')}
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    {t('login.forgot_password_q')}
                  </Link>
                </div>
                <motion.div 
                  className={`relative rounded-lg shadow-sm ${
                    focusedField === 'password' ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  animate={{ 
                    borderColor: focusedField === 'password' ? 'rgb(99, 102, 241)' : 'rgb(209, 213, 219)'
                  }}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconWrapper Icon={FiLock} className={`h-5 w-5 ${focusedField === 'password' ? 'text-indigo-500' : 'text-gray-400'} transition-colors duration-200`} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={authStatus === 'loading' || !isFormValid}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {authStatus === 'loading' ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  t('login.login')
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;