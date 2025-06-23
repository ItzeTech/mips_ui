import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserCircleIcon, CheckCircleIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUser, updateUser } from '../../features/user/userSlice'; // Adjust path as needed
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Helper component for displaying profile details consistently
const ProfileDetailItem: React.FC<{ label: string; value: string | number | string[] | undefined | null | React.ReactNode; icon?: React.ReactNode }> = ({ label, value, icon }) => {
  const { t } = useTranslation();
  return (
    <div className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 rounded-xl p-4 transition-all duration-200">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <dt className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words leading-relaxed">
            {value || (
              <span className="text-gray-400 dark:text-gray-500 italic">
                {t('profilePage.not_available', 'Not provided')}
              </span>
            )}
          </dd>
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>(); // Consider using your AppDispatch type
  const navigate = useNavigate();
  const {
    full_name,
    national_id,
    phone_number,
    email,
    roles, // Assuming roles is an array of strings
    location,
    status,
    created_at,
    updated_at,
    loading,
    error,
  } = useSelector((state: any) => state.user); // Consider using your RootState type

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  const [formData, setFormData] = useState(() => ({
    full_name: full_name || '',
    phone_number: phone_number || '',
    location: location || '',
    national_id: national_id || '',
  }));

  useEffect(() => {
    // Fetch user if not already loaded/loading and essential data (like email) is missing
    if (loading === 'idle' && !email) {
      dispatch(fetchUser());
    }
  }, [dispatch, loading, email]);

  // Sync formData with Redux state. This is useful for initial load and after updates.
  useEffect(() => {
    setFormData({
      full_name: full_name || '',
      phone_number: phone_number || '',
      location: location || '',
      national_id: national_id || '',
    });
  }, [full_name, phone_number, location, national_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    // Ensure formData is synced with the latest from Redux store when starting to edit
    setFormData({
      full_name: full_name || '',
      phone_number: phone_number || '',
      location: location || '',
      national_id: national_id || '',
    });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset form data to current Redux state values on cancel
    setFormData({
        full_name: full_name || '',
        phone_number: phone_number || '',
        location: location || '',
        national_id: national_id || '',
    });
  };

  const handleSubmit = async () => {
    const resultAction = await dispatch(updateUser(formData));
  
    if (updateUser.fulfilled.match(resultAction)) {
      setIsEditing(false);
      setShowConfirmationModal(true);
    } else {
      console.error("Failed to update user:", resultAction.error);
      toast.error(t('profilePage.error'));
    }
  };
  

  if (loading === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {t('profilePage.loading_user_profile', 'Loading your profile')}...
          </p>
        </motion.div>
      </div>
    );
  }

  // Show error if loading failed and we don't have essential user data (e.g., email)
  if (error && loading !== 'pending' && !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XMarkIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('profilePage.failed_to_load_profile', 'Failed to load profile')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {typeof error === 'string' ? error : t('profilePage.unknown_error', 'An unknown error occurred')}
          </p>
        </motion.div>
      </div>
    );
  }
  
  const formAnimationVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'active':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'inactive':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status?.toLowerCase() === 'active' ? 'bg-green-400' : 
          status?.toLowerCase() === 'inactive' ? 'bg-red-400' : 
          status?.toLowerCase() === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'
        }`} />
        {status || 'Unknown'}
      </span>
    );
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-white/10 rounded-3xl"></div>
              <div className="relative bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 dark:border-gray-700/50 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Avatar Section */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-28 h-28 bg-white/30 dark:bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-lg border border-white/40 shadow-lg">
                        <UserCircleIcon className="w-16 h-16 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h1 className="text-3xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
                            {full_name || t('profilePage.my_profile', 'My Profile')}
                          </h1>
                          {email && (
                            <p className="text-white/90 text-lg font-medium mb-1 drop-shadow">{email}</p>
                          )}
                          {roles && roles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {roles.map((role: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-white/30 text-white text-sm font-medium rounded-full backdrop-blur-lg border border-white/40 shadow-lg"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {!isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditClick}
                            className="flex items-center gap-2 px-6 py-3 bg-white/25 hover:bg-white/35 text-white font-semibold rounded-xl backdrop-blur-lg border border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <PencilIcon className="w-4 h-4" />
                            {t('profilePage.edit_profile', 'Edit Profile')}
                          </motion.button>
                        )}
                      </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Profile Details / Edit Form */}
              <div className="xl:col-span-2">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="editing-form"
                      variants={formAnimationVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-white/95 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-8 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {t('profilePage.edit_profile', 'Edit Profile')}
                        </h2>
                        <button
                          onClick={handleCancelClick}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Form Fields */}
                        <div>
                          <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('profilePage.full_name', 'Full Name')}
                          </label>
                          <input
                            type="text"
                            name="full_name"
                            id="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('profilePage.phone_number', 'Phone Number')}
                          </label>
                          <input
                            type="text"
                            name="phone_number"
                            id="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="Enter your phone number"
                          />
                        </div>

                        <div>
                          <label htmlFor="national_id" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('profilePage.national_id', 'National ID')}
                          </label>
                          <input
                            type="text"
                            name="national_id"
                            id="national_id"
                            value={formData.national_id}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="Enter your national ID"
                          />
                        </div>

                        <div>
                          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('profilePage.location', 'Location')}
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="Enter your location"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            type="button"
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {t('profilePage.save', 'Save Changes')}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancelClick}
                            type="button"
                            className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          >
                            {t('profilePage.cancel', 'Cancel')}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="display-info"
                      variants={formAnimationVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-white/95 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-8 shadow-xl"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        {t('profilePage.profile_details', 'Profile Details')}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileDetailItem 
                          label={t('profilePage.full_name', 'Full Name')} 
                          value={full_name} 
                        />
                        <ProfileDetailItem 
                          label={t('profilePage.email', 'Email')} 
                          value={email} 
                        />
                        <ProfileDetailItem 
                          label={t('profilePage.phone_number', 'Phone Number')} 
                          value={phone_number} 
                        />
                        <ProfileDetailItem 
                          label={t('profilePage.national_id', 'National ID')} 
                          value={national_id} 
                        />
                        <ProfileDetailItem 
                          label={t('profilePage.location', 'Location')} 
                          value={location} 
                        />
                        <ProfileDetailItem 
                          label={t('profilePage.status', 'Status')} 
                          value={<StatusBadge status={status} />} 
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Side Panel - Account Info */}
              <div className="space-y-6">
                <div className="bg-white/95 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    {t('profilePage.account_info', 'Account Information')}
                  </h3>
                  <div className="space-y-4">
                    <ProfileDetailItem 
                      label={t('profilePage.member_since', 'Member Since')} 
                      value={created_at ? new Date(created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : null} 
                    />
                    <ProfileDetailItem 
                      label={t('profilePage.last_updated', 'Last Updated')} 
                      value={updated_at ? new Date(updated_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : null} 
                    />
                  </div>
                </div>

                {/* Profile Completion Card */}
                <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-xl rounded-2xl border border-indigo-200/80 dark:border-indigo-700/50 p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                    {t('profilePage.profile_completion', 'Profile Completion')}
                  </h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
                    {t('profilePage.profile_completion_desc', 'Keep your profile updated for the best experience.')}
                  </p>
                  <div className="w-full bg-indigo-200/60 dark:bg-indigo-800 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.round(([full_name, email, phone_number, location, national_id].filter(Boolean).length / 5) * 100)}%` 
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-3 rounded-full shadow-sm"
                    ></motion.div>
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                    {Math.round(([full_name, email, phone_number, location, national_id].filter(Boolean).length / 5) * 100)}% {t('profilePage.complete')}
                  </p>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white/95 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/50 p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    {t('profilePage.quick_actions', 'Quick Actions')}
                  </h3>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 hover:bg-gray-100/80 dark:hover:bg-gray-600/50 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 group"
                      onClick={()=> navigate('change-password')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UserCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Change Password</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Update your account security</p>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t('profilePage.update_successful_title', 'Profile Updated')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('profilePage.update_successful_message', 'Your profile information has been successfully updated.')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmationModal(false)}
                  type="button"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('profilePage.ok', 'Got it')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfilePage;