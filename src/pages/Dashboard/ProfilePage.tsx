import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth'; // To get user details
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, roles } = useAuth();

  if (!user) {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
            <p>Loading user profile...</p>
        </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl"
    >
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">{t('my_profile')}</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex-shrink-0">
            <UserCircleIcon className="h-32 w-32 text-gray-400 dark:text-gray-500" />
            {/* Or an actual image: <img className="h-32 w-32 rounded-full object-cover" src={user.avatarUrl || 'default-avatar.png'} alt="Profile" /> */}
        </div>
        <div className="flex-grow">
            {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.email}</p>
            </div> */}
            {/* {user.name && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                    <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.name}</p>
                </div>
            )}
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
                <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.id}</p>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Roles</label>
                <div className="mt-1 flex flex-wrap gap-2">
                    {roles.map(role => (
                        <span key={role} className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full dark:bg-indigo-600 dark:text-indigo-100">
                            {role}
                        </span>
                    ))}
                </div>
            </div> */}
            {/* Add more profile fields as needed */}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
