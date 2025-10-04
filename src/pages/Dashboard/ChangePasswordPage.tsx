import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LockClosedIcon, 
  CheckCircleIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { changePassword } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUserApi, logout } from '../../features/auth/authSlice';

const ChangePasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>(); // Consider using your AppDispatch type

  const { loading } = useSelector((state: any) => state.user); // Consider using your RootState type

  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await dispatch(logoutUserApi());
    dispatch(logout());
    navigate('/login');
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    };

    // Validate current password
    if (!formData.current_password.trim()) {
      newErrors.current_password = t('changePassword.current_password_required', 'Current password is required');
    }

    // Validate new password
    if (!formData.new_password.trim()) {
      newErrors.new_password = t('changePassword.new_password_required', 'New password is required');
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = t('changePassword.password_min_length', 'Password must be at least 8 characters long');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.new_password)) {
      newErrors.new_password = t('changePassword.password_complexity', 'Password must contain uppercase, lowercase, number and special character');
    }

    // Validate password confirmation
    if (!formData.confirm_password.trim()) {
      newErrors.confirm_password = t('changePassword.confirm_password_required', 'Please confirm your new password');
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = t('changePassword.passwords_dont_match', 'Passwords do not match');
    }

    // Check if new password is same as current
    if (formData.current_password === formData.new_password && formData.new_password.trim()) {
      newErrors.new_password = t('changePassword.same_password_error', 'New password must be different from current password');
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const passwordData = {
      current_password: formData.current_password,
      new_password: formData.new_password
    };

    try {
      const resultAction = await dispatch(changePassword(passwordData));
      
      if (changePassword.fulfilled.match(resultAction)) {
        // Clear form
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setShowConfirmationModal(true);
        toast.success(t('changePassword.success', 'Password changed successfully'));
        handleLogout();
      } else {
        toast.error(t('changePassword.error', 'Failed to change password'));
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(t('changePassword.error', 'Failed to change password'));
    }
  };

  const handleCancel = () => {
    setFormData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setErrors({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return t('changePassword.strength.weak', 'Weak');
      case 2:
        return t('changePassword.strength.fair', 'Fair');
      case 3:
        return t('changePassword.strength.good', 'Good');
      case 4:
        return t('changePassword.strength.strong', 'Strong');
      case 5:
        return t('changePassword.strength.very_strong', 'Very Strong');
      default:
        return '';
    }
  };

  const passwordStrength = getPasswordStrength(formData.new_password);

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Header Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-white/10 rounded-xl"></div>
              <div className="relative bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-xl p-5 border border-white/30 dark:border-gray-700/50 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white/30 dark:bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-lg border border-white/40 shadow-lg">
                      <LockClosedIcon className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-0.5 drop-shadow-lg">
                      {t('changePassword.title', 'Change Password')}
                    </h1>
                    <p className="text-white/90 text-sm drop-shadow">
                      {t('changePassword.subtitle', 'Update your account password to keep it secure')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Change Password Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/95 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-5 shadow-lg"
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        {t('changePassword.current_password', 'Current Password')}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="current_password"
                          id="current_password"
                          value={formData.current_password}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                            errors.current_password
                              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500'
                          }`}
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showPasswords.current ? (
                            <EyeSlashIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.current_password && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.current_password}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label htmlFor="new_password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        {t('changePassword.new_password', 'New Password')}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="new_password"
                          id="new_password"
                          value={formData.new_password}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                            errors.new_password
                              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500'
                          }`}
                          placeholder="Enter your new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showPasswords.new ? (
                            <EyeSlashIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {formData.new_password && (
                        <div className="mt-1.5">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {getPasswordStrengthText(passwordStrength)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {errors.new_password && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.new_password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        {t('changePassword.confirm_password', 'Confirm New Password')}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirm_password"
                          id="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                            errors.confirm_password
                              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500'
                          }`}
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showPasswords.confirm ? (
                            <EyeSlashIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirm_password && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirm_password}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading === 'pending'}
                        className="flex-1 py-2 px-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                      >
                        {loading === 'pending' ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t('changePassword.updating', 'Updating...')}
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="w-3.5 h-3.5" />
                            {t('changePassword.change_password', 'Change Password')}
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancel}
                        type="button"
                        className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
                      >
                        {t('changePassword.cancel', 'Cancel')}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </div>

              {/* Security Tips Panel */}
              <div className="space-y-5">
                <div className="bg-white/95 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-4 shadow-lg">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full"></div>
                    {t('changePassword.security_tips', 'Security Tips')}
                  </h3>
                  <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-start gap-2">
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p>{t('changePassword.tip_1', 'Use at least 8 characters with a mix of letters, numbers, and symbols')}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p>{t('changePassword.tip_2', 'Avoid using personal information like names or birthdays')}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p>{t('changePassword.tip_3', "Don't reuse passwords from other accounts")}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p>{t('changePassword.tip_4', 'Consider using a password manager')}</p>
                    </div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 backdrop-blur-xl rounded-xl border border-teal-200/80 dark:border-teal-800/50 p-4 shadow-lg">
                  <h3 className="text-base font-semibold text-teal-900 dark:text-teal-100 mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full"></div>
                    {t('changePassword.requirements', 'Password Requirements')}
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className={`flex items-center gap-2 ${formData.new_password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-teal-700 dark:text-teal-300'}`}>
                      {formData.new_password.length >= 8 ? (
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 border-2 border-current rounded-full" />
                      )}
                      <span>{t('changePassword.req_length', 'At least 8 characters')}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.new_password) ? 'text-green-600 dark:text-green-400' : 'text-teal-700 dark:text-teal-300'}`}>
                      {/[A-Z]/.test(formData.new_password) ? (
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 border-2 border-current rounded-full" />
                      )}
                      <span>{t('changePassword.req_uppercase', 'One uppercase letter')}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/[a-z]/.test(formData.new_password) ? 'text-green-600 dark:text-green-400' : 'text-teal-700 dark:text-teal-300'}`}>
                      {/[a-z]/.test(formData.new_password) ? (
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 border-2 border-current rounded-full" />
                      )}
                      <span>{t('changePassword.req_lowercase', 'One lowercase letter')}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/\d/.test(formData.new_password) ? 'text-green-600 dark:text-green-400' : 'text-teal-700 dark:text-teal-300'}`}>
                      {/\d/.test(formData.new_password) ? (
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 border-2 border-current rounded-full" />
                      )}
                      <span>{t('changePassword.req_number', 'One number')}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/[@$!%*?&]/.test(formData.new_password) ? 'text-green-600 dark:text-green-400' : 'text-teal-700 dark:text-teal-300'}`}>
                      {/[@$!%*?&]/.test(formData.new_password) ? (
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 border-2 border-current rounded-full" />
                      )}
                      <span>{t('changePassword.req_special', 'One special character')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      <AnimatePresence>
        {showConfirmationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowConfirmationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">
                      {t('changePassword.success_title', 'Password Changed Successfully')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('changePassword.success_message', 'Your password has been updated. Please use your new password for future logins.')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmationModal(false)}
                  type="button"
                  className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 text-sm"
                >
                  {t('changePassword.got_it', 'Got it')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChangePasswordPage;