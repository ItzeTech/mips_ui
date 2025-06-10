import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiCheck, FiX, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import axiosInstance from '../../config/axiosInstance';
import IconWrapper from '../../components/common/IconWrapper';

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tokenVerified, setTokenVerified] = useState<boolean | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Password strength checker
  const passwordStrength = useMemo(() => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength + 1, 4);
  }, [password]);

  const strengthLabel = useMemo(() => {
    const labels = ['', 'Very Weak', 'Weak', 'Medium', 'Strong'];
    return labels[passwordStrength];
  }, [passwordStrength]);

  const strengthColor = useMemo(() => {
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    return colors[passwordStrength];
  }, [passwordStrength]);

  const passwordsMatch = useMemo(() => {
    return password === confirmPassword && confirmPassword.length > 0;
  }, [password, confirmPassword]);

  const isValidPassword = useMemo(() => {
    return password.length >= 8 && passwordStrength >= 3;
  }, [password.length, passwordStrength]);

  const canSubmit = useMemo(() => {
    return isValidPassword && passwordsMatch && tokenVerified === true;
  }, [isValidPassword, passwordsMatch, tokenVerified]);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  // Verify token on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      
      // Verify token validity (optional - mock implementation)
      const verifyToken = async () => {
        setIsLoading(true);
        try {
          // This would be an actual API call in a real app
          // await axiosInstance.get(`/auth/verify-token?token=${tokenFromUrl}`);
          setTokenVerified(true);
        } catch (err) {
          setError('Invalid or expired reset token.');
          setTokenVerified(false);
        } finally {
          setIsLoading(false);
        }
      };
      
      verifyToken();
    } else {
      setError('Invalid or missing reset token.');
      setTokenVerified(false);
    }
  }, [location.search]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      await axiosInstance.post('/auth/password/reset', { new_password: password, token });
      setResetSuccess(true);
      setMessage('Your password has been successfully reset.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [password, token, canSubmit, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
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
              className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900"
            >
              {/* <FiLock className="h-8 w-8 text-indigo-600 dark:text-indigo-300" /> */}
              <IconWrapper Icon={FiLock} className="h-8 w-8 text-indigo-600 dark:text-indigo-300"/>
            </motion.div>
            
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
            >
              {t('resetPasswordPage.reset_password')}
            </motion.h2>
            
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300"
            >
              {t('resetPasswordPage.reset_password_instruction')}
            </motion.p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mx-8 overflow-hidden"
              >
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              </motion.div>
            )}
            
            {message && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mx-8 overflow-hidden"
              >
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-200">{message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-8 pb-8 pt-4">
            <AnimatePresence mode="wait">
              {isLoading && tokenVerified === null ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-8"
                >
                  <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </motion.div>
              ) : tokenVerified === false ? (
                <motion.div 
                  key="invalidToken"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-4"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900"
                  >
                    {/* <FiX className="h-8 w-8 text-red-600 dark:text-red-300" /> */}
                    <IconWrapper Icon={FiX} className="h-8 w-8 text-red-600 dark:text-red-300" />
                    
                  </motion.div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    {t('resetPasswordPage.invalid_or_expired_token')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('resetPasswordPage.request_new_link')}
                  </p>
                  <Link
                    to="/forgot-password"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {t('resetPasswordPage.request_new_link_btn')}
                  </Link>
                </motion.div>
              ) : resetSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-4"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900"
                  >
                    {/* <FiCheck className="h-8 w-8 text-green-600 dark:text-green-300" /> */}
                    <IconWrapper Icon={FiCheck} className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    {t('resetPasswordPage.password_reset_success')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('resetPasswordPage.redirecting_to_login')}
                  </p>
                  <motion.div 
                    className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden"
                  >
                    <motion.div 
                      className="h-full bg-green-500" 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3 }}
                    />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6" 
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('resetPasswordPage.new_password')}
                    </label>
                    <div className="relative">
                      <input
                        id="new_password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        {showPassword ? <IconWrapper Icon={FiEyeOff} className="h-5 w-5" /> : <IconWrapper Icon={FiEye} className="h-5 w-5" /> } 
                      </button>
                    </div>
                    
                    {/* Password strength meter */}
                    {password.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {t('resetPasswordPage.password_strength')}: {t(strengthLabel.toLowerCase())}
                          </span>
                          <span className={`text-xs font-medium ${
                            passwordStrength < 3 ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {passwordStrength < 3 ? t('resetPasswordPage.not_strong_enough') : t('resetPasswordPage.strong_enough')}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${strengthColor}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength * 25}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          <li className="flex items-center">
                            <span className={`mr-2 ${password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                              {password.length >= 8 ? '✓' : '○'}
                            </span>
                            {t('resetPasswordPage.min_8_chars')}
                          </li>
                          <li className="flex items-center">
                            <span className={`mr-2 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                              {/[A-Z]/.test(password) ? '✓' : '○'}
                            </span>
                            {t('resetPasswordPage.uppercase_letter')}
                          </li>
                          <li className="flex items-center">
                            <span className={`mr-2 ${/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                              {/[0-9]/.test(password) ? '✓' : '○'}
                            </span>
                            {t('resetPasswordPage.number')}
                          </li>
                          <li className="flex items-center">
                            <span className={`mr-2 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                              {/[^A-Za-z0-9]/.test(password) ? '✓' : '○'}
                            </span>
                            {t('resetPasswordPage.special_char')}
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('resetPasswordPage.confirm_password')}
                    </label>
                    <div className="relative">
                      <input
                        id="confirm_password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`appearance-none block w-full px-4 py-3 border ${
                          confirmPassword && !passwordsMatch 
                            ? 'border-red-300 dark:border-red-700' 
                            : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        placeholder="••••••••"
                      />
                      
                      {confirmPassword && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          {passwordsMatch ? (
                            // <FiCheck className="h-5 w-5 text-green-500" />
                            <IconWrapper Icon={FiCheck} className="h-5 w-5 text-green-500" />
                          ) : (
                            // <FiX className="h-5 w-5 text-red-500" />
                            <IconWrapper Icon={FiX} className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-xs text-red-600 dark:text-red-400"
                      >
                        {t('resetPasswordPage.passwords_dont_match')}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: canSubmit ? 1.01 : 1 }}
                    whileTap={{ scale: canSubmit ? 0.99 : 1 }}
                    type="submit"
                    disabled={isLoading || !canSubmit}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                      canSubmit 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      t('resetPasswordPage.reset_password_btn')
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-center">
              <Link 
                to="/login" 
                className="group inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
              >
                {/* <FiArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform duration-200" /> */}
                <IconWrapper Icon={FiArrowLeft} className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform duration-200" />
                {t('resetPasswordPage.back_to_login')}
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPasswordPage;
