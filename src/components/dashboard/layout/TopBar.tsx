import React, { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMoon, FiSun, FiChevronDown } from 'react-icons/fi';
import IconWrapper from '../../common/IconWrapper';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import { Menu, Popover, Transition } from '@headlessui/react';
import { LanguageIcon, BellIcon } from '@heroicons/react/24/outline';
import { useUserInfo } from '../../../hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  sidebarExpanded: boolean;
  onLogout: () => void;
}

const UserDropdown = ({ sidebarExpanded, setShowUserMenu, onLogout, t }: any) => {
  const { roles } = useAuth();
  const { user } = useUserInfo();
  const navigate = useNavigate()
  const allowedRoles = ['Manager', 'Boss']
  const userHasRequiredRole = roles.some(role => allowedRoles.includes(role));

  return (
    <div className="relative">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            {/* Trigger Button */}
            <Menu.Button
              as={motion.div}
              className="flex items-center space-x-3 cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <AnimatePresence mode="wait">
                {sidebarExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="hidden md:block"
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.full_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.roles.slice().join(', ')}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <IconWrapper
                Icon={FiChevronDown}
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`}
              />
            </Menu.Button>

            {/* Dropdown Panel */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700 focus:outline-none">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.full_name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>

                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } text-gray-700 dark:text-gray-200`}
                        onClick={()=>navigate('/profile')}
                      >
                        {t('profile')}
                      </button>
                    )}
                  </Menu.Item>
                  {
                    userHasRequiredRole &&
                    <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } text-gray-700 dark:text-gray-200`}
                        onClick={()=>navigate('/settings')}
                      >
                        {t('settings')}
                      </button>
                    )}
                  </Menu.Item>
                  }
                  
                </div>

                <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          active ? 'bg-red-50 dark:bg-red-900/20' : ''
                        } text-red-600 dark:text-red-400`}
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                      >
                        {t('logout.logout')}
                      </button>
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
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [notifications, setNotifications] = useState([
      { id: 1, text: "New user registered", unread: true },
      { id: 2, text: "Server maintenance at 2 AM", unread: true },
      { id: 3, text: "Report generated successfully", unread: false },
    ]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'rw', name: 'Kinyarwanda' },
  ];

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, unread: false})));
  }
  const unreadCount = notifications.filter(n => n.unread).length;


  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-end px-4 md:px-6">      
      {/* Right Section - Actions */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {currentTheme !== 'light' ? <IconWrapper Icon={FiSun} className="w-5 h-5" /> : <IconWrapper Icon={FiMoon} className="w-5 h-5" />}
        </motion.button>

        <Menu as="div" className="relative">
          <Menu.Button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            <LanguageIcon className="h-6 w-6" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right z-30 bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {languages.map((lang) => (
                  <Menu.Item key={lang.code}>
                    {({ active }) => (
                      <button
                        onClick={() => changeLanguage(lang.code)}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100 ${i18n.resolvedLanguage === lang.code ? 'font-semibold' : ''}`}
                      >
                        {lang.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                )}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 sm:w-96 origin-top-right transform">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('notifications')}</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                {t('read_all')} ({unreadCount})
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No new notifications.</p>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-700 ${notification.unread ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{notification.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        
        {/* User Profile */}
        <UserDropdown sidebarExpanded={sidebarExpanded} showUserMenu={showUserMenu} onLogout={onLogout} setShowUserMenu={setShowUserMenu} t={t}/>
        
      </div>
    </header>
  );
};

export default TopBar;