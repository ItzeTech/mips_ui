import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiHome, FiPieChart, FiSettings, FiUsers, FiCalendar,
  FiFolder, FiChevronLeft, FiChevronRight, FiMenu
} from 'react-icons/fi';
import IconWrapper from '../../common/IconWrapper';

interface SidebarProps {
  expanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ expanded, toggleSidebar }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [useTextLogo, setUseTextLogo] = useState(false);

  const navItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiPieChart, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: FiFolder, label: 'Projects', path: '/dashboard/projects' },
    { icon: FiCalendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: FiUsers, label: 'Team', path: '/dashboard/team' },
    { icon: FiSettings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const toggleLogoType = () => {
    setUseTextLogo(!useTextLogo);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 shadow-lg z-30 h-screen"
      initial={{ width: expanded ? 260 : 80 }}
      animate={{ width: expanded ? 260 : 80 }}
      transition={{ duration: 0.3, ease: [0.3, 0.1, 0.3, 1] }}
    >
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div className="p-4 flex items-center h-16 border-b border-gray-200 dark:border-gray-700 relative">
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.div
                key="expanded-logo"
                className="flex items-center justify-between w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              > 
                  <motion.h1
                    className="text-xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
                    onClick={toggleLogoType}
                    whileHover={{ scale: 1.05 }}
                  >
                    RwandaMining
                  </motion.h1>
                <motion.button
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconWrapper Icon={FiChevronLeft} className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-logo"
                className="flex items-center justify-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <motion.button
                  onClick={toggleSidebar}
                  className="absolute -right-3 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconWrapper Icon={FiChevronRight} className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="py-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`relative flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <motion.div
                      className="text-xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconWrapper Icon={item.icon} />
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {expanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="ml-3 font-medium"
                        >
                          {t(item.label.toLowerCase())}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isActive && expanded && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-2 w-1.5 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex ${expanded ? 'justify-between' : 'justify-center'} items-center`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={toggleSidebar}
            >
              <IconWrapper Icon={FiMenu} className="w-5 h-5" />
            </motion.button>

            {expanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                v1.0.2
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
