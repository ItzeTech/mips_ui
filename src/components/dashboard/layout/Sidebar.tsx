import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import {
  HomeIcon,
  ChevronLeftIcon,
  Bars3Icon,
  UsersIcon,
  Cog6ToothIcon,
  CubeIcon,
  RectangleGroupIcon,
  Square3Stack3DIcon,
  CircleStackIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';
import '../../../sidebar.css';

interface NavItem {
  icon: any;
  label: string;
  path: string;
  allowedRoles: string[];
  category?: string;
  color?: string;
}

interface SidebarProps {
  expanded: boolean;
  toggleSidebar: () => void;
}

const navItems: NavItem[] = [
  { 
    icon: HomeIcon, 
    label: 'Dashboard', 
    path: '/dashboard', 
    allowedRoles: ['Manager', 'Boss', 'Finance Officer', 'Stock Manager', 'Lab Technician'],
    color: 'from-blue-500 to-purple-600'
  },
  { 
    icon: UsersIcon, 
    label: 'Manage Users', 
    path: '/manage-users', 
    allowedRoles: ['Finance Officer', 'Manager', 'Boss'],
    color: 'from-green-500 to-teal-600'
  },
  { 
    icon: UsersIcon, 
    label: 'Suppliers', 
    path: '/suppliers', 
    allowedRoles: ['Stock Manager', 'Manager'],
    color: 'from-green-500 to-teal-600'
  },
  // Minerals Category
  { 
    icon: Square3Stack3DIcon, 
    label: 'Mixed Minerals', 
    path: '/minerals/mixed', 
    allowedRoles: ['Stock Manager', 'Manager'],
    category: 'Minerals',
    color: 'from-indigo-500 to-purple-600'
  },
  { 
    icon: CircleStackIcon, 
    label: 'Tantalum', 
    path: '/minerals/tantalum', 
    allowedRoles: ['Stock Manager', 'Manager', 'Lab Technician', 'Finance Officer'],
    category: 'Minerals',
    color: 'from-blue-600 to-indigo-600'
  },
  { 
    icon: CubeIcon, 
    label: 'Tin', 
    path: '/minerals/tin', 
    allowedRoles: ['Stock Manager', 'Manager', 'Lab Technician', 'Finance Officer'],
    category: 'Minerals',
    color: 'from-amber-500 via-orange-500 to-red-500'
  },
  { 
    icon: RectangleGroupIcon, 
    label: 'Tungsten', 
    path: '/minerals/tungsten', 
    allowedRoles: ['Stock Manager', 'Manager', 'Lab Technician', 'Finance Officer'],
    category: 'Minerals',
    color: 'from-emerald-500 via-emerald-500 to-green-600'
  },
  // Finance Category
  { 
    icon: ShoppingCartIcon, 
    label: 'Sales', 
    path: '/sales', 
    allowedRoles: ['Finance Officer', 'Manager'],
    category: 'Finance',
    color: 'from-blue-500 via-indigo-500 to-purple-500'
  },
  { 
    icon: CreditCardIcon, 
    label: 'Payments', 
    path: '/payments', 
    allowedRoles: ['Finance Officer', 'Manager'],
    category: 'Finance',
    color: 'from-green-500 via-teal-500 to-emerald-500'
  },
  { 
    icon: BanknotesIcon, 
    label: 'Advance Payments', 
    path: '/advance-payments', 
    allowedRoles: ['Finance Officer', 'Manager'],
    category: 'Finance',
    color: 'from-amber-500 via-orange-500 to-yellow-500'
  },
  { 
    icon: ReceiptRefundIcon, 
    label: 'Expenses', 
    path: '/expenses', 
    allowedRoles: ['Finance Officer', 'Manager'],
    category: 'Finance',
    color: 'from-rose-500 via-red-500 to-pink-500'
  },
  { 
    icon: Cog6ToothIcon, 
    label: 'Settings', 
    path: '/settings', 
    allowedRoles: ['Manager', 'Boss', 'Finance Officer'],
    color: 'from-gray-500 to-slate-600'
  },
];

const Sidebar: React.FC<SidebarProps> = ({ expanded, toggleSidebar }) => {
  const location = useLocation();
  const { roles = [] } = useAuth();
  const { t } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Check if user has access to nav item
  const hasAccess = (item: NavItem) => {
    return item.allowedRoles.some(role => (roles || []).includes(role));
  };


  // Group items by category
  const groupedNavItems = useMemo(() => {
    const grouped: { [key: string]: NavItem[] } = { main: [] };
    
    navItems.forEach(item => {
      if (item.category) {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      } else {
        grouped.main.push(item);
      }
    });
    
    return grouped;
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden z-60"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Menu Button - Only visible on small screens when sidebar is collapsed */}
      {!expanded && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 md:hidden"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      )}

      <div
        className={`${expanded && window.innerWidth < 768 ? 'fixed' : 'relative'} bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 shadow-2xl z-30 h-screen overflow-hidden`}
        style={{
          width: expanded ? (window.innerWidth < 768 ? '280px' : '280px') : (window.innerWidth < 768 ? '0' : '80px'),
          transition: 'width 0.3s ease'
        }}
      >
        <div className="flex flex-col h-full z-60">
          {/* Logo Area */}
          <div className="p-3 sm:p-6 flex items-center h-16 sm:h-20 border-b border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5"></div>
            
            {expanded ? (
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                      {t('sidebar.app_name', 'RwandaMining')}
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {t('sidebar.app_subtitle', 'Management System')}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 sm:p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex-shrink-0 ml-2"
                >
                  <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              // Only show this on desktop when collapsed
              <div className="hidden md:flex items-center justify-center w-full relative z-10">
                {/* <button
                  className="p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={toggleSidebar}
                >
                  <Bars3Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div 
            className="py-4 sm:py-6 flex-grow overflow-y-auto custom-scrollbar"
          >
            <div className="px-2 sm:px-4 space-y-6 sm:space-y-8">
              {/* Main Navigation */}
              {groupedNavItems.main.length > 0 && (
                <div>
                  <ul className="space-y-1 sm:space-y-2">
                    {groupedNavItems.main.map((item) => (
                      <NavItemComponent
                        key={item.path}
                        item={item}
                        expanded={expanded}
                        hoveredItem={hoveredItem}
                        setHoveredItem={setHoveredItem}
                        location={location}
                        hasAccess={hasAccess(item)}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {/* Minerals Section */}
              {groupedNavItems.Minerals && groupedNavItems.Minerals.length > 0 && (
                <div>
                  {expanded && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 px-2 sm:px-3 py-2">
                        <div className="w-6 sm:w-8 h-[1px] bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('sidebar.minerals_category', 'Minerals')}
                        </span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
                      </div>
                    </div>
                  )}
                  
                  <ul className="space-y-1 sm:space-y-2">
                    {groupedNavItems.Minerals.map((item) => (
                      <NavItemComponent
                        key={item.path}
                        item={item}
                        expanded={expanded}
                        hoveredItem={hoveredItem}
                        setHoveredItem={setHoveredItem}
                        location={location}
                        hasAccess={hasAccess(item)}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {/* Finance Section */}
              {groupedNavItems.Finance && groupedNavItems.Finance.length > 0 && (
                <div>
                  {expanded && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 px-2 sm:px-3 py-2">
                        <div className="w-6 sm:w-8 h-[1px] bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('sidebar.finance_category', 'Finance')}
                        </span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
                      </div>
                    </div>
                  )}
                  
                  <ul className="space-y-1 sm:space-y-2">
                    {groupedNavItems.Finance.map((item) => (
                      <NavItemComponent
                        key={item.path}
                        item={item}
                        expanded={expanded}
                        hoveredItem={hoveredItem}
                        setHoveredItem={setHoveredItem}
                        location={location}
                        hasAccess={hasAccess(item)}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
            <div className={`flex justify-center items-center`}>
              {expanded && (
                <div className="text-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('sidebar.version', 'Version')} 2.0.1
                  </span>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {t('sidebar.edition', 'Mining Pro')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Navigation Item Component
const NavItemComponent: React.FC<{
  item: NavItem;
  expanded: boolean;
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
  location: any;
  hasAccess: boolean;
}> = ({ item, expanded, hoveredItem, setHoveredItem, location, hasAccess }) => {
  const { t } = useTranslation();
  const isActive = location.pathname === item.path && hasAccess;
  const isHovered = hoveredItem === item.path;

  const handleClick = (e: React.MouseEvent) => {
    if (!hasAccess) {
      e.preventDefault();
    }
  };

  return (
    <li>
      <Link
        to={hasAccess ? item.path : '#'}
        onClick={handleClick}
        onMouseEnter={() => setHoveredItem(item.path)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`group relative block ${!hasAccess ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.div
          className={`relative flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-2xl transition-all duration-300 overflow-hidden ${
            isActive
              ? 'bg-gradient-to-r ' + (item.color || 'from-blue-500 to-purple-600') + ' text-white shadow-lg'
              : hasAccess
              ? 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
              : 'text-gray-400 dark:text-gray-600 bg-gray-50/50 dark:bg-gray-800/20 opacity-50'
          }`}
          whileHover={hasAccess ? { scale: 1.02, x: 4 } : {}}
          whileTap={hasAccess ? { scale: 0.98 } : {}}
        >
          {/* Background Gradient for Hover */}
          <AnimatePresence>
            {isHovered && !isActive && hasAccess && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${item.color || 'from-blue-500 to-purple-600'} opacity-10`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          {/* Disabled overlay */}
          {!hasAccess && (
            <div className="absolute inset-0 bg-gray-200/20 dark:bg-gray-800/20 rounded-2xl" />
          )}

          {/* Icon */}
          <motion.div
            className={`relative z-10 ${
              isActive ? 'text-white' : hasAccess ? '' : 'text-gray-400 dark:text-gray-600'
            }`}
            whileHover={hasAccess ? { rotate: 5, scale: 1.1 } : {}}
            transition={{ duration: 0.2 }}
          >
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>

          {/* Label */}
          {expanded && (
            <span
              className={`ml-3 sm:ml-4 font-medium relative z-10 text-sm sm:text-base ${
                isActive ? 'text-white' : hasAccess ? '' : 'text-gray-400 dark:text-gray-600'
              } truncate`}
              style={{ 
                transition: 'opacity 0.2s, transform 0.2s',
                opacity: 1,
                transform: 'translateX(0)'
              }}
            >
              {t(`sidebar.menu.${item.label.toLowerCase().replace(/\s+/g, '_')}`, item.label)}
            </span>
          )}

          {/* Active Indicator */}
          {isActive && expanded && (
            <div
              className="absolute right-2 w-1.5 h-3 sm:w-2 sm:h-4 bg-white/30 rounded-full"
              style={{
                transition: 'opacity 0.3s, transform 0.3s',
                opacity: 1,
                transform: 'scale(1)'
              }}
            />
          )}

          {/* Tooltip for collapsed state */}
          <AnimatePresence>
            {!expanded && isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.8 }}
                className={`absolute left-full ml-4 px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm rounded-xl shadow-xl border whitespace-nowrap z-50 ${
                  hasAccess
                    ? 'bg-gray-900 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    : 'bg-gray-600 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                }`}
              >
                {t(`sidebar.menu.${item.label.toLowerCase().replace(/\s+/g, '_')}`, item.label)}
                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 ${
                  hasAccess
                    ? 'bg-gray-900 dark:bg-gray-700'
                    : 'bg-gray-600 dark:bg-gray-800'
                }`}></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </li>
  );
};

export default Sidebar;