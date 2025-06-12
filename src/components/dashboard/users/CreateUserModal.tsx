// // components/CreateUserModal.tsx
// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Dialog } from '@headlessui/react';
// import { XMarkIcon } from '@heroicons/react/24/solid';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '../../../store/store';
// import { createUser, resetCreateStatus, CreateUserData } from '../../../features/user/usersSlice';
// import toast from 'react-hot-toast';

// interface CreateUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const availableRoles = [
//   'Manager',
//   'Boss',
//   'Lab Technician',
//   'Finance Officer'
// ];

// const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch<AppDispatch>();
//   const { createStatus, error } = useSelector((state: RootState) => state.users);

//   const [formData, setFormData] = useState<CreateUserData>({
//     full_name: '',
//     email: '',
//     national_id: '',
//     phone_number: '',
//     roles: [],
//     location: ''
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (createStatus === 'succeeded') {
//       toast.success(t('users.create_success'));
//       onClose();
//       resetForm();
//       dispatch(resetCreateStatus());
//     } else if (createStatus === 'failed' && error) {
//       toast.error(error);
//       dispatch(resetCreateStatus());
//     }
//   }, [createStatus, error, onClose, dispatch, t]);

//   const resetForm = () => {
//     setFormData({
//       full_name: '',
//       email: '',
//       national_id: '',
//       phone_number: '',
//       roles: [],
//       location: ''
//     });
//     setErrors({});
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.full_name.trim()) {
//       newErrors.full_name = t('users.validation.full_name_required');
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = t('users.validation.email_required');
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = t('users.validation.email_invalid');
//     }

//     if (!formData.national_id.trim()) {
//       newErrors.national_id = t('users.validation.national_id_required');
//     }

//     if (!formData.phone_number.trim()) {
//       newErrors.phone_number = t('users.validation.phone_required');
//     }

//     if (formData.roles.length === 0) {
//       newErrors.roles = t('users.validation.roles_required');
//     }

//     if (!formData.location.trim()) {
//       newErrors.location = t('users.validation.location_required');
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     dispatch(createUser(formData));
//   };

//   const handleRoleToggle = (role: string) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       roles: prev.roles.includes(role)
//         ? prev.roles.filter((r: string) => r !== role)
//         : [...prev.roles, role]
//     }));
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <Dialog
//           as={motion.div}
//           static
//           open={isOpen}
//           onClose={handleClose}
//           className="fixed inset-0 z-50 overflow-y-auto"
//         >
//           <div className="flex items-center justify-center min-h-screen px-4 text-center">
//             <Dialog.Overlay
//               as={motion.div}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black bg-opacity-50"
//             />

//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-auto"
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
//                   {t('users.create_new')}
//                 </Dialog.Title>
//                 <button
//                   onClick={handleClose}
//                   className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                 >
//                   <XMarkIcon className="w-6 h-6" />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('users.full_name')}
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.full_name}
//                     onChange={(e) => setFormData((prev: any) => ({ ...prev, full_name: e.target.value }))}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
//                       errors.full_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                     }`}
//                     placeholder={t('users.full_name_placeholder')}
//                   />
//                   {errors.full_name && (
//                     <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('users.email')}
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
//                       errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                     }`}
//                     placeholder={t('users.email_placeholder')}
//                   />
//                   {errors.email && (
//                     <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                   )}
//                 </div>

//                 {/* National ID */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('users.national_id')}
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.national_id}
//                     onChange={(e) => setFormData((prev: any) => ({ ...prev, national_id: e.target.value }))}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
//                       errors.national_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                     }`}
//                     placeholder={t('users.national_id_placeholder')}
//                   />
//                   {errors.national_id && (
//                     <p className="mt-1 text-sm text-red-600">{errors.national_id}</p>
//                   )}
//                 </div>

//                 {/* Phone Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('users.phone_number')}
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone_number}
//                     onChange={(e) => setFormData((prev: any) => ({ ...prev, phone_number: e.target.value }))}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
//                       errors.phone_number ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                     }`}
//                     placeholder={t('users.phone_placeholder')}
//                   />
//                   {errors.phone_number && (
//                     <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
//                   )}
//                 </div>

//                 {/* Roles */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     {t('users.roles')}
//                   </label>
//                   <div className="space-y-2 max-h-32 overflow-y-auto">
//                     {availableRoles.map((role) => (
//                       <label key={role} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={formData.roles.includes(role)}
//                           onChange={() => handleRoleToggle(role)}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
//                           {role}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                   {errors.roles && (
//                     <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
//                   )}
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('users.location')}
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.location}
//                     onChange={(e) => setFormData((prev: any) => ({ ...prev, location: e.target.value }))}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
//                       errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                     }`}
//                     placeholder={t('users.location_placeholder')}
//                   />
//                   {errors.location && (
//                     <p className="mt-1 text-sm text-red-600">{errors.location}</p>
//                   )}
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={handleClose}
//                     className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
//                   >
//                     {t('common.cancel')}
//                   </button>
//                   <motion.button
//                     type="submit"
//                     disabled={createStatus === 'loading'}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors duration-200"
//                   >
//                     {createStatus === 'loading' ? t('common.creating') : t('common.create')}
//                   </motion.button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         </Dialog>
//       )}
//     </AnimatePresence>
//   );
// };

// export default CreateUserModal;


// components/CreateUserModal.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  IdentificationIcon,
  PhoneIcon,
  MapPinIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { createUser, resetCreateStatus, CreateUserData } from '../../../features/user/usersSlice';
import toast from 'react-hot-toast';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableRoles = [
  { name: 'Manager', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700' },
  { name: 'Boss', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' },
  { name: 'Lab Technician', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' },
  { name: 'Finance Officer', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' },
];

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { createStatus, error } = useSelector((state: RootState) => state.users);

  const [formData, setFormData] = useState<CreateUserData>({
    full_name: '',
    email: '',
    national_id: '',
    phone_number: '',
    roles: [],
    location: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      toast.success(t('users.create_success'));
      onClose();
      resetForm();
      dispatch(resetCreateStatus());
    } else if (createStatus === 'failed' && error) {
      toast.error(error);
      dispatch(resetCreateStatus());
    }
  }, [createStatus, error, onClose, dispatch, t]);

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      national_id: '',
      phone_number: '',
      roles: [],
      location: ''
    });
    setErrors({});
    setCurrentStep(1);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.full_name.trim()) {
        newErrors.full_name = t('users.validation.full_name_required');
      }
      if (!formData.email.trim()) {
        newErrors.email = t('users.validation.email_required');
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('users.validation.email_invalid');
      }
    } else if (step === 2) {
      if (!formData.national_id.trim()) {
        newErrors.national_id = t('users.validation.national_id_required');
      }
      if (!formData.phone_number.trim()) {
        newErrors.phone_number = t('users.validation.phone_required');
      }
      if (!formData.location.trim()) {
        newErrors.location = t('users.validation.location_required');
      }
    } else if (step === 3) {
      if (formData.roles.length === 0) {
        newErrors.roles = t('users.validation.roles_required');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    dispatch(createUser(formData));
  };

  const handleRoleToggle = (roleName: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter(r => r !== roleName)
        : [...prev.roles, roleName]
    }));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          static
          open={isOpen}
          onClose={handleClose}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-auto overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        {t('users.create_new')}
                      </Dialog.Title>
                      <p className="text-blue-100 text-sm">
                        Step {currentStep} of 3
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 relative">
                  <div className="flex items-center justify-between">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                          step <= currentStep 
                            ? 'bg-white text-blue-600 shadow-lg' 
                            : 'bg-white/20 text-white/60'
                        }`}>
                          {step < currentStep ? (
                            <CheckCircleIcon className="w-5 h-5" />
                          ) : (
                            step
                          )}
                        </div>
                        {step < 3 && (
                          <div className={`h-1 w-20 mx-2 rounded-full transition-all duration-500 ${
                            step < currentStep ? 'bg-white' : 'bg-white/20'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <UserCircleIcon className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Basic Information
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Let's start with the user's basic details
                          </p>
                        </div>

                        <div className="space-y-6">
                          {/* Full Name */}
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t('users.full_name')}
                            </label>
                            <div className="relative">
                              <UserCircleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                              <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  errors.full_name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                                }`}
                                placeholder={t('users.full_name_placeholder')}
                              />
                            </div>
                            {errors.full_name && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 flex items-center"
                              >
                                <XMarkIcon className="w-4 h-4 mr-1" />
                                {errors.full_name}
                              </motion.p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t('users.email')}
                            </label>
                            <div className="relative">
                              <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                                }`}
                                placeholder={t('users.email_placeholder')}
                              />
                            </div>
                            {errors.email && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 flex items-center"
                              >
                                <XMarkIcon className="w-4 h-4 mr-1" />
                                {errors.email}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Contact & Location */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <MapPinIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Contact & Location
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Contact information and location details
                          </p>
                        </div>

                        <div className="space-y-6">
                          {/* National ID */}
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t('users.national_id')}
                            </label>
                            <div className="relative">
                              <IdentificationIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                              <input
                                type="text"
                                value={formData.national_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, national_id: e.target.value }))}
                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  errors.national_id ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                                }`}
                                placeholder={t('users.national_id_placeholder')}
                              />
                            </div>
                            {errors.national_id && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 flex items-center"
                              >
                                <XMarkIcon className="w-4 h-4 mr-1" />
                                {errors.national_id}
                              </motion.p>
                            )}
                          </div>

                          {/* Phone Number */}
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t('users.phone_number')}
                            </label>
                            <div className="relative">
                              <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                              <input
                                type="tel"
                                value={formData.phone_number}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  errors.phone_number ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                                }`}
                                placeholder={t('users.phone_placeholder')}
                              />
                            </div>
                            {errors.phone_number && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 flex items-center"
                              >
                                <XMarkIcon className="w-4 h-4 mr-1" />
                                {errors.phone_number}
                              </motion.p>
                            )}
                          </div>

                          {/* Location */}
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t('users.location')}
                            </label>
                            <div className="relative">
                              <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                              <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                  errors.location ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                                }`}
                                placeholder={t('users.location_placeholder')}
                              />
                            </div>
                            {errors.location && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 flex items-center"
                              >
                                <XMarkIcon className="w-4 h-4 mr-1" />
                                {errors.location}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Roles */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <UserGroupIcon className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Assign Roles
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Select the roles for this user
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            {t('users.roles')}
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {availableRoles.map((role) => (
                              <motion.label
                                key={role.name}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative cursor-pointer`}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.roles.includes(role.name)}
                                  onChange={() => handleRoleToggle(role.name)}
                                  className="sr-only"
                                />
                                <div className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                                  formData.roles.includes(role.name)
                                    ? `${role.color} border-current shadow-lg`
                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm font-medium ${
                                      formData.roles.includes(role.name)
                                        ? ''
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                      {role.name}
                                    </span>
                                    {formData.roles.includes(role.name) && (
                                      <CheckCircleIcon className="w-5 h-5" />
                                    )}
                                  </div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                          {errors.roles && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 text-sm text-red-600 flex items-center"
                            >
                              <XMarkIcon className="w-4 h-4 mr-1" />
                              {errors.roles}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={currentStep === 1 ? handleClose : handlePrevious}
                      className="px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                    >
                      {currentStep === 1 ? t('common.cancel') : 'Previous'}
                    </button>

                    <div className="flex space-x-3">
                      {currentStep < 3 ? (
                        <motion.button
                          type="button"
                          onClick={handleNext}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Next Step
                        </motion.button>
                      ) : (
                        <motion.button
                          type="submit"
                          disabled={createStatus === 'loading'}
                          whileHover={{ scale: createStatus === 'loading' ? 1 : 1.02 }}
                          whileTap={{ scale: createStatus === 'loading' ? 1 : 0.98 }}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                        >
                          {createStatus === 'loading' ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              {t('common.creating')}
                            </div>
                          ) : (
                            t('common.create')
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CreateUserModal;