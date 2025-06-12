// topbar.tsx
import React, { Fragment, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MoonIcon, 
  SunIcon, 
  ChevronDownIcon, 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon, 
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import { Menu, Popover, Transition } from '@headlessui/react';
import { 
  LanguageIcon, 
  BellIcon, 
  SparklesIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useUserInfo } from '../../../hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  sidebarExpanded: boolean;
  onLogout: () => void;
}

const UserDropdown = ({ sidebarExpanded, onLogout, t }: any) => {
  const { roles } = useAuth();
  const { user } = useUserInfo();
  const navigate = useNavigate();
  const allowedRoles = ['Manager', 'Boss'];
  const userHasRequiredRole = roles.some(role => allowedRoles.includes(role));

  const menuItems = [
    {
      icon: UserIcon,
      label: t('menu.profile'),
      action: () => navigate('/profile'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    ...(userHasRequiredRole ? [{
      icon: Cog6ToothIcon,
      label: t('menu.settings'),
      action: () => navigate('/settings'),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
    }] : []),
  ];

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'Manager': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Boss': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Lab Technician': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Finance Officer': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  return (
    <div className="relative">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            {/* Trigger Button */}
            <Menu.Button as={motion.button}>
              <motion.div
                className="flex items-center space-x-3 p-2 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* User Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
                </div>

                {/* User Info (when sidebar expanded) */}
                <AnimatePresence mode="wait">
                  {sidebarExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="hidden md:block text-left"
                    >
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {user.full_name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
                        {user.roles.slice(0, 2).join(', ')}
                        {user.roles.length > 2 && '...'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chevron */}
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </motion.div>
              </motion.div>
            </Menu.Button>

            {/* Dropdown Panel */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 scale-95 translate-y-1"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-1"
            >
              <Menu.Items className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserCircleIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.full_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {user.roles.slice(0, 3).map((role, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${getRoleColor(role)}`}
                          >
                            <ShieldCheckIcon className="w-3 h-3 mr-1" />
                            {role}
                          </span>
                        ))}
                        {user.roles.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            +{user.roles.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {menuItems.map((item, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={item.action}
                          className={`w-full flex items-center px-6 py-3 text-sm transition-all duration-200 ${
                            active 
                              ? `${item.bgColor} ${item.color}` 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </motion.button>
                      )}
                    </Menu.Item>
                  ))}
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                  <Menu.Item>
                    {({ active }) => (
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={onLogout}
                        className={`w-full flex items-center px-6 py-3 text-sm transition-all duration-200 ${
                          active 
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        {t('logout.logout')}
                      </motion.button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

const TopBar: React.FC<TopBarProps> = ({ sidebarExpanded, onLogout }) => {
  const { t, i18n } = useTranslation();
  const { currentTheme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New tantalum analysis completed", unread: true, type: "success", time: "2 min ago" },
    { id: 2, text: "Tungsten shipment ready for export", unread: true, type: "info", time: "15 min ago" },
    { id: 3, text: "Monthly mineral report generated", unread: false, type: "info", time: "1 hour ago" },
    { id: 4, text: "Quality check alert: Tin batch #4521", unread: true, type: "warning", time: "2 hours ago" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  ];

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📋';
    }
  };

  return (
    <header className="bg-white/80 z-50 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 h-20 flex items-center justify-between px-6 shadow-lg">
      {/* Left Section - Time & Date */}
      <motion.div 
        className="flex items-center space-x-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hidden lg:block">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {time.toLocaleTimeString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {time.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </motion.div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTheme}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentTheme !== 'light' ? 
                <SunIcon className="w-5 h-5" /> : 
                <MoonIcon className="w-5 h-5" />
              }
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Language Selector */}
        <Menu as="div" className="relative">
          <Menu.Button 
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <LanguageIcon className="h-5 w-5" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="py-2">
                {languages.map((lang) => (
                  <Menu.Item key={lang.code}>
                    {({ active }) => (
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex w-full items-center px-4 py-3 text-sm transition-all duration-200 ${
                          active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                        } ${i18n.resolvedLanguage === lang.code ? 'font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}
                      >
                        <span className="mr-3 text-lg">{lang.flag}</span>
                        {lang.name}
                        {i18n.resolvedLanguage === lang.code && (
                          <SparklesIcon className="w-4 h-4 ml-auto" />
                        )}
                      </motion.button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Notifications */}
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button 
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <BellIcon className="h-5 w-5" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white shadow-lg"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-1 scale-95"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-3 w-96 origin-top-right transform">
                  <div className="overflow-hidden rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <BellIcon className="w-5 h-5 mr-2" />
                          {t('notifications.title')}
                        </h3>
                        {unreadCount > 0 && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={markAllAsRead} 
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                          >
                            {t('notifications.mark_all_read')} ({unreadCount})
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      <AnimatePresence>
                        {notifications.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 text-center"
                          >
                            <BellIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                          </motion.div>
                        ) : (
                          notifications.map((notification, index) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <span className="text-lg mt-0.5">{getNotificationIcon(notification.type)}</span>
                                <div className="flex-1">
                                  <p className={`text-sm ${notification.unread ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {notification.text}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        
        {/* User Profile */}
        <UserDropdown sidebarExpanded={sidebarExpanded} onLogout={onLogout} t={t} />
      </div>
    </header>
  );
};

export default TopBar;