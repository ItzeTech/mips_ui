// // components/ViewUserModal.tsx
// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Dialog } from '@headlessui/react';
// import { XMarkIcon, UserCircleIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/solid';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../store/store';

// interface ViewUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose }) => {
//   const { t } = useTranslation();
//   const { selectedUser } = useSelector((state: RootState) => state.users);

//   if (!selectedUser) return null;

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <Dialog
//           as={motion.div}
//           static
//           open={isOpen}
//           onClose={onClose}
//           className="fixed inset-0 z-50 overflow-y-auto"
//         >
//           <div className="flex items-center justify-center min-h-screen px-4 text-center">
//             {/* <Dialog.Overlay
//               as={motion.div}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black bg-opacity-50"
//             /> */}

//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-lg mx-auto"
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
//                   {t('users.user_details')}
//                 </Dialog.Title>
//                 <button
//                   onClick={onClose}
//                   className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                 >
//                   <XMarkIcon className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {/* User Avatar and Basic Info */}
//                 <motion.div 
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.1 }}
//                   className="text-center"
//                 >
//                   <UserCircleIcon className="w-20 h-20 mx-auto text-gray-400 mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                     {selectedUser.full_name}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400">
//                     {selectedUser.email}
//                   </p>
                  
//                   {/* Status Badge */}
//                   <div className="mt-3">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                       selectedUser.status === 'active'
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//                         : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
//                     }`}>
//                       {selectedUser.status === 'active' ? t('users.active') : t('users.disabled')}
//                     </span>
//                   </div>
//                 </motion.div>

//                 {/* Details Grid */}
//                 <motion.div
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className="grid grid-cols-1 gap-4"
//                 >
//                   {/* Contact Information */}
//                   <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//                     <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
//                       {t('users.contact_information')}
//                     </h4>
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">
//                           {t('users.phone_number')}:
//                         </span>
//                         <span className="text-sm text-gray-900 dark:text-white">
//                           {selectedUser.phone_number}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">
//                           {t('users.national_id')}:
//                         </span>
//                         <span className="text-sm text-gray-900 dark:text-white">
//                           {selectedUser.national_id}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Location */}
//                   <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//                     <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
//                       <MapPinIcon className="w-4 h-4 mr-2" />
//                       {t('users.location')}
//                     </h4>
//                     <p className="text-sm text-gray-900 dark:text-white">
//                       {selectedUser.location}
//                     </p>
//                   </div>

//                   {/* Roles */}
//                   <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//                     <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
//                       {t('users.roles')}
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedUser.roles.map((role:any, index:any) => (
//                         <span
//                           key={index}
//                           className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
//                         >
//                           {role}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Timestamps */}
//                   <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//                     <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
//                       <CalendarIcon className="w-4 h-4 mr-2" />
//                       {t('users.timestamps')}
//                     </h4>
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">
//                           {t('users.created_at')}:
//                         </span>
//                         <span className="text-sm text-gray-900 dark:text-white">
//                           {formatDate(selectedUser.created_at)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">
//                           {t('users.updated_at')}:
//                         </span>
//                         <span className="text-sm text-gray-900 dark:text-white">
//                           {formatDate(selectedUser.updated_at)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Close Button */}
//                 <motion.button
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.3 }}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={onClose}
//                   className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
//                 >
//                   {t('common.close')}
//                 </motion.button>
//               </div>
//             </motion.div>
//           </div>
//         </Dialog>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ViewUserModal;


// components/ViewUserModal.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  UserCircleIcon, 
  CalendarIcon, 
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  UserGroupIcon,
  EyeIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { selectedUser } = useSelector((state: RootState) => state.users);

  if (!selectedUser) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const roleColors = {
    'Manager': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
    'Boss': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
    'Lab Technician': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
    'Finance Officer': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          static
          open={isOpen}
          onClose={onClose}
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
              <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-8 py-8">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <EyeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Dialog.Title className="text-xl font-bold text-white">
                          {t('users.user_details')}
                        </Dialog.Title>
                        <p className="text-indigo-100 text-sm">
                            {t('users.user_details_additional')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* User Avatar and Basic Info */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <div className="relative inline-block">
                      <div className="w-18 h-18 bg-white/20 rounded-3xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
                        <UserCircleIcon className="w-16 h-16 text-white" />
                      </div>
                      <div className={`absolute -bottom-0 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedUser.status === 'active' 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`}>
                        {selectedUser.status === 'active' ? (
                          <CheckBadgeIcon className="w-5 h-5 text-white" />
                        ) : (
                          <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {selectedUser.full_name}
                    </h3>
                    <p className="text-indigo-100 text-lg">
                      {selectedUser.email}
                    </p>
                    
                    {/* Status Badge */}
                    {/* <div className="mt-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${
                        selectedUser.status === 'active'
                          ? 'bg-green-500/20 text-green-100 border-green-400/30'
                          : 'bg-red-500/20 text-red-100 border-red-400/30'
                      }`}>
                        {selectedUser.status === 'active' ? t('users.active') : t('users.disabled')}
                      </span>
                    </div> */}
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-3">
                {/* Contact Information */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-2xl p-6 border border-blue-100 dark:border-blue-800"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-500 rounded-xl">
                      <EnvelopeIcon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('users.contact_information')}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedUser.phone_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <IdentificationIcon className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">National ID</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedUser.national_id}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-2xl p-6 border border-green-100 dark:border-green-800"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-500 rounded-xl">
                      <MapPinIcon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('users.location')}
                    </h4>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedUser.location}
                  </p>
                </motion.div>

                {/* Roles */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-2xl p-6 border border-purple-100 dark:border-purple-800"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-purple-500 rounded-xl">
                      <UserGroupIcon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('users.roles')}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedUser.roles.map((role, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${
                          roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {role}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Timestamps */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gray-500 rounded-xl">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('users.timestamps')}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('users.created_at')}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedUser.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('users.updated_at')}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedUser.updated_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Close Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {t('common.close')}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ViewUserModal;